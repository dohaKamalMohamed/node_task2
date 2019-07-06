const {User}=require('../models/users');
const bcrypt=require('bcrypt');

 module.exports=function(req,res){
 User.findOne({resetpassword:req.body.token},function(err,user){
    if(err){
     if(err) throw err;
     console.log(user);
     if(user){
         user.resetpassword='';
         user.email=req.body.email;
         user.password = bcrypt.hash(req.body.password,10);
         user.save(function (err){
             if(err) throw err;
             else{
                 res.json({status:false,message:'password link has expired'})
             }
         })
     }
    }
})
}