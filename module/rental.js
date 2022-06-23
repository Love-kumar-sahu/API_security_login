const Joi = require('joi');
const mongoose = require('mongoose');

const Rental = mongoose.model('rental', new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: { 
                type: String,
                required: true,
                maxlength: 100,
                minlength: 5
            },
            isGold: {
                type: Boolean,
                required: true,
            },
            phone: {
                type: String,
                required: true,
                minlength: 6,
                maxlength: 15
            }
        }),
        required: true
    },
    book: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 100
            },
            rental: {
                type: Number,
                required: true,
                min: 0,
                max: 200
            },
            outdate: {
                type: Date,
                required: true,
                default: Date.now()
            },
            indate: {
                type: Date,
            }
        }),
        required: true
    },
    rentalfess: {
        type: Number,
        min:0
    }
}));

function validaterent(rent) {
    const shema = Joi.object({
        customid: Joi.string().required(),
        bookid: Joi.string().required()
    });
    return shema.validate(rent);
}

exports.rent = Rental;
exports.valrent = validaterent;