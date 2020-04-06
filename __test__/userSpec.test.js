const supertest = require('supertest')
const app = require('../index.js')
const request = supertest(app)
const jwt = require('jsonwebtoken')
const User = require('../models/user.schema')
const fs = require('fs')
const userFixture = require('./fixtures/userFixture.js')
const bcrypt = require('bcryptjs')
let rawNewUser = userFixture.create()
let otherNewUser = userFixture.create()
let newUser = {
    ...rawNewUser,
    password_confirmation: rawNewUser.password
}
let token
let _id

beforeAll(done => {
    User.create({
        ...otherNewUser,
        password: bcrypt.hashSync(otherNewUser.password, 10),
        password_confirmation: otherNewUser.password,
        isConfirmed: true
    })
        .then(() => {
            token = jwt.sign({ _id: newUser._id }, process.env.SECRET_KEY)
            _id = newUser._id
            done()
        })
})

afterAll(done => {
    User.deleteMany({})
        .then(() => done())

})
describe('POST /api/v1/user/register', function () {
    test('should register an user', function (done) {
        request.post(`/api/v1/user/register`)
            .set('Content-Type', 'application/json')
            .send(JSON.stringify(newUser))
            .then((res) => {
                token = jwt.sign({ _id: res.body.data._id }, process.env.SECRET_KEY)
                _id = res.body.data._id
                expect(res.statusCode).toBe(201)
                expect(res.body.data).toHaveProperty('name')
                done()
            })
    })
})

describe('GET /api/v1/user/activation/:_id', function () {
    test('should activate an user', function (done) {
        request.get(`/api/v1/user/activation/${token}`)
            .set('Content-Type', 'application/json')
            .then((res) => {
                expect(res.statusCode).toBe(302)
                done()
            })
    })
})

describe('POST /api/v1/user/login', function () {
    test('should be able to login', function (done) {
        request.post(`/api/v1/user/login`)
            .set('Content-Type', 'application/json')
            .send(JSON.stringify(otherNewUser))
            .then((res) => {
                expect(res.statusCode).toBe(200)
                expect(res.body.data).toHaveProperty('email')
                done()
            })
    })
})

describe('PUT /api/v1/user/updateProfile', function () {
    test('should update an user profile', function (done) {
        request.put(`/api/v1/user/updateProfile`)
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send(JSON.stringify({ "name": "Tested" }))
            .then((res) => {
                expect(res.statusCode).toBe(200)
                expect(res.body.data.name).toBe('Tested')
                done()
            })
    })
})

describe('GET /api/v1/user/userProfile', function () {
    test('should get information about current user', function (done) {
        request.get(`/api/v1/user/userProfile`)
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .then((res) => {
                expect(res.statusCode).toBe(200)
                done()
            })
    })
})

