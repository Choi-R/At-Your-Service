const supertest = require('supertest')
const app = require('../index.js')
const request = supertest(app)
const jwt = require('jsonwebtoken')
const User = require('../models//user.schema')
const Business = require('../models/business.schema')
const userFixture = require('./fixtures/userFixture.js')
const businessFixture = require('./fixtures/businessFixture.js')
const inquiryFixture = require('./fixtures/inquiryFixture.js')
let newUser = {
    ...userFixture.create(),
    privilege: true,
    isBusiness: false
}
let newBusiness = businessFixture.create()
let newInquiry = inquiryFixture.create()
let token;
let _id;

beforeAll(done => {
    Business.create(newBusiness)
    User.create({
        ...newUser,
        privilege: true,
        isBusiness: false
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
describe('POST /api/v1/inquiry/:_id', function () {
    test('should create an inquiry', function (done) {
        request.post(`/api/v1/inquiry/${newBusiness._id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send(JSON.stringify(newInquiry))
            .then((res) => {
                _id = res.body.data._id
                expect(res.statusCode).toBe(201)
                expect(res.body.data).toHaveProperty('name')
                done()
            })
    })
})

describe('GET /api/v1/inquiry/', function () {
    test('should get all inquiries', function (done) {
        request.get(`/api/v1/inquiry/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .then((res) => {
                expect(res.statusCode).toBe(200)
                done()
            })
    })
    test('should get an inquiry with a certain id', function (done) {
        request.get(`/api/v1/inquiry?_id=${_id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .then((res) => {
                expect(res.statusCode).toBe(200)
                done()
            })
    })
})

describe('PUT /api/v1/business/:_id', function () {
    test('should be able to edit a business model', function (done) {
        request.put(`/api/v1/inquiry/${_id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send(JSON.stringify({ name: 'test01' }))
            .then((res) => {
                expect(res.statusCode).toBe(200)
                done()
            })
    })
})

describe('DELETE /api/v1/inquiry/:_id', function () {
    test('should be able to delete an inquiry', done => {
        request.delete(`/api/v1/inquiry/${_id}`)
            .set('Authorization', token)
            .then((res) => {
                expect(res.statusCode).toBe(200)
                done()
            })
    })
})