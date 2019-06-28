const express=require('express');
const router=express.Router();
const joi = require('joi');
const {User}=require('../models/users');
const bcrypt=require('bcrypt');
const _ =require('lodash');


router.get('/token', async (req,res)=>{
    let user= await User.findOne({_id:req.params.id});
    if(!user){
        return res.status(404).send('this user is not exist');
    }
    res.send(user);
});


router.put('/:id',async (req,res)=>{

    const {error} =validate(req.body);
    if(error){
        return res.send(400).send(error.details[0].message);
    };

    const salt= await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password,salt);
    req.body.confirmPassword = await bcrypt.hash( req.body.confirmPassword,salt);

    if(req.body.password !== req.body.confirmPassword){
        return res.status(400).send("the password doesn't match"); 
    }
    

    let user=await User.findOneAndUpdate({_id:req.params.id},_.pick(req.body,[
        'password',
        'confirmPassword',
     ]));

     if(!user){
        return res.status(404).send('this user is not exist');
    }
 
    const token=user.generateToken();
    res.header('x-auth-token', token).send(token);
});



function validate(req) {
    const schema = {
        password: joi.string().required().regex(/^([a-zA-Z-0-9]*)$/),
        confirmPassword:joi.string().required().regex(/^([a-zA-Z-0-9]*)$/),
    }
    return joi.validate(req, schema);
}

module.exports=router;