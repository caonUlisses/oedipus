const chai = require('chai')
const chaiHttp = require('chai-http')
const {app} = require('./../app')
const {User} = require('./../server/models/user')

const should = chai.should()
chai.use(chaiHttp)

describe(':hammer:', () => {
  it('should return a 404 when a unhandled GET occurs', (done) => {
    chai.request(app)
            .get('/users/banana')
            .end((res) => {
              res.should.have.status(404)
              done()
            })
  })

  it('should return a 401 when an unauthenticated request gets made', (done) => {
    chai.request(app)
      .get('/')
      .end((res) => {
        res.should.have.status(401)
        done()
      })
  })
})
