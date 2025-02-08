import { mongoose, bcrypt, faker } from "#packages/index.js";

import { User } from "#models/index.js"; // adjust the model import path if necessary
import utilities from "#utilities/index.js";
import env from "#env/index.js"; // adjust this import as needed

const { logger } = utilities;
const { DATABASE_URI } = env;

async function main() {
  try {
    // Connect to the database
    await mongoose.connect(DATABASE_URI);
    logger.info("Connected to MongoDB to seed database.");

    // Define the number of users to create (must be an even number)
    const totalUsers = 20;

    // Default password for all users
    let defaultPassword = "12345678";
    const salt = await bcrypt.genSalt(10);
    defaultPassword = await bcrypt.hash(defaultPassword, salt);

    const users = [];

    // Create user accounts
    for (let i = 0; i < totalUsers; i++) {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const email = faker.internet.email(firstName, lastName);

      users.push({
        firstName,
        lastName,
        email,
        password: defaultPassword,
        role: "user",
        isApproved: false,
        isEmailVerified: true,
      });
    }

    // Bulk insert the users
    const insertedUsers = await User.insertMany(users);
    logger.info(`Inserted ${insertedUsers.length} users into the database.`);
  } catch (error) {
    logger.error("Error adding bulk users:", error);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
    logger.warn("Disconnected from MongoDB");
  }
}

main();
