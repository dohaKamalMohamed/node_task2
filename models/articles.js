const mongoose = require('mongoose');
const joi = require('joi');


const articleSchema = new mongoose.Schema({
    articleName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 225,
    },
    articleBody: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 4000,
    },
     
    creationDate: {
        type: Date,
        default: Date.now()
    }

});


const Article = mongoose.model('Article', articleSchema);

function validateArticle(article) {
    const schema = joi.object()
        .keys({
            articleName: joi.string()
                .required()
                .min(4)
                .max(225)
                .alphanum(),
            articleBody: joi.string()
                .required()
                .min(4)
                .max(4000),
        });
    return joi.validate(article, schema);
}

module.exports.Article = Article;
module.exports.validate = validateArticle;