# Code Citations

## License: unknown
https://github.com/raulrequenac/weMeet/blob/a224611f6984551437a8b7acba0a6d328ee49483/models/user.model.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      
```


## License: unknown
https://github.com/shoaibakhtar9611/social-networking-application/blob/cef0f6265393609d4a1df949f429853761bde126/node_api/models/userModel.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+(
```


## License: unknown
https://github.com/raulrequenac/weMeet/blob/a224611f6984551437a8b7acba0a6d328ee49483/models/user.model.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      
```


## License: unknown
https://github.com/shoaibakhtar9611/social-networking-application/blob/cef0f6265393609d4a1df949f429853761bde126/node_api/models/userModel.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+(
```


## License: unknown
https://github.com/raulrequenac/weMeet/blob/a224611f6984551437a8b7acba0a6d328ee49483/models/user.model.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      
```


## License: unknown
https://github.com/shoaibakhtar9611/social-networking-application/blob/cef0f6265393609d4a1df949f429853761bde126/node_api/models/userModel.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+(
```


## License: unknown
https://github.com/raulrequenac/weMeet/blob/a224611f6984551437a8b7acba0a6d328ee49483/models/user.model.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      
```


## License: unknown
https://github.com/shoaibakhtar9611/social-networking-application/blob/cef0f6265393609d4a1df949f429853761bde126/node_api/models/userModel.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+(
```


## License: unknown
https://github.com/ljcl79/api-mundose-node-express-mongo/blob/261e2b9f08e7db4c32fa35d90cb72adf5843bc8e/models/clientes.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/AdamGadziak/RESTapi/blob/ed298ef76b21ab2639782df34dce386360c247ac/models/user.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/mjgsilva/PetFinder/blob/087526d8b363135324449ecdaaa5129a6a27223c/implementation/server/models/user.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/Phase2-API-Project/server/blob/2582d3af144d0f4ebde31a903df87d3efebd5fbe/models/user.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/raulrequenac/weMeet/blob/a224611f6984551437a8b7acba0a6d328ee49483/models/user.model.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/shoaibakhtar9611/social-networking-application/blob/cef0f6265393609d4a1df949f429853761bde126/node_api/models/userModel.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/ljcl79/api-mundose-node-express-mongo/blob/261e2b9f08e7db4c32fa35d90cb72adf5843bc8e/models/clientes.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/AdamGadziak/RESTapi/blob/ed298ef76b21ab2639782df34dce386360c247ac/models/user.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/mjgsilva/PetFinder/blob/087526d8b363135324449ecdaaa5129a6a27223c/implementation/server/models/user.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/Phase2-API-Project/server/blob/2582d3af144d0f4ebde31a903df87d3efebd5fbe/models/user.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/raulrequenac/weMeet/blob/a224611f6984551437a8b7acba0a6d328ee49483/models/user.model.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/shoaibakhtar9611/social-networking-application/blob/cef0f6265393609d4a1df949f429853761bde126/node_api/models/userModel.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/ljcl79/api-mundose-node-express-mongo/blob/261e2b9f08e7db4c32fa35d90cb72adf5843bc8e/models/clientes.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/AdamGadziak/RESTapi/blob/ed298ef76b21ab2639782df34dce386360c247ac/models/user.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/mjgsilva/PetFinder/blob/087526d8b363135324449ecdaaa5129a6a27223c/implementation/server/models/user.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/Phase2-API-Project/server/blob/2582d3af144d0f4ebde31a903df87d3efebd5fbe/models/user.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/raulrequenac/weMeet/blob/a224611f6984551437a8b7acba0a6d328ee49483/models/user.model.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/shoaibakhtar9611/social-networking-application/blob/cef0f6265393609d4a1df949f429853761bde126/node_api/models/userModel.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/ljcl79/api-mundose-node-express-mongo/blob/261e2b9f08e7db4c32fa35d90cb72adf5843bc8e/models/clientes.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/AdamGadziak/RESTapi/blob/ed298ef76b21ab2639782df34dce386360c247ac/models/user.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/mjgsilva/PetFinder/blob/087526d8b363135324449ecdaaa5129a6a27223c/implementation/server/models/user.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/Phase2-API-Project/server/blob/2582d3af144d0f4ebde31a903df87d3efebd5fbe/models/user.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/raulrequenac/weMeet/blob/a224611f6984551437a8b7acba0a6d328ee49483/models/user.model.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/shoaibakhtar9611/social-networking-application/blob/cef0f6265393609d4a1df949f429853761bde126/node_api/models/userModel.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/ljcl79/api-mundose-node-express-mongo/blob/261e2b9f08e7db4c32fa35d90cb72adf5843bc8e/models/clientes.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/AdamGadziak/RESTapi/blob/ed298ef76b21ab2639782df34dce386360c247ac/models/user.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/mjgsilva/PetFinder/blob/087526d8b363135324449ecdaaa5129a6a27223c/implementation/server/models/user.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/Phase2-API-Project/server/blob/2582d3af144d0f4ebde31a903df87d3efebd5fbe/models/user.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/AdamGadziak/RESTapi/blob/ed298ef76b21ab2639782df34dce386360c247ac/models/user.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/raulrequenac/weMeet/blob/a224611f6984551437a8b7acba0a6d328ee49483/models/user.model.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/shoaibakhtar9611/social-networking-application/blob/cef0f6265393609d4a1df949f429853761bde126/node_api/models/userModel.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/ljcl79/api-mundose-node-express-mongo/blob/261e2b9f08e7db4c32fa35d90cb72adf5843bc8e/models/clientes.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/mjgsilva/PetFinder/blob/087526d8b363135324449ecdaaa5129a6a27223c/implementation/server/models/user.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/Phase2-API-Project/server/blob/2582d3af144d0f4ebde31a903df87d3efebd5fbe/models/user.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/mjgsilva/PetFinder/blob/087526d8b363135324449ecdaaa5129a6a27223c/implementation/server/models/user.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/AdamGadziak/RESTapi/blob/ed298ef76b21ab2639782df34dce386360c247ac/models/user.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/Phase2-API-Project/server/blob/2582d3af144d0f4ebde31a903df87d3efebd5fbe/models/user.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/raulrequenac/weMeet/blob/a224611f6984551437a8b7acba0a6d328ee49483/models/user.model.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/shoaibakhtar9611/social-networking-application/blob/cef0f6265393609d4a1df949f429853761bde126/node_api/models/userModel.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/ljcl79/api-mundose-node-express-mongo/blob/261e2b9f08e7db4c32fa35d90cb72adf5843bc8e/models/clientes.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/mjgsilva/PetFinder/blob/087526d8b363135324449ecdaaa5129a6a27223c/implementation/server/models/user.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/AdamGadziak/RESTapi/blob/ed298ef76b21ab2639782df34dce386360c247ac/models/user.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/Phase2-API-Project/server/blob/2582d3af144d0f4ebde31a903df87d3efebd5fbe/models/user.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/raulrequenac/weMeet/blob/a224611f6984551437a8b7acba0a6d328ee49483/models/user.model.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/shoaibakhtar9611/social-networking-application/blob/cef0f6265393609d4a1df949f429853761bde126/node_api/models/userModel.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/ljcl79/api-mundose-node-express-mongo/blob/261e2b9f08e7db4c32fa35d90cb72adf5843bc8e/models/clientes.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true,
```


## License: unknown
https://github.com/mjgsilva/PetFinder/blob/087526d8b363135324449ecdaaa5129a6a27223c/implementation/server/models/user.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    phone: {
      type: String,
      trim: true
```


## License: unknown
https://github.com/AdamGadziak/RESTapi/blob/ed298ef76b21ab2639782df34dce386360c247ac/models/user.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    phone: {
      type: String,
      trim: true
```


## License: unknown
https://github.com/Phase2-API-Project/server/blob/2582d3af144d0f4ebde31a903df87d3efebd5fbe/models/user.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    phone: {
      type: String,
      trim: true
```


## License: unknown
https://github.com/raulrequenac/weMeet/blob/a224611f6984551437a8b7acba0a6d328ee49483/models/user.model.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    phone: {
      type: String,
      trim: true
```


## License: unknown
https://github.com/shoaibakhtar9611/social-networking-application/blob/cef0f6265393609d4a1df949f429853761bde126/node_api/models/userModel.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    phone: {
      type: String,
      trim: true
```


## License: unknown
https://github.com/ljcl79/api-mundose-node-express-mongo/blob/261e2b9f08e7db4c32fa35d90cb72adf5843bc8e/models/clientes.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    phone: {
      type: String,
      trim: true
```


## License: unknown
https://github.com/mjgsilva/PetFinder/blob/087526d8b363135324449ecdaaa5129a6a27223c/implementation/server/models/user.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    phone: {
      type: String,
      trim: true
```


## License: unknown
https://github.com/AdamGadziak/RESTapi/blob/ed298ef76b21ab2639782df34dce386360c247ac/models/user.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    phone: {
      type: String,
      trim: true
```


## License: unknown
https://github.com/Phase2-API-Project/server/blob/2582d3af144d0f4ebde31a903df87d3efebd5fbe/models/user.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    phone: {
      type: String,
      trim: true
```


## License: unknown
https://github.com/raulrequenac/weMeet/blob/a224611f6984551437a8b7acba0a6d328ee49483/models/user.model.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    phone: {
      type: String,
      trim: true
```


## License: unknown
https://github.com/shoaibakhtar9611/social-networking-application/blob/cef0f6265393609d4a1df949f429853761bde126/node_api/models/userModel.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    phone: {
      type: String,
      trim: true
```


## License: unknown
https://github.com/ljcl79/api-mundose-node-express-mongo/blob/261e2b9f08e7db4c32fa35d90cb72adf5843bc8e/models/clientes.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    phone: {
      type: String,
      trim: true
```


## License: unknown
https://github.com/Ayush-Manware/Tourism-Backend-File/blob/b09cdbf7029b8051764b4dee5e51e40e148e1082/index.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    profileImage: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'collector'],
      default: 'user'
    },
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for faster queries
userSchema.index({ email: 1, role: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
export default User;
```

### `/backend/src/models/PickupRequest.js`

```javascript
import mongoose from 'mongoose';

const pickupRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    wasteType: {
      type: String,
      enum: ['Organic', 'Plastic', 'E-waste', 'Hazardous'],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    address: {
      type: String,
      required: true
    },
    preferredDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'In-Progress', 'Completed'],
      default: 'Pending'
    },
    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    notes: {
      type: String,
      default: ''
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null
    },
    fee: {
      type: Number,
      default: 50
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

pickupRequestSchema.index({ user: 1, status: 1 });
pickupRequestSchema.index({ collector: 1, status: 1 });
pickupRequestSchema.index({ status: 1 });

const PickupRequest = mongoose.model('PickupRequest', pickupRequestSchema);
export default PickupRequest;
```

### `/backend/src/models/Complaint.js`

```javascript
import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Open', 'In-Progress', 'Resolved', 'Closed'],
      default: 'Open'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    attachments: [String],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    resolution: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

complaintSchema.index({ user: 1, status: 1 });
complaintSchema.index({ status: 1 });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
```

### `/backend/src/models/Payment.js`

```javascript
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    pickupRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupRequest',
      default: null
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    method: {
      type: String,
      enum: ['UPI Payment', 'Bank Payment', 'Card Payment', 'Cash'],
      default: 'UPI Payment'
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Paid'
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true
    },
    reference: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
```

### `/backend/src/models/WasteCategory.js`

```javascript
import mongoose from 'mongoose';

const wasteCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: '📦'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

const WasteCategory = mongoose.model('WasteCategory', wasteCategorySchema);
export default WasteCategory;
```

### `/backend/src/models/Notification.js`

```javascript
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    actionUrl: {
      type: String,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

notificationSchema.index({ user: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
```

