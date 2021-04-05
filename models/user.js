const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

const Schema = mongoose.Schema;

//Define our model
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
  },
  password: String,
});

//on save Hook, encrypt password
//before saving model run the function
userSchema.pre("save", function (next) {
    //get access to the user model
  const user = this;

  //generate a salt thn run the callback
  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return next(err);
    }

    //hash(encrypt) the password using the salt
    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) {
        return next(err);
      }

      //overwrite the plain text password with encrypted password
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback){
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
    if(err) {return callback(err)}
    callback(null, isMatch)
  })
}

//create the model class
const ModelClass = mongoose.model("user", userSchema);

//export the model
module.exports = ModelClass;
