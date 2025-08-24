<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Dashboard</h1>
      <p>Welcome back, {{ userStore.user?.name || 'User' }}!</p>
    </div>
    
    <div class="dashboard-stats">
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <h3>{{ totalTasks }}</h3>
          <p>Total Tasks</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <h3>{{ completedTasks }}</h3>
          <p>Completed</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">⏳</div>
        <div class="stat-content">
          <h3>{{ inProgressTasks }}</h3>
          <p>In Progress</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-content">
          <h3>{{ overdueTasks }}</h3>
          <p>Overdue</p>
        </div>
      </div>
    </div>
    
    <div class="dashboard-content">
      <div class="dashboard-section">
        <div class="section-header">
          <h2>Recent Tasks</h2>
          <router-link to="/tasks" class="view-all">View All</router-link>
        </div>
        
        <div v-if="recentTasks.length === 0" class="empty-state">
          <p>No tasks yet. Create your first task to get started!</p>
          <button @click="showCreateTask = true" class="btn btn-primary">
            Create Task
          </button>
        </div>
        
        <div v-else class="recent-tasks">
          <div
            v-for="task in recentTasks"
            :key="task.id"
            class="task-item"
            @click="viewTask(task)"
          >
            <div class="task-info">
              <h4>{{ task.title }}</h4>
              <p>{{ task.description }}</p>
            </div>
            <div class="task-status">
              <span class="status-badge" :class="task.status">
                {{ task.status }}
              </span>
              <span class="priority-badge" :class="task.priority">
                {{ task.priority }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="dashboard-section">
        <div class="section-header">
          <h2>Quick Actions</h2>
        </div>
        
        <div class="quick-actions">
          <button @click="showCreateTask = true" class="action-btn">
            <span class="action-icon">➕</span>
            <span>Create Task</span>
          </button>
          
          <button @click="showCreateProject = true" class="action-btn">
            <span class="action-icon">📁</span>
            <span>New Project</span>
          </button>
          
          <button @click="navigateToProjects" class="action-btn">
            <span class="action-icon">📋</span>
            <span>View Projects</span>
          </button>
          
          <button @click="navigateToTasks" class="action-btn">
            <span class="action-icon">✅</span>
            <span>All Tasks</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Create Task Modal -->
    <div v-if="showCreateTask" class="modal-overlay" @click="showCreateTask = false">
      <div class="modal" @click.stop>
        <h3>Create New Task</h3>
        <form @submit.prevent="createTask">
          <div class="form-group">
            <label for="title">Title</label>
            <input
              id="title"
              v-model="newTask.title"
              type="text"
              required
              placeholder="Enter task title"
            />
          </div>
          
          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              v-model="newTask.description"
              rows="3"
              placeholder="Enter task description"
            ></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="priority">Priority</label>
              <select id="priority" v-model="newTask.priority">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="dueDate">Due Date</label>
              <input
                id="dueDate"
                v-model="newTask.dueDate"
                type="date"
              />
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="showCreateTask = false" class="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore, Task } from '../store/tasks'
import { useUserStore } from '../store/user'

const router = useRouter()
const taskStore = useTaskStore()
const userStore = useUserStore()

const showCreateTask = ref(false)
const showCreateProject = ref(false)

const newTask = ref({
  title: '',
  description: '',
  priority: 'medium' as Task['priority'],
  dueDate: ''
})

// Computed properties for dashboard stats
const totalTasks = computed(() => taskStore.tasks.length)
const completedTasks = computed(() => taskStore.getTasksByStatus('done').length)
const inProgressTasks = computed(() => taskStore.getTasksByStatus('in-progress').length)
const overdueTasks = computed(() => {
  const today = new Date()
  return taskStore.tasks.filter(task => 
    task.dueDate && new Date(task.dueDate) < today && task.status !== 'done'
  ).length
})

const recentTasks = computed(() => {
  return taskStore.tasks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
})

const createTask = async () => {
  if (newTask.value.title.trim()) {
    await taskStore.createTask({
      title: newTask.value.title,
      description: newTask.value.description,
      priority: newTask.value.priority,
      projectId: '', // No project assigned for dashboard tasks
      dueDate: newTask.value.dueDate ? new Date(newTask.value.dueDate) : undefined
    })
    
    // Reset form
    newTask.value = {
      title: '',
      description: '',
      priority: 'medium',
      dueDate: ''
    }
    
    showCreateTask.value = false
  }
}

const viewTask = (task: Task) => {
  // Navigate to task detail or project view
  if (task.projectId) {
    router.push(`/project/${task.projectId}`)
  }
}

const navigateToProjects = () => {
  router.push('/projects')
}

const navigateToTasks = () => {
  router.push('/tasks')
}

onMounted(() => {
  taskStore.fetchTasks()
  userStore.fetchUserProfile()
})
</script>

<style scoped>
.dashboard {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 32px;
}

.dashboard-header h1 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 32px;
}

.dashboard-header p {
  margin: 0;
  color: #666;
  font-size: 18px;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 50%;
}

.stat-content h3 {
  margin: 0 0 4px 0;
  font-size: 28px;
  color: #333;
  font-weight: 600;
}

.stat-content p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
}

.dashboard-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
}

.section-header h2 {
  margin: 0;
  color: #333;
  font-size: 20px;
}

.view-all {
  color: #2196f3;
  text-decoration: none;
  font-weight: 500;
}

.view-all:hover {
  text-decoration: underline;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.empty-state p {
  margin: 0 0 16px 0;
  font-size: 16px;
}

.recent-tasks {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.task-item:hover {
  border-color: #2196f3;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.1);
}

.task-info h4 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 16px;
}

.task-info p {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}

.task-status {
  display: flex;
  gap: 8px;
}

.status-badge, .priority-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.todo {
  background: #fff3e0;
  color: #f57c00;
}

.status-badge.in-progress {
  background: #e3f2fd;
  color: #1976d2;
}

.status-badge.done {
  background: #e8f5e8;
  color: #2e7d32;
}

.priority-badge.low {
  background: #e8f5e8;
  color: #2e7d32;
}

.priority-badge.medium {
  background: #fff3e0;
  color: #f57c00;
}

.priority-badge.high {
  background: #ffebee;
  color: #c62828;
}

.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px;
  border: 2px solid #f0f0f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  border-color: #2196f3;
  background: #f8f9ff;
}

.action-icon {
  font-size: 24px;
}

.action-btn span:last-child {
  font-weight: 500;
  color: #333;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-primary {
  background: #2196f3;
  color: white;
}

.btn-primary:hover {
  background: #1976d2;
}

.btn-secondary {
  background: #9e9e9e;
  color: white;
}

.btn-secondary:hover {
  background: #757575;
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
  border-radius: 8px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal h3 {
  margin: 0 0 20px 0;
  color: #333;
}

.form-group {
  margin-bottom: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

/* Responsive design */
@media (max-width: 768px) {
  .dashboard {
    padding: 16px;
  }
  
  .dashboard-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .dashboard-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .quick-actions {
    grid-template-columns: 1fr;
  }
}
</style>
