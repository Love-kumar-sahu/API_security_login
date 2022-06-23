const express = require('express');
const auth = require('../middelware/logger');
const middelware = require('../middelware/async'); 
const routes = express();
const bcrypt = require('bcrypt');
const { user: User,validate} = require('../module/user');
const admin = require('../middelware/admin');


routes.post('/', middelware(async(req ,res) => {
    const { error }=validate(req.body);
    if(error) return res.status(400).send(error.details[0].message); 

    let user = await User.findOne({ email: req.body.email });
    if(user) return res.status(400).send('user already registered...');

    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);
    user = await user.save();
    
    const pv = user.genrateAuth();
    res.header('x-auth-token',pv).send(user);
}));

routes.get('/me',auth,middelware(async(req,res)=>{
    const user = await User.findById(req.user._id).select('name email');
    res.send(user);
}));

routes.get('/h',async(req,res)=>{
    res.send({name:'hello lucky',email:'hejwj@jdkd.com'});
});

routes.delete('/delete/:id',[auth,admin],middelware(async(req,res) => {
    const cou = await User.findByIdAndRemove(req.params.id);
    if(!cou) return res.status(404).send('course not found');

    res.send(cou);
}));

module.exports = routes;