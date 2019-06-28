const user = require('../routes/users');
const auth = require('../routes/auth');
const article = require('../routes/articles');
require('express-async-errors');
const body_parser = require('body-parser');
const cors = require('cors');
const errors=require('../middleware/handleError');



module.exports = function (app) {
    app.use(body_parser.json());
    app.use(cors());
    app.use('/api/users', user);
    app.use('/api/auth', auth);
    app.use('/api/article', article);
    app.use(errors); 
}