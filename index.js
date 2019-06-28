const express=require('express');
const app=express();




require('./startUp/db')();
require('./startUp/routes')(app);
require('./startUp/config');
require('./startUp/logError');



const port =process.env.PORT || 4000;
app.listen(port,()=>console.log(`app listen to port ${port}`));