### `/backend/src/middleware/authMiddleware.js`

```javascript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    req.user = null;
  }

  next();
}
```

### `/backend/src/middleware/roleMiddleware.js`

```javascript
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
}
```

### `/backend/src/middleware/errorMiddleware.js`

```javascript
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map(e => e.message)
      .join(', ');
    return res.status(400).json({ message: messages });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({ message: `${field} already exists` });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
}
```

### `/backend/src/controllers/authController.js`

```javascript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRE = '7d';

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
}

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
    profileImage: user.profileImage,
    employeeId: user.employeeId
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, phone, password, address } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: 'name, email, phone, and password are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      phone: phone.trim(),
      address: (address || '').trim(),
      password: hashedPassword,
      role: 'user'
    });

    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: formatUser(newUser)
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase()
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    
```


## License: unknown
https://github.com/Ayush-Manware/Tourism-Backend-File/blob/b09cdbf7029b8051764b4dee5e51e40e148e1082/index.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    profileImage: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'collector'],
      default: 'user'
    },
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for faster queries
userSchema.index({ email: 1, role: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
export default User;
```

### `/backend/src/models/PickupRequest.js`

```javascript
import mongoose from 'mongoose';

const pickupRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    wasteType: {
      type: String,
      enum: ['Organic', 'Plastic', 'E-waste', 'Hazardous'],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    address: {
      type: String,
      required: true
    },
    preferredDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'In-Progress', 'Completed'],
      default: 'Pending'
    },
    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    notes: {
      type: String,
      default: ''
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null
    },
    fee: {
      type: Number,
      default: 50
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

pickupRequestSchema.index({ user: 1, status: 1 });
pickupRequestSchema.index({ collector: 1, status: 1 });
pickupRequestSchema.index({ status: 1 });

const PickupRequest = mongoose.model('PickupRequest', pickupRequestSchema);
export default PickupRequest;
```

### `/backend/src/models/Complaint.js`

```javascript
import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Open', 'In-Progress', 'Resolved', 'Closed'],
      default: 'Open'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    attachments: [String],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    resolution: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

complaintSchema.index({ user: 1, status: 1 });
complaintSchema.index({ status: 1 });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
```

### `/backend/src/models/Payment.js`

```javascript
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    pickupRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupRequest',
      default: null
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    method: {
      type: String,
      enum: ['UPI Payment', 'Bank Payment', 'Card Payment', 'Cash'],
      default: 'UPI Payment'
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Paid'
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true
    },
    reference: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
```

### `/backend/src/models/WasteCategory.js`

```javascript
import mongoose from 'mongoose';

const wasteCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: '📦'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

const WasteCategory = mongoose.model('WasteCategory', wasteCategorySchema);
export default WasteCategory;
```

### `/backend/src/models/Notification.js`

```javascript
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    actionUrl: {
      type: String,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

notificationSchema.index({ user: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
```

### `/backend/src/middleware/authMiddleware.js`

```javascript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    req.user = null;
  }

  next();
}
```

### `/backend/src/middleware/roleMiddleware.js`

```javascript
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
}
```

### `/backend/src/middleware/errorMiddleware.js`

```javascript
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map(e => e.message)
      .join(', ');
    return res.status(400).json({ message: messages });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({ message: `${field} already exists` });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
}
```

### `/backend/src/controllers/authController.js`

```javascript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRE = '7d';

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
}

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
    profileImage: user.profileImage,
    employeeId: user.employeeId
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, phone, password, address } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: 'name, email, phone, and password are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      phone: phone.trim(),
      address: (address || '').trim(),
      password: hashedPassword,
      role: 'user'
    });

    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: formatUser(newUser)
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase()
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    
```


## License: unknown
https://github.com/Ayush-Manware/Tourism-Backend-File/blob/b09cdbf7029b8051764b4dee5e51e40e148e1082/index.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    profileImage: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'collector'],
      default: 'user'
    },
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for faster queries
userSchema.index({ email: 1, role: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
export default User;
```

### `/backend/src/models/PickupRequest.js`

```javascript
import mongoose from 'mongoose';

const pickupRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    wasteType: {
      type: String,
      enum: ['Organic', 'Plastic', 'E-waste', 'Hazardous'],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    address: {
      type: String,
      required: true
    },
    preferredDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'In-Progress', 'Completed'],
      default: 'Pending'
    },
    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    notes: {
      type: String,
      default: ''
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null
    },
    fee: {
      type: Number,
      default: 50
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

pickupRequestSchema.index({ user: 1, status: 1 });
pickupRequestSchema.index({ collector: 1, status: 1 });
pickupRequestSchema.index({ status: 1 });

const PickupRequest = mongoose.model('PickupRequest', pickupRequestSchema);
export default PickupRequest;
```

### `/backend/src/models/Complaint.js`

```javascript
import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Open', 'In-Progress', 'Resolved', 'Closed'],
      default: 'Open'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    attachments: [String],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    resolution: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

complaintSchema.index({ user: 1, status: 1 });
complaintSchema.index({ status: 1 });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
```

### `/backend/src/models/Payment.js`

```javascript
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    pickupRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupRequest',
      default: null
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    method: {
      type: String,
      enum: ['UPI Payment', 'Bank Payment', 'Card Payment', 'Cash'],
      default: 'UPI Payment'
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Paid'
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true
    },
    reference: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
```

### `/backend/src/models/WasteCategory.js`

```javascript
import mongoose from 'mongoose';

const wasteCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: '📦'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

const WasteCategory = mongoose.model('WasteCategory', wasteCategorySchema);
export default WasteCategory;
```

### `/backend/src/models/Notification.js`

```javascript
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    actionUrl: {
      type: String,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

notificationSchema.index({ user: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
```

### `/backend/src/middleware/authMiddleware.js`

```javascript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    req.user = null;
  }

  next();
}
```

### `/backend/src/middleware/roleMiddleware.js`

```javascript
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
}
```

### `/backend/src/middleware/errorMiddleware.js`

```javascript
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map(e => e.message)
      .join(', ');
    return res.status(400).json({ message: messages });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({ message: `${field} already exists` });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
}
```

### `/backend/src/controllers/authController.js`

```javascript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRE = '7d';

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
}

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
    profileImage: user.profileImage,
    employeeId: user.employeeId
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, phone, password, address } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: 'name, email, phone, and password are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      phone: phone.trim(),
      address: (address || '').trim(),
      password: hashedPassword,
      role: 'user'
    });

    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: formatUser(newUser)
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase()
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    
```


## License: unknown
https://github.com/anantsaxena09/Nervesparks-backend/blob/1a1c8dcd2d341cf0f1e9931b9c9c61896bda7fc2/backend/controllers/authController.mjs

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    profileImage: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'collector'],
      default: 'user'
    },
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for faster queries
userSchema.index({ email: 1, role: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
export default User;
```

### `/backend/src/models/PickupRequest.js`

```javascript
import mongoose from 'mongoose';

const pickupRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    wasteType: {
      type: String,
      enum: ['Organic', 'Plastic', 'E-waste', 'Hazardous'],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    address: {
      type: String,
      required: true
    },
    preferredDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'In-Progress', 'Completed'],
      default: 'Pending'
    },
    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    notes: {
      type: String,
      default: ''
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null
    },
    fee: {
      type: Number,
      default: 50
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

pickupRequestSchema.index({ user: 1, status: 1 });
pickupRequestSchema.index({ collector: 1, status: 1 });
pickupRequestSchema.index({ status: 1 });

const PickupRequest = mongoose.model('PickupRequest', pickupRequestSchema);
export default PickupRequest;
```

### `/backend/src/models/Complaint.js`

```javascript
import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Open', 'In-Progress', 'Resolved', 'Closed'],
      default: 'Open'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    attachments: [String],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    resolution: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

complaintSchema.index({ user: 1, status: 1 });
complaintSchema.index({ status: 1 });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
```

### `/backend/src/models/Payment.js`

```javascript
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    pickupRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupRequest',
      default: null
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    method: {
      type: String,
      enum: ['UPI Payment', 'Bank Payment', 'Card Payment', 'Cash'],
      default: 'UPI Payment'
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Paid'
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true
    },
    reference: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
```

### `/backend/src/models/WasteCategory.js`

```javascript
import mongoose from 'mongoose';

const wasteCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: '📦'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

const WasteCategory = mongoose.model('WasteCategory', wasteCategorySchema);
export default WasteCategory;
```

### `/backend/src/models/Notification.js`

```javascript
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    actionUrl: {
      type: String,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

notificationSchema.index({ user: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
```

### `/backend/src/middleware/authMiddleware.js`

```javascript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    req.user = null;
  }

  next();
}
```

### `/backend/src/middleware/roleMiddleware.js`

```javascript
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
}
```

### `/backend/src/middleware/errorMiddleware.js`

```javascript
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map(e => e.message)
      .join(', ');
    return res.status(400).json({ message: messages });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({ message: `${field} already exists` });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
}
```

### `/backend/src/controllers/authController.js`

```javascript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRE = '7d';

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
}

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
    profileImage: user.profileImage,
    employeeId: user.employeeId
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, phone, password, address } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: 'name, email, phone, and password are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      phone: phone.trim(),
      address: (address || '').trim(),
      password: hashedPassword,
      role: 'user'
    });

    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: formatUser(newUser)
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase()
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: formatUser
```


## License: unknown
https://github.com/Ayush-Manware/Tourism-Backend-File/blob/b09cdbf7029b8051764b4dee5e51e40e148e1082/index.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    profileImage: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'collector'],
      default: 'user'
    },
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for faster queries
userSchema.index({ email: 1, role: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
export default User;
```

### `/backend/src/models/PickupRequest.js`

```javascript
import mongoose from 'mongoose';

const pickupRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    wasteType: {
      type: String,
      enum: ['Organic', 'Plastic', 'E-waste', 'Hazardous'],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    address: {
      type: String,
      required: true
    },
    preferredDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'In-Progress', 'Completed'],
      default: 'Pending'
    },
    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    notes: {
      type: String,
      default: ''
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null
    },
    fee: {
      type: Number,
      default: 50
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

pickupRequestSchema.index({ user: 1, status: 1 });
pickupRequestSchema.index({ collector: 1, status: 1 });
pickupRequestSchema.index({ status: 1 });

const PickupRequest = mongoose.model('PickupRequest', pickupRequestSchema);
export default PickupRequest;
```

### `/backend/src/models/Complaint.js`

```javascript
import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Open', 'In-Progress', 'Resolved', 'Closed'],
      default: 'Open'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    attachments: [String],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    resolution: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

complaintSchema.index({ user: 1, status: 1 });
complaintSchema.index({ status: 1 });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
```

### `/backend/src/models/Payment.js`

```javascript
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    pickupRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupRequest',
      default: null
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    method: {
      type: String,
      enum: ['UPI Payment', 'Bank Payment', 'Card Payment', 'Cash'],
      default: 'UPI Payment'
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Paid'
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true
    },
    reference: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
```

### `/backend/src/models/WasteCategory.js`

```javascript
import mongoose from 'mongoose';

const wasteCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: '📦'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

const WasteCategory = mongoose.model('WasteCategory', wasteCategorySchema);
export default WasteCategory;
```

### `/backend/src/models/Notification.js`

```javascript
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    actionUrl: {
      type: String,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

notificationSchema.index({ user: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
```

### `/backend/src/middleware/authMiddleware.js`

```javascript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    req.user = null;
  }

  next();
}
```

### `/backend/src/middleware/roleMiddleware.js`

```javascript
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
}
```

### `/backend/src/middleware/errorMiddleware.js`

```javascript
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map(e => e.message)
      .join(', ');
    return res.status(400).json({ message: messages });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({ message: `${field} already exists` });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
}
```

