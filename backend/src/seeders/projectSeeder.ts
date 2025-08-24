import { AppDataSource } from "../utils/dataSource.js";
import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";

export const seedProjects = async () => {
  try {
    const projectRepository = AppDataSource.getRepository(Project);
    const userRepository = AppDataSource.getRepository(User);

    // Check if projects already exist
    const existingProjects = await projectRepository.count();
    if (existingProjects > 0) {
      console.log("Projects already seeded, skipping...");
      return;
    }

    // Get users for project ownership
    const users = await userRepository.find();
    if (users.length === 0) {
      console.log("No users found, skipping project seeding...");
      return;
    }

    const projects = [
      {
        name: "Website Redesign",
        description: "Complete redesign of company website with modern UI/UX",
        status: "active" as const,
        startDate: new Date("2024-01-15"),
        endDate: new Date("2024-06-30"),
        ownerId: users.find(u => u.role === "manager")?.id
      },
      {
        name: "Mobile App Development",
        description: "iOS and Android app for customer engagement",
        status: "active" as const,
        startDate: new Date("2024-02-01"),
        endDate: new Date("2024-12-31"),
        ownerId: users.find(u => u.role === "admin")?.id
      },
      {
        name: "Database Migration",
        description: "Migrate from legacy system to new cloud database",
        status: "active" as const,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-03-31"),
        ownerId: users.find(u => u.role === "manager")?.id
      },
      {
        name: "Marketing Campaign",
        description: "Q2 marketing campaign for new product launch",
        status: "active" as const,
        startDate: new Date("2024-04-01"),
        endDate: new Date("2024-06-30"),
        ownerId: users.find(u => u.role === "user")?.id
      },
      {
        name: "Security Audit",
        description: "Comprehensive security audit and penetration testing",
        status: "archived" as const,
        startDate: new Date("2023-10-01"),
        endDate: new Date("2023-12-31"),
        ownerId: users.find(u => u.role === "admin")?.id
      }
    ];

    const savedProjects = await projectRepository.save(projects);
    console.log(`Seeded ${savedProjects.length} projects successfully`);
    
    return savedProjects;
  } catch (error) {
    console.error("Error seeding projects:", error);
    throw error;
  }
};
