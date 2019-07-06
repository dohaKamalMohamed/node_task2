const {User}=require('../models/users');
const bcrypt=require('bcrypt');
const express=require('express');
const router=express.Router();
const joi = require('joi');


router.put('/',async (req,res)=>{
    const {error} =validate(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    };
    let user =await User.findOne({resetpassword:req.body.token});

    if(!user){
        return  res.json({status:false,message:'password link has expired'})
    }else {
        user.resetpassword='';
        user.email=req.body.email;
        user.password = bcrypt.hash(req.body.password,10);
    }
})

function validate(req) {
    const schema = {
        email: joi.string().required().min(3).max(225).email({ minDomainAtoms: 2 }),
        password: joi.string().required().regex(/^([a-zA-Z-0-9]*)$/),
        token:joi.string().required()
    }
    return joi.validate(req, schema);
  }
  
  module.exports=router;



 /*User.findOne({resetpassword:req.body.token},function(err,user){
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
}*/