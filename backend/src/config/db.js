import 'dotenv/config';
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/waste_disposal_local_db';
const MONGO_RETRY_DELAY_MS = Number(process.env.MONGO_RETRY_DELAY_MS || 2000);
const MONGO_MAX_RETRY_DELAY_MS = Number(process.env.MONGO_MAX_RETRY_DELAY_MS || 15000);

let mongoEventsBound = false;
let connectInProgress = false;
let reconnectTimer = null;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clearReconnectTimer() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
}

function scheduleReconnect() {
  if (reconnectTimer || connectInProgress) {
    return;
  }

  reconnectTimer = setTimeout(async () => {
    reconnectTimer = null;
    try {
      await connectDB({ retry: true });
    } catch {
      scheduleReconnect();
    }
  }, MONGO_RETRY_DELAY_MS);
}

function bindMongoEvents() {
  if (mongoEventsBound) {
    return;
  }

  mongoose.connection.on('connected', () => {
    clearReconnectTimer();
    console.log(`MongoDB Connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected. Retrying...');
    scheduleReconnect();
  });

  mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error.message);
  });

  mongoEventsBound = true;
}

export async function connectDB(options = {}) {
  const { retry = true } = options;

  bindMongoEvents();

  if (isMongoConnected()) {
    return true;
  }

  if (connectInProgress) {
    return false;
  }

  connectInProgress = true;
  let retryDelay = MONGO_RETRY_DELAY_MS;

  try {
    while (true) {
      try {
        await mongoose.connect(MONGO_URI, {
          serverSelectionTimeoutMS: 5000,
          maxPoolSize: 20
        });
        return true;
      } catch (error) {
        if (!retry) {
          throw error;
        }

        console.error(`MongoDB connect failed. Retrying in ${retryDelay}ms: ${error.message}`);
        await wait(retryDelay);
        retryDelay = Math.min(retryDelay * 2, MONGO_MAX_RETRY_DELAY_MS);
      }
    }
  } finally {
    connectInProgress = false;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
