// src/utils/dataSource.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Task } from "../models/task.model.js";
import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'DB_HOST', 'DB_PORT', 'DB_USERNAME', 
  'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST!,
  port: parseInt(process.env.DB_PORT!),
  username: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  synchronize: process.env.NODE_ENV === "development",
  logging: process.env.NODE_ENV === "development",
  entities: [Task, Project, User],
  // migrations: ["../migrations/*.ts"], // Not needed when synchronize is true
  subscribers: ["src/subscribers/*.ts"],
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});
