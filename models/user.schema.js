const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const Schema = mongoose.Schema

var validateEmail = function(email) {
    var re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    business: String,
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    privilege: {
        type: Boolean,
        default: false
    },
    isBusiness: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
        default: 'https://i.pinimg.com/originals/0d/36/e7/0d36e7a476b06333d9fe9960572b66b9.jpg'
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    business_bookmarks: [{
        type: Schema.Types.ObjectId,
        ref: 'Business',
    }],
    article_bookmarks: [{
        type: Schema.Types.ObjectId,
        ref: 'Article',
    }],
    notifications: [{
        type: String
    }]
}, {
    timestamps: true
});

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
};

userSchema.plugin(mongoosePaginate)
const User = mongoose.model('User', userSchema)

module.exports = User;