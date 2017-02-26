const {BasicStrategy} = require('passport-http');
const express = require('express');
const app = express();
const fetch = require('isomorphic-fetch');
const bodyParser = require('body-parser');
const jsonParser = require('body-parser').json();
const mongoose = require('mongoose');
const passport = require('passport');
require('dotenv').config();

const {User, Movie} = require('./models');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');

app.set('view engine', 'ejs');

app.use(bodyParser.json());

app.use(express.static('public'));
app.get('/', function(req, res) {
  let env = process.env;
  res.render('pages/index', {
    env: {
      ENVIRONMENT: env.ENVIRONMENT
    }
  });
});

// User search call to TMDB API==================================
// ==============================================================
app.get('/usersearch', jsonParser, (req, res) => {
  let searchKeyword = req.query.usersearch;
  let apiKey = process.env.TMDB_API_KEY;
  fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchKeyword}`)
  .then(response => {
    if (response.status < 200 || response.status >= 300) {
      const error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
    return response;
  })
  .then(response => response.json())
  .then(response => {
    res.json(response);
  });
});

// Add movie to user list========================================
// ==============================================================
app.post('/user-movies', jsonParser, (req, res) => {
  let movieInstance = 0;
  User.find({userName: 'Steve2482'})
  .then(user => {
    for (let i = 0; i < user[0].movieIds.length; i++) {
      if (user[0].movieIds[i].movieId === req.body.movieId) {
        movieInstance++;
      }
    }
  })
  .then(function() {
    console.log(movieInstance);
    if (movieInstance === 0) {
      User.findOneAndUpdate(
      {userName: 'Steve2482'},
      {$push: {movieIds: req.body}},
      {safe: true, upsert: true},
      function(err, model) {
        console.log(err);
      })
      .then(user => {// undefined
        res.status(201).json(user);
      });
    } else {
      return res.status(500).json({message: 'Movie already exists in user list'});
    }
  });
});

// Remove movie from user list====================================
// ===============================================================
app.put('/user-movies', jsonParser, (req, res) => {
  console.log(req.body);
  User
  .findOneAndUpdate(
    {userName: 'Steve2482'},
    {$pull: {movieIds: {movieId: req.body.movieId}}},
    function(err, model) {
      console.log(err);
    })
    // .then(user => {// undefined
    //   res.status(204).json(user);
    // });
});

// Get user movie list============================================
// ===============================================================
app.get('/user-movies', jsonParser, (req, res) => {
  User
  .findOne(
    {userName: req.query.userName})
  .exec()
  .then(user => {
    let data = user.movieIds;
    res.send(data);
  });
});

// User registration==============================================
// ===============================================================
app.post('/register', jsonParser, (req, res) => {
  if (!req.body) {
    return res.status(400).json({message: 'No request body'});
  }
  if (!('userName' in req.body)) {
    return res.status(422).json({message: 'Missing field: Username'});
  }

  let {userName, password, firstName, lastName} = req.body;

  if (typeof userName !== 'string') {
    return res.status(422).json({message: 'Incorrect field type: Username'});
  }

  userName = userName.trim();

  if (userName === '') {
    return res.status(422).json({message: 'Incorrect field length: Username'});
  }
  if (!(password)) {
    return res.status(422).json({message: 'Missing field: password'});
  }

  password = password.trim();

  if (password === '') {
    return res.status(422).json({message: 'Incorrect field length: password'});
  }

  // Check if username is available
  return User
    .findOne({userName})
    .count()
    .exec()
    .then(count => {
      if (count > 0) {
        return res.status(422).json({message: 'Username already taken'});
      }
      return User.hashPassword(password);
    })
    .then(hash => {
      return User
        .create({
          userName: userName,
          password: hash,
          firstName: firstName,
          lastName: lastName,
          movieIds: []
        });
    })
    .then(user => {
      return res.status(201).json(user.apiRepr());
    })
    .catch(err => {
      res.status(500).json({message: 'Internal server error'});
    });
});

const basicStrategy = new BasicStrategy(function(username, password, callback) {
  let user;
  User
    .findOne({username: username})
    .exec()
    .then(_user => {
      user = _user;
      if (!user) {
        return callback(null, false, {message: 'Incorrect username'});
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return callback(null, false, {message: 'Incorrect password'});
      }
      return callback(null, user);
    });
});

passport.use(basicStrategy);
app.use(passport.initialize());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.post('/login',
  passport.authenticate('basic'),
  (req, res) => res.json({user: req.user.apiRepr()})
  );

// Start the server===============================================
// ===============================================================
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

// Close the server==============================================
// ==============================================================
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
