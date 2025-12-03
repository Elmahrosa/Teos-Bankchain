"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PINAuthService } from "./biometric-auth"
import { AlertCircle } from "lucide-react"

interface PINAuthDialogProps {
  open: boolean
  onSuccess: () => void
  onCancel: () => void
  mode?: "verify" | "setup"
}

export function PINAuthDialog({ open, onSuccess, onCancel, mode = "verify" }: PINAuthDialogProps) {
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError("")
    setLoading(true)

    try {
      if (mode === "setup") {
        // Setup mode: set new PIN
        if (pin.length < 4) {
          setError("PIN must be at least 4 digits")
          return
        }

        if (pin !== confirmPin) {
          setError("PINs do not match")
          return
        }

        const success = await PINAuthService.setPIN(pin)
        if (success) {
          onSuccess()
        } else {
          setError("Failed to set PIN")
        }
      } else {
        // Verify mode: check PIN
        const isValid = await PINAuthService.verifyPIN(pin)

        if (isValid) {
          onSuccess()
        } else {
          setError("Invalid PIN. Please try again.")
          setPin("")
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  const handlePinChange = (value: string) => {
    // Only allow digits
    const digitsOnly = value.replace(/\D/g, "")
    setPin(digitsOnly)
    setError("")
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "setup" ? "Setup PIN" : "Enter PIN"}</DialogTitle>
          <DialogDescription>
            {mode === "setup" ? "Create a 4-digit PIN for secure access" : "Enter your PIN to continue"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={(e) => handlePinChange(e.target.value)}
              placeholder={mode === "setup" ? "Enter PIN" : "PIN"}
              className="text-center text-2xl tracking-widest"
              autoFocus
            />
          </div>

          {mode === "setup" && (
            <div>
              <Input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                placeholder="Confirm PIN"
                className="text-center text-2xl tracking-widest"
              />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel} disabled={loading} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || pin.length < 4 || (mode === "setup" && confirmPin.length < 4)}
              className="flex-1"
            >
              {loading ? "Processing..." : mode === "setup" ? "Set PIN" : "Verify"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
