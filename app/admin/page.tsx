"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Users, Shield, CheckCircle2, XCircle, Clock } from "lucide-react"
import { ROLE_PERMISSIONS, APPROVAL_TIERS, TRANSACTION_LIMITS, type UserRole, type User } from "@/lib/auth"

export default function AdminPage() {
  const { isAuthenticated, isLoading, user, hasPermission } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    if (!hasPermission("manage_users")) {
      router.push("/dashboard")
      return
    }

    loadData()
  }, [isAuthenticated, isLoading, router, hasPermission])

  const loadData = () => {
    // Mock users data
    const mockUsers: User[] = [
      {
        id: "user_001",
        email: "admin@teosbank.eg",
        name: "Mohamed Ahmed",
        role: "bank_admin",
        permissions: ROLE_PERMISSIONS.bank_admin,
        approvalTier: APPROVAL_TIERS.bank_admin,
        walletIds: ["wallet_001"],
        primaryWalletId: "wallet_001",
      },
      {
        id: "user_002",
        email: "compliance@teosbank.eg",
        name: "Fatima Hassan",
        role: "compliance_officer",
        permissions: ROLE_PERMISSIONS.compliance_officer,
        approvalTier: APPROVAL_TIERS.compliance_officer,
        walletIds: ["wallet_002"],
        primaryWalletId: "wallet_002",
      },
      {
        id: "user_003",
        email: "ops@teosbank.eg",
        name: "Ahmed Ali",
        role: "operations",
        permissions: ROLE_PERMISSIONS.operations,
        approvalTier: APPROVAL_TIERS.operations,
        walletIds: ["wallet_003"],
        primaryWalletId: "wallet_003",
      },
      {
        id: "user_004",
        email: "business@teosbank.eg",
        name: "Sarah Ibrahim",
        role: "business",
        permissions: ROLE_PERMISSIONS.business,
        approvalTier: APPROVAL_TIERS.business,
        walletIds: ["wallet_004"],
        primaryWalletId: "wallet_004",
      },
    ]
    setUsers(mockUsers)

    // Mock pending approvals
    const mockApprovals = [
      {
        id: "appr_001",
        transactionId: "txn_001",
        type: "withdrawal",
        amount: 250000,
        currency: "EGP",
        requiredTier: 2,
        approvals: [{ tier: 1, approved: true, approverRole: "operations", timestamp: new Date() }],
        status: "pending",
        createdAt: new Date(Date.now() - 3600000),
      },
      {
        id: "appr_002",
        transactionId: "txn_002",
        type: "deposit",
        amount: 1500000,
        currency: "EGP",
        requiredTier: 3,
        approvals: [
          { tier: 1, approved: true, approverRole: "operations", timestamp: new Date() },
          { tier: 2, approved: true, approverRole: "compliance_officer", timestamp: new Date() },
        ],
        status: "pending",
        createdAt: new Date(Date.now() - 7200000),
      },
    ]
    setPendingApprovals(mockApprovals)
  }

  const handleApprove = (approvalId: string) => {
    console.log("[v0] Approving transaction:", approvalId)
    setPendingApprovals((prev) => prev.filter((a) => a.id !== approvalId))
  }

  const handleReject = (approvalId: string) => {
    console.log("[v0] Rejecting transaction:", approvalId)
    setPendingApprovals((prev) => prev.filter((a) => a.id !== approvalId))
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)
  }

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <main className="px-4 pt-4 pb-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">User management & approval workflows</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{users.length}</p>
                  <p className="text-xs text-muted-foreground">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingApprovals.length}</p>
                  <p className="text-xs text-muted-foreground">Pending Approvals</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="approvals" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
          </TabsList>

          <TabsContent value="approvals" className="space-y-4">
            {pendingApprovals.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-2" />
                  <p className="text-muted-foreground">No pending approvals</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {pendingApprovals.map((approval) => (
                  <Card key={approval.id}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold capitalize">{approval.type}</h3>
                            <p className="text-sm text-muted-foreground">
                              {approval.amount.toLocaleString()} {approval.currency}
                            </p>
                          </div>
                          <Badge variant="outline">Tier {approval.requiredTier}</Badge>
                        </div>

                        <div className="space-y-1">
                          {[1, 2, 3].slice(0, approval.requiredTier).map((tier) => {
                            const tierApproval = approval.approvals.find((a: any) => a.tier === tier)
                            return (
                              <div key={tier} className="flex items-center gap-2 text-xs">
                                {tierApproval?.approved ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Clock className="w-4 h-4 text-yellow-600" />
                                )}
                                <span>
                                  Tier {tier}: {tierApproval?.approved ? "Approved" : "Pending"}
                                </span>
                              </div>
                            )
                          })}
                        </div>

                        {user?.approvalTier && user.approvalTier >= approval.requiredTier && (
                          <div className="flex gap-2 pt-2">
                            <Button size="sm" onClick={() => handleApprove(approval.id)} className="flex-1">
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(approval.id)}
                              className="flex-1"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="space-y-3">
              {users.map((u) => (
                <Card key={u.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{u.name}</h3>
                        <p className="text-sm text-muted-foreground">{u.email}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs capitalize">
                            {u.role.replace("_", " ")}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            Tier {u.approvalTier}
                          </Badge>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleEditUser(u)}>
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            {Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => (
              <Card key={role}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base capitalize">{role.replace("_", " ")}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        Approval Tier: {APPROVAL_TIERS[role as UserRole]}
                      </CardDescription>
                    </div>
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-2">Transaction Limits</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Single Transaction</p>
                        <p className="font-medium">
                          {TRANSACTION_LIMITS[role as UserRole].single.toLocaleString()} EGP
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Daily Limit</p>
                        <p className="font-medium">{TRANSACTION_LIMITS[role as UserRole].daily.toLocaleString()} EGP</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Permissions ({permissions.length})</p>
                    <div className="flex flex-wrap gap-1">
                      {permissions.map((perm) => (
                        <Badge key={perm} variant="secondary" className="text-xs">
                          {perm.replace("_", " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
      <BottomNav />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user role and permissions</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={selectedUser.name} disabled />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={selectedUser.email} disabled />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select defaultValue={selectedUser.role}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_admin">Bank Admin</SelectItem>
                    <SelectItem value="compliance_officer">Compliance Officer</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsEditDialogOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
