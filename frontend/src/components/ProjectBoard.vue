<template>
  <div class="project-board">
    <div class="project-header">
      <div class="project-info">
        <h1>{{ project?.name || 'Project Board' }}</h1>
        <p v-if="project?.description" class="project-description">
          {{ project.description }}
        </p>
      </div>
      
      <div class="project-actions">
        <button @click="showCreateTask = true" class="btn btn-primary">
          Create Task
        </button>
        <button @click="showProjectSettings = true" class="btn btn-secondary">
          Settings
        </button>
      </div>
    </div>
    
    <div class="board-container">
      <div class="board-column" v-for="status in taskStatuses" :key="status.value">
        <div class="column-header">
          <h3>{{ status.label }}</h3>
          <span class="task-count">{{ getTasksByStatus(status.value).length }}</span>
        </div>
        
        <div class="column-content">
          <div
            v-for="task in getTasksByStatus(status.value)"
            :key="task.id"
            class="task-item"
            draggable="true"
            @dragstart="handleDragStart($event, task)"
            @dragover.prevent
            @drop="handleDrop($event, status.value)"
          >
            <div class="task-preview">
              <h4>{{ task.title }}</h4>
              <p>{{ task.description }}</p>
              <div class="task-meta">
                <span class="priority" :class="task.priority">{{ task.priority }}</span>
                <span v-if="task.dueDate" class="due-date">
                  {{ formatDate(task.dueDate) }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="add-task-placeholder" @click="showCreateTask = true">
            + Add Task
          </div>
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
              <label for="status">Status</label>
              <select id="status" v-model="newTask.status">
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label for="dueDate">Due Date</label>
            <input
              id="dueDate"
              v-model="newTask.dueDate"
              type="date"
            />
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
import { useRoute } from 'vue-router'
import { useTaskStore, Task } from '../store/tasks'

const route = useRoute()
const taskStore = useTaskStore()
const showCreateTask = ref(false)
const showProjectSettings = ref(false)

const projectId = computed(() => route.params.id as string)

// Mock project data - replace with actual API call
const project = ref({
  id: projectId.value,
  name: 'Sample Project',
  description: 'This is a sample project description'
})

const taskStatuses = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' }
]

const newTask = ref({
  title: '',
  description: '',
  priority: 'medium' as Task['priority'],
  status: 'todo' as Task['status'],
  dueDate: '',
  projectId: projectId.value
})

const getTasksByStatus = (status: Task['status']) => {
  return taskStore.getTasksByStatus(status).filter(task => task.projectId === projectId.value)
}

const createTask = async () => {
  if (newTask.value.title.trim()) {
    await taskStore.createTask({
      title: newTask.value.title,
      description: newTask.value.description,
      priority: newTask.value.priority,
      status: newTask.value.status,
      projectId: newTask.value.projectId,
      dueDate: newTask.value.dueDate ? new Date(newTask.value.dueDate) : undefined
    })
    
    // Reset form
    newTask.value = {
      title: '',
      description: '',
      priority: 'medium',
      status: 'todo',
      dueDate: '',
      projectId: projectId.value
    }
    
    showCreateTask.value = false
  }
}

const handleDragStart = (event: DragEvent, task: Task) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', task.id)
  }
}

const handleDrop = async (event: DragEvent, newStatus: Task['status']) => {
  event.preventDefault()
  const taskId = event.dataTransfer?.getData('text/plain')
  
  if (taskId) {
    await taskStore.updateTask(taskId, { status: newStatus })
  }
}

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString()
}

onMounted(() => {
  taskStore.fetchTasks()
})
</script>

<style scoped>
.project-board {
  padding: 20px;
  height: 100vh;
  overflow: hidden;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.project-info h1 {
  margin: 0 0 8px 0;
  color: #333;
}

.project-description {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.project-actions {
  display: flex;
  gap: 12px;
}

.board-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  height: calc(100vh - 140px);
  overflow: hidden;
}

.board-column {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e0e0e0;
}

.column-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.task-count {
  background: #2196f3;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.column-content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  background: white;
  border-radius: 6px;
  padding: 12px;
  cursor: grab;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s;
}

.task-item:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.task-item:active {
  cursor: grabbing;
}

.task-preview h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #333;
}

.task-preview p {
  margin: 0 0 12px 0;
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

.task-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.priority {
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
}

.priority.low {
  background: #e8f5e8;
  color: #2e7d32;
}

.priority.medium {
  background: #fff3e0;
  color: #f57c00;
}

.priority.high {
  background: #ffebee;
  color: #c62828;
}

.due-date {
  font-size: 10px;
  color: #666;
}

.add-task-placeholder {
  border: 2px dashed #ccc;
  border-radius: 6px;
  padding: 20px;
  text-align: center;
  color: #999;
  cursor: pointer;
  transition: all 0.2s;
}

.add-task-placeholder:hover {
  border-color: #2196f3;
  color: #2196f3;
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
</style>
