const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const adsSchema = new Schema ({
    isApproved: {
        type: Boolean,
        default: false
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: 'https://i.pinimg.com/originals/0d/36/e7/0d36e7a476b06333d9fe9960572b66b9.jpg'
    }, 
    isApprove : {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

adsSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Ads', adsSchema);
