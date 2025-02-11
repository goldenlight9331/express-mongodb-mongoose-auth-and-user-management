import { mongoose, bcrypt, faker, crypto } from "#packages/index.js";

import { User } from "#models/index.js";
import { logger, env } from "#config/index.js";

const { DATABASE_URI } = env;

async function main() {
  try {
    await mongoose.connect(DATABASE_URI);
    logger.info("Connected to MongoDB to seed database.");

    const totalUsers = 20;
    const halfCount = totalUsers / 2;

    let defaultPassword = "12345678";
    const salt = await bcrypt.genSalt(10);
    defaultPassword = await bcrypt.hash(defaultPassword, salt);

    const users = [];

    for (let i = 0; i < halfCount; i++) {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const email = faker.internet.email(firstName, lastName);
      const username =
        `${firstName}${crypto.createHash("sha256").update(email).digest("hex").substring(0, 8)}`.toLowerCase();

      users.push({
        firstName,
        lastName,
        username,
        email,
        password: defaultPassword,
        role: "tutor",
        isEmailVerified: true,
      });
    }

    for (let i = 0; i < halfCount; i++) {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const email = faker.internet.email(firstName, lastName);
      const username =
        `${firstName}${crypto.createHash("sha256").update(email).digest("hex").substring(0, 8)}`.toLowerCase();

      users.push({
        firstName,
        lastName,
        username,
        email,
        password: defaultPassword,
        role: "student",
        isEmailVerified: true,
      });
    }

    const insertedUsers = await User.insertMany(users);
    logger.info(`Inserted ${insertedUsers.length} users into the database.`);
  } catch (error) {
    logger.error("Error adding bulk users:", error);
  } finally {
    await mongoose.disconnect();
    logger.warn("Disconnected from MongoDB");
  }
}

main();
