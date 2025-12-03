import { Capacitor } from "@capacitor/core"
import {
  PushNotifications,
  type Token,
  type PushNotificationSchema,
  type ActionPerformed,
} from "@capacitor/push-notifications"
import { apiClient } from "../../frontend/web/lib/api-client"

export interface NotificationPayload {
  type: "compliance_alert" | "settlement_completed" | "transaction_approved" | "withdrawal_pending"
  title: string
  body: string
  data?: any
}

export class PushNotificationService {
  private token: string | null = null

  /**
   * Initialize push notifications
   */
  async initialize(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      console.log("[v0] Push notifications only available on native platforms")
      return
    }

    // Request permission
    const permStatus = await PushNotifications.requestPermissions()

    if (permStatus.receive === "granted") {
      // Register with Apple / Google to receive push via APNS/FCM
      await PushNotifications.register()

      // Setup listeners
      this.setupListeners()
    } else {
      console.log("[v0] Push notification permission denied")
    }
  }

  /**
   * Setup notification listeners
   */
  private setupListeners(): void {
    // Token received
    PushNotifications.addListener("registration", async (token: Token) => {
      console.log("[v0] Push registration success, token:", token.value)
      this.token = token.value

      // Send token to backend
      await this.registerDeviceToken(token.value)
    })

    // Registration error
    PushNotifications.addListener("registrationError", (error: any) => {
      console.error("[v0] Push registration error:", error)
    })

    // Notification received in foreground
    PushNotifications.addListener("pushNotificationReceived", (notification: PushNotificationSchema) => {
      console.log("[v0] Push received:", notification)
      this.handleNotification(notification)
    })

    // Notification action performed (tapped)
    PushNotifications.addListener("pushNotificationActionPerformed", (notification: ActionPerformed) => {
      console.log("[v0] Push action performed:", notification)
      this.handleNotificationAction(notification)
    })
  }

  /**
   * Register device token with backend
   */
  private async registerDeviceToken(token: string): Promise<void> {
    try {
      await apiClient.post("/v1/notifications/register", {
        token,
        platform: Capacitor.getPlatform(),
      })
    } catch (error) {
      console.error("[v0] Error registering device token:", error)
    }
  }

  /**
   * Handle notification received in foreground
   */
  private handleNotification(notification: PushNotificationSchema): void {
    const payload = notification.data as NotificationPayload

    // Show in-app notification
    this.showInAppNotification(payload)

    // Update app state based on notification type
    switch (payload.type) {
      case "compliance_alert":
        // Trigger compliance alert refresh
        window.dispatchEvent(new CustomEvent("compliance-alert", { detail: payload }))
        break
      case "settlement_completed":
        // Trigger settlement refresh
        window.dispatchEvent(new CustomEvent("settlement-update", { detail: payload }))
        break
      case "transaction_approved":
      case "withdrawal_pending":
        // Trigger transaction refresh
        window.dispatchEvent(new CustomEvent("transaction-update", { detail: payload }))
        break
    }
  }

  /**
   * Handle notification tap action
   */
  private handleNotificationAction(notification: ActionPerformed): void {
    const payload = notification.notification.data as NotificationPayload

    // Navigate to relevant screen based on notification type
    switch (payload.type) {
      case "compliance_alert":
        window.location.href = "/admin/compliance"
        break
      case "settlement_completed":
        window.location.href = "/settlement"
        break
      case "transaction_approved":
      case "withdrawal_pending":
        window.location.href = "/transactions"
        break
    }
  }

  /**
   * Show in-app notification
   */
  private showInAppNotification(payload: NotificationPayload): void {
    // Trigger toast or custom notification UI
    window.dispatchEvent(new CustomEvent("show-notification", { detail: payload }))
  }

  /**
   * Get current device token
   */
  getToken(): string | null {
    return this.token
  }
}

export const pushNotificationService = new PushNotificationService()
