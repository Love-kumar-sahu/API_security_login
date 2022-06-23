const express = require('express');
const routes = express.Router();
const auth = require('../middelware/logger');
const middelware = require('../middelware/async'); 
const { valbook , book} = require('../module/book');

routes.get('/', auth,middelware(async(req ,res) => {
    const cou = await book.find().sort('name');
    res.send(cou);
}));

routes.post('/',auth, middelware(async(req ,res) => {
    const { error }=valbook(req.body);
    if(error) return res.status(400).send(error.details[0].message); 

    let cos = await book({
        title: req.body.title,
        author: req.body.authorid,
        numberinstock: req.body.instock,
        dailyrentalreta: req.body.rental
    });
    cos = await cos.save();

    res.send(cos);
}));

routes.put('/:id',auth,middelware(async(req, res)=>{
    const { error }=validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const cou = await book.findByIdAndUpdate(req.params.id, {numberinstock: req.body.instock } , {new: true});
    if(!cou) return res.status(404).send('course not found');

    res.send(cou);
}));

routes.delete('/delete/:id',async(req,res) => {
    try{
        const cou = await book.findByIdAndRemove(req.params.id);
        if(!cou) return res.status(404).send('course not found');
        res.send(cou);
    }
    catch(ex){
        res.status(500).send('somthing failed....');
        console.log('we get erorr : ',ex);
    }
});

routes.get('/find/:id',async(req,res)=>{
    const co = await book.findById(req.params.id);
    if(!co) return res.status(404).send('course not found');

    res.send(co);
});

module.exports = routes;