### `/backend/src/controllers/authController.js`

```javascript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRE = '7d';

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
}

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
    profileImage: user.profileImage,
    employeeId: user.employeeId
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, phone, password, address } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: 'name, email, phone, and password are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      phone: phone.trim(),
      address: (address || '').trim(),
      password: hashedPassword,
      role: 'user'
    });

    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: formatUser(newUser)
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase()
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    
```


## License: unknown
https://github.com/anantsaxena09/Nervesparks-backend/blob/1a1c8dcd2d341cf0f1e9931b9c9c61896bda7fc2/backend/controllers/authController.mjs

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    profileImage: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'collector'],
      default: 'user'
    },
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for faster queries
userSchema.index({ email: 1, role: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
export default User;
```

### `/backend/src/models/PickupRequest.js`

```javascript
import mongoose from 'mongoose';

const pickupRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    wasteType: {
      type: String,
      enum: ['Organic', 'Plastic', 'E-waste', 'Hazardous'],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    address: {
      type: String,
      required: true
    },
    preferredDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'In-Progress', 'Completed'],
      default: 'Pending'
    },
    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    notes: {
      type: String,
      default: ''
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null
    },
    fee: {
      type: Number,
      default: 50
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

pickupRequestSchema.index({ user: 1, status: 1 });
pickupRequestSchema.index({ collector: 1, status: 1 });
pickupRequestSchema.index({ status: 1 });

const PickupRequest = mongoose.model('PickupRequest', pickupRequestSchema);
export default PickupRequest;
```

### `/backend/src/models/Complaint.js`

```javascript
import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Open', 'In-Progress', 'Resolved', 'Closed'],
      default: 'Open'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    attachments: [String],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    resolution: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

complaintSchema.index({ user: 1, status: 1 });
complaintSchema.index({ status: 1 });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
```

### `/backend/src/models/Payment.js`

```javascript
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    pickupRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupRequest',
      default: null
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    method: {
      type: String,
      enum: ['UPI Payment', 'Bank Payment', 'Card Payment', 'Cash'],
      default: 'UPI Payment'
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Paid'
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true
    },
    reference: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
```

### `/backend/src/models/WasteCategory.js`

```javascript
import mongoose from 'mongoose';

const wasteCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: '📦'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

const WasteCategory = mongoose.model('WasteCategory', wasteCategorySchema);
export default WasteCategory;
```

### `/backend/src/models/Notification.js`

```javascript
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    actionUrl: {
      type: String,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

notificationSchema.index({ user: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
```

### `/backend/src/middleware/authMiddleware.js`

```javascript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    req.user = null;
  }

  next();
}
```

### `/backend/src/middleware/roleMiddleware.js`

```javascript
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
}
```

### `/backend/src/middleware/errorMiddleware.js`

```javascript
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map(e => e.message)
      .join(', ');
    return res.status(400).json({ message: messages });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({ message: `${field} already exists` });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
}
```

### `/backend/src/controllers/authController.js`

```javascript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRE = '7d';

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
}

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
    profileImage: user.profileImage,
    employeeId: user.employeeId
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, phone, password, address } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: 'name, email, phone, and password are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      phone: phone.trim(),
      address: (address || '').trim(),
      password: hashedPassword,
      role: 'user'
    });

    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: formatUser(newUser)
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase()
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: formatUser
```


## License: unknown
https://github.com/Ayush-Manware/Tourism-Backend-File/blob/b09cdbf7029b8051764b4dee5e51e40e148e1082/index.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    profileImage: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'collector'],
      default: 'user'
    },
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for faster queries
userSchema.index({ email: 1, role: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
export default User;
```

### `/backend/src/models/PickupRequest.js`

```javascript
import mongoose from 'mongoose';

const pickupRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    wasteType: {
      type: String,
      enum: ['Organic', 'Plastic', 'E-waste', 'Hazardous'],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    address: {
      type: String,
      required: true
    },
    preferredDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'In-Progress', 'Completed'],
      default: 'Pending'
    },
    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    notes: {
      type: String,
      default: ''
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null
    },
    fee: {
      type: Number,
      default: 50
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

pickupRequestSchema.index({ user: 1, status: 1 });
pickupRequestSchema.index({ collector: 1, status: 1 });
pickupRequestSchema.index({ status: 1 });

const PickupRequest = mongoose.model('PickupRequest', pickupRequestSchema);
export default PickupRequest;
```

### `/backend/src/models/Complaint.js`

```javascript
import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Open', 'In-Progress', 'Resolved', 'Closed'],
      default: 'Open'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    attachments: [String],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    resolution: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

complaintSchema.index({ user: 1, status: 1 });
complaintSchema.index({ status: 1 });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
```

### `/backend/src/models/Payment.js`

```javascript
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    pickupRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupRequest',
      default: null
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    method: {
      type: String,
      enum: ['UPI Payment', 'Bank Payment', 'Card Payment', 'Cash'],
      default: 'UPI Payment'
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Paid'
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true
    },
    reference: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
```

### `/backend/src/models/WasteCategory.js`

```javascript
import mongoose from 'mongoose';

const wasteCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: '📦'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

const WasteCategory = mongoose.model('WasteCategory', wasteCategorySchema);
export default WasteCategory;
```

### `/backend/src/models/Notification.js`

```javascript
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    actionUrl: {
      type: String,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

notificationSchema.index({ user: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
```

### `/backend/src/middleware/authMiddleware.js`

```javascript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    req.user = null;
  }

  next();
}
```

### `/backend/src/middleware/roleMiddleware.js`

```javascript
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
}
```

### `/backend/src/middleware/errorMiddleware.js`

```javascript
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map(e => e.message)
      .join(', ');
    return res.status(400).json({ message: messages });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({ message: `${field} already exists` });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
}
```

### `/backend/src/controllers/authController.js`

```javascript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRE = '7d';

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
}

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
    profileImage: user.profileImage,
    employeeId: user.employeeId
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, phone, password, address } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: 'name, email, phone, and password are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      phone: phone.trim(),
      address: (address || '').trim(),
      password: hashedPassword,
      role: 'user'
    });

    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: formatUser(newUser)
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase()
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    
```


## License: unknown
https://github.com/anantsaxena09/Nervesparks-backend/blob/1a1c8dcd2d341cf0f1e9931b9c9c61896bda7fc2/backend/controllers/authController.mjs

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    profileImage: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'collector'],
      default: 'user'
    },
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for faster queries
userSchema.index({ email: 1, role: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
export default User;
```

### `/backend/src/models/PickupRequest.js`

```javascript
import mongoose from 'mongoose';

const pickupRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    wasteType: {
      type: String,
      enum: ['Organic', 'Plastic', 'E-waste', 'Hazardous'],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    address: {
      type: String,
      required: true
    },
    preferredDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'In-Progress', 'Completed'],
      default: 'Pending'
    },
    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    notes: {
      type: String,
      default: ''
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null
    },
    fee: {
      type: Number,
      default: 50
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

pickupRequestSchema.index({ user: 1, status: 1 });
pickupRequestSchema.index({ collector: 1, status: 1 });
pickupRequestSchema.index({ status: 1 });

const PickupRequest = mongoose.model('PickupRequest', pickupRequestSchema);
export default PickupRequest;
```

### `/backend/src/models/Complaint.js`

```javascript
import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Open', 'In-Progress', 'Resolved', 'Closed'],
      default: 'Open'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    attachments: [String],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    resolution: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

complaintSchema.index({ user: 1, status: 1 });
complaintSchema.index({ status: 1 });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
```

### `/backend/src/models/Payment.js`

```javascript
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    pickupRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupRequest',
      default: null
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    method: {
      type: String,
      enum: ['UPI Payment', 'Bank Payment', 'Card Payment', 'Cash'],
      default: 'UPI Payment'
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Paid'
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true
    },
    reference: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
```

### `/backend/src/models/WasteCategory.js`

```javascript
import mongoose from 'mongoose';

const wasteCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: '📦'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

const WasteCategory = mongoose.model('WasteCategory', wasteCategorySchema);
export default WasteCategory;
```

### `/backend/src/models/Notification.js`

```javascript
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    actionUrl: {
      type: String,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

notificationSchema.index({ user: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
```

### `/backend/src/middleware/authMiddleware.js`

```javascript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    req.user = null;
  }

  next();
}
```

### `/backend/src/middleware/roleMiddleware.js`

```javascript
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
}
```

### `/backend/src/middleware/errorMiddleware.js`

```javascript
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map(e => e.message)
      .join(', ');
    return res.status(400).json({ message: messages });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({ message: `${field} already exists` });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
}
```

### `/backend/src/controllers/authController.js`

```javascript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRE = '7d';

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
}

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
    profileImage: user.profileImage,
    employeeId: user.employeeId
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, phone, password, address } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: 'name, email, phone, and password are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      phone: phone.trim(),
      address: (address || '').trim(),
      password: hashedPassword,
      role: 'user'
    });

    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: formatUser(newUser)
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase()
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: formatUser
```


## License: unknown
https://github.com/Ayush-Manware/Tourism-Backend-File/blob/b09cdbf7029b8051764b4dee5e51e40e148e1082/index.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    profileImage: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'collector'],
      default: 'user'
    },
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for faster queries
userSchema.index({ email: 1, role: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
export default User;
```

### `/backend/src/models/PickupRequest.js`

```javascript
import mongoose from 'mongoose';

const pickupRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    wasteType: {
      type: String,
      enum: ['Organic', 'Plastic', 'E-waste', 'Hazardous'],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    address: {
      type: String,
      required: true
    },
    preferredDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'In-Progress', 'Completed'],
      default: 'Pending'
    },
    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    notes: {
      type: String,
      default: ''
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null
    },
    fee: {
      type: Number,
      default: 50
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

pickupRequestSchema.index({ user: 1, status: 1 });
pickupRequestSchema.index({ collector: 1, status: 1 });
pickupRequestSchema.index({ status: 1 });

const PickupRequest = mongoose.model('PickupRequest', pickupRequestSchema);
export default PickupRequest;
```

### `/backend/src/models/Complaint.js`

```javascript
import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Open', 'In-Progress', 'Resolved', 'Closed'],
      default: 'Open'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    attachments: [String],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    resolution: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

complaintSchema.index({ user: 1, status: 1 });
complaintSchema.index({ status: 1 });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
```

### `/backend/src/models/Payment.js`

```javascript
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    pickupRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupRequest',
      default: null
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    method: {
      type: String,
      enum: ['UPI Payment', 'Bank Payment', 'Card Payment', 'Cash'],
      default: 'UPI Payment'
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Paid'
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true
    },
    reference: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
```

### `/backend/src/models/WasteCategory.js`

```javascript
import mongoose from 'mongoose';

const wasteCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: '📦'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

const WasteCategory = mongoose.model('WasteCategory', wasteCategorySchema);
export default WasteCategory;
```

### `/backend/src/models/Notification.js`

```javascript
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    actionUrl: {
      type: String,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

notificationSchema.index({ user: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
```

### `/backend/src/middleware/authMiddleware.js`

```javascript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    req.user = null;
  }

  next();
}
```

### `/backend/src/middleware/roleMiddleware.js`

```javascript
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
}
```

### `/backend/src/middleware/errorMiddleware.js`

```javascript
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map(e => e.message)
      .join(', ');
    return res.status(400).json({ message: messages });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({ message: `${field} already exists` });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
}
```

### `/backend/src/controllers/authController.js`

```javascript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRE = '7d';

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
}

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
    profileImage: user.profileImage,
    employeeId: user.employeeId
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, phone, password, address } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: 'name, email, phone, and password are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      phone: phone.trim(),
      address: (address || '').trim(),
      password: hashedPassword,
      role: 'user'
    });

    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: formatUser(newUser)
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase()
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    
```


