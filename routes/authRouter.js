const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const passport = require('passport');
const router = express.Router();
const bcryptSalt = 10;

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {

  const {
    username,
    password,
    role
  } = req.body;

  User.findOne({
      username
    })
    .then(user => {
      console.log(user);
      if (user !== null) {
        throw new Error("Username Already exists");
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        role
      });

      return newUser.save()
    })
    .then(user => {
      res.redirect("/auth/private");
    })
    .catch(err => {
      console.log(err);
      res.render("auth/signup", {
        errorMessage: err.message
      });
    })
})


router.get('/login', (req, res, next) => {  
  res.render('auth/login');
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/auth/private",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
)

router.get('/logout' , (req,res) => {
  req.logout();
  res.redirect('/');
})


router.get("/delete/:id", (req, res) => {
    User.findByIdAndRemove(req.params.id)
      .then(users => {
        res.redirect("/auth/private");
      })
      .catch(error => {
        console.log(error);
      });
  });



module.exports = router;