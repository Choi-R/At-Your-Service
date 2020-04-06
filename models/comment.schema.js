const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongoosePaginate = require('mongoose-paginate-v2')

const commentSchema = new Schema({
    article: {
        type: Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})
commentSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Comment', commentSchema) 