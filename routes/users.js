const express=require('express');
const router=express.Router();
const _ =require('lodash');
const {User,validate}=require('../models/users');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const config=require('config');




router.get('/',async (req,res)=>{
    let users= await User.find();
    res.send(users);
});

router.get('/:id', async (req,res)=>{
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

    let email= await User.findOne({email:req.body.email});
    if(email){
        return res.send(400).send("this email is already exist");
    }

    const phoneNumber= await User.findOne({phoneNumber:req.body.phoneNumber});
    if(phoneNumber){
        return res.send(400).send("this phone number is already exist");    
    }

    const salt= await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password,salt);
    req.body.confirmPassword = await bcrypt.hash( req.body.confirmPassword,salt);

    if(req.body.password !== req.body.confirmPassword){
        return res.status(400).send("the password doesn't match"); 
    }
    
 
    let user=new User(_.pick(req.body,[
       'userName',
       'email',
       'phoneNumber',
       'password',
       'confirmPassword',
       'isAdmin'
    ]));
    await user.save();

    const token=jwt.sign({_id:this._id,isAdmin:this.isAdmin},config.get('jwtprivatekey'));
    res.header('x-auth-token', token).send(_.pick(req.body,[
        'userName',
       'email',
       'phoneNumber',
       'isAdmin'
    ]));

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
        'userName',
        'email',
        'phoneNumber',
        'password',
        'confirmPassword',
        'isAdmin'
     ]));

     if(!user){
        return res.status(404).send('this user is not exist');
    }
 
        res.send(_.pick(req.body,[
            'userName',
           'email',
           'phoneNumber',
           'isAdmin'
        ]));
  
});


router.delete('/:id',async (req,res)=>{

    let user=await User.findOneAndDelete({_id:req.params.id});
     
    if(!user){
        return res.status(400).send('this user is not exist');
    }

        res.send(_.pick(req.body,[
            'userName',
           'email',
           'phoneNumber',
           'isAdmin'
        ]));
    
});

module.exports=router;