
module.exports=function (req,res,next){
    if(!req.user.isAdmin){
        res.status(401).send('only admin can access');
        next();
    }
}