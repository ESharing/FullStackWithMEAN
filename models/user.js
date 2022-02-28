const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const ObjectId = require('mongodb').ObjectId;

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
});

const User = mongoose.model('User', UserSchema);
module.exports = User;

module.exports.createUser = (newUser, callback) => {
    bcryptjs.genSalt(10, (err,salt) => {
        bcryptjs.hash(newUser.password, salt, (error, hash) => {
            const newUserResource = newUser;
            newUserResource.password = hash;
            newUserResource.save(this.callback);
        });
    });
};

module.exports.getUserByEmail = (email, callback) => {
    const query = { email };
    User.findOne(query, callback);
};

module.exports.getUserById= (id, callback) => {
    objectId = new ObjectId(id);
    const query = { objectId };
    User.findOne(query, callback);
};

module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcryptjs.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
};