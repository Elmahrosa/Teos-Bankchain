export type NotificationType = "system_health" | "transaction" | "compliance" | "security"
export type NotificationPriority = "low" | "medium" | "high" | "critical"

export interface Notification {
  id: string
  type: NotificationType
  priority: NotificationPriority
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

export class NotificationService {
  private static notifications: Notification[] = []
  private static listeners: Set<(notifications: Notification[]) => void> = new Set()

  /**
   * Add notification
   */
  static addNotification(notification: Omit<Notification, "id" | "timestamp" | "read">): void {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
    }

    this.notifications.unshift(newNotification)
    this.notifyListeners()
  }

  /**
   * Get all notifications
   */
  static getNotifications(): Notification[] {
    return this.notifications
  }

  /**
   * Get unread count
   */
  static getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length
  }

  /**
   * Mark notification as read
   */
  static markAsRead(id: string): void {
    const notification = this.notifications.find((n) => n.id === id)
    if (notification) {
      notification.read = true
      this.notifyListeners()
    }
  }

  /**
   * Subscribe to notification updates
   */
  static subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private static notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.notifications))
  }

  /**
   * System health notification
   */
  static notifySystemHealth(issue: string, priority: NotificationPriority = "high"): void {
    this.addNotification({
      type: "system_health",
      priority,
      title: "System Health Alert",
      message: issue,
      actionUrl: "/monitoring",
    })
  }

  /**
   * Transaction notification
   */
  static notifyTransaction(message: string, priority: NotificationPriority = "medium"): void {
    this.addNotification({
      type: "transaction",
      priority,
      title: "Transaction Update",
      message,
      actionUrl: "/transactions",
    })
  }
}
