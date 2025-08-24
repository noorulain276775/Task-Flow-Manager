import { AppDataSource } from "../utils/dataSource.js";
import { Task } from "../models/task.model.js";
import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";

export const seedTasks = async () => {
  try {
    const taskRepository = AppDataSource.getRepository(Task);
    const projectRepository = AppDataSource.getRepository(Project);
    const userRepository = AppDataSource.getRepository(User);

    // Check if tasks already exist
    const existingTasks = await taskRepository.count();
    if (existingTasks > 0) {
      console.log("Tasks already seeded, skipping...");
      return;
    }

    // Get projects and users for task relationships
    const projects = await projectRepository.find();
    const users = await userRepository.find();
    
    if (projects.length === 0 || users.length === 0) {
      console.log("No projects or users found, skipping task seeding...");
      return;
    }

    const tasks = [
      // Website Redesign Tasks
      {
        title: "Design Homepage Layout",
        description: "Create wireframes and mockups for homepage redesign",
        priority: "high" as const,
        status: "pending" as const,
        projectId: projects.find(p => p.name === "Website Redesign")?.id,
        assignedTo: users.find(u => u.role === "manager")?.id,
        dueDate: new Date("2024-03-15")
      },
      {
        title: "Implement Responsive Design",
        description: "Ensure website works on all device sizes",
        priority: "high" as const,
        status: "pending" as const,
        projectId: projects.find(p => p.name === "Website Redesign")?.id,
        assignedTo: users.find(u => u.role === "user")?.id,
        dueDate: new Date("2024-04-30")
      },
      {
        title: "Content Migration",
        description: "Move existing content to new design structure",
        priority: "medium" as const,
        status: "pending" as const,
        projectId: projects.find(p => p.name === "Website Redesign")?.id,
        assignedTo: users.find(u => u.role === "user")?.id,
        dueDate: new Date("2024-05-15")
      },

      // Mobile App Development Tasks
      {
        title: "Setup Development Environment",
        description: "Configure React Native development setup",
        priority: "high" as const,
        status: "done" as const,
        projectId: projects.find(p => p.name === "Mobile App Development")?.id,
        assignedTo: users.find(u => u.role === "admin")?.id,
        dueDate: new Date("2024-02-15")
      },
      {
        title: "Design App UI/UX",
        description: "Create app design mockups and user flows",
        priority: "high" as const,
        status: "pending" as const,
        projectId: projects.find(p => p.name === "Mobile App Development")?.id,
        assignedTo: users.find(u => u.role === "manager")?.id,
        dueDate: new Date("2024-04-30")
      },
      {
        title: "Implement Authentication",
        description: "Add user login and registration functionality",
        priority: "high" as const,
        status: "pending" as const,
        projectId: projects.find(p => p.name === "Mobile App Development")?.id,
        assignedTo: users.find(u => u.role === "user")?.id,
        dueDate: new Date("2024-06-30")
      },

      // Database Migration Tasks
      {
        title: "Backup Existing Data",
        description: "Create full backup of current database",
        priority: "high" as const,
        status: "done" as const,
        projectId: projects.find(p => p.name === "Database Migration")?.id,
        assignedTo: users.find(u => u.role === "admin")?.id,
        dueDate: new Date("2024-01-15")
      },
      {
        title: "Test Migration Scripts",
        description: "Validate data migration in staging environment",
        priority: "high" as const,
        status: "pending" as const,
        projectId: projects.find(p => p.name === "Database Migration")?.id,
        assignedTo: users.find(u => u.role === "manager")?.id,
        dueDate: new Date("2024-02-28")
      },

      // Marketing Campaign Tasks
      {
        title: "Create Campaign Strategy",
        description: "Develop comprehensive marketing strategy document",
        priority: "medium" as const,
        status: "pending" as const,
        projectId: projects.find(p => p.name === "Marketing Campaign")?.id,
        assignedTo: users.find(u => u.role === "user")?.id,
        dueDate: new Date("2024-04-15")
      },
      {
        title: "Design Marketing Materials",
        description: "Create banners, social media posts, and email templates",
        priority: "medium" as const,
        status: "pending" as const,
        projectId: projects.find(p => p.name === "Marketing Campaign")?.id,
        assignedTo: users.find(u => u.role === "user")?.id,
        dueDate: new Date("2024-05-15")
      }
    ];

    const savedTasks = await taskRepository.save(tasks);
    console.log(`Seeded ${savedTasks.length} tasks successfully`);
    
    return savedTasks;
  } catch (error) {
    console.error("Error seeding tasks:", error);
    throw error;
  }
};
