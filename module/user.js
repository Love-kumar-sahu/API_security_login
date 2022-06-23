const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const users = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 4
    },
    email: {
        type: String,
        required: true,
        maxlength: 100,
        minlength: 4,
        unique: true
    },
    password: {
        type: String,
        required: true,
        maxlength: 1024,
        minlength: 4
    },
    data: { type:Date , default: Date.now },
    isAdmin: { type: Boolean , default: false}
});

users.methods.genrateAuth = function() {
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin,name: this.name},'privatkey');
    return token;
}

const User = mongoose.model('user', users);

function validatecode(user) {
    const shema = Joi.object({
        name: Joi.string().min(4).max(50).required(),
        email: Joi.string().min(4).max(100).required(),
        password: Joi.string().min(4).max(12).required()
    });
    return shema.validate(user);
} 

exports.user = User;
exports.validate = validatecode;