## License: unknown
https://github.com/anantsaxena09/Nervesparks-backend/blob/1a1c8dcd2d341cf0f1e9931b9c9c61896bda7fc2/backend/controllers/authController.mjs

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    profileImage: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'collector'],
      default: 'user'
    },
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for faster queries
userSchema.index({ email: 1, role: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
export default User;
```

### `/backend/src/models/PickupRequest.js`

```javascript
import mongoose from 'mongoose';

const pickupRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    wasteType: {
      type: String,
      enum: ['Organic', 'Plastic', 'E-waste', 'Hazardous'],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    address: {
      type: String,
      required: true
    },
    preferredDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'In-Progress', 'Completed'],
      default: 'Pending'
    },
    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    notes: {
      type: String,
      default: ''
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null
    },
    fee: {
      type: Number,
      default: 50
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

pickupRequestSchema.index({ user: 1, status: 1 });
pickupRequestSchema.index({ collector: 1, status: 1 });
pickupRequestSchema.index({ status: 1 });

const PickupRequest = mongoose.model('PickupRequest', pickupRequestSchema);
export default PickupRequest;
```

### `/backend/src/models/Complaint.js`

```javascript
import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Open', 'In-Progress', 'Resolved', 'Closed'],
      default: 'Open'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    attachments: [String],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    resolution: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

complaintSchema.index({ user: 1, status: 1 });
complaintSchema.index({ status: 1 });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
```

### `/backend/src/models/Payment.js`

```javascript
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    pickupRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupRequest',
      default: null
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    method: {
      type: String,
      enum: ['UPI Payment', 'Bank Payment', 'Card Payment', 'Cash'],
      default: 'UPI Payment'
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Paid'
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true
    },
    reference: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
```

### `/backend/src/models/WasteCategory.js`

```javascript
import mongoose from 'mongoose';

const wasteCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: '📦'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

const WasteCategory = mongoose.model('WasteCategory', wasteCategorySchema);
export default WasteCategory;
```

### `/backend/src/models/Notification.js`

```javascript
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    actionUrl: {
      type: String,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

notificationSchema.index({ user: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
```

### `/backend/src/middleware/authMiddleware.js`

```javascript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    req.user = null;
  }

  next();
}
```

### `/backend/src/middleware/roleMiddleware.js`

```javascript
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
}
```

### `/backend/src/middleware/errorMiddleware.js`

```javascript
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map(e => e.message)
      .join(', ');
    return res.status(400).json({ message: messages });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({ message: `${field} already exists` });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
}
```

### `/backend/src/controllers/authController.js`

```javascript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRE = '7d';

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
}

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
    profileImage: user.profileImage,
    employeeId: user.employeeId
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, phone, password, address } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: 'name, email, phone, and password are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      phone: phone.trim(),
      address: (address || '').trim(),
      password: hashedPassword,
      role: 'user'
    });

    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: formatUser(newUser)
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase()
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: formatUser
```


## License: unknown
https://github.com/Ayush-Manware/Tourism-Backend-File/blob/b09cdbf7029b8051764b4dee5e51e40e148e1082/index.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    profileImage: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'collector'],
      default: 'user'
    },
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for faster queries
userSchema.index({ email: 1, role: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
export default User;
```

### `/backend/src/models/PickupRequest.js`

```javascript
import mongoose from 'mongoose';

const pickupRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    wasteType: {
      type: String,
      enum: ['Organic', 'Plastic', 'E-waste', 'Hazardous'],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    address: {
      type: String,
      required: true
    },
    preferredDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'In-Progress', 'Completed'],
      default: 'Pending'
    },
    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    notes: {
      type: String,
      default: ''
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null
    },
    fee: {
      type: Number,
      default: 50
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

pickupRequestSchema.index({ user: 1, status: 1 });
pickupRequestSchema.index({ collector: 1, status: 1 });
pickupRequestSchema.index({ status: 1 });

const PickupRequest = mongoose.model('PickupRequest', pickupRequestSchema);
export default PickupRequest;
```

### `/backend/src/models/Complaint.js`

```javascript
import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Open', 'In-Progress', 'Resolved', 'Closed'],
      default: 'Open'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    attachments: [String],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    resolution: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

complaintSchema.index({ user: 1, status: 1 });
complaintSchema.index({ status: 1 });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
```

### `/backend/src/models/Payment.js`

```javascript
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    pickupRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupRequest',
      default: null
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    method: {
      type: String,
      enum: ['UPI Payment', 'Bank Payment', 'Card Payment', 'Cash'],
      default: 'UPI Payment'
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Paid'
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true
    },
    reference: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
```

### `/backend/src/models/WasteCategory.js`

```javascript
import mongoose from 'mongoose';

const wasteCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: '📦'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

const WasteCategory = mongoose.model('WasteCategory', wasteCategorySchema);
export default WasteCategory;
```

### `/backend/src/models/Notification.js`

```javascript
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    actionUrl: {
      type: String,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

notificationSchema.index({ user: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
```

### `/backend/src/middleware/authMiddleware.js`

```javascript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    req.user = null;
  }

  next();
}
```

### `/backend/src/middleware/roleMiddleware.js`

```javascript
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
}
```

### `/backend/src/middleware/errorMiddleware.js`

```javascript
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map(e => e.message)
      .join(', ');
    return res.status(400).json({ message: messages });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({ message: `${field} already exists` });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
}
```

### `/backend/src/controllers/authController.js`

```javascript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRE = '7d';

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
}

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
    profileImage: user.profileImage,
    employeeId: user.employeeId
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, phone, password, address } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: 'name, email, phone, and password are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      phone: phone.trim(),
      address: (address || '').trim(),
      password: hashedPassword,
      role: 'user'
    });

    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: formatUser(newUser)
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase()
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    
```


## License: unknown
https://github.com/anantsaxena09/Nervesparks-backend/blob/1a1c8dcd2d341cf0f1e9931b9c9c61896bda7fc2/backend/controllers/authController.mjs

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    profileImage: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'collector'],
      default: 'user'
    },
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for faster queries
userSchema.index({ email: 1, role: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
export default User;
```

### `/backend/src/models/PickupRequest.js`

```javascript
import mongoose from 'mongoose';

const pickupRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    wasteType: {
      type: String,
      enum: ['Organic', 'Plastic', 'E-waste', 'Hazardous'],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    address: {
      type: String,
      required: true
    },
    preferredDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'In-Progress', 'Completed'],
      default: 'Pending'
    },
    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    notes: {
      type: String,
      default: ''
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null
    },
    fee: {
      type: Number,
      default: 50
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

pickupRequestSchema.index({ user: 1, status: 1 });
pickupRequestSchema.index({ collector: 1, status: 1 });
pickupRequestSchema.index({ status: 1 });

const PickupRequest = mongoose.model('PickupRequest', pickupRequestSchema);
export default PickupRequest;
```

### `/backend/src/models/Complaint.js`

```javascript
import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Open', 'In-Progress', 'Resolved', 'Closed'],
      default: 'Open'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    attachments: [String],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    resolution: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

complaintSchema.index({ user: 1, status: 1 });
complaintSchema.index({ status: 1 });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
```

### `/backend/src/models/Payment.js`

```javascript
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    pickupRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupRequest',
      default: null
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    method: {
      type: String,
      enum: ['UPI Payment', 'Bank Payment', 'Card Payment', 'Cash'],
      default: 'UPI Payment'
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Paid'
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true
    },
    reference: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
```

### `/backend/src/models/WasteCategory.js`

```javascript
import mongoose from 'mongoose';

const wasteCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: '📦'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

const WasteCategory = mongoose.model('WasteCategory', wasteCategorySchema);
export default WasteCategory;
```

### `/backend/src/models/Notification.js`

```javascript
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    actionUrl: {
      type: String,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

notificationSchema.index({ user: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
```

### `/backend/src/middleware/authMiddleware.js`

```javascript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    req.user = null;
  }

  next();
}
```

### `/backend/src/middleware/roleMiddleware.js`

```javascript
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
}
```

### `/backend/src/middleware/errorMiddleware.js`

```javascript
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map(e => e.message)
      .join(', ');
    return res.status(400).json({ message: messages });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({ message: `${field} already exists` });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
}
```

### `/backend/src/controllers/authController.js`

```javascript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRE = '7d';

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
}

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
    profileImage: user.profileImage,
    employeeId: user.employeeId
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, phone, password, address } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: 'name, email, phone, and password are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      phone: phone.trim(),
      address: (address || '').trim(),
      password: hashedPassword,
      role: 'user'
    });

    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: formatUser(newUser)
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase()
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: formatUser
```


## License: unknown
https://github.com/Ayush-Manware/Tourism-Backend-File/blob/b09cdbf7029b8051764b4dee5e51e40e148e1082/index.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    profileImage: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'collector'],
      default: 'user'
    },
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for faster queries
userSchema.index({ email: 1, role: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
export default User;
```

### `/backend/src/models/PickupRequest.js`

```javascript
import mongoose from 'mongoose';

const pickupRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    wasteType: {
      type: String,
      enum: ['Organic', 'Plastic', 'E-waste', 'Hazardous'],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    address: {
      type: String,
      required: true
    },
    preferredDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'In-Progress', 'Completed'],
      default: 'Pending'
    },
    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    notes: {
      type: String,
      default: ''
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null
    },
    fee: {
      type: Number,
      default: 50
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

pickupRequestSchema.index({ user: 1, status: 1 });
pickupRequestSchema.index({ collector: 1, status: 1 });
pickupRequestSchema.index({ status: 1 });

const PickupRequest = mongoose.model('PickupRequest', pickupRequestSchema);
export default PickupRequest;
```

### `/backend/src/models/Complaint.js`

```javascript
import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Open', 'In-Progress', 'Resolved', 'Closed'],
      default: 'Open'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    attachments: [String],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    resolution: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

complaintSchema.index({ user: 1, status: 1 });
complaintSchema.index({ status: 1 });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
```

### `/backend/src/models/Payment.js`

```javascript
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    pickupRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupRequest',
      default: null
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    method: {
      type: String,
      enum: ['UPI Payment', 'Bank Payment', 'Card Payment', 'Cash'],
      default: 'UPI Payment'
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Paid'
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true
    },
    reference: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
```

### `/backend/src/models/WasteCategory.js`

```javascript
import mongoose from 'mongoose';

const wasteCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: '📦'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

const WasteCategory = mongoose.model('WasteCategory', wasteCategorySchema);
export default WasteCategory;
```

### `/backend/src/models/Notification.js`

```javascript
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    actionUrl: {
      type: String,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

notificationSchema.index({ user: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
```

### `/backend/src/middleware/authMiddleware.js`

```javascript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    req.user = null;
  }

  next();
}
```

### `/backend/src/middleware/roleMiddleware.js`

```javascript
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
}
```

### `/backend/src/middleware/errorMiddleware.js`

```javascript
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map(e => e.message)
      .join(', ');
    return res.status(400).json({ message: messages });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({ message: `${field} already exists` });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
}
```

### `/backend/src/controllers/authController.js`

```javascript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRE = '7d';

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
}

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
    profileImage: user.profileImage,
    employeeId: user.employeeId
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, phone, password, address } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: 'name, email, phone, and password are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      phone: phone.trim(),
      address: (address || '').trim(),
      password: hashedPassword,
      role: 'user'
    });

    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: formatUser(newUser)
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase()
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const
```


