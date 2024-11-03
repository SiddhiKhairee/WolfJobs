const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); // Assuming your Express app is in app.js
const Message = require("../models/message");

chai.should();


chai.use(chaiHttp);

describe('Messages Controller', () => {
    describe('POST /messsage/createMessage', () => {
      it('should create a new message', (done) => {
        const messageData = {
          message: 'Test message',
          fromUser: '6722e4be0f205dc7a0c0b2ea',
          toUser: '6722e4be0f205dc7a0c0b2ec',
          applicationId: "6722e4be0f205dc7a0c0b2eb"
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
  beforeEach(async () => {
    // Create some test messages
    await Message.insertMany([
      { applicantId: '6722e4be0f205dc7a0c0b2ea', message: 'Message 1', timestamp: new Date('2023-01-01'), fromUser: "6722e4be0f205dc7a0c0b2ev", toUser:"6722e4be0f205dc7a0c0b2eb" },
      { applicantId: '6722e4be0f205dc7a0c0b2ea', message: 'Message 2', timestamp: new Date('2023-01-02'), fromUser: "6722e4be0f205dc7a0c0b2e1", toUser:"6722e4be0f205dc7a0c0b243" },
      { applicantId: '6722e4be0f205dc7a0c0b2ev', message: 'Other Message', timestamp: new Date('2023-01-03'), fromUser: "6722e4be0f205dc7a0c0b444", toUser:"6722e4be0f205dc7a0c0b34h" }
    ]);
  });

  afterEach(async () => {
    // Clean up test messages
    await Message.deleteMany({});
  });

  it('should fetch messages for a specific applicant', (done) => {
    chai.request(app)
      .get('/messsage/fetchMessages')
      .query({ applicationId: '6722e4be0f205dc7a0c0b2eb' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.data.should.be.an('array').with.lengthOf(2);
        res.body.data[0].content.should.equal('Message 1');
        res.body.data[1].content.should.equal('Message 2');
        done();
      });
  });

  it('should sort messages by date', (done) => {
    chai.request(app)
      .get('/messsage/fetchMessages')
      .query({ applicationId: '6722e4be0f205dc7a0c0b2eb' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.data.should.be.an('array').with.lengthOf(2);
        res.body.data[0].date.should.be.below(res.body.data[1].date);
        done();
      });
  });

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

  it('should handle errors during message fetching', async () => {
    // Mock an error in the Message model
    sinon.stub(Message, 'find').rejects(new Error('Mocked error'));

    try {
      await chai.request(app)
        .get('/messsage/fetchMessages')
        .query({ applicationId: '6722e4be0f205dc7a0c0b2eb' });
    } catch (error) {
      error.response.should.have.status(500);
      error.response.body.should.be.an('object');
      error.response.body.message.should.equal('Something went wrong');
    }

    // Restore the original function
    Message.find.restore();
  });
});

describe('GET /messsage/fetchMessages', () => {
    beforeEach(async () => {
      // Create some test messages
      await Message.insertMany([
        { applicantId: '6722e4be0f205dc7a0c0b2eb', content: 'Message 1', date: new Date('2023-01-01') },
        { applicantId: '6722e4be0f205dc7a0c0b2eb', content: 'Message 2', date: new Date('2023-01-02') },
        { applicantId: '6722e4be0f205dc7a0c0b2eb', content: 'Other Message', date: new Date('2023-01-03') }
      ]);
    });
  
    afterEach(async () => {
      // Clean up test messages
      await Message.deleteMany({});
    });
  
    it('should fetch messages for a specific applicant', (done) => {
      chai.request(app)
        .get('/messsage/fetchMessages')
        .query({ applicationId: '6722e4be0f205dc7a0c0b2eb' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.data.should.be.an('array').with.lengthOf(2);
          res.body.data[0].content.should.equal('Message 1');
          res.body.data[1].content.should.equal('Message 2');
          done();
        });
    });
  
    it('should sort messages by date', (done) => {
      chai.request(app)
        .get('/messsage/fetchMessages')
        .query({ applicationId: '6722e4be0f205dc7a0c0b2eb' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.data.should.be.an('array').with.lengthOf(2);
          res.body.data[0].date.should.be.below(res.body.data[1].date);
          done();
        });
    });
  
    it('should return 400 when applicationId is missing', (done) => {
      chai.request(app)
        .get('/messsage/fetchMessages')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.message.should.equal('applicationId missing');
          done();
        });
    });
  
    it('should handle errors during message fetching', async () => {
      // Mock an error in the Message model
      sinon.stub(Message, 'find').rejects(new Error('Mocked error'));
  
      try {
        await chai.request(app)
          .get('/messsage/fetchMessages')
          .query({ applicationId: 'testApplicant' });
      } catch (error) {
        error.response.should.have.status(500);
        error.response.body.should.be.an('object');
        error.response.body.message.should.equal('Something went wrong');
      }
  
      // Restore the original function
      Message.find.restore();
    });
  });
  
