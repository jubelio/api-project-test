const utils = require('@test/utils');
let utilsContext = utils.context;
let basePoint = '/api/v1';
export default
describe('Basepoint', async () => {
    describe(`GET ${basePoint}`,  () => {
        it("Check basepoint", (done) => {
            utilsContext.request
              .get(`${basePoint}`)
              .set('content-type', 'application/json')
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
              });
        });
    });
});

export {basePoint}

// API
require('./authentication');
require('./portalApplications');