## License: unknown
https://github.com/anantsaxena09/Nervesparks-backend/blob/1a1c8dcd2d341cf0f1e9931b9c9c61896bda7fc2/backend/controllers/authController.mjs

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    profileImage: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'collector'],
      default: 'user'
    },
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for faster queries
userSchema.index({ email: 1, role: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
export default User;
```

### `/backend/src/models/PickupRequest.js`

```javascript
import mongoose from 'mongoose';

const pickupRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    wasteType: {
      type: String,
      enum: ['Organic', 'Plastic', 'E-waste', 'Hazardous'],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    address: {
      type: String,
      required: true
    },
    preferredDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'In-Progress', 'Completed'],
      default: 'Pending'
    },
    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    notes: {
      type: String,
      default: ''
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null
    },
    fee: {
      type: Number,
      default: 50
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

pickupRequestSchema.index({ user: 1, status: 1 });
pickupRequestSchema.index({ collector: 1, status: 1 });
pickupRequestSchema.index({ status: 1 });

const PickupRequest = mongoose.model('PickupRequest', pickupRequestSchema);
export default PickupRequest;
```

### `/backend/src/models/Complaint.js`

```javascript
import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Open', 'In-Progress', 'Resolved', 'Closed'],
      default: 'Open'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    attachments: [String],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    resolution: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

complaintSchema.index({ user: 1, status: 1 });
complaintSchema.index({ status: 1 });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
```

### `/backend/src/models/Payment.js`

```javascript
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    pickupRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupRequest',
      default: null
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    method: {
      type: String,
      enum: ['UPI Payment', 'Bank Payment', 'Card Payment', 'Cash'],
      default: 'UPI Payment'
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Paid'
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true
    },
    reference: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
```

### `/backend/src/models/WasteCategory.js`

```javascript
import mongoose from 'mongoose';

const wasteCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: '📦'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

const WasteCategory = mongoose.model('WasteCategory', wasteCategorySchema);
export default WasteCategory;
```

### `/backend/src/models/Notification.js`

```javascript
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    actionUrl: {
      type: String,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

notificationSchema.index({ user: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
```

### `/backend/src/middleware/authMiddleware.js`

```javascript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    req.user = null;
  }

  next();
}
```

### `/backend/src/middleware/roleMiddleware.js`

```javascript
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
}
```

### `/backend/src/middleware/errorMiddleware.js`

```javascript
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map(e => e.message)
      .join(', ');
    return res.status(400).json({ message: messages });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({ message: `${field} already exists` });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
}
```

### `/backend/src/controllers/authController.js`

```javascript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRE = '7d';

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
}

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
    profileImage: user.profileImage,
    employeeId: user.employeeId
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, phone, password, address } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: 'name, email, phone, and password are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      phone: phone.trim(),
      address: (address || '').trim(),
      password: hashedPassword,
      role: 'user'
    });

    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: formatUser(newUser)
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase()
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: formatUser
```


## License: unknown
https://github.com/Ayush-Manware/Tourism-Backend-File/blob/b09cdbf7029b8051764b4dee5e51e40e148e1082/index.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    profileImage: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'collector'],
      default: 'user'
    },
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for faster queries
userSchema.index({ email: 1, role: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
export default User;
```

### `/backend/src/models/PickupRequest.js`

```javascript
import mongoose from 'mongoose';

const pickupRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    wasteType: {
      type: String,
      enum: ['Organic', 'Plastic', 'E-waste', 'Hazardous'],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    address: {
      type: String,
      required: true
    },
    preferredDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'In-Progress', 'Completed'],
      default: 'Pending'
    },
    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    notes: {
      type: String,
      default: ''
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null
    },
    fee: {
      type: Number,
      default: 50
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

pickupRequestSchema.index({ user: 1, status: 1 });
pickupRequestSchema.index({ collector: 1, status: 1 });
pickupRequestSchema.index({ status: 1 });

const PickupRequest = mongoose.model('PickupRequest', pickupRequestSchema);
export default PickupRequest;
```

### `/backend/src/models/Complaint.js`

```javascript
import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Open', 'In-Progress', 'Resolved', 'Closed'],
      default: 'Open'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    attachments: [String],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    resolution: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

complaintSchema.index({ user: 1, status: 1 });
complaintSchema.index({ status: 1 });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
```

### `/backend/src/models/Payment.js`

```javascript
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    pickupRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupRequest',
      default: null
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    method: {
      type: String,
      enum: ['UPI Payment', 'Bank Payment', 'Card Payment', 'Cash'],
      default: 'UPI Payment'
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Paid'
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true
    },
    reference: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
```

### `/backend/src/models/WasteCategory.js`

```javascript
import mongoose from 'mongoose';

const wasteCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: '📦'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

const WasteCategory = mongoose.model('WasteCategory', wasteCategorySchema);
export default WasteCategory;
```

### `/backend/src/models/Notification.js`

```javascript
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    actionUrl: {
      type: String,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

notificationSchema.index({ user: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
```

### `/backend/src/middleware/authMiddleware.js`

```javascript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    req.user = null;
  }

  next();
}
```

### `/backend/src/middleware/roleMiddleware.js`

```javascript
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
}
```

### `/backend/src/middleware/errorMiddleware.js`

```javascript
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map(e => e.message)
      .join(', ');
    return res.status(400).json({ message: messages });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({ message: `${field} already exists` });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
}
```

### `/backend/src/controllers/authController.js`

```javascript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRE = '7d';

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
}

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
    profileImage: user.profileImage,
    employeeId: user.employeeId
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, phone, password, address } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: 'name, email, phone, and password are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      phone: phone.trim(),
      address: (address || '').trim(),
      password: hashedPassword,
      role: 'user'
    });

    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: formatUser(newUser)
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase()
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const
```


## License: unknown
https://github.com/anantsaxena09/Nervesparks-backend/blob/1a1c8dcd2d341cf0f1e9931b9c9c61896bda7fc2/backend/controllers/authController.mjs

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    profileImage: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'collector'],
      default: 'user'
    },
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for faster queries
userSchema.index({ email: 1, role: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
export default User;
```

### `/backend/src/models/PickupRequest.js`

```javascript
import mongoose from 'mongoose';

const pickupRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    wasteType: {
      type: String,
      enum: ['Organic', 'Plastic', 'E-waste', 'Hazardous'],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    address: {
      type: String,
      required: true
    },
    preferredDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'In-Progress', 'Completed'],
      default: 'Pending'
    },
    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    notes: {
      type: String,
      default: ''
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null
    },
    fee: {
      type: Number,
      default: 50
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

pickupRequestSchema.index({ user: 1, status: 1 });
pickupRequestSchema.index({ collector: 1, status: 1 });
pickupRequestSchema.index({ status: 1 });

const PickupRequest = mongoose.model('PickupRequest', pickupRequestSchema);
export default PickupRequest;
```

### `/backend/src/models/Complaint.js`

```javascript
import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Open', 'In-Progress', 'Resolved', 'Closed'],
      default: 'Open'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    attachments: [String],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    resolution: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

complaintSchema.index({ user: 1, status: 1 });
complaintSchema.index({ status: 1 });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
```

### `/backend/src/models/Payment.js`

```javascript
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    pickupRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupRequest',
      default: null
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    method: {
      type: String,
      enum: ['UPI Payment', 'Bank Payment', 'Card Payment', 'Cash'],
      default: 'UPI Payment'
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Paid'
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true
    },
    reference: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
```

### `/backend/src/models/WasteCategory.js`

```javascript
import mongoose from 'mongoose';

const wasteCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: '📦'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

const WasteCategory = mongoose.model('WasteCategory', wasteCategorySchema);
export default WasteCategory;
```

### `/backend/src/models/Notification.js`

```javascript
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    actionUrl: {
      type: String,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

notificationSchema.index({ user: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
```

### `/backend/src/middleware/authMiddleware.js`

```javascript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    req.user = null;
  }

  next();
}
```

### `/backend/src/middleware/roleMiddleware.js`

```javascript
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
}
```

### `/backend/src/middleware/errorMiddleware.js`

```javascript
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map(e => e.message)
      .join(', ');
    return res.status(400).json({ message: messages });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({ message: `${field} already exists` });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
}
```

### `/backend/src/controllers/authController.js`

```javascript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRE = '7d';

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
}

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
    profileImage: user.profileImage,
    employeeId: user.employeeId
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, phone, password, address } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: 'name, email, phone, and password are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      phone: phone.trim(),
      address: (address || '').trim(),
      password: hashedPassword,
      role: 'user'
    });

    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: formatUser(newUser)
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase()
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: formatUser
```


## License: unknown
https://github.com/Ayush-Manware/Tourism-Backend-File/blob/b09cdbf7029b8051764b4dee5e51e40e148e1082/index.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    profileImage: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'collector'],
      default: 'user'
    },
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for faster queries
userSchema.index({ email: 1, role: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
export default User;
```

### `/backend/src/models/PickupRequest.js`

```javascript
import mongoose from 'mongoose';

const pickupRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    wasteType: {
      type: String,
      enum: ['Organic', 'Plastic', 'E-waste', 'Hazardous'],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    address: {
      type: String,
      required: true
    },
    preferredDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'In-Progress', 'Completed'],
      default: 'Pending'
    },
    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    notes: {
      type: String,
      default: ''
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null
    },
    fee: {
      type: Number,
      default: 50
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

pickupRequestSchema.index({ user: 1, status: 1 });
pickupRequestSchema.index({ collector: 1, status: 1 });
pickupRequestSchema.index({ status: 1 });

const PickupRequest = mongoose.model('PickupRequest', pickupRequestSchema);
export default PickupRequest;
```

### `/backend/src/models/Complaint.js`

```javascript
import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Open', 'In-Progress', 'Resolved', 'Closed'],
      default: 'Open'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    attachments: [String],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    resolution: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

complaintSchema.index({ user: 1, status: 1 });
complaintSchema.index({ status: 1 });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
```

### `/backend/src/models/Payment.js`

```javascript
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    pickupRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupRequest',
      default: null
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    method: {
      type: String,
      enum: ['UPI Payment', 'Bank Payment', 'Card Payment', 'Cash'],
      default: 'UPI Payment'
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Paid'
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true
    },
    reference: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
```

### `/backend/src/models/WasteCategory.js`

```javascript
import mongoose from 'mongoose';

const wasteCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: '📦'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

const WasteCategory = mongoose.model('WasteCategory', wasteCategorySchema);
export default WasteCategory;
```

### `/backend/src/models/Notification.js`

```javascript
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    actionUrl: {
      type: String,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

notificationSchema.index({ user: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
```

### `/backend/src/middleware/authMiddleware.js`

```javascript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    req.user = null;
  }

  next();
}
```

### `/backend/src/middleware/roleMiddleware.js`

```javascript
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
}
```

### `/backend/src/middleware/errorMiddleware.js`

```javascript
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map(e => e.message)
      .join(', ');
    return res.status(400).json({ message: messages });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({ message: `${field} already exists` });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
}
```

### `/backend/src/controllers/authController.js`

```javascript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRE = '7d';

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
}

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
    profileImage: user.profileImage,
    employeeId: user.employeeId
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, phone, password, address } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: 'name, email, phone, and password are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      phone: phone.trim(),
      address: (address || '').trim(),
      password: hashedPassword,
      role: 'user'
    });

    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: formatUser(newUser)
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase()
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user);

    res.json({
      message
```


