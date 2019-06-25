
const mongoose=require('mongoose');

module.exports =function(){
    mongoose.connect('mongodb://localhost/task',{useNewUrlParser:true,useCreateIndex:true})
    .then(()=>console.log('connection succeed'))
    .catch((err)=>console.log(`connection failed => ${err}`));
}