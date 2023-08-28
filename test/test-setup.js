// test/test-setup.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoServer = new MongoMemoryServer();

module.exports = async () => {
  const mongoUri = await mongoServer.getUri();

  const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  await mongoose.connect(mongoUri, mongooseOptions);
};
