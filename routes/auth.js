const express=require('express');
const router=express.Router();
const joi = require('joi');
const {User}=require('../models/users');
const jwt=require('jsonwebtoken');
const config=require('config');
const bcrypt=require('bcrypt');

router.post('',async (req,res)=>{
    const {error} =validate(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    };
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).send('invalid email or password');
    };
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
     return  res.status(404).send('invalid email or password');
    }

    const token=jwt.sign({_id:this._id,isAdmin:this.isAdmin},config.get('jwtprivatekey'));
    res.header('x-auth-token', token).send(token);

});

function validate(req) {
    const schema = {
        email: joi.string().required().min(3).max(225).email({ minDomainAtoms: 2 }),
        password: joi.string().required().regex(/^([a-zA-Z-0-9]*)$/),
    }
    return joi.validate(req, schema);
}

module.exports=router;