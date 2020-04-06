const faker = require('faker')
const mongoose = require('mongoose')

function create() {
    return {
        _id: mongoose.Types.ObjectId(),
        title: faker.name.firstName(),
        body: faker.company.catchPhraseDescriptor(),
    }
}
module.exports = {create}