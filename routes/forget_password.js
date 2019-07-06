const express=require('express');
const router=express.Router();
const {User}=require('../models/users');
const nodemailer=require('nodemailer');
const joi = require('joi');
const jwt=require('jsonwebtoken');
const config=require('config');
    //node mailer function 
function sendemail(email,token){
  const transporter =nodemailer.createTransport({
   host:'localhost:4000/task',
   port:'4000',
   secure:true,
   auth:{
     user:'dohakamalelzrka94@gmail.com',
     pass:'doha_back1994'
   }
  });
  let mailOptions={
    from:'doha',
    to:email,
    subject:'verification link',
    text:'welcome to my web site',
    html:`<h1> welcome</h1><a href="http://localhost:4200/resetpassword/${token}">please click this link</a>`
  };
  transporter.sendMail(mailOptions,(error,info)=>{
    console.log('here we sent message');
    if(error){
      console.log(error);
    } else{
      console.log('message sent',info);
      console.log('preview URL',nodemailer.getTestMessageUrl(info));
    }
    transporter.close();
  });
}
 // end of nodemailer function

 router.post('/',async (req,res)=>{

  const {error} =validate(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    };

     let user = await User.findOne({email:req.body.email});
     if(!user){
       return res.json({status:false,message:'invalid email address'});
     }else {
      user.resetpassword=jwt.sign({_id:user._id ,isAdmin :user.isAdmin,email:user.email},config.get('jwtprivatekey'));
       await user.save();
      sendemail(user.email,user.resetpassword);
      return res.json({status:true,message:'check your email please'}) 
     }
});

function validate(req) {
  const schema = {
      email: joi.string().required().min(3).max(225).email({ minDomainAtoms: 2 }),
  }
  return joi.validate(req, schema);
}

module.exports=router;


