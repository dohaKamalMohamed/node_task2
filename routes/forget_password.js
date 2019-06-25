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

    async function main(){

      
        let transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false, 
          auth: {
           email: user.email, 
            pass: testAccount.pass ,
          }
        });
      
        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: '"Fred Foo 👻" <foo@example.com>', // sender address
          to: req.body.email, // list of receivers
          subject: "Hello ✔", // Subject line
          text: "Hello world?", // plain text body
          html: "<b>Hello world?</b>" // html body
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      }
      
      main().catch(console.error);


});

function validate(req) {
    const schema = {
        email: joi.string().required().min(3).max(225).email({ minDomainAtoms: 2 }),
    }
    return joi.validate(req, schema);
}
module.exports=router;