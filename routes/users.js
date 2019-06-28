const express=require('express');
const router=express.Router();
const _ =require('lodash');
const {User,validate}=require('../models/users');
const bcrypt=require('bcrypt');




router.get('/',async (req,res)=>{
    let users= await User.find();
    res.send(users);
});

router.get('/me', async (req,res)=>{
    let user= await User.findOne({_id:user.id});
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

    const salt= await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password,salt);
    req.body.confirmPassword = await bcrypt.hash( req.body.confirmPassword,salt);

    if(req.body.password !== req.body.confirmPassword){
        return res.status(400).send("the password doesn't match"); 
    }
    
 
     user=new User(_.pick(req.body,[
       'userName',
       'email',
       'phoneNumber',
       'password',
       'confirmPassword',
       'isAdmin'
    ]));
    await user.save();

    const token=user.generateToken();
    res.header('x-auth-token', token).send(_.pick(user,[
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