## License: unknown
https://github.com/anantsaxena09/Nervesparks-backend/blob/1a1c8dcd2d341cf0f1e9931b9c9c61896bda7fc2/backend/controllers/authController.mjs

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    profileImage: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'collector'],
      default: 'user'
    },
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for faster queries
userSchema.index({ email: 1, role: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
export default User;
```

### `/backend/src/models/PickupRequest.js`

```javascript
import mongoose from 'mongoose';

const pickupRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    wasteType: {
      type: String,
      enum: ['Organic', 'Plastic', 'E-waste', 'Hazardous'],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    address: {
      type: String,
      required: true
    },
    preferredDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'In-Progress', 'Completed'],
      default: 'Pending'
    },
    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    notes: {
      type: String,
      default: ''
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null
    },
    fee: {
      type: Number,
      default: 50
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

pickupRequestSchema.index({ user: 1, status: 1 });
pickupRequestSchema.index({ collector: 1, status: 1 });
pickupRequestSchema.index({ status: 1 });

const PickupRequest = mongoose.model('PickupRequest', pickupRequestSchema);
export default PickupRequest;
```

### `/backend/src/models/Complaint.js`

```javascript
import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Open', 'In-Progress', 'Resolved', 'Closed'],
      default: 'Open'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    attachments: [String],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    resolution: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

complaintSchema.index({ user: 1, status: 1 });
complaintSchema.index({ status: 1 });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
```

### `/backend/src/models/Payment.js`

```javascript
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    pickupRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupRequest',
      default: null
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    method: {
      type: String,
      enum: ['UPI Payment', 'Bank Payment', 'Card Payment', 'Cash'],
      default: 'UPI Payment'
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Paid'
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true
    },
    reference: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
```

### `/backend/src/models/WasteCategory.js`

```javascript
import mongoose from 'mongoose';

const wasteCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: '📦'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

const WasteCategory = mongoose.model('WasteCategory', wasteCategorySchema);
export default WasteCategory;
```

### `/backend/src/models/Notification.js`

```javascript
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    actionUrl: {
      type: String,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

notificationSchema.index({ user: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
```

### `/backend/src/middleware/authMiddleware.js`

```javascript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    req.user = null;
  }

  next();
}
```

### `/backend/src/middleware/roleMiddleware.js`

```javascript
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
}
```

### `/backend/src/middleware/errorMiddleware.js`

```javascript
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map(e => e.message)
      .join(', ');
    return res.status(400).json({ message: messages });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({ message: `${field} already exists` });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
}
```

### `/backend/src/controllers/authController.js`

```javascript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRE = '7d';

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
}

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
    profileImage: user.profileImage,
    employeeId: user.employeeId
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, phone, password, address } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: 'name, email, phone, and password are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      phone: phone.trim(),
      address: (address || '').trim(),
      password: hashedPassword,
      role: 'user'
    });

    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: formatUser(newUser)
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase()
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: formatUser
```


## License: unknown
https://github.com/Ayush-Manware/Tourism-Backend-File/blob/b09cdbf7029b8051764b4dee5e51e40e148e1082/index.js

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    profileImage: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'collector'],
      default: 'user'
    },
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for faster queries
userSchema.index({ email: 1, role: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
export default User;
```

### `/backend/src/models/PickupRequest.js`

```javascript
import mongoose from 'mongoose';

const pickupRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    wasteType: {
      type: String,
      enum: ['Organic', 'Plastic', 'E-waste', 'Hazardous'],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    address: {
      type: String,
      required: true
    },
    preferredDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'In-Progress', 'Completed'],
      default: 'Pending'
    },
    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    notes: {
      type: String,
      default: ''
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null
    },
    fee: {
      type: Number,
      default: 50
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

pickupRequestSchema.index({ user: 1, status: 1 });
pickupRequestSchema.index({ collector: 1, status: 1 });
pickupRequestSchema.index({ status: 1 });

const PickupRequest = mongoose.model('PickupRequest', pickupRequestSchema);
export default PickupRequest;
```

### `/backend/src/models/Complaint.js`

```javascript
import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Open', 'In-Progress', 'Resolved', 'Closed'],
      default: 'Open'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    attachments: [String],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    resolution: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

complaintSchema.index({ user: 1, status: 1 });
complaintSchema.index({ status: 1 });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
```

### `/backend/src/models/Payment.js`

```javascript
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    pickupRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupRequest',
      default: null
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    method: {
      type: String,
      enum: ['UPI Payment', 'Bank Payment', 'Card Payment', 'Cash'],
      default: 'UPI Payment'
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Paid'
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true
    },
    reference: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
```

### `/backend/src/models/WasteCategory.js`

```javascript
import mongoose from 'mongoose';

const wasteCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: '📦'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

const WasteCategory = mongoose.model('WasteCategory', wasteCategorySchema);
export default WasteCategory;
```

### `/backend/src/models/Notification.js`

```javascript
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    actionUrl: {
      type: String,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

notificationSchema.index({ user: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
```

### `/backend/src/middleware/authMiddleware.js`

```javascript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    req.user = null;
  }

  next();
}
```

### `/backend/src/middleware/roleMiddleware.js`

```javascript
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
}
```

### `/backend/src/middleware/errorMiddleware.js`

```javascript
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map(e => e.message)
      .join(', ');
    return res.status(400).json({ message: messages });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({ message: `${field} already exists` });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
}
```

### `/backend/src/controllers/authController.js`

```javascript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRE = '7d';

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
}

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
    profileImage: user.profileImage,
    employeeId: user.employeeId
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, phone, password, address } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: 'name, email, phone, and password are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      phone: phone.trim(),
      address: (address || '').trim(),
      password: hashedPassword,
      role: 'user'
    });

    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: formatUser(newUser)
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase()
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: formatUser
```


## License: unknown
https://github.com/anantsaxena09/Nervesparks-backend/blob/1a1c8dcd2d341cf0f1e9931b9c9c61896bda7fc2/backend/controllers/authController.mjs

```
## PART 1: DETECTED PROBLEM FILES

Files currently using localStorage for app data (not just auth/theme):

1. **js/storage.js** - Entire database in `wds_db_v1` (users, pickups, complaints, feedback, payments, notifications)
2. **js/auth.js** - Uses `initDatabase()` and localStorage registration
3. **js/admin-dashboard.js** - Uses `getAllRequests()`, `getCollectors()`, `getUsers()` from localStorage
4. **js/user-dashboard.js** - Uses `createPickupRequest()`, `getPickupRequestsByUser()`, `addComplaint()` from localStorage
5. **js/collector-dashboard.js** - Uses `getAssignedRequests()`, `updateRequestStatus()` from localStorage
6. **js/storage.js** - Lines 216-221: `readDb()` and `writeDb()` using localStorage as full database

---

## PART 2: COMPLETE FILE TREE FOR NEW BACKEND STRUCTURE

```
/backend/
├── src/
│   ├── config/
│   │   ├── db.js (MongoDB connection)
│   │   └── env.js (environment validation)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── complaintController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (updated)
│   │   ├── roleMiddleware.js (updated)
│   │   ├── errorMiddleware.js (new)
│   │   └── validationMiddleware.js (new)
│   ├── models/
│   │   ├── User.js (updated)
│   │   ├── PickupRequest.js (new)
│   │   ├── Complaint.js (new)
│   │   ├── Payment.js (new)
│   │   ├── WasteCategory.js (new)
│   │   └── Notification.js (new)
│   ├── routes/
│   │   ├── authRoutes.js (new)
│   │   ├── userRoutes.js (new)
│   │   ├── pickupRoutes.js (new)
│   │   ├── complaintRoutes.js (new)
│   │   ├── paymentRoutes.js (new)
│   │   └── index.js (main routes)
│   ├── utils/
│   │   ├── validators.js (new)
│   │   ├── helpers.js (new)
│   │   └── seedData.js (new)
│   └── server.js (updated)
├── scripts/
│   ├── initDb.js (new - MongoDB init)
│   └── seed.js (new - seed data)
├── .env.example (new)
├── .env (git-ignored)
├── package.json (already exists)
└── docker-compose.yml (optional)

/frontend/ (existing)
├── js/
│   ├── services/
│   │   ├── api.js (new - API client wrapper)
│   │   └── auth.js (new - auth service)
│   ├── storage.js (refactored - minimal localStorage only)
│   ├── auth.js (refactored)
│   ├── admin-dashboard.js (refactored)
│   ├── user-dashboard.js (refactored)
│   ├── collector-dashboard.js (refactored)
│   └── app.js (updated)
└── .env.example (new - frontend)
```

---

## PART 3: COMPLETE BACKEND CODE

### `/backend/src/config/db.js`

```javascript
import mongoose from 'mongoose';

export async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Using local file storage fallback.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    console.warn('Falling back to file-based storage');
    return null;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}
```

### `/backend/src/config/env.js`

```javascript
export function validateEnv() {
  const required = ['JWT_SECRET'];
  const optional = ['MONGODB_URI', 'CLIENT_URL', 'PORT'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '5000'),
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
```

### `/backend/src/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    profileImage: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'collector'],
      default: 'user'
    },
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for faster queries
userSchema.index({ email: 1, role: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
export default User;
```

### `/backend/src/models/PickupRequest.js`

```javascript
import mongoose from 'mongoose';

const pickupRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    wasteType: {
      type: String,
      enum: ['Organic', 'Plastic', 'E-waste', 'Hazardous'],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    address: {
      type: String,
      required: true
    },
    preferredDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'In-Progress', 'Completed'],
      default: 'Pending'
    },
    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    notes: {
      type: String,
      default: ''
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null
    },
    fee: {
      type: Number,
      default: 50
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

pickupRequestSchema.index({ user: 1, status: 1 });
pickupRequestSchema.index({ collector: 1, status: 1 });
pickupRequestSchema.index({ status: 1 });

const PickupRequest = mongoose.model('PickupRequest', pickupRequestSchema);
export default PickupRequest;
```

### `/backend/src/models/Complaint.js`

```javascript
import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Open', 'In-Progress', 'Resolved', 'Closed'],
      default: 'Open'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    attachments: [String],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    resolution: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

complaintSchema.index({ user: 1, status: 1 });
complaintSchema.index({ status: 1 });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
```

### `/backend/src/models/Payment.js`

```javascript
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    pickupRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupRequest',
      default: null
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    method: {
      type: String,
      enum: ['UPI Payment', 'Bank Payment', 'Card Payment', 'Cash'],
      default: 'UPI Payment'
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Paid'
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true
    },
    reference: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
```

### `/backend/src/models/WasteCategory.js`

```javascript
import mongoose from 'mongoose';

const wasteCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: '📦'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

const WasteCategory = mongoose.model('WasteCategory', wasteCategorySchema);
export default WasteCategory;
```

### `/backend/src/models/Notification.js`

```javascript
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    actionUrl: {
      type: String,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

notificationSchema.index({ user: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
```

### `/backend/src/middleware/authMiddleware.js`

```javascript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    req.user = null;
  }

  next();
}
```

### `/backend/src/middleware/roleMiddleware.js`

```javascript
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
}
```

### `/backend/src/middleware/errorMiddleware.js`

```javascript
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map(e => e.message)
      .join(', ');
    return res.status(400).json({ message: messages });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({ message: `${field} already exists` });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
}
```

### `/backend/src/controllers/authController.js`

```javascript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRE = '7d';

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
}

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
    profileImage: user.profileImage,
    employeeId: user.employeeId
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, phone, password, address } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: 'name, email, phone, and password are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      phone: phone.trim(),
      address: (address || '').trim(),
      password: hashedPassword,
      role: 'user'
    });

    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: formatUser(newUser)
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase()
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: formatUser
```


## License: unknown
https://github.com/ankit261192/ContactApp/blob/11aebad3312343ba7f8adc6d192b8f8ec813b242/WebContent/WEB-INF/view/users.jsp

```
### `/frontend/js/auth.js` (REFACTORED)

