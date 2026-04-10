import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectMongo } from "../src/config/mongo.js";
import { User } from "../src/models/User.js";
import { Collector } from "../src/models/Collector.js";
import { WasteCategory } from "../src/models/WasteCategory.js";

async function createUserIfMissing({ name, email, password, role, employeeId = "", preferredLanguage = "en" }) {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return existing;
  }

  return User.create({
    name,
    email: email.toLowerCase(),
    employeeId: employeeId ? String(employeeId).trim().toUpperCase() : undefined,
    passwordHash: await bcrypt.hash(password, 10),
    role,
    preferredLanguage,
    chatbotState: {
      mode: "",
      step: "",
      draftComplaint: {
        description: "",
        location: "",
        imageUrl: ""
      }
    }
  });
}

async function seedUsersAndCollectors() {
  const admin = await createUserIfMissing({
    name: "System Admin",
    email: "admin@gmail.com",
    employeeId: "ADM-0001",
    password: "Admin@123",
    role: "admin"
  });

  const collectorUser = await createUserIfMissing({
    name: "Field Collector",
    email: "collector@wds.local",
    password: "Collector@123",
    role: "collector"
  });

  await createUserIfMissing({
    name: "Resident User",
    email: "user@wds.local",
    password: "User@123",
    role: "user"
  });

  const collectorProfile = await Collector.findOne({ userId: collectorUser._id });
  if (!collectorProfile) {
    await Collector.create({
      userId: collectorUser._id,
      vehicleId: "ECO-102",
      zone: "North Zone",
      assignedTasks: []
    });
  }

  return { admin, collectorUser };
}

async function seedWasteCategories() {
  const categories = [
    { name: "Organic", description: "Food and biodegradable waste" },
    { name: "Plastic", description: "Bottles, packaging and plastic items" },
    { name: "E-waste", description: "Electronic and battery waste" },
    { name: "Hazardous", description: "Medical, chemical and unsafe waste" }
  ];

  for (const category of categories) {
    await WasteCategory.updateOne(
      { name: category.name },
      { $setOnInsert: category },
      { upsert: true }
    );
  }
}

async function run() {
  try {
    await connectMongo();

    await Promise.all([seedUsersAndCollectors(), seedWasteCategories()]);

    const [userCount, collectorCount, categoryCount] = await Promise.all([
      User.countDocuments(),
      Collector.countDocuments(),
      WasteCategory.countDocuments()
    ]);

    console.log("Mongo database initialized successfully.");
    console.log(`Users: ${userCount}`);
    console.log(`Collectors: ${collectorCount}`);
    console.log(`Waste categories: ${categoryCount}`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to initialize Mongo database:", error.message);
    process.exit(1);
  }
}

run();
