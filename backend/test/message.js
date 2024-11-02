let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');

chai.should();


chai.use(chaiHttp);

describe('Messages Controller', () => {
    describe('POST /messsage/createMessage', () => {
      it('should create a new message', (done) => {
        const messageData = {
          message: 'Test message',
          fromUser: 'p123jr',
          toUser: 'sdijgpo213k',
          applicationId: "1231241"
        };
  
        chai.request("http://localhost:8000")
          .post('/messsage/createMessage')
          .send(messageData)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('object');
            res.body.message.should.equal('Message sent successfully');
            done();
          });
      });
  
      it('should handle errors during message creation', (done) => {
        const invalidData = {};
  
        chai.request("http://localhost:8000")
          .post('/messsage/createMessage')
          .send(invalidData)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.should.be.an('object');
            res.body.message.should.equal('Something went wrong');
            done();
          });
      });
    });
  });
describe('GET /fetchMessages', () => {
  it('should return 400 when applicationId is missing', (done) => {
    chai.request("http://localhost:8000")
      .get('/messsage/fetchMessages')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.message.should.equal('applicationId missing');
        done();
      });
  });
});
