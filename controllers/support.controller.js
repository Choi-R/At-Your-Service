const Support = require('../models/support.schema');
const jwt = require('jsonwebtoken');

const { success, error, failedMessage } = require('../helpers/response');

// Create Support
exports.addSupport = async (req, res) => {
    let user = jwt.verify(req.headers.authorization, process.env.SECRET_KEY)
    if (!user) return failedMessage(res, 'You\'re not login yet', 401)

    let support = new Support({
        owner: user._id,
        title: req.body.title,
        description: req.body.description
    })
    Support.create(support)
        .then(data => success(res,'Support send', data, 201))
        .catch(err => error(res, err, 'There\'s something error', 422))
}
//Get all or One Article
exports.getSupport = (req, res) => {
    let user = jwt.verify(req.headers.authorization, process.env.SECRET_KEY)
    let page = parseInt(req.query.page)
    if (!user.privilege) return failedMessage(res, 'You\'re not admin', 401)

    if (req.query._id) {
        Support.findOneAndUpdate({ _id: req.query._id }, { isRead: true }, { new: true })
            .then(data => success(res,'read one', data, 200))
            .catch(err => error(res, err, 'There\'s something error', 422))
    }
    else {
        Support.paginate({}, { page, limit: 10 })
            .then(data => {
                if (!data) return failedMessage(res, 'support not found', 404)
                success(res, 'success', data, 200)
            })
            .catch(err => error(res, 'failed', err, 422))
    }
}

// Delete One Support
exports.deleteSupport = (req, res) => {
    let user = jwt.verify(req.headers.authorization, process.env.SECRET_KEY)
    if (!user.privilege) return failedMessage(res, 'You\'re not admin', 401)

    Support.findOneAndDelete({ _id: req.params._id })
        .then(data => {
            if (!data) return failedMessage(res, 'support not found', 404)
            success(res, `One support has been deleted.`, data, 200)
        })
        .catch(err => error(res, 'failed', err, 422))
}

// Delete All Support
exports.deleteAll = (req, res) => {
    let user = jwt.verify(req.headers.authorization, process.env.SECRET_KEY)
    if (!user.privilege) return failedMessage(res, 'You\'re not admin', 401)

    Support.deleteMany({})
        .then(data => {
            if (!data) return failedMessage(res, 'support not found', 404)
            success(res, `All support has been deleted.`, data, 200)
        })
        .catch(err => error(res, 'failed', err, 422))
}