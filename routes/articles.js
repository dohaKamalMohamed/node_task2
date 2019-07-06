const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { Article, validate } = require('../models/articles');
const auth=require('../middleware/userAuthorization');
const admin=require('../middleware/adminAuthorization');



router.get('/',[auth,admin], async (req, res) => {
    let articles = await Article.find();
    res.send(articles);
});

router.get('/:id', async (req, res) => {
    let article = await Article.findOne({ _id: req.params.id });
    if (!article) {
        return res.status(404).send('this user is not exist');
    }
    res.send(article);
});

router.post('/',admin, async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.send(400).send(error.details[0].message);
    }

    let article = new Article(_.pick(req.body, [
        'articleName',
        'articleBody',
    ]));
    await article.save();
    res.send(article);

});

router.put('/:id',admin, async (req, res) => {

    const { error } = validate(req.body);
    if (error) {
        return res.send(400).send(error.details[0].message);
    };

    let article = await Article.findOneAndUpdate({ _id: req.params.id }, _.pick(req.body, [
        'articleName',
        'articleBody',
    ]));

    if (!article) {
        return res.status(404).send('this user is not exist');
    }

    res.send(article);

});


router.delete('/:id',admin, async (req, res) => {

    let article = await Article.findOneAndDelete({ _id: req.params.id });

    if (!article) {
        return res.status(400).send('this user is not exist');
    }

    res.send(article);

});

module.exports = router;