const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();


chai.use(chaiHttp);

describe('Messages Controller', () => {
    describe('POST /message/createMessage', () => {
      it('should create a new message', (done) => {
        const messageData = {
          message: 'Test message',
          fromUser: '6722e4be0f205dc7a0c0b2ea',
          toUser: '6722e4be0f205dc7a0c0b2ec',
          applicationId: "6722e4be0f205dc7a0c0b2eb"
        };
  
        chai.request('http://localhost:8000')
          .post('/message/createMessage')
          .send(messageData)
          .end((err, res) => {
            console.log(err)
            res.should.have.status(200);
            res.body.should.be.an('object');
            res.body.message.should.equal('Message sent successfully');
            done();
          });
      });
  
      it('should handle errors during message creation', (done) => {
        const invalidData = {};
  
        chai.request("http://localhost:8000")
          .post('/message/createMessage')
          .send(invalidData)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.an('object');
            res.body.message.should.equal("Required fields missing");
            done();
          });
      });
    });
  });
describe('GET /fetchMessages', () => {

  it('should fetch messages for a specific applicant', (done) => {
    chai.request('http://localhost:8000')
      .get('/message/fetchMessages')
      .query({ applicationId: '6722e4be0f205dc7a0c0b2eb' })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('should sort messages by date', (done) => {
    chai.request('http://localhost:8000')
      .get('/message/fetchMessages')
      .query({ applicationId: '6722e4be0f205dc7a0c0b2eb' })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('should return 400 when applicationId is missing', (done) => {
    chai.request("http://localhost:8000")
      .get('/message/fetchMessages')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.message.should.equal('applicationId missing');
        done();
      });
  });

  it('should handle errors during message fetching', async () => {

    try {
      await chai.request('http://localhost:8000')
        .get('/message/fetchMessages')
        .query({ applicationId: '6722e4be0f205dc7a0c0b2eb' });
    } catch (error) {
      error.response.should.have.status(500);
      error.response.body.should.be.an('object');
      error.response.body.message.should.equal('Something went wrong');
    }
  });
});

describe('GET /message/fetchMessages', () => {
    it('should fetch messages for a specific applicant', (done) => {
      chai.request('http://localhost:8000')
        .get('/message/fetchMessages')
        .query({ applicationId: '6722e4be0f205dc7a0c0b2eb' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          done();
        });
    });
  
    it('should sort messages by date', (done) => {
      chai.request('http://localhost:8000')
        .get('/message/fetchMessages')
        .query({ applicationId: '6722e4be0f205dc7a0c0b2eb' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          done();
        });
    });
  
    it('should return 400 when applicationId is missing', (done) => {
      chai.request('http://localhost:8000')
        .get('/message/fetchMessages')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.message.should.equal('applicationId missing');
          done();
        });
    });
  
    it('should handle errors during message fetching', async () => {  
      try {
        await chai.request('http://localhost:8000')
          .get('/message/fetchMessages')
          .query({ applicationId: 'testApplicant' });
      } catch (error) {
        error.response.should.have.status(500);
        error.response.body.should.be.an('object');
        error.response.body.message.should.equal('Something went wrong');
      }
    });
  });
  
