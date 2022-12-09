import { basePoint } from './_base';
const utils = require('@test/utils');
let utilsContext = utils.context;

export default
describe('Authentication', async () => {

    // Authentication
    const  endpoint = `${basePoint}/auth`;
    describe(`POST ${endpoint}`,  () => {
        it("Login with empty Username & Password", (done) => {
            utilsContext.request
              .post(`${endpoint}`)
              .set('content-type', 'application/json')
              .send({
                username: '',
                password: ''
               })
              .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                done();
              });
        });
        it("Login with empty Username", (done) => {
            utilsContext.request
              .post(`${endpoint}`)
              .set('content-type', 'application/json')
              .send({
                username: '',
                password: 'tester'
               })
              .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                done();
              });
        });
        it("Login with Empty Password", (done) => {
            utilsContext.request
              .post(`${endpoint}`)
              .set('content-type', 'application/json')
              .send({
                username: 'tester',
                password: ''
               })
              .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                done();
              });
        });
        it("Login with Wrong Username/Password", (done) => {
            utilsContext.request
              .post(`${endpoint}`)
              .set('content-type', 'application/json')
              .send({
                username: 'tester',
                password: 'wrongpassword'
               })
              .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                done();
              });
        });
        it("Login with correct Username/Password", (done) => {
            utilsContext.request
              .post(`${endpoint}`)
              .set('content-type', 'application/json')
              .send({
                username: 'tester',
                password: 'tester'
               })
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.message.should.be.to.equal('auth success');
                res.body.should.have.nested.property('data.access-token');
                utilsContext.token=res.body.data['access-token'];
                done();
              });
        });
    });
    describe(`GET ${endpoint}`,  () => {
        it("Authentication with correct Bearer Token", (done) => {
            utilsContext.request
              .get(`${endpoint}`)
              .set('content-type', 'application/json')
              .set('authorization', `Bearer ${utilsContext.token}`)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.message.should.be.to.equal('authenticated');
                res.body.should.have.nested.property('data.auth');
                done();
              });
        });
    });
});
