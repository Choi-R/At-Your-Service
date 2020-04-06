const Article = require('../models/article.schema');
const jwt = require('jsonwebtoken');
const Imagekit = require('imagekit');
const User = require('../models/user.schema')

const { success, error, successMessage, failedMessage } = require('../helpers/response');

const imagekit = new Imagekit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.urlEndpoint
});

// split string by space
function capitalSpace(str) {
    str = str.split(" ");
    for (var i = 0, x = str.length; i < x; i++) {
        str[i] = str[i][0].toUpperCase() + str[i].substr(1);
    }
    return str.join(" ");
}

// split string by underscore
function capitalUnderscore(str) {
    str = str.split("_");
    for (var i = 0, x = str.length; i < x; i++) {
        str[i] = str[i][0].toUpperCase() + str[i].substr(1);
    }
    return str.join(" ");
}

// string to object
function stringObj(words) {
    words = words.split(",");
    for (var i = 0, x = words.length; i < x; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1)
    }
    return words
}

// object cleaner
function cleanObject(obj) {
    for (var propName in obj) {
        if (!obj[propName]) {
            delete obj[propName];
        }
    }
}

// Create Article
exports.create = (req, res) => {
    let user = jwt.verify(req.headers.authorization, process.env.SECRET_KEY)
    if (!user.privilege) return failedMessage(res, 'You\'re not admin', 422)

    let article = new Article({
        title: capitalSpace(req.body.title),
        body: req.body.body,
        category: stringObj(req.body.category)
    })

    imagekit
        .upload({
            file: req.file.buffer.toString("base64"),
            fileName: `IMG-${Date()}`
        })
        .then(data => {
            return Article.create({ ...article._doc, thumbnail: data.url })
        })
        .then(result => success(res, 'successfully added an Article', result, 201))
        .catch(err => error(res, 'failed to add article', err, 422))
}

//Get all Article
exports.get = (req, res) => {
    let page = parseInt(req.query.page)
    Article.paginate({}, { page, limit: 10 })
        .then(data => {
            if (!data) return failedMessage(res, 'article not found', 422)
            success(res, 'success', data, 201)
        })
        .catch(err => error(res, 'failed', err, 422))
}

//Update Thumbnail
exports.updateImage = (req, res) => {
    imagekit
        .upload({
            file: req.file.buffer.toString("base64"),
            fileName: `IMG-${Date()}`
        })
        .then(async data => {
            return Article.findOneAndUpdate({ _id: req.params.article_id }, { thumbnail: data.url }, (error, document, result) => {
                let newResponse = {
                    ...document._doc,
                    thumbnail: data.url
                }
                success(res, `successfully updated thumbnail`, newResponse, 200)
            })
        })
        .catch(err => error(res, 'fail to update thumbnail', err, 422))
}

//Update Article detail
exports.update = (req, res) => {
    let user = jwt.verify(req.headers.authorization, process.env.SECRET_KEY)
    if (!user.privilege) return failedMessage(res, 'You\'re not admin', 422)

    let updateValue = {
        title: capitalSpace(req.body.title),
        body: req.body.body,
        category: stringObj(req.body.category)
    }

    cleanObject(updateValue)

    Article.findOneAndUpdate({ _id: req.params.article_id }, updateValue)
        .then(data => {
            if (!data) return failedMessage(res, 'article not found', 422)
            success(res, 'update success', { ...data._doc, ...updateValue }, 200)
        })
        .catch(err => error(res, 'failed', err, 422))
}

//Delete Article
exports.delete = (req, res) => {
    let user = jwt.verify(req.headers.authorization, process.env.SECRET_KEY)
    if (!user.privilege) return failedMessage(res, 'You\'re not admin', 422)

    Article.findOneAndDelete({ _id: req.params.article_id })
        .then(data => {
            if (!data) return failedMessage(res, 'article not found', 422)
            success(res, `${data.title} has been deleted.`, data, 200)
        })
        .catch(err => error(res, 'failed', err, 422))
}

// Bookmark an Article
exports.bookmark = async (req, res) => {
    try {
        let user = await User.findById(req.user);
        let index = user.article_bookmarks.indexOf(req.params.article_id)
        if (index == -1) {
            user.article_bookmarks.push(req.params.article_id)
            await user.save()
            return successMessage(res, 'Saved to bookmark!', 200)
        }
        else {
            user.article_bookmarks.splice(index, 1)
            await user.save()
            return successMessage(res, 'Removed from bookmark!', 200)
        }

    }
    catch (err) {
        failedMessage(res, err, 422)
    }
}

// GET Article details by ID
exports.detailsById = (req, res) => {
    Article.findOne({ _id: req.params.article_id })
        .then(data => success(res, 'get article details', data, 200))
        .catch(err => error(res, 'failed to get details', err, 422))
}

exports.like = async (req, res) => {
    try {
        let article = await Article.findById(req.params.article_id);
        let index = article.likes.indexOf(req.params.article_id)
        if (index == -1) {
            article.likes.push(req.params.article_id)
            await article.save()
            return successMessage(res, 'Liked!', 200)
        }
        else {
            article.likes.splice(index, 1)
            await article.save()
            return successMessage(res, 'Removed like!', 200)
        }
    }
    catch (err) {
        failedMessage(res, 'err', 422)
    }
}