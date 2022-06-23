const express = require('express');
const routes = express.Router();
const { genres , validate} = require('../module/genres');
const middelware = require('../middelware/async'); 

routes.get('/', async(req ,res) => {
    const cou = await genres.find().sort('name');
    res.send(cou);
});

routes.post('/', middelware(async(req ,res) => {
    const { error }=validate(req.body);
    if(error) return res.status(400).send(error.details[0].message); 

    let cos = await genres({
        name: req.body.name,
        author: req.body.author
    });
    cos = await cos.save();

    res.send(cos);
}));

routes.put('/:id',async(req, res)=>{
    const { error }=validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const cou = await genres.findByIdAndUpdate(req.params.id, {name: req.body.name } , {new: true});
    if(!cou) return res.status(404).send('course not found');

    res.send(cou);
});

routes.delete('/delete/:id',async(req,res) => {
    try{
        const cou = await genres.findByIdAndRemove(req.params.id);
        if(!cou) return res.status(404).send('course not found');
        res.send(cou);
    }
    catch(ex){
        res.status(500).send('somthing failed....');
        console.log('we get erorr : ',ex);
    }
});

routes.get('/find/:id',async(req,res)=>{
    const co = await genres.findById(req.params.id);
    if(!co) return res.status(404).send('course not found');

    res.send(co);
});

module.exports = routes;
