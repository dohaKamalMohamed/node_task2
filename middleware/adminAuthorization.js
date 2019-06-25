
module.exports=function (req,res,next){
    if(!req.body.isAdmin){
        return res.status(403).send('only admin can access');
        next();
    }
}