# Watch This!  [![Build Status](https://travis-ci.org/steve2482/watch-this.svg?branch=master)](https://travis-ci.org/steve2482/watch-this)
==========================================================================================================================================
[Watch This!](https://watch-this.herokuapp.com/users/login) is a full-stack web application designed to help users remember movies suggested to them.

## Project Summary
Watch This! is a web application I designed and developed to help the everyday person 'remember' movies suggested to them by friends or family. It is designed to allow users to search for the movie suggested to them and store in a list specific to them. Watch This! also allows users to browse the most watched movies among the app's users and add them to thier list if they find one they may like.

## Screen Shots
| <img alt="Landing Page/Login" src="https://github.com/steve2482/watch-this/blob/readme/public/images/Landing-page-login.jpg?raw=true" width="350"> | <img alt="Registration Page" src="https://github.com/steve2482/watch-this/blob/readme/public/images/registration.jpg?raw=true" width="350"> | <img alt="Dashboard" src="https://github.com/steve2482/watch-this/blob/readme/public/images/dashboard.jpg?raw=true" width="350"> |
|:---:|:---:|:---:|
|Landing Page/Login | Register | Dashboard |
## Design Process
The design process began with writing user stories to settle on what a user could do with the application. The main user features being to search for the movie they are looking for, add that movie to thier list, mark a movie as watched from thier list, removing a movie from thier list, and finally browsing the most watched movies and adding to thier list from it. I also decided to include user authentication to keep lists specific to users. I then created user flows to show how a user should be able to navigate the application. Wireframing was completed using the 'grey box method'.

## Tech Used
### Front-End
 - HTML5
 - CSS3
 - Javascript
 - [jQuery](https://jquery.com/)
### Back-End
 - [Node](https://nodejs.org)
 - [Express](https://expressjs.com/)
 - [Handlebars](https://handlebarsjs.com)
 - [Flash Messages](https://www.npmjs.com/package/flash)
 - [MongoDB](https://www.mongodb.com/)
 - [Mongoose](http://mongoosejs.com/)
 - [Passport](http://passportjs.org/) - user authentication
 - [Bcrypt](https://www.npmjs.com/package/bcrypt) - password hashing
### Testing and Deployment
 - [Mocha](https://mochajs.org/)
 - [Chai](http://chaijs.com/)
 - [Faker](https://www.npmjs.com/package/Faker)
 - [Travis CI](https://tracis-ci.org/)
 - [Heroku](https://www.heroku.com/)
 - [mLab](https://mlab.com/)

## Future Features
 - Suggestions based on the previously watched movie
 - Current movie times based on users local theater
 - Availability to view preview trailers