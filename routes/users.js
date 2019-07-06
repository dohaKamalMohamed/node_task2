const express=require('express');
const router=express.Router();
const _ =require('lodash');
const {User,validate}=require('../models/users');
const bcrypt=require('bcrypt');




router.get('/',async (req,res)=>{
    let users= await User.find();
    res.send(users);
});

router.get('/id', async (req,res)=>{
    let user= await User.findOne({_id:req.params.id});
    if(!user){
        return res.status(404).send('this user is not exist');
    }
    res.send(user);
});

router.post('/',async (req,res)=>{
    const {error} =validate(req.body);
    if(error){
        return res.send(400).send(error.details[0].message);
    }

    let user= await User.findOne({email:req.body.email});
    if(user){
        return res.send(400).send("this email is already exist");
    }

    const phoneNumber= await User.findOne({phoneNumber:req.body.phoneNumber});
    if(phoneNumber){
        return res.send(400).send("this phone number is already exist");    
    }

     user=new User(_.pick(req.body,[
       'userName',
       'email',
       'phoneNumber',
       'password',
       'resetpassword',
       'isAdmin',
       'token',
    ]));

    const salt= await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);
    await user.save();

    const token=user.generateToken();
    res.header('x-auth-token', token).send(_.pick(user,[
       'userName',
       'email',
       'phoneNumber',
       'isAdmin'
    ]));

});



module.exports=router;