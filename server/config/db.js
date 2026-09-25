const mongoose = require('mongoose');

let mongoServerInstance = null;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  const isAtlasConfigured =
    mongoUri &&
    !mongoUri.includes('<username>') &&
    !mongoUri.includes('<password>') &&
    (mongoUri.startsWith('mongodb+srv://') || mongoUri.startsWith('mongodb://'));

  if (isAtlasConfigured) {
    try {
      console.log('🔄 Attempting connection to MongoDB Atlas / configured database...');
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });

      console.log(`✅ MongoDB Connected: ${conn.connection.host} (${conn.connection.name})`);
      return;
    } catch (error) {
      console.warn(`⚠️ Could not connect to configured MongoDB (${error.message}).`);
    }
  }

  // Graceful fallback to development in-memory MongoDB
  try {
    console.log('⚡ Starting in-memory MongoDB database for instant local development...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongoServerInstance = await MongoMemoryServer.create();
    const memoryUri = mongoServerInstance.getUri();

    const conn = await mongoose.connect(memoryUri);
    console.log(`✅ Development MongoDB Connected at in-memory instance`);

    // Auto-populate with demo data
    const { seedDataInternal } = require('../seed');
    await seedDataInternal();

    console.log(`
----------------------------------------------------------------------
ℹ️  MONGODB ATLAS SETUP:
To link your permanent cloud database, replace MONGO_URI in 'server/.env':
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/food_donation?retryWrites=true&w=majority
Currently running with in-memory database & preloaded demo accounts!
----------------------------------------------------------------------
`);
  } catch (err) {
    console.error(`❌ In-Memory MongoDB Error: ${err.message}`);
  }
};

module.exports = connectDB;
