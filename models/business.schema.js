const mongoose = require('mongoose')
const Schema = mongoose.Schema

const businessSchema = new Schema({
    isRead: {
        type: Boolean,
        default: false
    },
    owner_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    name: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    description: String,
    logo: String,
    web_link: String,
    gplay_link: String,
    category: String
})

const Business = mongoose.model('Business', businessSchema)
module.exports = Business