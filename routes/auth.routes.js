const { Router } = require('express');
const router = new Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/User.model');
const {isLoggedIn, isLoggedOut} = require('../middleware');

router.get('/signup', isLoggedOut, (req, res) => {
  console.log("req.session Signup", req.session)
  res.render("auth/signup")
});

router.post('/signup', isLoggedOut, (req, res, next) => {
    const { username, email, password } = req.body;

  bcrypt
    .genSalt(saltRounds)
    .then(salt => bcrypt.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        username,
        email,
        password: hashedPassword
      });

    })
    .then(userFromDB => {
        // req.session.currentUser = user;
        res.render('auth/profile', { user: userFromDB });
        console.log('quesito')
      })
    .catch(error => next(error));

    console.log('username, password')
});

router.get('/login', isLoggedOut, (req, res) => {
  res.render('auth/login')
});

router.post('/login', isLoggedOut, (req, res, next) => {
    const { username, password } = req.body;

    if (username === '' || password === '') {
      res.render('auth/login', {
        errorMessage: 'Please enter both, username and password to login.'
      });
      return;
    }

    User.findOne({ username })
      .then(user => {
        if (!user) {
          res.render('auth/login', { errorMessage: 'User not found and/or incorrect password.' });
          return;
        } else if (bcrypt.compare(password, user.password)) {
          req.session.currentUser = user;
          res.render(`auth/profile`, user);
        } else {
          console.log("Incorrect password. ");
          res.render('auth/login', { errorMessage: 'User not found and/or incorrect password.' });
        }
        
      })


      .catch(error => next(error));
  });

router.get("/profile", isLoggedIn, (req, res, next) => {
    console.log("req.session", req.session)
    res.render("auth/profile", user);
});

  // router.get("/profile", (req, res, next) => {
  //   const { username } = req.params;
  //   User.findOne({ username })
  //     .then(foundUser => {
  //     res.render("auth/profile", foundUser);
  //   })
  //   .catch(err => console.log(err))
        
  //   });

  // router.post("/profile", isLoggedIn, (req, res, next) => {
  //   res.render("auth/profile", user);
  // })

  router.get('/home', (req, res) => {
    res.render('index');
  })

  router.get('/main', isLoggedIn, (req, res) => {
    res.render('auth/main',{ userInSession: req.session.currentUser });
  })

  router.get('/private', isLoggedIn, (req, res) => {
    res.render('auth/private', { userInSession: req.session.currentUser });
  })

  router.post('/logout', isLoggedIn, (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });


  module.exports = router;