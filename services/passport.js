const User = require("../models/user");
const passport = require("passport");
const config = require("../config");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");

//create local strategy
const localOptions = { usernameField: "email" };
const localLogin = new LocalStrategy(
  localOptions,
  function (email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      //compare passwords
      user.comparePassword(password, function(err, isMatch){
          if(err){return done(err)}
          if(!isMatch){return done(null, false)}

          return done(null, user)
      });

    });
  }
);

//setup options for JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: config.secret,
};

//create Jwt Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
  //see if userId in the payload exists in the database
  //If it exists call done with that
  //Otherwise, call done without user object

  User.findById(payload.sub, function (err, user) {
    if (err) {
      return done(err, false);
    }

    if (User) {
      done(null, User);
    } else {
      done(null, false);
    }
  });
});

//tell passport to use this strategy

passport.use(jwtLogin);
passport.use(localLogin)
