const express = require('express');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');
const jsonParser = require('body-parser').json();
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();
require('./config/passport')(passport);

const {User, Movie} = require('./models');
app.use(bodyParser.json());

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');

app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(session({secret: 'secret'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));

require('./router')(app, passport);

// User search api call
app.get('/usersearch', jsonParser, (req, res) => {
  let searchKeyword = req.query.usersearch;
  let apiKey = process.env.TMDB_API_KEY;
  request.get('https://api.themoviedb.org/3/search/movie?api_key=' + apiKey + '&query=' + searchKeyword, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      res.json(JSON.parse(body));
    }
  });
});

// Start the server
let server;
function runServer(databaseURL = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseURL, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

// Close the server
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};
