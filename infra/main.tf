terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.2"
    }
  }
}

provider "docker" {}

# Custom network for container communication
resource "docker_network" "task_manager_network" {
  name = "task-manager-network"
}

# Docker Images
resource "docker_image" "postgres" {
  name = "postgres:15-alpine"
}

resource "docker_image" "redis" {
  name = "redis:7-alpine"
}

resource "docker_image" "pgadmin" {
  name = "dpage/pgadmin4:latest"
}

# Postgres container
resource "docker_container" "postgres" {
  name  = "taskmanager-postgres"
  image = docker_image.postgres.name
  
  networks_advanced {
    name = docker_network.task_manager_network.name
  }
  
  ports {
    internal = 5432
    external = var.postgres_port
  }
  env = [
    "POSTGRES_USER=${var.db_user}",
    "POSTGRES_PASSWORD=${var.db_password}",
    "POSTGRES_DB=${var.db_name}"
  ]
}

# Redis Container
resource "docker_container" "redis" {
  name  = "taskmanager-redis"
  image = docker_image.redis.name
  
  networks_advanced {
    name = docker_network.task_manager_network.name
  }
  
  ports {
    internal = 6379
    external = var.redis_port
  }
}

# pgAdmin container
resource "docker_container" "pgadmin" {
  name  = "taskmanager-pgadmin"
  image = docker_image.pgadmin.name
  
  networks_advanced {
    name = docker_network.task_manager_network.name
  }
  
  ports {
    internal = 80
    external = var.pgadmin_port
  }
  env = [
    "PGADMIN_DEFAULT_EMAIL=${var.pgadmin_email}",
    "PGADMIN_DEFAULT_PASSWORD=${var.pgadmin_password}"
  ]
  depends_on = [docker_container.postgres]
}

# Backend Dev Container (Node + TS)
resource "docker_container" "backend_dev" {
  name  = "taskmanager-backend-dev"
  image = "node:18-alpine"

  networks_advanced {
    name = docker_network.task_manager_network.name
  }

  ports {
    internal = 3000
    external = 3000
  }

  env = [
    "DB_HOST=taskmanager-postgres",
    "DB_PORT=${var.postgres_port}",
    "DB_USERNAME=${var.db_user}",
    "DB_PASSWORD=${var.db_password}",
    "DB_NAME=${var.db_name}",
    "REDIS_HOST=taskmanager-redis",
    "REDIS_PORT=${var.redis_port}"
  ]

  # Mount backend source code for live dev
  mounts {
    type   = "bind"
    source = "C:/Users/nooru/Downloads/GitHubWork/Task-Flow-Manager/backend"
    target = "/app"
  }

  # Run dev server with build-and-run approach to avoid ES module loader issues
  command = [
    "sh", "-c",
    "cd /app && npm install && npx nodemon --watch './src' --ext ts,js --exec 'npm run build && node dist/server.js'"
  ]

  depends_on = [
    docker_container.postgres,
    docker_container.redis
  ]
}
