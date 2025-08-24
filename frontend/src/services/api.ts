import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (userData: any) =>
    api.post('/auth/register', userData),
  logout: () =>
    api.post('/auth/logout')
}

// User API
export const userAPI = {
  getProfile: () =>
    api.get('/users/profile'),
  updateProfile: (userData: any) =>
    api.put('/users/profile', userData),
  getUsers: () =>
    api.get('/users')
}

// Project API
export const projectAPI = {
  getProjects: () =>
    api.get('/projects'),
  getProject: (id: string) =>
    api.get(`/projects/${id}`),
  createProject: (projectData: any) =>
    api.post('/projects', projectData),
  updateProject: (id: string, projectData: any) =>
    api.put(`/projects/${id}`, projectData),
  deleteProject: (id: string) =>
    api.delete(`/projects/${id}`)
}

// Task API
export const taskAPI = {
  getTasks: (projectId?: string) =>
    api.get('/tasks', { params: { projectId } }),
  getTask: (id: string) =>
    api.get(`/tasks/${id}`),
  createTask: (taskData: any) =>
    api.post('/tasks', taskData),
  updateTask: (id: string, taskData: any) =>
    api.put(`/tasks/${id}`, taskData),
  deleteTask: (id: string) =>
    api.delete(`/tasks/${id}`),
  updateTaskStatus: (id: string, status: string) =>
    api.patch(`/tasks/${id}/status`, { status })
}

export default api
