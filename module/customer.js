const { number } = require('joi');
const Joi = require('joi');
const mongoose = require('mongoose');

const customer = mongoose.model('customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 4
    },
    phone: {
        type: String,
        required: true,
        maxlength: 15,
        minlength: 7
    },       
    email: {
        type: String,
        required: true,
        maxlength: 60,
        minlength: 10
    },
    isGold:{
        type: Boolean,
        required: true
    }, 
    gender:{
        type: String,
        required: true,
        maxlength: 8,
        minlength: 3
    },
    address:{
        type: String,
        minlength: 5,
        maxlength: 25
    },
    pincode:{
        type: Number
    },
    due:{
        type: Boolean,
        default: false
    },
    date: { type:Date , default: Date.now }
}));

function validatecustomer(customer) {
    const shema = Joi.object({
        name: Joi.string().min(4).max(50).required(),
        email: Joi.string().min(10).max(60).required().email(),
        phone: Joi.string().min(7).max(15).required(),
        gender: Joi.string().min(3).max(8).required(),
        address: Joi.string().min(5).max(25),
        pincode: Joi.number(),
        isGold: Joi.boolean()
    });
    return shema.validate(customer);
}

exports.customer = customer;
exports.valcustom = validatecustomer;