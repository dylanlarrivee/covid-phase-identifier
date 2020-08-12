//During the test the env variable is set to test
// npm run test --production
process.env.NODE_ENV = 'production';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../server');

require('dotenv').config()

chai.use(chaiHttp);

describe("Covid Phase Identifier Tests", function () {
  describe('/POST get county from zip code', () => {
      it('it should return customer data including county from a zip code. King from 98005', (done) => {
        let data = {zipCode: "98005"}
      // let host = 'https://covid-phase-identifier.herokuapp.com/'
      // let host = 'http://127.0.0.1:8080'
        let path = '/api/get-county-from-zip?zipcode=98005';
        chai.request(server)
            .post(path)
            .set('apikey', process.env.API_KEY)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.custData.zipCode.should.equal("980053");
                  // res.body.should.have.property('errors');
                  // res.body.errors.should.have.property('pages');
                  // res.body.errors.pages.should.have.property('kind').eql('required');
              done();
            });
      });
  });
  describe('/POST get phase from zip code', () => {
    it('it should return a phase number (string) from a county', (done) => {
      let path = '/api/get-county-status?county=King';
      chai.request(server)
          .post(path)
          .set('apikey', process.env.API_KEY)
          .end((err, res) => {
                // console.log("res.body:", JSON.stringify(res.body))
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.phase.should.be.satisfy(function (num) {
                  if ((num == "1") || (num == "2") | (num == "3") | (num == "4")) {
                      return true;
                  } else {
                      return false;
                  }
              });
            done();
          });
    });
});
});
