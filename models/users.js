const mongoose = require('mongoose');
const joi = require('joi');
const validator = require('validator');
const jwt=require('jsonwebtoken');
const config=require('config');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 225,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 3,
        maxlength: 225,
        validate: {
            validator: email => validator.isEmail(email),
            message: 'please enter valid email'
        }
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 3,
        maxlength: 225,
        validate: {
            validator: phone => validator.isMobilePhone(phone),
            message: 'please enter valid phone number'
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
        maxlength: 1024,
    },
    isAdmin: {
        type: Boolean,
        default:false
    },
    resetpassword:{
        type: String,
        required: false,
    },
    creationDate: {
        type: Date,
        default: Date.now()
    }

});

userSchema.methods.generateToken=function(){
    const token=jwt.sign({_id:this._id ,isAdmin :this.isAdmin,email:this.email},config.get('jwtprivatekey'));
    return token;
}


const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = joi.object()
        .keys({
            userName: joi.string()
                .required()
                .min(4)
                .max(225)
                .alphanum(),
            email:joi.string()
                 .required()
                 .min(3)
                 .max(225)
                 .email({minDomainAtoms:2}),
            phoneNumber:joi.string()
                 .required()
                 .length(11)
                 .regex(/^([0-9]*)$/),
            password:joi.string()
                 .required()
                 .regex(/^([a-z0-9A-Z]*)$/),
                 resetpassword:joi.string()
                 .regex(/^([a-z0-9A-Z]*)$/),
            isAdmin:joi.boolean(),      
        });
    return joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validate = validateUser;