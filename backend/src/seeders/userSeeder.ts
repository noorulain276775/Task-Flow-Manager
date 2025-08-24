import { AppDataSource } from "../utils/dataSource.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const seedUsers = async () => {
  try {
    const userRepository = AppDataSource.getRepository(User);

    // Check if users already exist
    const existingUsers = await userRepository.count();
    if (existingUsers > 0) {
      console.log("Users already seeded, skipping...");
      return;
    }

    const users = [
      {
        email: "admin@taskmanager.com",
        password: await bcrypt.hash("admin123", 12),
        name: "Admin User",
        role: "admin" as const,
        isActive: true
      },
      {
        email: "manager@taskmanager.com",
        password: await bcrypt.hash("manager123", 12),
        name: "Project Manager",
        role: "manager" as const,
        isActive: true
      },
      {
        email: "user@taskmanager.com",
        password: await bcrypt.hash("user123", 12),
        name: "Regular User",
        role: "user" as const,
        isActive: true
      },
      {
        email: "john.doe@taskmanager.com",
        password: await bcrypt.hash("john123", 12),
        name: "John Doe",
        role: "user" as const,
        isActive: true
      },
      {
        email: "jane.smith@taskmanager.com",
        password: await bcrypt.hash("jane123", 12),
        name: "Jane Smith",
        role: "manager" as const,
        isActive: true
      }
    ];

    const savedUsers = await userRepository.save(users);
    console.log(`✅ Seeded ${savedUsers.length} users successfully`);
    
    return savedUsers;
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    throw error;
  }
};
