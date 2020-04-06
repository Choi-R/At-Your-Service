const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2')

const articleSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    body: {
        type: String,
        required: true
    },
    category: {
        type: Array,
        required: true,
        default: []
    },
    thumbnail: {
        type: String
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
})
articleSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Article', articleSchema);