```javascript
import { login, register, logout } from './services/auth.js';
import { authAPI } from './services/api.js';

function showMessage(type, text) {
  const target = document.getElementById('authNotice');
  if (!target) return;

  target.className = `notice ${type === 'error' ? 'notice-error' : 'notice-success'}`;
  target.textContent = text;
  target.classList.remove('hidden');
}

function dashboardFor(role) {
  if (role === 'admin') return 'admin-dashboard.html';
  if (role === 'collector') return 'collector-dashboard.html';
  return 'user-dashboard.html';
}

window.addEventListener('DOMContentLoaded', async () => {
  // Check if already logged in
  const session = localStorage.getItem('wds_session_v1');
  if (session) {
    const user = JSON.parse(session);
    window.location.href = dashboardFor(user.role);
    return;
  }

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  // Setup password toggles
  document.querySelectorAll('.password-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-toggle-target');
      const input = document.getElementById(targetId);
      if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
        btn.textContent = input.type === 'password' ? 'Show' : 'Hide';
      }
    });
  });

  // Login form
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(loginForm);

      try {
        const user = await login(
          formData.get('email'),
          formData.get('password')
        );
        showMessage('success', 'Logged in successfully. Redirecting...');
        setTimeout(() => {
          window.location.href = dashboardFor(user.role);
        }, 600);
      } catch (error) {
        showMessage('error', error.message || 'Login failed');
      }
    });
  }

  // Register form
  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(registerForm);
      const password = formData.get('password');
      const confirmPassword = formData.get('confirmPassword');

      if (password.length < 8) {
        showMessage('error', 'Password must be at least 8 characters');
        return;
      }

      if (password !== confirmPassword) {
        showMessage('error', 'Passwords do not match');
        return;
      }

      try {
        await register(
          formData.get('name'),
          formData.get('regEmail'),
          formData.get('phone'),
          password,
          ''
        );
        showMessage('success', 'Registered successfully. Redirecting to login...');
        registerForm.reset();
        setTimeout(() => {
          // Switch to login tab or redirect
          document.getElementById('loginTab')?.click();
        }, 600);
      } catch (error) {
        showMessage('error', error.message || 'Registration failed');
      }
    });
  }
});

// Logout function (used from dashboards)
export function logoutUser() {
  logout();
  window.location.href = 'auth.html';
}
```

### `/frontend/js/admin-dashboard.js` (REFACTORED)

```javascript
import { getSessionUser, logout } from './services/auth.js';
import { userAPI, pickupAPI, complaintAPI, paymentAPI } from './services/api.js';

let localData = { users: [], pickups: [], complaints: [], payments: [] };
let autoRefreshInterval = null;

// Initialize dashboard
window.addEventListener('DOMContentLoaded', async () => {
  const user = getSessionUser();

  if (!user || user.role !== 'admin') {
    window.location.href = 'auth.html';
    return;
  }

  setupUI();
  await loadAllData();
  startAutoRefresh();
});

function setupUI() {
  // Navigation
  const navItems = document.querySelectorAll('[data-nav]');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const sectionId = item.getAttribute('data-nav');
      const sections = document.querySelectorAll('[data-section]');
      sections.forEach(s => s.classList.add('hidden'));
      const section = document.getElementById(sectionId);
      if (section) section.classList.remove('hidden');
    });
  });

  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logout();
      window.location.href = 'auth.html';
    });
  }
}

async function loadAllData() {
  try {
    // Load users
    const usersRes = await userAPI.getAll();
    localData.users = usersRes.users || [];

    // Load pickups
    const pickupsRes = await pickupAPI.getAll({ limit: 100 });
    localData.pickups = pickupsRes.pickups || [];

    // Load complaints
    const complaintsRes = await complaintAPI.getAll({ limit: 100 });
    localData.complaints = complaintsRes.complaints || [];

    // Load payments
    const paymentsRes = await paymentAPI.getAll({ limit: 100 });
    localData.payments = paymentsRes.payments || [];

    renderAll();
  } catch (error) {
    console.error('Error loading data:', error);
    showNotice('error', 'Failed to load data');
  }
}

function renderAll() {
  renderUsers();
  renderCollectors();
  renderAnalytics();
  renderPickups();
  renderComplaints();
  renderPayments();
}

function renderUsers() {
  const tbody = document.getElementById('usersTableBody');
  if (!tbody) return;

  const users = localData.users.filter(u => u.role === 'user');

  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5">No users yet</td></tr>';
    return;
  }

  tbody.innerHTML = users.map(u => `
    <tr>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.phone}</td>
      <td>${u.address}</td>
      <td>
        <button onclick="window.removeUser('${u.id}')" class="btn btn-sm btn-danger">
```


## License: unknown
https://github.com/ankit261192/ContactApp/blob/11aebad3312343ba7f8adc6d192b8f8ec813b242/WebContent/WEB-INF/view/users.jsp

```
### `/frontend/js/auth.js` (REFACTORED)

```javascript
import { login, register, logout } from './services/auth.js';
import { authAPI } from './services/api.js';

function showMessage(type, text) {
  const target = document.getElementById('authNotice');
  if (!target) return;

  target.className = `notice ${type === 'error' ? 'notice-error' : 'notice-success'}`;
  target.textContent = text;
  target.classList.remove('hidden');
}

function dashboardFor(role) {
  if (role === 'admin') return 'admin-dashboard.html';
  if (role === 'collector') return 'collector-dashboard.html';
  return 'user-dashboard.html';
}

window.addEventListener('DOMContentLoaded', async () => {
  // Check if already logged in
  const session = localStorage.getItem('wds_session_v1');
  if (session) {
    const user = JSON.parse(session);
    window.location.href = dashboardFor(user.role);
    return;
  }

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  // Setup password toggles
  document.querySelectorAll('.password-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-toggle-target');
      const input = document.getElementById(targetId);
      if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
        btn.textContent = input.type === 'password' ? 'Show' : 'Hide';
      }
    });
  });

  // Login form
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(loginForm);

      try {
        const user = await login(
          formData.get('email'),
          formData.get('password')
        );
        showMessage('success', 'Logged in successfully. Redirecting...');
        setTimeout(() => {
          window.location.href = dashboardFor(user.role);
        }, 600);
      } catch (error) {
        showMessage('error', error.message || 'Login failed');
      }
    });
  }

  // Register form
  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(registerForm);
      const password = formData.get('password');
      const confirmPassword = formData.get('confirmPassword');

      if (password.length < 8) {
        showMessage('error', 'Password must be at least 8 characters');
        return;
      }

      if (password !== confirmPassword) {
        showMessage('error', 'Passwords do not match');
        return;
      }

      try {
        await register(
          formData.get('name'),
          formData.get('regEmail'),
          formData.get('phone'),
          password,
          ''
        );
        showMessage('success', 'Registered successfully. Redirecting to login...');
        registerForm.reset();
        setTimeout(() => {
          // Switch to login tab or redirect
          document.getElementById('loginTab')?.click();
        }, 600);
      } catch (error) {
        showMessage('error', error.message || 'Registration failed');
      }
    });
  }
});

// Logout function (used from dashboards)
export function logoutUser() {
  logout();
  window.location.href = 'auth.html';
}
```

### `/frontend/js/admin-dashboard.js` (REFACTORED)

```javascript
import { getSessionUser, logout } from './services/auth.js';
import { userAPI, pickupAPI, complaintAPI, paymentAPI } from './services/api.js';

let localData = { users: [], pickups: [], complaints: [], payments: [] };
let autoRefreshInterval = null;

// Initialize dashboard
window.addEventListener('DOMContentLoaded', async () => {
  const user = getSessionUser();

  if (!user || user.role !== 'admin') {
    window.location.href = 'auth.html';
    return;
  }

  setupUI();
  await loadAllData();
  startAutoRefresh();
});

function setupUI() {
  // Navigation
  const navItems = document.querySelectorAll('[data-nav]');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const sectionId = item.getAttribute('data-nav');
      const sections = document.querySelectorAll('[data-section]');
      sections.forEach(s => s.classList.add('hidden'));
      const section = document.getElementById(sectionId);
      if (section) section.classList.remove('hidden');
    });
  });

  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logout();
      window.location.href = 'auth.html';
    });
  }
}

async function loadAllData() {
  try {
    // Load users
    const usersRes = await userAPI.getAll();
    localData.users = usersRes.users || [];

    // Load pickups
    const pickupsRes = await pickupAPI.getAll({ limit: 100 });
    localData.pickups = pickupsRes.pickups || [];

    // Load complaints
    const complaintsRes = await complaintAPI.getAll({ limit: 100 });
    localData.complaints = complaintsRes.complaints || [];

    // Load payments
    const paymentsRes = await paymentAPI.getAll({ limit: 100 });
    localData.payments = paymentsRes.payments || [];

    renderAll();
  } catch (error) {
    console.error('Error loading data:', error);
    showNotice('error', 'Failed to load data');
  }
}

function renderAll() {
  renderUsers();
  renderCollectors();
  renderAnalytics();
  renderPickups();
  renderComplaints();
  renderPayments();
}

function renderUsers() {
  const tbody = document.getElementById('usersTableBody');
  if (!tbody) return;

  const users = localData.users.filter(u => u.role === 'user');

  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5">No users yet</td></tr>';
    return;
  }

  tbody.innerHTML = users.map(u => `
    <tr>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.phone}</td>
      <td>${u.address}</td>
      <td>
        <button onclick="window.removeUser('${u.id}')" class="btn btn-sm btn-danger">
```


## License: unknown
https://github.com/ankit261192/ContactApp/blob/11aebad3312343ba7f8adc6d192b8f8ec813b242/WebContent/WEB-INF/view/users.jsp

```
### `/frontend/js/auth.js` (REFACTORED)

```javascript
import { login, register, logout } from './services/auth.js';
import { authAPI } from './services/api.js';

function showMessage(type, text) {
  const target = document.getElementById('authNotice');
  if (!target) return;

  target.className = `notice ${type === 'error' ? 'notice-error' : 'notice-success'}`;
  target.textContent = text;
  target.classList.remove('hidden');
}

function dashboardFor(role) {
  if (role === 'admin') return 'admin-dashboard.html';
  if (role === 'collector') return 'collector-dashboard.html';
  return 'user-dashboard.html';
}

window.addEventListener('DOMContentLoaded', async () => {
  // Check if already logged in
  const session = localStorage.getItem('wds_session_v1');
  if (session) {
    const user = JSON.parse(session);
    window.location.href = dashboardFor(user.role);
    return;
  }

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  // Setup password toggles
  document.querySelectorAll('.password-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-toggle-target');
      const input = document.getElementById(targetId);
      if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
        btn.textContent = input.type === 'password' ? 'Show' : 'Hide';
      }
    });
  });

  // Login form
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(loginForm);

      try {
        const user = await login(
          formData.get('email'),
          formData.get('password')
        );
        showMessage('success', 'Logged in successfully. Redirecting...');
        setTimeout(() => {
          window.location.href = dashboardFor(user.role);
        }, 600);
      } catch (error) {
        showMessage('error', error.message || 'Login failed');
      }
    });
  }

  // Register form
  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(registerForm);
      const password = formData.get('password');
      const confirmPassword = formData.get('confirmPassword');

      if (password.length < 8) {
        showMessage('error', 'Password must be at least 8 characters');
        return;
      }

      if (password !== confirmPassword) {
        showMessage('error', 'Passwords do not match');
        return;
      }

      try {
        await register(
          formData.get('name'),
          formData.get('regEmail'),
          formData.get('phone'),
          password,
          ''
        );
        showMessage('success', 'Registered successfully. Redirecting to login...');
        registerForm.reset();
        setTimeout(() => {
          // Switch to login tab or redirect
          document.getElementById('loginTab')?.click();
        }, 600);
      } catch (error) {
        showMessage('error', error.message || 'Registration failed');
      }
    });
  }
});

// Logout function (used from dashboards)
export function logoutUser() {
  logout();
  window.location.href = 'auth.html';
}
```

### `/frontend/js/admin-dashboard.js` (REFACTORED)

