const config=require('config');

module.exports =function(){
    if(!config.get('jwtprivatekey')){
        console.log('fetal error :fatal error:jwtprivatekey not set');
        process.exit(1);
    }
}