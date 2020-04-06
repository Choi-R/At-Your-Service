require('dotenv').config()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.schema');
const mailer = require('../services/mailer');
const Imagekit = require('imagekit')
const {
    success,
    error,
    successMessage,
    failedMessage,
} = require('../helpers/response')

const imagekit = new Imagekit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.urlEndpoint
});

//USER CLIENT REGISTER
exports.userRegister = (req, res) => {
    if (req.body.password != req.body.password_confirmation) return failedMessage(
        res, 'Password doesn\'t match', 422)
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    })

    User.create(user)
        .then(data => {
            let token = jwt.sign({ _id: data._id }, process.env.SECRET_KEY)
            mailer.send({
                from: 'no-reply@AYS.com',
                to: data.email,
                subject: 'User Activation',
                html: `
                <p> Hei, ${data.name}. Please click on the link below to verify your email and continue the registration process.</p>
                <a href="${process.env.BASE_URL}/api/v1/user/activation/${token}">Click here</a>`
            })
            return {
                ...data._doc,
                token
            }
        })
        .then(result => {
            success(res, `A verification link has been sent to your email account. Please click on the link that has just been sent to your email account to verify your email and continue the registration process.`, result, 201)
        })
        .catch(err => error(res, 'Can\'t create user', err, 422))
}

//ACTIVATION USER
exports.activation = (req, res) => {
    let user = jwt.verify(req.params.token, process.env.SECRET_KEY)

    User.findOneAndUpdate({ _id: user._id }, { isConfirmed: true })
        .then(() => res.redirect('/user/confirmed'))
        .catch(err => error(res, err, 422))
}

//LOGIN USER
exports.loginUser = (req, res) => {
    User.findOne({ email: req.body.email })
        .then(data => {
            if (!data) return failedMessage(
                res, `That email and password combination didn't work. Try again.`, 403)
            if (!bcrypt.compareSync(req.body.password, data.password)) return failedMessage(
                res, `That email and password combination didn't work. Try again.`, 403)
            if (!data.isConfirmed) return failedMessage(
                res, 'Email isn\'t verified, please check your email!', 403)
            
            success(res, 'Successfuly login', {
                _id: data._id,
                privilege: data.privilege,
                name: data.name,
                email: data.email,
                image: data.image,
                isBusiness: data.isBusiness,
                token: jwt.sign({ _id: data._id, privilege: data.privilege, isBusiness: data.isBusiness }, process.env.SECRET_KEY)
            }, 200)
        })
        .catch(err => failedMessage(res, err, 422))
}

// FORGOT PASSWORD
exports.forgotPassword = (req, res) => {
    User.findOne({ email: req.body.email })
        .then(data => {
            let token = jwt.sign({ _id: data._id }, process.env.SECRET_KEY)
            mailer.send({
                from: 'no-reply@AYS.com',
                to: data.email,
                subject: 'Reset password',
                html: `
          <p> Hai, ${data.name}. Change your password with click this link below.</p>
          <a href="${process.env.BASE_URL}/api/v1/user/resetPassword/${token}">Click here</a>`
            })
            return token
        })
        .then(result => {
            success(res, `If a AYS account for ${req.body.email} exists, you will receive an email with a link to reset your password.`, result, 200)
        })
        .catch(() => {
            successMessage(res, `If a AYS account for ${req.body.email} exists, you will receive an email with a link to reset your password.`, 200)
        })
}

// RESET PASSWORD
exports.resetPassword = (req, res) => {
    let user = jwt.verify(req.params.token, process.env.SECRET_KEY)

    User.findOneAndUpdate({ _id: user._id }, { password: bcrypt.hashSync(req.query.password) })
        .then(() => res.redirect('/user/reset'))
        .catch(err => error(res, err, 422))
}

//UPLOAD PICTURE
exports.uploadImage = (req, res) => {
    imagekit
        .upload({
            file: req.file.buffer.toString("base64"),
            fileName: `IMG-${Date()}`
        })
        .then(async data => {
            User.findOneAndUpdate({ _id: req.user._id }, { image: data.url }, (error, document) => {
                let newResponse = {
                    ...document._doc,
                    image: data.url
                }
                delete newResponse.password
                success(res, `successfully updated profile`, newResponse, 200)
            })
        })
        .catch(err => {
            res.status(422).json({
                status: false,
                errors: err
            })
        })
}

//EDIT PROFILE
exports.editProfile = (req, res) => {
    let user = jwt.verify(req.headers.authorization, process.env.SECRET_KEY)
    User.findOneAndUpdate({ _id: user._id }, { name: req.body.name })
        .select(['-password'])
        .then(data => {
            success(res, 'successful update', { ...data._doc, name: req.body.name }, 200)
        })
        .catch(err => error(res, err, 'ERR', 422))
}

// VIEW PROFILE
exports.viewProfile = (req, res) => {
    let user = jwt.verify(req.headers.authorization, process.env.SECRET_KEY)
    User.findOne({ _id: user._id })
        .then(data => success(res, 'success get user profile', data, 200))
        .catch(err => error(res, 'failed get user profile', err, 422))
}

// USER COUNTING
exports.count = async (req, res) => {
    try {
        let user = await User.findById(req.user)
        if (user.privilege == true) {
            let page = parseInt(req.query.page || 1, 10)
            let limit = parseInt(req.query.limit || 10, 10)
            let total = await User.countDocuments({})
            let verificated = await User.countDocuments({ isConfirmed: true })
            let notVerificated = parseInt(total, 10) - parseInt(verificated, 10)

            let data = await User.paginate({}, { page, limit })
            successMessage(res, { total: total, verificated: verificated, notVerificated: notVerificated, data }, 200)
        }
        else { return failedMessage(res, 'You are not an admin', 422) }
    }
    catch (err) { error(res, "Something's wrong, please contact backend team.", err, 404) }
}
