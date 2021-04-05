const User = require('../models/user')
const jwt = require("jwt-simple");
const config = require('../config')

function tokenForUser(user){
  const timestamp = new Date().getTime()
  return jwt.encode({sub: user.id, iat: timestamp}, config.secret)
}

exports.signin = function(req, res, next){
  //user already had their email and password auth'd
  //we just need to give them token
  res.send({token: tokenForUser(req.user)})
}

exports.signup = function(req, res, next){
    const email = req.body.email
    const password = req.body.password

    if(!email || !password){
        return res.status(422).send({error: "Please provide email and password"})
    }

// see if a user with given email address exist
    User.findOne({email: email}, function(err, existingUser){
      if (err) {
        return next(err);
      }

      if (existingUser) {
        //if a user with given email does exist return error
        return res.status(422).send({ error: "Email is in use" });
      }

      //if a user with email does NOT exist create a new user
      const user = new User({
        email: email,
        password: password,
      });

      //response giving user created successfully
      user.save(function (err) {
        if (err) next(err);

        res.json({token: tokenForUser(user)});
      });
    })



   

   
}