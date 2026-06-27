import { AdminLayout } from "@/components/layout/AdminLayout";
import { 
  useAdminGetStats, 
  getAdminGetStatsQueryKey, 
  useAdminListUsers, 
  getAdminListUsersQueryKey, 
  useAdminBlockUser 
} from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, Building2, Bot, MessageSquare, AlertTriangle, ShieldCheck, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const { isAuthenticated, isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useAdminGetStats({
    query: {
      enabled: isAuthenticated && isAdmin,
      queryKey: getAdminGetStatsQueryKey()
    }
  });

  const { data: users, isLoading: usersLoading } = useAdminListUsers({
    query: {
      enabled: isAuthenticated && isAdmin,
      queryKey: getAdminListUsersQueryKey()
    }
  });

  const blockMutation = useAdminBlockUser();

  const handleToggleBlock = (userId: number, currentStatus: boolean) => {
    blockMutation.mutate(
      { id: userId, data: { isBlocked: !currentStatus } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getAdminListUsersQueryKey() });
          toast.success(currentStatus ? "User unblocked" : "User blocked");
        },
        onError: () => toast.error("Failed to update user status")
      }
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
          <p className="text-muted-foreground mt-1">Platform-wide statistics and management.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? <Skeleton className="h-8 w-20" /> : (
                <>
                  <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">+{stats?.newUsersThisWeek || 0} this week</p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Businesses</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? <Skeleton className="h-8 w-20" /> : (
                <div className="text-2xl font-bold">{stats?.totalBusinesses || 0}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Assistants</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? <Skeleton className="h-8 w-20" /> : (
                <div className="text-2xl font-bold">{stats?.totalAssistants || 0}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? <Skeleton className="h-8 w-20" /> : (
                <div className="text-2xl font-bold">{stats?.totalMessages || 0}</div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">User</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Joined</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Usage</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {usersLoading ? (
                      <tr><td colSpan={6} className="p-4 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></td></tr>
                    ) : users && users.length > 0 ? (
                      users.map(user => (
                        <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </td>
                          <td className="p-4 align-middle capitalize">
                            {user.role === 'admin' ? <span className="text-destructive font-bold flex items-center gap-1"><Shield className="h-3 w-3" /> Admin</span> : 'User'}
                          </td>
                          <td className="p-4 align-middle text-muted-foreground whitespace-nowrap">
                            {format(new Date(user.createdAt), "MMM d, yyyy")}
                          </td>
                          <td className="p-4 align-middle">
                            <div className="text-xs">
                              Chats: {user.chatCount || 0} <br/>
                              Leads: {user.leadCount || 0}
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            {user.isBlocked ? (
                              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-destructive/10 text-destructive border-transparent">Blocked</span>
                            ) : (
                              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-600 border-transparent">Active</span>
                            )}
                          </td>
                          <td className="p-4 align-middle text-right">
                            {user.role !== 'admin' && (
                              <Button 
                                variant={user.isBlocked ? "outline" : "destructive"} 
                                size="sm"
                                disabled={blockMutation.isPending}
                                onClick={() => handleToggleBlock(user.id, user.isBlocked)}
                              >
                                {user.isBlocked ? <ShieldCheck className="mr-2 h-4 w-4" /> : <AlertTriangle className="mr-2 h-4 w-4" />}
                                {user.isBlocked ? "Unblock" : "Block"}
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">No users found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
