const faker = require('faker')
const mongoose = require('mongoose')

function create() {
    return {
        _id: mongoose.Types.ObjectId(),
        name: faker.name.firstName(),
        phone: faker.phone.phoneNumber(),
        job: faker.name.jobTitle(),
        description: faker.name.jobDescriptor()

    }
}
module.exports = {create}