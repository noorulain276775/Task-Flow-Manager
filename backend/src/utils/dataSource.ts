// src/utils/dataSource.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Task } from "../models/task.model.js";
import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "task_manager",
  synchronize: process.env.NODE_ENV === "development",
  logging: process.env.NODE_ENV === "development",
  entities: [Task, Project, User],
  migrations: ["../migrations/*.ts"],
  subscribers: ["src/subscribers/*.ts"],
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});
