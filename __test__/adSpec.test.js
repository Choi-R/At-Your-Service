const supertest = require('supertest')
const app = require('../index.js')
const request = supertest(app)
const jwt = require('jsonwebtoken')
const User = require('../models/user.schema')
const userFixture = require('./fixtures/userFixture.js')
const adFixture = require('./fixtures/adFixtures')
// const fs = require('fs')

let newAd = adFixture.create()
let newUser = {
    ...userFixture.create(),
    isBusiness: true,
    privilege: true
}

let token;
let _id;

beforeAll(done => {
    User.create({
        ...newUser,
        isBusiness: true
    })
        .then(() => {
            token = jwt.sign({ _id: newUser._id }, process.env.SECRET_KEY)
            done()
        })
})
afterAll(done => {
    User.deleteMany({})
        .then(() => done())

})

describe('POST /api/v1/ads', function () {
    test('should create an advertisement', function (done) {
        request.post(`/api/v1/ads`)
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send(JSON.stringify(newAd))
            .then((res) => {
                _id = res.body.data._id
                expect(res.statusCode).toBe(201)
                expect(res.body.data).toHaveProperty('title')
                expect(res.body.data).toHaveProperty('body')
                done()
            })
    })
})

describe('GET /api/v1/ads', function () {
    test('should get an advertisement', function (done) {
        request.get(`/api/v1/ads`)
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .then((res) => {
                expect(res.statusCode).toBe(200)
                done()
            })
    })
    test('should get one advertisement', function (done) {
        request.get(`/api/v1/ads/${_id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .then((res) => {
                expect(res.statusCode).toBe(200)
                done()
            })
    })
})

