const faker = require('faker')
const mongoose = require('mongoose')

function create() {
    return {
        _id: mongoose.Types.ObjectId(),
        name: faker.name.firstName(),
        email: faker.internet.email().toLowerCase(),
        password: faker.internet.password()
    }
}
module.exports = {create}