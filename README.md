# Task Flow Manager

A comprehensive task management application built with modern web technologies and **Terraform** infrastructure automation.

## Architecture Overview

This project implements a **microservices architecture** with containerized services, **Terraform** infrastructure provisioning, and real-time communication capabilities.

### Technology Stack

#### Backend Services
- **Node.js 18** with **TypeScript** for type safety
- **Express.js** framework for RESTful API endpoints
- **TypeORM** for database operations and migrations
- **PostgreSQL 15** as the primary database
- **Redis 7** for caching and session management
- **Socket.IO** for real-time WebSocket communication

#### Frontend Application
- **Vue.js 3** with **TypeScript** for reactive UI components
- **Vue Router** for client-side navigation
- **Pinia** for state management
- **Modern CSS** with responsive design principles

#### **Terraform Infrastructure & DevOps**
- **Terraform** for Infrastructure as Code (IaC)
- **Docker** for containerization and consistent environments
- **Custom Docker networks** for secure inter-service communication
- **Automated container orchestration** via Terraform

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Vue.js)     │◄──►│   (Node.js)     │◄──►│  (PostgreSQL)   │
│   Port: 80      │    │   Port: 3000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │     Redis       │
                       │   Port: 6379    │
                       └─────────────────┘
```

## **Terraform Infrastructure Components**

### Container Orchestration
- **Custom Docker Network**: `task-manager-network` for secure inter-container communication
- **Service Discovery**: Automatic hostname resolution between containers
- **Port Mapping**: Exposed services accessible from host machine
- **Resource Isolation**: Each service runs in its own container with defined dependencies

### Database Layer
- **PostgreSQL 15**: Primary relational database with automatic schema synchronization
- **TypeORM Integration**: Entity-based data modeling with automatic migrations
- **Connection Pooling**: Optimized database connections for high performance
- **Environment-based Configuration**: Development vs production database settings

### Caching & Sessions
- **Redis 7**: In-memory data store for caching and session management
- **WebSocket State**: Real-time communication state persistence
- **Performance Optimization**: Reduced database load through intelligent caching

## Getting Started

### Prerequisites
- **Docker Desktop** (Windows/Mac) or **Docker Engine** (Linux)
- **Terraform** CLI version 1.0+
- **Node.js** 18+ (for local development)
- **Git** for version control

### **Quick Start with Terraform Infrastructure as Code**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Task-Flow-Manager
   ```

2. **Navigate to infrastructure directory**
   ```bash
   cd infra
   ```

3. **Initialize Terraform**
   ```bash
   terraform init
   ```

4. **Deploy the infrastructure**
   ```bash
   terraform apply -auto-approve
   ```

5. **Access the application**
   - **Frontend**: http://localhost:80
   - **Backend API**: http://localhost:3000
   - **Database Admin**: http://localhost:5050 (pgAdmin)
   - **Health Check**: http://localhost:3000/health

### Development Environment

The application automatically sets up a development environment with:
- **Hot Reload**: Backend TypeScript compilation on file changes
- **Live Database**: Automatic schema synchronization
- **Container Networking**: Seamless service communication
- **Environment Variables**: Pre-configured for development

## API Endpoints

### Core Services
- `GET /health` - System health check
- `GET /api/tasks` - Retrieve all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update existing task
- `DELETE /api/tasks/:id` - Remove task

### Project Management
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project details
- `DELETE /api/projects/:id` - Remove project

### User Management
- `GET /api/users` - Retrieve user list
- `POST /api/users` - User registration
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Deactivate user

## Real-time Features

### WebSocket Events
- **Task Updates**: Real-time task status changes
- **Project Collaboration**: Live project modifications
- **User Presence**: Online user status indicators
- **Notifications**: Instant system alerts

## Database Schema

### Core Entities
- **Users**: Authentication, roles, and profile management
- **Projects**: Project definitions with status tracking
- **Tasks**: Individual work items with priority and assignment
- **Relationships**: Foreign key constraints for data integrity

### Data Types
- **UUID Primary Keys**: Globally unique identifiers
- **Enums**: Status and priority constraints
- **Timestamps**: Automatic creation and update tracking
- **Soft Deletes**: Data preservation with logical removal

## Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure stateless authentication
- **Role-based Access Control**: Admin, Manager, and User roles
- **Password Hashing**: Bcrypt encryption for user credentials
- **CORS Configuration**: Cross-origin request security

### Infrastructure Security
- **Container Isolation**: Process and network separation
- **Custom Networks**: Controlled inter-service communication
- **Environment Variables**: Secure configuration management
- **Port Restrictions**: Limited external access points

## Performance Optimization

### Backend Optimizations
- **TypeScript Compilation**: Pre-compiled JavaScript for production
- **Database Indexing**: Optimized query performance
- **Connection Pooling**: Efficient database resource utilization
- **Caching Strategy**: Redis-based performance enhancement

### Frontend Optimizations
- **Component Lazy Loading**: On-demand resource loading
- **State Management**: Efficient data flow with Pinia
- **Responsive Design**: Mobile-first user experience
- **Bundle Optimization**: Minimized JavaScript payloads

## Monitoring & Health Checks

### System Monitoring
- **Health Endpoints**: Real-time service status
- **Database Connectivity**: Connection pool monitoring
- **Redis Status**: Cache service availability
- **Container Health**: Docker container status monitoring

### Logging & Debugging
- **Structured Logging**: Consistent log format across services
- **Error Tracking**: Comprehensive error handling and reporting
- **Development Tools**: Hot reload and debugging capabilities
- **Performance Metrics**: Response time and throughput monitoring

## **Terraform Deployment & Scaling**

### Container Orchestration
- **Docker Compose Alternative**: Terraform-based container management
- **Service Dependencies**: Automatic startup ordering
- **Resource Allocation**: Configurable container resources
- **Network Configuration**: Custom Docker networks for security

### Scalability Considerations
- **Horizontal Scaling**: Multiple container instances
- **Load Balancing**: Distributed request handling
- **Database Scaling**: Read replicas and connection pooling
- **Cache Distribution**: Redis cluster for high availability

## Development Workflow

### Code Quality
- **TypeScript**: Static type checking and IntelliSense
- **ESLint**: Code style and quality enforcement
- **Prettier**: Consistent code formatting
- **Git Hooks**: Pre-commit code validation

### Testing Strategy
- **Unit Tests**: Individual component testing
- **Integration Tests**: Service interaction validation
- **End-to-End Tests**: Complete user workflow testing
- **Performance Tests**: Load and stress testing

## Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb style guide
- **Prettier**: Consistent formatting
- **Git**: Conventional commit messages

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For technical support or questions:
- **Issues**: GitHub issue tracker
- **Documentation**: Inline code documentation
- **Community**: Developer forums and discussions

---

**Built with modern cloud-native technologies and Terraform infrastructure automation for scalable, maintainable applications.**
