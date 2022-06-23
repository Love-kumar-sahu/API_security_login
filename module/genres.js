const Joi = require('joi');
const mongoose = require('mongoose');

const genress = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 4
    },
    author: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 4
    },       
    data: { type:Date , default: Date.now }
});

const Genres = mongoose.model('genres', genress);

function validatecode(cours) {
    const shema = Joi.object({
        name: Joi.string().min(4),
        author: Joi.string().min(4)
    });
    return shema.validate(cours);
}

exports.genres = Genres;
exports.validate = validatecode;
exports.genress = genress;