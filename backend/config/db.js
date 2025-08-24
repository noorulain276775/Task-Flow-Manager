import { DataSource } from "typeorm";
import { User } from "../src/models/user.model.js";
import { Project } from "../src/models/project.model.js";
import { Task } from "../src/models/task.model.js";
import dotenv from "dotenv";
dotenv.config();
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
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: process.env.NODE_ENV === "development",
    logging: process.env.NODE_ENV === "development",
    entities: [User, Project, Task],
    migrations: ["src/migrations/*.ts"],
    subscribers: ["src/subscribers/*.ts"],
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});
export default AppDataSource;
//# sourceMappingURL=db.js.map