const faker = require('faker')
const mongoose = require('mongoose')

function create() {
    return {
        _id: mongoose.Types.ObjectId(),
        name: faker.name.firstName(),
        company: faker.company.companyName(),
        description: faker.company.catchPhraseDescriptor(),
        web_link: faker.internet.url(),
        gplay_link: faker.internet.url(),
        category: 'Finance'

    }
}
module.exports = {create}