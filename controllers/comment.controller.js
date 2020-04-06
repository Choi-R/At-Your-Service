const Article = require('../models/article.schema');
const Comment = require('../models/comment.schema');
const jwt = require('jsonwebtoken');
const {
    success,
    error,
    failedMessage
} = require('../helpers/response');

exports.addComment = async (req, res) => {
    let user = jwt.verify(req.headers.authorization, process.env.SECRET_KEY)

    let comment = new Comment({
        article: req.params.article_id,
        owner: user._id,
        description: req.body.description
    })

    Comment.findOne({ article: req.params.article_id, owner: user._id })
        .then(data => {
            if (data) return failedMessage(res, 'You just can put one comment in each article', 422)
            Article.update({ id: req.params.article_id })
                .then(newdata => {
                    if (!newdata.nModified) return failedMessage(res, 'can\'t create comment, article not found', 404)
                    return Comment.create(comment)
                })
                .then(result => success(res, 'comment created', result, 201))
                .catch(err => error(res, 'can\'t comment', err, 422))
        })
        .catch(err => error(res, 'can\'tcomment', err, 422))
}

exports.getCommentByArticle = (req, res) => {
    let page = parseInt(req.query.page)
    Comment.paginate({ article: req.params.article_id }, { page, limit: 10, populate: 'owner' })
        .then(data => {
            if (!data) return failedMessage(res, 'Can\'t find comment', 404)
            success(res, 'success', data, 200)
        })
        .catch(err => error(res, 'failed', err, 422))
}

exports.editComment = (req, res) => {
    let user = jwt.verify(req.headers.authorization, process.env.SECRET_KEY)
    let update = {
        description: req.body.description
    }
    Comment.findOneAndUpdate({ article: req.params.article_id, owner: user._id }, update)
        .then(data => {
            if (!data) return failedMessage(res, 'Can\'t find comment', 404)
            success(res, 'comment updated', { ...data._doc, ...update }, 200)
        })
        .catch(err => error(res, 'fail to update comment', err, 422))
}

exports.deleteComment = (req, res) => {
    let user = jwt.verify(req.headers.authorization, process.env.SECRET_KEY)
    Comment.findOneAndDelete({ article: req.params.article_id, owner: user._id })
        .then(data => {
            if (!data) return failedMessage(res, 'Can\'t find comment', 404)
            success(res, 'success delete comment', data, 200)
        })
        .catch(err => error(res, 'can\'t delete comment', err, 422))
}