const chai     = require('chai')
const chaiHttp = require('chai-http')
const {app}    = require('./../app')
const {User}   = require('./../server/models/user')
let should     = chai.should()
chai.use(chaiHttp)

let validUser = {
    name    : 'Testing',
    email   : 'seeder@seeder.com',
    password: '12345678'
}

let invalidUser = {
    username: '1241234',
    email   : 'badtest@test.com',
    password: '12345678'
}

describe('/', () => {
    it('should return a 404 when a unhandled GET occurs', (done) => {
        chai.request(app)
          .get('/asd')
          .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })

    it('should return a 500 when a unhandled POST occurs', (done) => {
        chai.request(app)
          .post('/')
          .send({banana: 'Testing'})
          .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })
})

describe('/users', () => {
    it('should return a 400 for bad POST routes', (done) => {
        chai.request(app)
          .post('/users')
          .send({banana: 'Testing'})
          .end((err, res) => {
            res.should.have.status(400)
            done()
        })
    })

    it('should create a new user', (done) => {
        chai.request(app)
          .post('/users')
          .send(validUser)
          .end((err, res) => {
              res.should.have.status(200)
              res.should.be.a('object')
              res.body.should.have.property('message')
              res.body.message.should.equal('Usuário criado com sucesso')              
              done()
          })
    })

    it('should get the users list', (done) => {
        chai.request(app)
        .get('/users')
        .set('x-auth', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTA5OWVhMjc3YWQxOTUzOTJhNTc0ZGEiLCJhY2Nlc3MiOiJhZG1pbiIsImlhdCI6MTUxMDU3OTg3NH0.Q5gSjqw2hwCuh0mV6NOWV-7ZBq_MCEO0-6LEY-x3__s')
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })

    it('should get a specific user', (done) => {
        chai.request(app)
        .get('/users/5a099ea277ad195392a574da')
        .set('x-auth', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTA5OWVhMjc3YWQxOTUzOTJhNTc0ZGEiLCJhY2Nlc3MiOiJhZG1pbiIsImlhdCI6MTUxMDU3OTg3NH0.Q5gSjqw2hwCuh0mV6NOWV-7ZBq_MCEO0-6LEY-x3__s')
        .end((err, res) => {
            res.should.have.status(200)
            res.body.user.should.have.property('email')
            done()
        })
    })

    it('should return the authenticated user', (done) => {
        chai.request(app)
        .get('/auth')
        .set('x-auth', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTA5OWVhMjc3YWQxOTUzOTJhNTc0ZGEiLCJhY2Nlc3MiOiJhZG1pbiIsImlhdCI6MTUxMDU3OTg3NH0.Q5gSjqw2hwCuh0mV6NOWV-7ZBq_MCEO0-6LEY-x3__s')
        .end((err, res) => {
            res.should.have.status(200)
            res.body.should.have.property('email')
            res.body.should.have.property('_id')
            done()
        })
    })

    it('should delete an user', (done) => {
        chai.request(app)
        .delete('/users/5a099ea277ad195392a574da')
        .set('x-auth', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTA5OWVhMjc3YWQxOTUzOTJhNTc0ZGEiLCJhY2Nlc3MiOiJhZG1pbiIsImlhdCI6MTUxMDU3OTg3NH0.Q5gSjqw2hwCuh0mV6NOWV-7ZBq_MCEO0-6LEY-x3__s')
        .end((err, res) => {
            res.should.have.status(200)
            res.body.user.should.have.property('email')
            done()
        })
    })
})