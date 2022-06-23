const {genress: genress} =  require('./genres');
const Joi = require('joi');
const mongoose = require('mongoose');

const Book = new mongoose.model('book',new mongoose.Schema({
    title:{
        type: String,
        required: true,
        minlength: 150,
        minlength: 5
    },
    author:{
        type: genress,
        required: true
    },
    numberinstock:{
        type: Number,
        required: true,
        min: 0,
        max: 200
    },
    dailyrentalreta:{
        type: Number,
        required: true,
        min: 0,
        max: 200,
    }
}));

function validatebook(book) {
    const shema = Joi.object({
        title: Joi.string().min(5).max(150).required(), 
        authorid: Joi.string().required(),
        instock: Joi.number().min(0).max(200).required(),
        rental: Joi.number().min(0).max(200).required()
    });
    return shema.validate(book);
}

exports.book = Book;
exports.valbook = validatebook;