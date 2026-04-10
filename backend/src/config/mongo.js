import mongoose from "mongoose";

let hasAttemptedConnection = false;

function getMongoUri() {
  return (
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/wds_ai_chatbot"
  );
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

export async function connectMongo() {
  if (isMongoConnected()) {
    return mongoose.connection;
  }

  if (hasAttemptedConnection && mongoose.connection.readyState !== 2) {
    return null;
  }

  hasAttemptedConnection = true;

  const mongoUri = getMongoUri();

  try {
    await mongoose.connect(mongoUri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000
    });
    return mongoose.connection;
  } catch (error) {
    console.warn(`MongoDB connection failed: ${error.message}`);
    return null;
  }
}

export function getMongoConnectionInfo() {
  return {
    connected: isMongoConnected(),
    host: mongoose.connection.host || "",
    name: mongoose.connection.name || ""
  };
}
