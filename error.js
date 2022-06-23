module.exports = function (err,req,res,next) {
    res.status(500).send('somthing failed....');
    console.log('we get erorr : ',err);
}