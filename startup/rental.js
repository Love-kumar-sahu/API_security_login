const { customer } = require('../module/customer');
const { book } = require('../module/book');
const {rent, valrent} = require('../module/rental');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const routes = express.Router();

Fawn.init(mongoose);

routes.get('/', async(req ,res) => {
    const cou = await rent.find();
    res.send(cou);
});

routes.post('/', async(req ,res) => {
    const { error }=valrent(req.body);
    if(error) return res.status(400).send(error.details[0].message); 

    const custom = await customer.findById(req.body.customid);
    if(!custom) return res.status(400).send('invalid customer....');

    const booke = await book.findById(req.body.bookid);
    if(!booke) return res.status(400).send('invalid book....');
    
    if(booke.numberinstock === 0) return res.status(400),send('book not in stock....');

    let cos = await rent({
        customer: {
            _id: custom._id,
            name: custom.name,
            isGold: custom.isGold,
            phone: custom.phone
        },
        book: {
            _id: booke._id,
            title: booke.title,
            rental: booke.dailyrentalreta
        } 
    });
    
    try{
        new Fawn.Task()
        .save('rentals', cos)
        .update('books',{ _id: booke._id}, {
            $inc: {numberinstock: - 1}
        })
        .run();
        
        res.send(cos);
    }
    catch(ex){
        res.status(500).send('somthing want wrong...');
        console.log(ex);
    }
});

routes.put('/:id',async(req, res)=>{
    // const { error }=valrent(req.body);
    // if(error) return res.status(400).send(error.details[0].message);

    const cou = await rent.updateMany({_id: req.params.id},{
        $set: {
            'customer.name': req.body.name
        }
    });
    if(!cou) return res.status(404).send('course not found');

    res.send(cou);
});

routes.put('/retur/:rentid',async(req,res)=>{

    const t = await rent.findOne({_id: req.params.rentid});
    if(!t) return res.status(400).send('custmor not found...');
    
    let d = Date.now();

    // t.book.indate = Date.now();
    // t.rentalfess = fess(t.book.indate,t.book.outdate,t.book.rental);

    try{
        new Fawn.Task()
        .update('rentals',{ _id: t._id},{ 
            $set: {
                rentalfess: fess(Date.now(),t.book.outdate,t.book.rental), 
                'book.indate': Date.now()
            }})
        .update('customers',{ _id: t.customer._id}, { $set: {due: false}})
        .update('books',{ _id: t.book._id}, {
            $inc: {numberinstock: 1}
        })
        .run();
    }
    
    catch(ex){
        res.status(500).send('somthing want wrong...');
        console.log(ex);
    }

    // const booke = await book.updateMany({_id: t.book._id},{
    //     $inc: {numberinstock: 1} 
    // });
    // if(!booke) return res.status(400).send('invalid book....');

    console.log(d);
    // t.save();

    res.send('Return. thank you for using the book');
});

routes.delete('/delete/:id',async(req,res) => {
    try{
        const cou = await rent.findByIdAndRemove(req.params.id);
        if(!cou) return res.status(404).send('course not found');
        res.send(cou);
    }
    catch(ex){
        res.status(500).send('somthing failed....');
        console.log('we get erorr : ',ex);
    }
});

routes.get('/find/:id',async(req,res)=>{
    const co = await rent.findById(req.params.id);
    if(!co) return res.status(404).send('course not found');

    res.send(co);
});

module.exports = routes;

function fess(indate,outdate,rent) {
    let to = (indate - outdate)/(1000*60*60*24);
    to = Math.round(to);
    if(to === 0) return rent;
    else return rent*to;
}
