import { AppDataSource } from "../utils/dataSource.js";
import { seedUsers } from "./userSeeder.js";
import { seedProjects } from "./projectSeeder.js";
import { seedTasks } from "./taskSeeder.js";

export const runSeeders = async () => {
  try {
    console.log("Starting database seeding...");
    
    // Initialize database connection
    await AppDataSource.initialize();
    console.log("Database connected for seeding");

    // Run seeders in order (due to dependencies)
    await seedUsers();
    await seedProjects();
    await seedTasks();

    console.log("All seeders completed successfully!");
    
    // Close connection
    await AppDataSource.destroy();
    console.log("Database connection closed");
    
  } catch (error) {
    console.error("Error running seeders:", error);
    process.exit(1);
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSeeders();
}
