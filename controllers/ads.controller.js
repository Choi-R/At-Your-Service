const Ads = require('../models/ads.schema');
const jwt = require('jsonwebtoken');
const Imagekit = require('imagekit');
const User = require('../models/user.schema')

const {
    success,
    error,
    failedMessage
} = require('../helpers/response');

const imagekit = new Imagekit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.urlEndpoint
});

exports.create = async (req, res) => {
    let user = await User.findById(req.user)
    if (!user.isBusiness) return failedMessage(res, 'You\'re not Business account', 401)
    let ads = new Ads({
        title: req.body.title,
        body: req.body.body,
        owner: user._id
    })
    Ads.create(ads)
        .then(data => success(res, 'successfully added an Ads', data, 201))
        .catch(err => error(res, 'failed to add ads', err, 422))
}

exports.get = (req, res) => {
    let page = parseInt(req.query.page) || 1
    let user = User.findById(req.user)
    if (user.privilege == true) {
        Ads.paginate({}, { page, limit: 10 })
            .then(data => {
                if (!data) return failedMessage(res, 'ads not found', 404)
                success(res, 'success', data, 200)
            })
            .catch(err => error(res, 'failed', err, 422))
    }
    else {
        Ads.paginate({ isApproved: true }, { page, limit: 10 })
            .then(data => {
                if (!data) return failedMessage(res, 'ads not found', 422)
                success(res, 'success', data, 200)
            })
            .catch(err => error(res, 'failed', err, 422))
    }
}

exports.getByDetailsId = async (req, res) => {
    let user = await User.findById(req.user)
    if (!user.privilege) return failedMessage(res, 'You\'re not admin', 401)

    Ads.findOne({ _id: req.params.ads_id })
        .then(data => success(res, 'get ads details', data, 200))
        .catch(err => error(res, 'failed to get details', err, 422))
}

exports.updateImage = (req, res) => {
    imagekit
        .upload({
            file: req.file.buffer.toString("base64"),
            fileName: `IMG-${Date()}`
        })
        .then(async data => {
            return Ads.findOneAndUpdate({ _id: req.params.ads_id }, { image: data.url }, (error, document, result) => {
                let newResponse = {
                    ...document._doc,
                    image: data.url
                }
                success(res, `successfully updated banner`, newResponse, 200)
            })
        })
        .catch(err => error(res, 'fail to update banner', err, 422))
}

exports.deleteAd = async (req, res) => {
    let user = await User.findById(req.user)
    if (!user.privilege) return failedMessage(res, 'You\'re not admin', 401)

    Ads.findOneAndDelete({ _id: req.params.ads_id })
        .then(data => {
            if (!data) return failedMessage(res, 'support not found', 404)
            success(res, `One ad has been deleted.`, data, 200)
        })
        .catch(err => error(res, 'failed', err, 422))
}

exports.approve = async (req, res) => {
    try {
        let currentUser = await User.findById(req.user)
        if (currentUser.privilege == true) {
            if (req.query.status == false) {
                let updated = await Ads.findOneAndUpdate({ _id: req.params.ads_id }, { isApproved: false }, { new: true })
                success(res, 'Ad approved!', updated, 200)
            }
            else {
                let updated = await Ads.findOneAndUpdate({ _id: req.params.ads_id }, { isApproved: true }, { new: true })
                success(res, 'Ad approved!', updated, 200)
            }

        }
        else {
            return failedMessage(res, 'You are not an admin', 401)
        }
    }
    catch (err) {
        return error(res, 'Failed to approve', err, 422)
    }
}