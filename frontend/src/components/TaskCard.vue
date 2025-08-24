<template>
  <div class="task-card" :class="task.status">
    <div class="task-header">
      <h3 class="task-title">{{ task.title }}</h3>
      <div class="task-priority" :class="task.priority">
        {{ task.priority }}
      </div>
    </div>
    
    <p class="task-description">{{ task.description }}</p>
    
    <div class="task-meta">
      <div class="task-status">
        <span class="status-badge">{{ task.status }}</span>
      </div>
      
      <div class="task-due-date" v-if="task.dueDate">
        <span class="due-label">Due:</span>
        <span class="due-date">{{ formatDate(task.dueDate) }}</span>
      </div>
      
      <div class="task-assignee" v-if="task.assignedTo">
        <span class="assignee-label">Assigned to:</span>
        <span class="assignee-name">{{ task.assignedTo }}</span>
      </div>
    </div>
    
    <div class="task-actions">
      <button @click="editTask" class="btn btn-edit">Edit</button>
      <button @click="deleteTask" class="btn btn-delete">Delete</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Task } from '../store/tasks'

interface Props {
  task: Task
}

interface Emits {
  (e: 'edit', task: Task): void
  (e: 'delete', taskId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const editTask = () => {
  emit('edit', props.task)
}

const deleteTask = () => {
  emit('delete', props.task.id)
}

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString()
}
</script>

<style scoped>
.task-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #ddd;
}

.task-card.todo {
  border-left-color: #ff9800;
}

.task-card.in-progress {
  border-left-color: #2196f3;
}

.task-card.done {
  border-left-color: #4caf50;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.task-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.task-priority {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.task-priority.low {
  background: #e8f5e8;
  color: #2e7d32;
}

.task-priority.medium {
  background: #fff3e0;
  color: #f57c00;
}

.task-priority.high {
  background: #ffebee;
  color: #c62828;
}

.task-description {
  color: #666;
  margin-bottom: 16px;
  line-height: 1.5;
}

.task-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.task-status, .task-due-date, .task-assignee {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  background: #f5f5f5;
  color: #666;
  font-size: 12px;
  text-transform: capitalize;
}

.due-label, .assignee-label {
  color: #999;
  font-size: 12px;
}

.due-date, .assignee-name {
  color: #333;
  font-weight: 500;
}

.task-actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-edit {
  background: #2196f3;
  color: white;
}

.btn-edit:hover {
  background: #1976d2;
}

.btn-delete {
  background: #f44336;
  color: white;
}

.btn-delete:hover {
  background: #d32f2f;
}
</style>