```javascript
import { getSessionUser, logout } from './services/auth.js';
import { userAPI, pickupAPI, complaintAPI, paymentAPI } from './services/api.js';

let localData = { users: [], pickups: [], complaints: [], payments: [] };
let autoRefreshInterval = null;

// Initialize dashboard
window.addEventListener('DOMContentLoaded', async () => {
  const user = getSessionUser();

  if (!user || user.role !== 'admin') {
    window.location.href = 'auth.html';
    return;
  }

  setupUI();
  await loadAllData();
  startAutoRefresh();
});

function setupUI() {
  // Navigation
  const navItems = document.querySelectorAll('[data-nav]');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const sectionId = item.getAttribute('data-nav');
      const sections = document.querySelectorAll('[data-section]');
      sections.forEach(s => s.classList.add('hidden'));
      const section = document.getElementById(sectionId);
      if (section) section.classList.remove('hidden');
    });
  });

  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logout();
      window.location.href = 'auth.html';
    });
  }
}

async function loadAllData() {
  try {
    // Load users
    const usersRes = await userAPI.getAll();
    localData.users = usersRes.users || [];

    // Load pickups
    const pickupsRes = await pickupAPI.getAll({ limit: 100 });
    localData.pickups = pickupsRes.pickups || [];

    // Load complaints
    const complaintsRes = await complaintAPI.getAll({ limit: 100 });
    localData.complaints = complaintsRes.complaints || [];

    // Load payments
    const paymentsRes = await paymentAPI.getAll({ limit: 100 });
    localData.payments = paymentsRes.payments || [];

    renderAll();
  } catch (error) {
    console.error('Error loading data:', error);
    showNotice('error', 'Failed to load data');
  }
}

function renderAll() {
  renderUsers();
  renderCollectors();
  renderAnalytics();
  renderPickups();
  renderComplaints();
  renderPayments();
}

function renderUsers() {
  const tbody = document.getElementById('usersTableBody');
  if (!tbody) return;

  const users = localData.users.filter(u => u.role === 'user');

  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5">No users yet</td></tr>';
    return;
  }

  tbody.innerHTML = users.map(u => `
    <tr>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.phone}</td>
      <td>${u.address}</td>
      <td>
        <button onclick="window.removeUser('${u.id}')" class="btn btn-sm btn-danger">
```


## License: unknown
https://github.com/ankit261192/ContactApp/blob/11aebad3312343ba7f8adc6d192b8f8ec813b242/WebContent/WEB-INF/view/users.jsp

```
### `/frontend/js/auth.js` (REFACTORED)

```javascript
import { login, register, logout } from './services/auth.js';
import { authAPI } from './services/api.js';

function showMessage(type, text) {
  const target = document.getElementById('authNotice');
  if (!target) return;

  target.className = `notice ${type === 'error' ? 'notice-error' : 'notice-success'}`;
  target.textContent = text;
  target.classList.remove('hidden');
}

function dashboardFor(role) {
  if (role === 'admin') return 'admin-dashboard.html';
  if (role === 'collector') return 'collector-dashboard.html';
  return 'user-dashboard.html';
}

window.addEventListener('DOMContentLoaded', async () => {
  // Check if already logged in
  const session = localStorage.getItem('wds_session_v1');
  if (session) {
    const user = JSON.parse(session);
    window.location.href = dashboardFor(user.role);
    return;
  }

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  // Setup password toggles
  document.querySelectorAll('.password-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-toggle-target');
      const input = document.getElementById(targetId);
      if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
        btn.textContent = input.type === 'password' ? 'Show' : 'Hide';
      }
    });
  });

  // Login form
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(loginForm);

      try {
        const user = await login(
          formData.get('email'),
          formData.get('password')
        );
        showMessage('success', 'Logged in successfully. Redirecting...');
        setTimeout(() => {
          window.location.href = dashboardFor(user.role);
        }, 600);
      } catch (error) {
        showMessage('error', error.message || 'Login failed');
      }
    });
  }

  // Register form
  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(registerForm);
      const password = formData.get('password');
      const confirmPassword = formData.get('confirmPassword');

      if (password.length < 8) {
        showMessage('error', 'Password must be at least 8 characters');
        return;
      }

      if (password !== confirmPassword) {
        showMessage('error', 'Passwords do not match');
        return;
      }

      try {
        await register(
          formData.get('name'),
          formData.get('regEmail'),
          formData.get('phone'),
          password,
          ''
        );
        showMessage('success', 'Registered successfully. Redirecting to login...');
        registerForm.reset();
        setTimeout(() => {
          // Switch to login tab or redirect
          document.getElementById('loginTab')?.click();
        }, 600);
      } catch (error) {
        showMessage('error', error.message || 'Registration failed');
      }
    });
  }
});

// Logout function (used from dashboards)
export function logoutUser() {
  logout();
  window.location.href = 'auth.html';
}
```

### `/frontend/js/admin-dashboard.js` (REFACTORED)

```javascript
import { getSessionUser, logout } from './services/auth.js';
import { userAPI, pickupAPI, complaintAPI, paymentAPI } from './services/api.js';

let localData = { users: [], pickups: [], complaints: [], payments: [] };
let autoRefreshInterval = null;

// Initialize dashboard
window.addEventListener('DOMContentLoaded', async () => {
  const user = getSessionUser();

  if (!user || user.role !== 'admin') {
    window.location.href = 'auth.html';
    return;
  }

  setupUI();
  await loadAllData();
  startAutoRefresh();
});

function setupUI() {
  // Navigation
  const navItems = document.querySelectorAll('[data-nav]');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const sectionId = item.getAttribute('data-nav');
      const sections = document.querySelectorAll('[data-section]');
      sections.forEach(s => s.classList.add('hidden'));
      const section = document.getElementById(sectionId);
      if (section) section.classList.remove('hidden');
    });
  });

  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logout();
      window.location.href = 'auth.html';
    });
  }
}

async function loadAllData() {
  try {
    // Load users
    const usersRes = await userAPI.getAll();
    localData.users = usersRes.users || [];

    // Load pickups
    const pickupsRes = await pickupAPI.getAll({ limit: 100 });
    localData.pickups = pickupsRes.pickups || [];

    // Load complaints
    const complaintsRes = await complaintAPI.getAll({ limit: 100 });
    localData.complaints = complaintsRes.complaints || [];

    // Load payments
    const paymentsRes = await paymentAPI.getAll({ limit: 100 });
    localData.payments = paymentsRes.payments || [];

    renderAll();
  } catch (error) {
    console.error('Error loading data:', error);
    showNotice('error', 'Failed to load data');
  }
}

function renderAll() {
  renderUsers();
  renderCollectors();
  renderAnalytics();
  renderPickups();
  renderComplaints();
  renderPayments();
}

function renderUsers() {
  const tbody = document.getElementById('usersTableBody');
  if (!tbody) return;

  const users = localData.users.filter(u => u.role === 'user');

  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5">No users yet</td></tr>';
    return;
  }

  tbody.innerHTML = users.map(u => `
    <tr>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.phone}</td>
      <td>${u.address}</td>
      <td>
        <button onclick="window.removeUser('${u.id}')" class="btn btn-sm btn-danger">
```


## License: unknown
https://github.com/ankit261192/ContactApp/blob/11aebad3312343ba7f8adc6d192b8f8ec813b242/WebContent/WEB-INF/view/users.jsp

```
### `/frontend/js/auth.js` (REFACTORED)

```javascript
import { login, register, logout } from './services/auth.js';
import { authAPI } from './services/api.js';

function showMessage(type, text) {
  const target = document.getElementById('authNotice');
  if (!target) return;

  target.className = `notice ${type === 'error' ? 'notice-error' : 'notice-success'}`;
  target.textContent = text;
  target.classList.remove('hidden');
}

function dashboardFor(role) {
  if (role === 'admin') return 'admin-dashboard.html';
  if (role === 'collector') return 'collector-dashboard.html';
  return 'user-dashboard.html';
}

window.addEventListener('DOMContentLoaded', async () => {
  // Check if already logged in
  const session = localStorage.getItem('wds_session_v1');
  if (session) {
    const user = JSON.parse(session);
    window.location.href = dashboardFor(user.role);
    return;
  }

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  // Setup password toggles
  document.querySelectorAll('.password-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-toggle-target');
      const input = document.getElementById(targetId);
      if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
        btn.textContent = input.type === 'password' ? 'Show' : 'Hide';
      }
    });
  });

  // Login form
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(loginForm);

      try {
        const user = await login(
          formData.get('email'),
          formData.get('password')
        );
        showMessage('success', 'Logged in successfully. Redirecting...');
        setTimeout(() => {
          window.location.href = dashboardFor(user.role);
        }, 600);
      } catch (error) {
        showMessage('error', error.message || 'Login failed');
      }
    });
  }

  // Register form
  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(registerForm);
      const password = formData.get('password');
      const confirmPassword = formData.get('confirmPassword');

      if (password.length < 8) {
        showMessage('error', 'Password must be at least 8 characters');
        return;
      }

      if (password !== confirmPassword) {
        showMessage('error', 'Passwords do not match');
        return;
      }

      try {
        await register(
          formData.get('name'),
          formData.get('regEmail'),
          formData.get('phone'),
          password,
          ''
        );
        showMessage('success', 'Registered successfully. Redirecting to login...');
        registerForm.reset();
        setTimeout(() => {
          // Switch to login tab or redirect
          document.getElementById('loginTab')?.click();
        }, 600);
      } catch (error) {
        showMessage('error', error.message || 'Registration failed');
      }
    });
  }
});

// Logout function (used from dashboards)
export function logoutUser() {
  logout();
  window.location.href = 'auth.html';
}
```

### `/frontend/js/admin-dashboard.js` (REFACTORED)

```javascript
import { getSessionUser, logout } from './services/auth.js';
import { userAPI, pickupAPI, complaintAPI, paymentAPI } from './services/api.js';

let localData = { users: [], pickups: [], complaints: [], payments: [] };
let autoRefreshInterval = null;

// Initialize dashboard
window.addEventListener('DOMContentLoaded', async () => {
  const user = getSessionUser();

  if (!user || user.role !== 'admin') {
    window.location.href = 'auth.html';
    return;
  }

  setupUI();
  await loadAllData();
  startAutoRefresh();
});

function setupUI() {
  // Navigation
  const navItems = document.querySelectorAll('[data-nav]');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const sectionId = item.getAttribute('data-nav');
      const sections = document.querySelectorAll('[data-section]');
      sections.forEach(s => s.classList.add('hidden'));
      const section = document.getElementById(sectionId);
      if (section) section.classList.remove('hidden');
    });
  });

  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logout();
      window.location.href = 'auth.html';
    });
  }
}

async function loadAllData() {
  try {
    // Load users
    const usersRes = await userAPI.getAll();
    localData.users = usersRes.users || [];

    // Load pickups
    const pickupsRes = await pickupAPI.getAll({ limit: 100 });
    localData.pickups = pickupsRes.pickups || [];

    // Load complaints
    const complaintsRes = await complaintAPI.getAll({ limit: 100 });
    localData.complaints = complaintsRes.complaints || [];

    // Load payments
    const paymentsRes = await paymentAPI.getAll({ limit: 100 });
    localData.payments = paymentsRes.payments || [];

    renderAll();
  } catch (error) {
    console.error('Error loading data:', error);
    showNotice('error', 'Failed to load data');
  }
}

function renderAll() {
  renderUsers();
  renderCollectors();
  renderAnalytics();
  renderPickups();
  renderComplaints();
  renderPayments();
}

function renderUsers() {
  const tbody = document.getElementById('usersTableBody');
  if (!tbody) return;

  const users = localData.users.filter(u => u.role === 'user');

  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5">No users yet</td></tr>';
    return;
  }

  tbody.innerHTML = users.map(u => `
    <tr>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.phone}</td>
      <td>${u.address}</td>
      <td>
        <button onclick="window.removeUser('${u.id}')" class="btn btn-sm btn-danger">
```

