import { AppDataSource } from './dist/utils/dataSource.js';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('✅ Database connected for seeding');

    // Get repositories
    const userRepo = AppDataSource.getRepository('User');
    const projectRepo = AppDataSource.getRepository('Project');
    const taskRepo = AppDataSource.getRepository('Task');

    // Check if data already exists
    const existingUsers = await userRepo.count();
    if (existingUsers > 0) {
      console.log('Users already seeded, skipping...');
      return;
    }

    // Create users
    const users = [
      {
        email: 'admin@taskmanager.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzqKqK', // admin123
        name: 'Admin User',
        role: 'admin',
        isActive: true
      },
      {
        email: 'manager@taskmanager.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzqKqK', // manager123
        name: 'Project Manager',
        role: 'manager',
        isActive: true
      },
      {
        email: 'user@taskmanager.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzqKqK', // user123
        name: 'Regular User',
        role: 'user',
        isActive: true
      }
    ];

    const savedUsers = await userRepo.save(users);
    console.log(`✅ Seeded ${savedUsers.length} users successfully`);

    // Create projects
    const projects = [
      {
        name: 'Website Redesign',
        description: 'Complete redesign of company website with modern UI/UX',
        status: 'active',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-06-30'),
        ownerId: savedUsers.find(u => u.role === 'manager')?.id
      },
      {
        name: 'Mobile App Development',
        description: 'iOS and Android app for customer engagement',
        status: 'active',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-12-31'),
        ownerId: savedUsers.find(u => u.role === 'admin')?.id
      },
      {
        name: 'Database Migration',
        description: 'Migrate from legacy system to new cloud database',
        status: 'active',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-03-31'),
        ownerId: savedUsers.find(u => u.role === 'manager')?.id
      }
    ];

    const savedProjects = await projectRepo.save(projects);
    console.log(`✅ Seeded ${savedProjects.length} projects successfully`);

    // Create tasks
    const tasks = [
      {
        title: 'Design Homepage Layout',
        description: 'Create modern homepage design with responsive layout',
        priority: 'high',
        status: 'pending',
        projectId: savedProjects.find(p => p.name === 'Website Redesign')?.id,
        assignedTo: savedUsers.find(u => u.role === 'manager')?.id,
        dueDate: new Date('2024-03-15')
      },
      {
        title: 'Setup Development Environment',
        description: 'Configure React Native development setup',
        priority: 'high',
        status: 'done',
        projectId: savedProjects.find(p => p.name === 'Mobile App Development')?.id,
        assignedTo: savedUsers.find(u => u.role === 'admin')?.id,
        dueDate: new Date('2024-02-15')
      },
      {
        title: 'Backup Existing Data',
        description: 'Create full backup of current database',
        priority: 'high',
        status: 'done',
        projectId: savedProjects.find(p => p.name === 'Database Migration')?.id,
        assignedTo: savedUsers.find(u => u.role === 'admin')?.id,
        dueDate: new Date('2024-01-15')
      }
    ];

    const savedTasks = await taskRepo.save(tasks);
    console.log(`✅ Seeded ${savedTasks.length} tasks successfully`);

    console.log('🎉 All seeders completed successfully!');
    
    // Close connection
    await AppDataSource.destroy();
    console.log('🔌 Database connection closed');
    
  } catch (error) {
    console.error('❌ Error running seeders:', error);
    process.exit(1);
  }
}

seedDatabase();
