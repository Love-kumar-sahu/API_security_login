const express = require('express');
const routes = express.Router();
const bcrypt = require('bcrypt');
const { user: User} = require('../module/user');
const Joi = require('joi');

routes.post('/', async(req ,res) => {
    const { error }=validate(req.body);
    if(error) return res.status(400).send(error.details[0].message); 

    let user = await User.findOne({ email: req.body.email});
    if(!user) return res.status(400).send('invalid email or password');

    password = await bcrypt.compare(req.body.password,user.password);
    if(!password) return res.status(400).send('invalid password....')

    const pv = user.genrateAuth();
    res.header('x-auth-token',pv).send(user);
});

function validate(user) {
    const shema = Joi.object({
        email: Joi.string().min(4).max(100).required().email(),
        password: Joi.string().min(4).max(12).required()
    });
    return shema.validate(user);
}

module.exports = routes;