const winston=require('winston');
require('winston-mongodb');

module.exports=function(){
process.on('uncaughtException',(ex)=>{
    console.log('something wrong');
    winston.error(ex.message,ex)
});

process.on('unhandledRejection',(ex)=>{
    console.log('something wrong');
    winston.error(ex.message,ex)
});


winston.add(winston.transports.File,{filename:'logfile.log'});
winston.add(winston.transports.MongoDB,{
    db:'mongodb://localhost/task',
    level:'info'
})
}