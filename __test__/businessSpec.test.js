const supertest = require('supertest')
const app = require('../index.js')
const request = supertest(app)
const jwt = require('jsonwebtoken')
const User = require('../models/user.schema')
const userFixture = require('./fixtures/userFixture.js')
const businessFixture = require('./fixtures/businessFixture.js')
const fs = require('fs')

let newUser = {
    ...userFixture.create(),
    privilege: true
}
let newBusiness = businessFixture.create()

let token;
let _id;

beforeAll(done => {
    User.create({
        ...newUser,
        privilege: true
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
describe('POST /api/v1/business', function () {
    test('should create a business model', function (done) {
        request.post(`/api/v1/business`)
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send(JSON.stringify(newBusiness))
            .then((res) => {
                _id = res.body.data._id;
                expect(res.statusCode).toBe(201)
                expect(res.body.data).toHaveProperty('name')
                expect(res.body.data).toHaveProperty('company')
                done()
            })
    })
})

describe('GET /api/v1/business/', function () {
    test('should get all businesses', function (done) {
        request.get(`/api/v1/business/`)
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .then((res) => {
                expect(res.statusCode).toBe(200)
                done()
            })
    })
    test('should get businesses with a certain id', function (done) {
        request.get(`/api/v1/business?_id=${_id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .then((res) => {
                expect(res.statusCode).toBe(200)
                done()
            })
    })
    test("should be able to search businesses' description or name", function (done) {
        request.get(`/api/v1/business?search=tes`)
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .then((res) => {
                expect(res.statusCode).toBe(200)
                done()
            })
    })
    test("should be able to search businesses' category", function (done) {
        request.get(`/api/v1/business?category=Finance`)
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
        request.put(`/api/v1/business/${_id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send(JSON.stringify({ name: 'test01' }))
            .then((res) => {
                expect(res.statusCode).toBe(200)
                done()
            })
    })
})

describe('POST /api/v1/business/:_id', function () {
    test('should bookmark a business', function (done) {
        request.post(`/api/v1/business/${_id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .then((res) => {
                expect(res.statusCode).toBe(200)
                done()
            })
    })
})

describe('GET /api/v1/business/:_id', function () {
    test('should approve a business', function (done) {
        request.get(`/api/v1/business/${_id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .then((res) => {
                expect(res.body.data.isApproved).toBe(true)
                expect(res.statusCode).toBe(200)
                done()
            })
    })
})



describe('DELETE /api/v1/business/:_id', function () {
    test('should be able to delete a business', done => {
        request.delete(`/api/v1/business/${_id}`)
            .set('Authorization', token)
            .then((res) => {
                expect(res.statusCode).toBe(200)
                done()
            })
    })
})