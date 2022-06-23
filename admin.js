module.exports = function (req,res,next) {
    if(!req.user.isAdmin) return res.status('403').send('Access denied.');
    console.log('admin access...',req.user.name);
    next();
}
