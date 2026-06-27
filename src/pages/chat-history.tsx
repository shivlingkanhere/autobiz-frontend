import { AppLayout } from "@/components/layout/AppLayout";
import { useListChats, getListChatsQueryKey, useGetChat, useDeleteChat } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Search, MessageSquare, Trash2, Calendar, User, ArrowLeft, Loader2, Bot } from "lucide-react";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChatHistory() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

  const { data: chats, isLoading } = useListChats({ search }, {
    query: {
      enabled: isAuthenticated,
      queryKey: getListChatsQueryKey({ search })
    }
  });

  const { data: selectedChatDetails, isLoading: detailsLoading } = useGetChat(selectedChatId || 0, {
    query: {
      enabled: !!selectedChatId,
      // using hardcoded key since generator doesn't expose it correctly in the prompt
      queryKey: ['chat', selectedChatId]
    }
  });

  const deleteChatMutation = useDeleteChat();

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!confirm("Delete this conversation?")) return;

    deleteChatMutation.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListChatsQueryKey({ search }) });
          toast.success("Chat deleted");
          if (selectedChatId === id) setSelectedChatId(null);
        },
        onError: () => toast.error("Failed to delete chat")
      }
    );
  };

  if (selectedChatId) {
    return (
      <AppLayout>
        <div className="space-y-4 max-w-4xl mx-auto h-[calc(100vh-6rem)] flex flex-col">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setSelectedChatId(null)} className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to History
            </Button>
            {selectedChatDetails && (
              <Button variant="destructive" size="sm" onClick={(e) => handleDelete(e, selectedChatDetails.id)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete Session
              </Button>
            )}
          </div>

          <Card className="flex-1 flex flex-col overflow-hidden">
            {detailsLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : selectedChatDetails ? (
              <>
                <CardHeader className="border-b bg-muted/20 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        {selectedChatDetails.visitorName || "Anonymous Visitor"}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center"><User className="mr-1 h-3.5 w-3.5" /> {selectedChatDetails.visitorEmail || "No email"}</span>
                        <span className="flex items-center"><Calendar className="mr-1 h-3.5 w-3.5" /> {format(new Date(selectedChatDetails.createdAt), "PPP p")}</span>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{selectedChatDetails.messages?.length || 0} messages</div>
                      <div className="text-xs text-muted-foreground text-mono">{selectedChatDetails.sessionId}</div>
                    </div>
                  </div>
                </CardHeader>
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-6 max-w-3xl mx-auto">
                    {selectedChatDetails.messages?.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
                          <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-primary text-primary-foreground'}`}>
                            {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                          </div>
                          <div>
                            <div className={`px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                              <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                            </div>
                            <div className={`text-[10px] text-muted-foreground mt-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                              {format(new Date(msg.createdAt), "h:mm a")}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!selectedChatDetails.messages || selectedChatDetails.messages.length === 0) && (
                      <div className="text-center text-muted-foreground py-8">No messages in this session.</div>
                    )}
                  </div>
                </ScrollArea>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Chat not found.
              </div>
            )}
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chat History</h1>
          <p className="text-muted-foreground mt-1">Review past conversations between visitors and your AI.</p>
        </div>

        <Card>
          <div className="p-4 border-b">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by visitor name or email..." 
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="divide-y">
            {isLoading ? (
              <div className="py-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : chats && chats.length > 0 ? (
              chats.map((chat) => (
                <div 
                  key={chat.id} 
                  className="p-4 hover:bg-muted/50 cursor-pointer transition-colors group flex items-start gap-4"
                  onClick={() => setSelectedChatId(chat.id)}
                >
                  <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-base truncate pr-4">
                        {chat.visitorName || "Anonymous Visitor"}
                        {chat.visitorEmail && <span className="ml-2 text-sm font-normal text-muted-foreground">({chat.visitorEmail})</span>}
                      </h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(chat.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mb-2">
                      {chat.lastMessage || "Empty session"}
                    </p>
                    <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                      <span className="bg-muted px-2 py-0.5 rounded-md">{chat.messageCount || 0} messages</span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10 -mr-2"
                    onClick={(e) => handleDelete(e, chat.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-16 px-4">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-1">No conversations found</h3>
                <p className="text-muted-foreground">
                  {search ? "Try adjusting your search terms." : "Your AI assistant hasn't had any conversations yet."}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}