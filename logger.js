const jwt = require('jsonwebtoken');

module.exports = async function(req, res, next) {
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access denied. No token provieded..');

    try{
        const decode = await jwt.verify(token,'privatkey');
        req.user = decode;
        console.log('login.. user: '+decode.name+'  '+decode._id);
        next();
    }
    catch(ex){
        res.status(401).send('invalid token...');
    } 
}