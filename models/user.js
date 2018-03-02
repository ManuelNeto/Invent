var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var userSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
    	type: String,
        unique: true,
    	required:true
    },

    room: {
        type:String,
        default: ''
    },

    userKind: {
        type:String,
        default: ''
    },

    hash: String,

    salt: String
});

userSchema.methods.setPassword = function (password){
    this.salt = crypto.randomBytes(16).toString('hex');
    userSchema.salt = this.salt;
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
    userSchema.hash = this.hash;
};

userSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
    return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        room: this.room,
        userKind: this.userKind,
        exp: parseInt(expiry.getTime() / 1000),
    }, "MY_SECRET");
};

var User = mongoose.model('User', userSchema);

module.exports = User;
