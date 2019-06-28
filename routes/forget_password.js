const express=require('express');
const router=express.Router();
const nodemailer=require('nodemailer');
const {User}=require('../models/users');


router.post('/',async (req,res)=>{

    const {error} =validate(req.body);
    if(error){
        return res.send(400).send(error.details[0].message);
    };
   
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).send('invalid email');
    };


    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'dohakamalelzrka94@gmail.com',
        pass: '123456'
      }
    });
    const token=user.generateToken();
    const url=`https://localhost:4000/api/forgetPassword${token}`
    
    var mailOptions = {
      from: 'dohakamalelzrka94@gmail.com',
      to: user,
      subject: 'verfication link',
      text: `'click link to reset your password' ${url}`,
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    return res.redirect('/reset-password')   
 
});

function validate(req) {
    const schema = {
        email: joi.string().required().min(3).max(225).email({ minDomainAtoms: 2 }),
    }
    return joi.validate(req, schema);
}
module.exports=router;