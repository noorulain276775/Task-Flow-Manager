# Task Flow Manager

A comprehensive task and project management application built with modern web technologies, featuring real-time collaboration, drag-and-drop task management, and robust user authentication.

## Project Overview

Task Flow Manager is a full-stack web application designed to streamline project workflows, task management, and team collaboration. The application provides an intuitive interface for managing tasks, projects, and user interactions with real-time updates and notifications.

## Architecture

### Frontend
- **Framework**: Vue.js 3 with Composition API
- **Language**: TypeScript
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Real-time Communication**: WebSocket integration
- **UI Components**: Custom responsive components with drag-and-drop functionality

### Backend
- **Runtime**: Node.js with TypeScript
- **Web Framework**: Express.js
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with bcrypt password hashing
- **Real-time**: Socket.io for WebSocket connections
- **Security**: Helmet, CORS, and input validation
- **Logging**: Morgan for HTTP request logging

## Features

### Core Functionality
- **User Management**: Registration, authentication, and role-based access control
- **Project Management**: Create, update, and organize projects with status tracking
- **Task Management**: Comprehensive task CRUD operations with priority and status
- **Real-time Updates**: Live task updates and notifications via WebSocket
- **Responsive Design**: Mobile-first approach with modern UI/UX

### Advanced Features
- **Drag & Drop**: Intuitive task status management with Kanban-style boards
- **Task Filtering**: Filter tasks by project, status, priority, and assignee
- **Notification System**: Real-time alerts for task updates and project changes
- **Role-based Access**: Admin, Manager, and User roles with appropriate permissions
- **API Security**: JWT authentication with secure password handling

## Project Structure

```
Task-Flow-Manager/
├── frontend/                 # Vue.js 3 frontend application
│   ├── src/
│   │   ├── components/      # Reusable Vue components
│   │   ├── views/           # Page components
│   │   ├── store/           # Pinia state management
│   │   ├── router/          # Vue Router configuration
│   │   └── services/        # API and WebSocket services
│   ├── package.json         # Frontend dependencies
│   └── tsconfig.json        # TypeScript configuration
├── backend/                  # Node.js backend API
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # TypeORM entity models
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic services
│   │   └── utils/           # Utility functions and configurations
│   ├── config/              # Database and AWS configurations
│   ├── migrations/          # Database migration files
│   ├── seeders/             # Database seed data
│   └── package.json         # Backend dependencies
└── README.md                # Project documentation
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- Redis (optional, for caching)
- npm or yarn package manager

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

The backend API will be available at `http://localhost:3000`

### Environment Configuration
Create `.env` files in both frontend and backend directories with appropriate configuration values.

## Development

### Available Scripts

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

#### Backend
- `npm run dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Comprehensive error handling
- Input validation and sanitization

## API Endpoints

### Authentication
- `POST /api/users/login` - User authentication
- `POST /api/users` - User registration

### Users
- `GET /api/users` - Get all users
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Database Schema

### Users
- UUID primary key
- Email (unique)
- Password (hashed)
- Name
- Role (admin, manager, user)
- Avatar URL
- Active status
- Timestamps

### Projects
- UUID primary key
- Name
- Description
- Status (active, completed, archived)
- Start/End dates
- Owner ID (foreign key to users)
- Timestamps

### Tasks
- UUID primary key
- Title
- Description
- Priority (low, medium, high)
- Status (pending, in-progress, done)
- Project ID (foreign key to projects)
- Assigned user ID (foreign key to users)
- Due date
- Timestamps

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Helmet security headers
- Input validation and sanitization
- Role-based access control
- Secure WebSocket connections

## Deployment

### Docker Support
Both frontend and backend include Dockerfile configurations for containerized deployment.

### Production Considerations
- Environment variable management
- Database connection pooling
- Logging and monitoring
- Error tracking
- Performance optimization
- SSL/TLS configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For questions and support, please refer to the project documentation or create an issue in the repository.
