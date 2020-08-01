//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../server');

require('dotenv').config()

chai.use(chaiHttp);

describe('/POST get county from zip code', () => {
    it('it should return customer data including county from a zip code. King from 98005', (done) => {
      let zipCode = {zipCode: "98005"}
    //   let host = 'https://covid-phase-identifier.herokuapp.com/'
    let host = 'http://127.0.0.1:8080'
      let path = '/api/get-county-from-zip'
      chai.request(server)
          .post(path)
          .set('apikey', process.env.API_KEY)
          .send(zipCode)
          .end((err, res) => {
                console.log("res:", res)
                res.should.have.status(200);
                res.body.should.be.a('object');
                // res.body.should.have.property('errors');
                // res.body.errors.should.have.property('pages');
                // res.body.errors.pages.should.have.property('kind').eql('required');
            done();
          });
    });
});
