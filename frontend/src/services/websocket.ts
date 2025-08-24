export class WebSocketService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private url: string

  constructor(url: string) {
    this.url = url
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url)
        
        this.ws.onopen = () => {
          console.log('WebSocket connected')
          this.reconnectAttempts = 0
          resolve()
        }

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason)
          this.handleReconnect()
        }

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          reject(error)
        }

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
      
      setTimeout(() => {
        this.connect().catch(error => {
          console.error('Reconnection failed:', error)
        })
      }, this.reconnectDelay * this.reconnectAttempts)
    } else {
      console.error('Max reconnection attempts reached')
    }
  }

  private handleMessage(data: any): void {
    try {
      const message = JSON.parse(data)
      
      // Handle different message types
      switch (message.type) {
        case 'task_update':
          this.handleTaskUpdate(message.data)
          break
        case 'notification':
          this.handleNotification(message.data)
          break
        case 'project_update':
          this.handleProjectUpdate(message.data)
          break
        default:
          console.log('Unknown message type:', message.type)
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error)
    }
  }

  private handleTaskUpdate(data: any): void {
    // Emit custom event for task updates
    window.dispatchEvent(new CustomEvent('taskUpdate', { detail: data }))
  }

  private handleNotification(data: any): void {
    // Emit custom event for notifications
    window.dispatchEvent(new CustomEvent('notification', { detail: data }))
  }

  private handleProjectUpdate(data: any): void {
    // Emit custom event for project updates
    window.dispatchEvent(new CustomEvent('projectUpdate', { detail: data }))
  }

  send(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.error('WebSocket is not connected')
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

// Create and export a singleton instance
const wsService = new WebSocketService('ws://localhost:3000/ws')

export default wsService
