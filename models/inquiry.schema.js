const mongoose = require('mongoose')
const paginate = require('mongoose-paginate-v2')
const Schema = mongoose.Schema

const inquirySchema = new Schema({
    isRead: {
        type: Boolean,
        default: false
    },
    isAccepted: "",
    business_id: {
        type: Schema.Types.ObjectId,
        ref: 'Business',
    },
    owner_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    email: String,
    phone: {
        type: String,
        required: true
    },
    job: String,
    description: {
        type: String,
        required: true
    },
})

inquirySchema.plugin(paginate)
const Inquiry = mongoose.model('Inquiry', inquirySchema)
module.exports = Inquiry