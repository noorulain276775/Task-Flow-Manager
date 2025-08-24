<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>Task Flow Manager</h1>
        <p>Sign in to your account</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="Enter your email"
            :disabled="loading"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="Enter your password"
            :disabled="loading"
          />
        </div>
        
        <div class="form-options">
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="rememberMe"
              :disabled="loading"
            />
            <span>Remember me</span>
          </label>
          
          <a href="#" class="forgot-password">Forgot password?</a>
        </div>
        
        <button
          type="submit"
          class="login-btn"
          :disabled="loading"
        >
          <span v-if="loading" class="loading-spinner"></span>
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </form>
      
      <div class="login-footer">
        <p>Don't have an account? <a href="#" @click="showRegister = true">Sign up</a></p>
      </div>
    </div>
    
    <!-- Register Modal -->
    <div v-if="showRegister" class="modal-overlay" @click="showRegister = false">
      <div class="modal" @click.stop>
        <h3>Create Account</h3>
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label for="regName">Full Name</label>
            <input
              id="regName"
              v-model="registerData.name"
              type="text"
              required
              placeholder="Enter your full name"
            />
          </div>
          
          <div class="form-group">
            <label for="regEmail">Email</label>
            <input
              id="regEmail"
              v-model="registerData.email"
              type="email"
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div class="form-group">
            <label for="regPassword">Password</label>
            <input
              id="regPassword"
              v-model="registerData.password"
              type="password"
              required
              placeholder="Enter your password"
              minlength="6"
            />
          </div>
          
          <div class="form-group">
            <label for="regConfirmPassword">Confirm Password</label>
            <input
              id="regConfirmPassword"
              v-model="registerData.confirmPassword"
              type="password"
              required
              placeholder="Confirm your password"
              minlength="6"
            />
          </div>
          
          <div class="form-actions">
            <button type="button" @click="showRegister = false" class="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'

const router = useRouter()
const userStore = useUserStore()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showRegister = ref(false)

const registerData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = computed(() => userStore.loading)
const error = computed(() => userStore.error)

const handleLogin = async () => {
  if (email.value && password.value) {
    try {
      await userStore.login(email.value, password.value)
      
      if (userStore.isAuthenticated) {
        // Store remember me preference
        if (rememberMe.value) {
          localStorage.setItem('rememberMe', 'true')
        }
        
        // Redirect to dashboard
        router.push('/')
      }
    } catch (error) {
      console.error('Login failed:', error)
    }
  }
}

const handleRegister = async () => {
  if (registerData.value.password !== registerData.value.confirmPassword) {
    // Handle password mismatch
    return
  }
  
  // Handle registration logic here
  console.log('Register:', registerData.value)
  showRegister.value = false
}

// Check for remembered login
const checkRememberedLogin = () => {
  const remembered = localStorage.getItem('rememberMe')
  if (remembered && userStore.isAuthenticated) {
    router.push('/')
  }
}

// Check on component mount
checkRememberedLogin()
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h1 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 28px;
  font-weight: 600;
}

.login-header p {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.form-group input {
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.forgot-password {
  color: #667eea;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
}

.login-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e1e5e9;
}

.login-footer p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.login-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.login-footer a:hover {
  text-decoration: underline;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal h3 {
  margin: 0 0 20px 0;
  color: #333;
  text-align: center;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a6fd8;
}

.btn-secondary {
  background: #9e9e9e;
  color: white;
}

.btn-secondary:hover {
  background: #757575;
}

/* Responsive design */
@media (max-width: 480px) {
  .login-card {
    padding: 24px;
  }
  
  .login-header h1 {
    font-size: 24px;
  }
  
  .form-options {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>
