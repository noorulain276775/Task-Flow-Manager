import { defineStore } from 'pinia'

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user' | 'manager'
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
    loading: false,
    error: null as string | null
  }),

  getters: {
    getUserRole: (state) => state.user?.role || 'user',
    isAdmin: (state) => state.user?.role === 'admin',
    isManager: (state) => state.user?.role === 'manager'
  },

  actions: {
    async login(email: string, password: string) {
      this.loading = true
      this.error = null
      try {
        // API call will be implemented here
        // Mock user for now
        const mockUser: User = {
          id: '1',
          email,
          name: 'John Doe',
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        }
        this.user = mockUser
        this.isAuthenticated = true
        this.loading = false
      } catch (error) {
        this.error = 'Login failed'
        this.loading = false
      }
    },

    async logout() {
      try {
        // API call will be implemented here
        this.user = null
        this.isAuthenticated = false
      } catch (error) {
        this.error = 'Logout failed'
      }
    },

    async fetchUserProfile() {
      this.loading = true
      try {
        // API call will be implemented here
        this.loading = false
      } catch (error) {
        this.error = 'Failed to fetch user profile'
        this.loading = false
      }
    },

    async updateProfile(updates: Partial<User>) {
      try {
        // API call will be implemented here
        if (this.user) {
          this.user = { ...this.user, ...updates, updatedAt: new Date() }
        }
      } catch (error) {
        this.error = 'Failed to update profile'
      }
    }
  }
})
