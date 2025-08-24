import { defineStore } from 'pinia'

export interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  projectId: string
  assignedTo?: string
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
}

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [] as Task[],
    loading: false,
    error: null as string | null
  }),

  getters: {
    getTasksByProject: (state) => (projectId: string) => {
      return state.tasks.filter(task => task.projectId === projectId)
    },
    getTasksByStatus: (state) => (status: Task['status']) => {
      return state.tasks.filter(task => task.status === status)
    }
  },

  actions: {
    async fetchTasks() {
      this.loading = true
      try {
        // API call will be implemented here
        this.loading = false
      } catch (error) {
        this.error = 'Failed to fetch tasks'
        this.loading = false
      }
    },

    async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
      try {
        // API call will be implemented here
        const newTask: Task = {
          ...task,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
        this.tasks.push(newTask)
      } catch (error) {
        this.error = 'Failed to create task'
      }
    },

    async updateTask(id: string, updates: Partial<Task>) {
      try {
        // API call will be implemented here
        const index = this.tasks.findIndex(task => task.id === id)
        if (index !== -1) {
          this.tasks[index] = { ...this.tasks[index], ...updates, updatedAt: new Date() }
        }
      } catch (error) {
        this.error = 'Failed to update task'
      }
    },

    async deleteTask(id: string) {
      try {
        // API call will be implemented here
        this.tasks = this.tasks.filter(task => task.id !== id)
      } catch (error) {
        this.error = 'Failed to delete task'
      }
    }
  }
})
