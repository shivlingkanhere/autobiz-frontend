import { AppLayout } from "@/components/layout/AppLayout";
import { useGetDashboardStats, getGetDashboardStatsQueryKey, useGetRecentChats, getGetRecentChatsQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, Activity, ExternalLink, ArrowRight, Bot, Building2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats({
    query: {
      enabled: isAuthenticated,
      queryKey: getGetDashboardStatsQueryKey()
    }
  });

  const { data: recentChats, isLoading: chatsLoading } = useGetRecentChats({
    query: {
      enabled: isAuthenticated,
      queryKey: getGetRecentChatsQueryKey()
    }
  });

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Overview of your AI assistant's performance.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 ${stats?.assistantStatus ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'}`}>
              <span className={`w-2 h-2 rounded-full ${stats?.assistantStatus ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              {stats?.assistantStatus ? 'Assistant Active' : 'Assistant Inactive'}
            </div>
            <Link href="/chat">
              <Button>Test Assistant <ExternalLink className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.totalChats || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    +{stats?.chatsThisWeek || 0} this week
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leads Captured</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.totalLeads || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    +{stats?.leadsThisWeek || 0} this week
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages Processed</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.totalMessages || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Across all conversations
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Conversations</CardTitle>
              <CardDescription>
                Latest interactions between your assistant and visitors.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chatsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {recentChats && recentChats.length > 0 ? (
                    recentChats.map((chat) => (
                      <div key={chat.id} className="flex items-center">
                        <div className="bg-primary/10 h-9 w-9 rounded-full flex items-center justify-center mr-4">
                          <MessageSquare className="h-4 w-4 text-primary" />
                        </div>
                        <div className="ml-4 space-y-1 flex-1">
                          <p className="text-sm font-medium leading-none">
                            {chat.visitorName || "Anonymous Visitor"}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {chat.lastMessage || "Started a conversation"}
                          </p>
                        </div>
                        <div className="ml-auto font-medium text-xs text-muted-foreground whitespace-nowrap">
                          {format(new Date(chat.createdAt), "MMM d, h:mm a")}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                      <p>No conversations yet.</p>
                    </div>
                  )}
                </div>
              )}
              {recentChats && recentChats.length > 0 && (
                <div className="mt-6">
                  <Link href="/chat-history">
                    <Button variant="outline" className="w-full">
                      View All History <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Manage your assistant and business profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/assistant">
                <div className="group flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                  <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-background">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">Configure Assistant</h4>
                    <p className="text-xs text-muted-foreground group-hover:text-accent-foreground/80">Update instructions and FAQs</p>
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-50" />
                </div>
              </Link>
              <Link href="/business">
                <div className="group flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                  <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-background">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">Business Profile</h4>
                    <p className="text-xs text-muted-foreground group-hover:text-accent-foreground/80">Update your company details</p>
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-50" />
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}