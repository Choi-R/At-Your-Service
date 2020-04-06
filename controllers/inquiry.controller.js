const Inquiry = require('../models/inquiry.schema')
const User = require('../models/user.schema');
const Business = require('../models/business.schema')
const { success, error, successMessage, failedMessage } = require('../helpers/response')

async function add(req, res) {
    try {
        if (!req.user) {
            return failedMessage(res, 'You need to login first', 401)
        }
        let user = await User.findById(req.user)
        let inquiry = new Inquiry({
            business_id: req.params._id,
            owner_id: req.user,
            name: req.body.name,
            email: user.email,
            phone: req.body.phone,
            job: req.body.job,
            description: req.body.description
        })
        let data = await inquiry.save()
        success(res, 'Your request has been sent.', data, 201)
    }
    catch (err) { failedMessage(res, err, 422) }

}

async function show(req, res) {
    try {
        let user = await User.findById(req.user)
        let page = parseInt(req.query.page || 1, 10)
        let limit = parseInt(req.query.limit || 10, 10)
        let _id = req.query._id

        if (user.privilege == true) {
            if (_id) {
                let data = await Inquiry.findOne({ _id: _id })
                return success(res, 'Here you go', data, 200)
            }
            else {
                let data = await Inquiry.paginate({}, { page, limit })
                return success(res, 'Here you go', data, 200)
            }
        }
        else if (user.isBusiness == true){
            let business = await Business.findOne({owner_id: user._id})
            let status = req.query.status
            if (_id) {
                let data = await Inquiry.findOneAndUpdate({ _id: _id, business_id: business._id }, {isRead: true}, {new: true})
                if(status=="true"){
                    let updated = await Inquiry.findByIdAndUpdate(_id, {isAccepted: true})
                    user.notifications.push(`Your inquiry for ${user.business} has been accepted`)
                    return success(res, 'This inquiry has been accepted', updated, 200)
                }
                else if(status=="false"){
                    let updated = await Inquiry.findByIdAndUpdate(_id, {isAccepted: false})
                    user.notifications.push(`Your inquiry for ${user.business} has been rejected`)
                    return success(res, 'This inquiry has been rejected', updated, 200)
                }
                return success(res, 'Here you go', data, 200)
            }
            else {
                let data = await Inquiry.paginate({business_id: user.business},{ page, limit })
                return success(res, 'Here you go', data, 200)
            }
        }
        else {
            if (_id) {
                let data = await Inquiry.findOneAndUpdate({ _id: _id, owner_id: user._id }, {isRead: true}, {new: true})
                return success(res, 'Here you go', data, 200)
            }
            else {
                let data = await Inquiry.paginate({ owner_id: user._id }, { page, limit })
                return success(res, 'Here you go', data, 200)
            }
        }
    }
    catch (err) {
        return error(res, 'ERROR', err, 422)
    }
}

async function update(req, res) {
    try {
        let user = await User.findById(req.user)
        if (user.privilege == true) {
            let updated = await Inquiry.findOneAndUpdate({ _id: req.params._id }, req.body, {new: true})
            success(res, 'This inquiry has been updated.', updated, 200)
        }
        else {
            return failedMessage(res, 'You are not an admin', 401)
        }
    }
    catch (err) {
        return failedMessage(res, err.message, 422)
    }
}

async function destroy(req, res) {
    try {
        let user = await User.findById(req.user)
        let inquiry = await Inquiry.findById(req.params._id)
        if (user.privilege == true) {
            inquiry.remove()
            successMessage(res, 'succesfully delete an inquiry', 200)
        }
        else {
            return failedMessage(res, 'You are not an admin', 401)
        }
    }
    catch (err) {
        return failedMessage(res, err.message, 422)
    }
}

module.exports = {
    add,
    show,
    update,
    destroy
}