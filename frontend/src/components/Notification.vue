<template>
  <div class="notification-container">
    <TransitionGroup name="notification" tag="div" class="notifications">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification"
        :class="notification.type"
        @click="removeNotification(notification.id)"
      >
        <div class="notification-icon">
          <span v-if="notification.type === 'success'">✓</span>
          <span v-else-if="notification.type === 'error'">✕</span>
          <span v-else-if="notification.type === 'warning'">⚠</span>
          <span v-else>ℹ</span>
        </div>
        
        <div class="notification-content">
          <h4 class="notification-title">{{ notification.title }}</h4>
          <p class="notification-message">{{ notification.message }}</p>
        </div>
        
        <button class="notification-close" @click.stop="removeNotification(notification.id)">
          ×
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

export interface NotificationItem {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  timestamp: number
}

const notifications = ref<NotificationItem[]>([])

const addNotification = (notification: Omit<NotificationItem, 'id' | 'timestamp'>) => {
  const id = Date.now().toString()
  const newNotification: NotificationItem = {
    ...notification,
    id,
    timestamp: Date.now()
  }
  
  notifications.value.push(newNotification)
  
  // Auto-remove notification after duration (default: 5000ms)
  const duration = notification.duration || 5000
  if (duration > 0) {
    setTimeout(() => {
      removeNotification(id)
    }, duration)
  }
}

const removeNotification = (id: string) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

const clearAll = () => {
  notifications.value = []
}

// Expose methods for external use
defineExpose({
  addNotification,
  removeNotification,
  clearAll
})

// Listen for custom notification events
const handleNotificationEvent = (event: CustomEvent) => {
  addNotification(event.detail)
}

onMounted(() => {
  window.addEventListener('notification', handleNotificationEvent)
})

onUnmounted(() => {
  window.removeEventListener('notification', handleNotificationEvent)
})
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

.notifications {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}

.notification {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.3s ease;
  border-left: 4px solid #ddd;
}

.notification:hover {
  transform: translateX(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.notification.success {
  border-left-color: #4caf50;
}

.notification.error {
  border-left-color: #f44336;
}

.notification.warning {
  border-left-color: #ff9800;
}

.notification.info {
  border-left-color: #2196f3;
}

.notification-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
}

.notification.success .notification-icon {
  background: #e8f5e8;
  color: #2e7d32;
}

.notification.error .notification-icon {
  background: #ffebee;
  color: #c62828;
}

.notification.warning .notification-icon {
  background: #fff3e0;
  color: #f57c00;
}

.notification.info .notification-icon {
  background: #e3f2fd;
  color: #1565c0;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.notification-message {
  margin: 0;
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

.notification-close {
  flex-shrink: 0;
  background: none;
  border: none;
  font-size: 18px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.notification-close:hover {
  background: #f5f5f5;
  color: #666;
}

/* Transition animations */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}

/* Responsive design */
@media (max-width: 768px) {
  .notification-container {
    top: 10px;
    right: 10px;
    left: 10px;
  }
  
  .notifications {
    max-width: none;
  }
  
  .notification {
    padding: 12px;
  }
}
</style>
