const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    if (!mongoUri || mongoUri.includes("your_mongodb_connection")) {
      console.log("No MONGO_URI specified in .env or default placeholder detected.");
      console.log("Attempting to spin up an in-memory MongoDB database...");
      try {
        const { MongoMemoryServer } = require("mongodb-memory-server");
        const mongoServer = await MongoMemoryServer.create();
        mongoUri = mongoServer.getUri();
        console.log(`In-memory MongoDB successfully started at: ${mongoUri}`);
        
        // Keep a reference to prevent garbage collection
        global.__MONGO_SERVER__ = mongoServer;
      } catch (memError) {
        console.error("Could not start mongodb-memory-server:", memError.message);
        console.error("Please install MongoDB locally or provide a valid MONGO_URI in server/.env");
        throw memError;
      }
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected successfully");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
