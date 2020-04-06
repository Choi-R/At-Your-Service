require('dotenv').config()
const Business = require('../models/business.schema')
const User = require('../models/user.schema');
const Inquiry = require('../models/inquiry.schema')
const Imagekit = require('imagekit')
const imagekit = new Imagekit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.urlEndpoint
});
const { success, error, successMessage, failedMessage } = require('../helpers/response.js')

async function add(req, res) {
    try {
        let business = await new Business({
            owner_id: req.user._id,
            name: req.body.name,
            company: req.body.company,
            description: req.body.description,
            web_link: req.body.web_link,
            gplay_link: req.body.gplay_link,
            category: req.body.category,
            logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQkeLuqan9ydnLbAszqc8opzzy4A-Scfhv1r712TMNtRCTpXBZz&usqp=CAU"
        })
        let data = await business.save()
        await User.findOneAndUpdate({_id: req.user._id}, {isBusiness: true})
        return success(res, 'Succesfully registered your business, please wait for the admin\'s approval', data, 201)
    }
    catch (err) {
        return error(res, 'failed to register', err, 422)
    }
}

const show = async (req, res) => {
    try {
        let user = await User.findById(req.user)
        let category = req.query.category
        let search = req.query.search
        let _id = req.query._id
        if (_id) {
            let data = await Business.findOne({ _id: _id })
            if(user.privilege==true) {
                data.isRead = true
                await data.save()
            }
            success(res, 'Here you go', data, 200)
        }
        else if (category) {
            let data = await Business.find({ category: category, isApproved: true })
            success(res, 'Here you go', data, 200)
        }
        else if (search) {
            let data = await Business.find({ $or: [{ description: { $regex: search, $options: 'i' } }, { name: { $regex: search, $options: 'i' } }] })
            success(res, 'Here you go', data, 200)
        }
        else {
            if (user.privilege == true) {
                let totalDocs = await Business.countDocuments({})
                let data = await Business.find({})
                res.status(200).json({
                    status: true,
                    totalDocs: totalDocs,
                    data
                })
            }
            else {
                let data = await Business.find({ isApproved: true })
                success(res, 'Here you go', data, 200)
            }
        }
    }
    catch (err) { failedMessage(res, 'Not found', 404) }
}

async function update(req, res) {
    try {
        let user = await User.findById(req.user)
        if (user.privilege == true || user.isBusiness == true) {
            let updated = await Business.findOneAndUpdate({ _id: req.params._id }, req.body, { new: true })
            success(res, 'Your business has been updated', updated, 200)
        }
        else {
            return failedMessage(res, 'You are not an admin', 401)
        }
    }
    catch (err) {
        return error(res, 'Failed to edit', err, 422)
    }
}

async function image(req, res) {
    try {
        let user = await User.findById(req.user)
        if (user.privilege == true || user.isBusiness == true) {
            let logo = await imagekit.upload({
                file: req.file.buffer.toString('base64'),
                fileName: `BusinessIMG-${Date.now()}`
            })
            let updated = await Business.findByIdAndUpdate(req.params._id, { logo: logo.url }, { new: true })
            success(res, 'Your business logo has been uploaded', updated, 202)
        }
        else {
            return failedMessage(res, 'You are not an admin', 401)
        }
    }
    catch (err) {
        error(res, 'Failed to upload logo', err, 422)
    }
}

async function removeB(req, res) {
    try {
        let user = await User.findById(req.user)
        let business = await Business.findById(req.params._id)
        if (user.privilege == true) {
            await Inquiry.deleteMany({ business_id: req.params._id })
            let deleted = await business.remove()
            return success(res, 'succesfully delete a business', deleted, 200)
        }
        else if (user.isBusiness == true) {
            if (business.owner_id == user._id) {
                await Inquiry.deleteMany({ business_id: req.params._id })
                let deleted = await business.remove()
                return success(res, 'succesfully delete a business', deleted, 200)
            }
            else{
                return failedMessage(res, 'You can only delete your own business!', 422 )
            }

        }
        else {
            return failedMessage(res, 'You are not an admin nor this business\'s owner', 401)
        }
    }
    catch (err) {
        return failedMessage(res, err.message, 422)
    }
}

async function approve(req, res) {
    try {
        let business = await Business.findById(req.params._id)
        let user = await User.findById(business.owner_id)
        let currentUser = await User.findById(req.user)
        if (currentUser.privilege == true) {
            let updated = await Business.findOneAndUpdate({ _id: req.params._id }, { isApproved: true }, { new: true })
            user.isBusiness = true
            user.business = updated._id
            await user.save()
            success(res, 'Business approved!', updated, 200)
        }
        else {
            return failedMessage(res, 'You are not an admin', 401)
        }
    }
    catch (err) {
        return error(res, 'Failed to approve', err, 422)
    }
}

async function bookmark(req, res) {
    try {
        let user = await User.findById(req.user);
        let index = user.business_bookmarks.indexOf(req.params._id)
        if (index == -1) {
            user.business_bookmarks.push(req.params._id)
            await user.save()
            return successMessage(res, 'Saved to bookmark!', 200)
        }
        else {
            user.business_bookmarks.splice(index,1)
            await user.save()
            return successMessage(res, 'Removed from bookmark!', 200)
        }

    }
    catch (err) {
        failedMessage(res, err, 422)
    }
}

module.exports = {
    add,
    show,
    update,
    image,
    removeB,
    approve,
    bookmark,
}