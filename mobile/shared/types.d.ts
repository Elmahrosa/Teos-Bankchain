declare module "@aparajita/capacitor-secure-storage" {
  export const SecureStoragePlugin: {
    set(key: string, value: string): Promise<void>
    get(key: string): Promise<string | null>
    remove(key: string): Promise<void>
  }
}

declare module "@capgo/capacitor-native-biometric" {
  export const NativeBiometric: any
}

declare module "@capacitor/push-notifications" {
  export const PushNotifications: any
}
