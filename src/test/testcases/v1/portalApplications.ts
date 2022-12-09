import { basePoint } from './_base';
import XConfig from '@config/_core';
const utils = require('@test/utils');
let utilsContext = utils.context;

export default
describe('Portal Application', async () => {
  const  endpoint = `${basePoint}/application`;
  describe(`GET ${endpoint}`,  () => {
    it("Get All Portal Application", (done) => {
        utilsContext.request
          .get(`${endpoint}`)
          .set('content-type', 'application/json')
          .set('authorization', `Bearer ${utilsContext.token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.message.should.be.to.equal('Success');
            res.body.data.should.be.a('array');
            done();
          });
    });
  });
  describe(`POST ${endpoint}`,  () => {
    it("Create a Portal Application without 'name'", (done) => {
        utilsContext.request
          .post(`${endpoint}`)
          .set('content-type', 'multipart/form-data; boundary=app')
          .set('authorization', `Bearer ${utilsContext.token}`)
          .field({
            url: 'https://new-application.com'
          })
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            done();
          });
    });
    it("Create a Portal Application with empty string in 'name'", (done) => {
      utilsContext.request
        .post(`${endpoint}`)
        .set('content-type', 'multipart/form-data; boundary=app')
        .set('authorization', `Bearer ${utilsContext.token}`)
        .field({
          url: 'https://new-application.com'
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        });
  });
    it("Create a Portal Application without 'url'", (done) => {
        utilsContext.request
          .post(`${endpoint}`)
          .set('content-type', 'multipart/form-data; boundary=app')
          .set('authorization', `Bearer ${utilsContext.token}`)
          .field({
            name: 'New Application'
          })
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            done();
          });
    });
    it("Create a Portal Application without 'logo'", (done) => {
        utilsContext.request
          .post(`${endpoint}`)
          .set('content-type', 'multipart/form-data; boundary=app')
          .set('authorization', `Bearer ${utilsContext.token}`)
          .field({
            name: 'New Application',
            url: 'https://new-application.com'
          })
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            done();
          });
    });
    it("Create a Portal Application without attach correct image", (done) => {
        utilsContext.request
          .post(`${endpoint}`)
          .set('content-type', 'multipart/form-data; boundary=app')
          .set('authorization', `Bearer ${utilsContext.token}`)
          .field({
            name: 'New Application',
            url: 'https://new-application.com'
          })
          .attach('logo',XConfig.get('/application/staticFile/root') + 'dummy/pdf_150kb.pdf')
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            done();
          });
    });
    it("Create a Portal Application with correct data", (done) => {
        utilsContext.request
          .post(`${endpoint}`)
          .set('content-type', 'multipart/form-data; boundary=app')
          .set('authorization', `Bearer ${utilsContext.token}`)
          .field({
            name: 'New Application',
            url: 'https://new-application.com'
          })
          .attach('logo',XConfig.get('/application/staticFile/root') + 'dummy/image_25kb.png')
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.message.should.be.to.equal('Created');
            done();
          });
    });
  });
  describe(`GET ${endpoint}/{applicationID}`,  () => {
    it("Get Portal Application that created recently", (done) => {
        utilsContext.request
          .get(`${endpoint}/3`)
          .set('content-type', 'application/json')
          .set('authorization', `Bearer ${utilsContext.token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.message.should.be.to.equal('Success');
            res.body.data.should.be.a('object');
            res.body.data.should.have.property('name');
            res.body.data.name.should.be.to.equal('New Application');
            done();
          });
    });
    it("Get Unregistered ApplicationID", (done) => {
        utilsContext.request
          .get(`${endpoint}/4`)
          .set('content-type', 'application/json')
          .set('authorization', `Bearer ${utilsContext.token}`)
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.a('object');
            done();
          });
    });
  });

  describe(`PATCH ${endpoint}/{applicationID}`,  () => {
    it("Update Portal Application that created recently", (done) => {
        utilsContext.request
          .patch(`${endpoint}/3`)
          .set('content-type', 'application/json')
          .set('authorization', `Bearer ${utilsContext.token}`)
          .send({
            name: 'New Application',
            url: 'https://new-application.com',
            description: 'This is a description',
            isActive: false
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.message.should.be.to.equal('Updated.');
            res.body.data.should.be.a('object');
            res.body.data.should.have.property('description');
            res.body.data.description.should.be.to.equal('This is a description');
            res.body.data.isActive.should.be.to.equal(false);
            done();
          });
    });
    it("Update Portal Application that doesn't exist", (done) => {
        utilsContext.request
          .patch(`${endpoint}/4`)
          .set('content-type', 'application/json')
          .set('authorization', `Bearer ${utilsContext.token}`)
          .send({
            name: 'New Application',
            url: 'https://new-application.com',
            description: 'This is a description',
            isActive: false
          })
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.a('object');
            done();
          });
    });
    it("Update Portal Application without 'name'", (done) => {
        utilsContext.request
          .patch(`${endpoint}/4`)
          .set('content-type', 'application/json')
          .set('authorization', `Bearer ${utilsContext.token}`)
          .send({
            url: 'https://new-application.com',
            description: 'This is a description',
            isActive: false
          })
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            done();
          });
    });
  });
  describe(`PATCH ${endpoint}/{applicationID}/logo`,  () => {
    it("Update Portal Application Logo that doesn't exist", (done) => {
      utilsContext.request
        .patch(`${endpoint}/4/logo`)
        .set('content-type', 'multipart/form-data')
        .set('authorization', `Bearer ${utilsContext.token}`)
        .attach('logo',XConfig.get('/application/staticFile/root') + 'dummy/pdf_150kb.pdf')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          done();
        });
    });
    it("Update Portal Application Logo with invalid 'logo'", (done) => {
      utilsContext.request
        .patch(`${endpoint}/3/logo`)
        .set('content-type', 'multipart/form-data')
        .set('authorization', `Bearer ${utilsContext.token}`)
        .attach('logo',XConfig.get('/application/staticFile/root') + 'dummy/pdf_150kb.pdf')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        });
    });
    it("Update Portal Application Logo with valid 'logo'", (done) => {
      utilsContext.request
        .patch(`${endpoint}/3/logo`)
        .set('content-type', 'multipart/form-data')
        .set('authorization', `Bearer ${utilsContext.token}`)
        .attach('logo',XConfig.get('/application/staticFile/root') + 'dummy/image_25kb.png')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
  });

  describe(`DELETE ${endpoint}/{applicationID}`,  () => {
    it("Delete Portal Application that doesn't exist", (done) => {
      utilsContext.request
        .delete(`${endpoint}/4`)
        .set('content-type', 'application/json')
        .set('authorization', `Bearer ${utilsContext.token}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          done();
        });
    });
    it("Delete Portal Application", (done) => {
      utilsContext.request
        .delete(`${endpoint}/3`)
        .set('content-type', 'application/json')
        .set('authorization', `Bearer ${utilsContext.token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
  });

});
