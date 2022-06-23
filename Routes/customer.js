const express = require('express');
const routes = express.Router();
const { customer , valcustom: validate} = require('../module/customer');

routes.get('/', async(req ,res) => {
    const cou = await customer.find().sort('name');
    res.send(cou);
});

routes.post('/', async(req ,res) => {
    const { error }=validate(req.body);
    if(error) return res.status(400).send(error.details[0].message); 

    let cos = await customer({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        gender: req.body.gender,
        isGold: false
    });
    cos = await cos.save();

    res.send(cos);
});

routes.put('/:id',async(req, res)=>{
    const { error }=validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const cou = await customer.findByIdAndUpdate(req.params.id, {name: req.body.name } , {new: true});
    if(!cou) return res.status(404).send('course not found');

    res.send(cou);
});

routes.delete('/delete/:id',async(req,res) => {
    try{
        const cou = await customer.findByIdAndRemove(req.params.id);
        if(!cou) return res.status(404).send('course not found');
        res.send(cou);
    }
    catch(ex){
        res.status(500).send('somthing failed....');
        console.log('we get erorr : ',ex);
    }
});

routes.get('/find/:id',async(req,res)=>{
    const co = await customer.findById(req.params.id);
    if(!co) return res.status(404).send('course not found');

    res.send(co);
});

module.exports = routes;