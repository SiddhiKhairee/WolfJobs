const Application = require("../models/application");
const Message = require("../models/message");
const isUndefinedOrEmpty = require("../utils/common") 

module.exports.createMessage = async function (req, res) {
  if (isUndefinedOrEmpty(req.body.fromUser) || isUndefinedOrEmpty(req.body.toUser) || isUndefinedOrEmpty(req.body.message) || isUndefinedOrEmpty(req.body.applicationId)) {
    return res.status(400).send({message: `Required fields missing`});
  }
  const doc = new Message(req.body);
  try {
    await doc.save();
    res.status(200).send({ message: "Message sent successfully" });
  } catch (error) {
    console.error(`Message: ${req.body} not created due to error: ${error}`);
    res.status(500).send({ message: `Something went wrong` });
  }
};

module.exports.fetchMessages = async function (req, res) {
  const applicationId = req.query.applicationId;
  if (applicationId === undefined || applicationId.trim() === "") {
    return res.status(400).send({ message: "applicationId missing" });
  }

  try {
    const docs = await Message.find({ applicationId: applicationId });
    const data = docs.sort(function (a, b) {
      return new Date(a.date) - new Date(b.date);
    });
    res.send({ data: data });
  } catch (error) {
    console.error(`Message for applicationId: ${applicationId} not fetched due to error: ${error}`);
    res.status(500).send({ message: `Something went wrong` });
  }
};

module.exports.fetchListingChats = async function (req, res) {
  const jobId = req.query.jobId;
  if (jobId === undefined || jobId.trim() === "") {
    return res.status(400).send({ message: "jobId missing" });
  }

  try {
    // Find all applications associated with the jobId
    const applications = await Application.find({ jobId: jobId });

    // Initialize an array to hold all chats
    const chats = [];

    // Fetch messages for each application
    for (const application of applications) {
      const applicationId = application._id;

      // Fetch messages for this applicationId
      const messages = await Message.find({ applicationId: applicationId });
      
      // Sort messages by date
      const sortedMessages = messages.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // Add the sorted messages to the result array
      chats.push({
        applicationId: applicationId,
        applicantId: application.applicantid,
        applicantName: application.applicantname,
        lastMessage: sortedMessages[sortedMessages.length - 1] || null,
        messages: sortedMessages
      });
    }

    // Return the chat data
    res.send({ data: chats });

  } catch (error) {
    console.error(`Chats for jobId: ${jobId} not fetched due to error: ${error}`);
    res.status(500).send({ message: `Something went wrong` });
  }
}