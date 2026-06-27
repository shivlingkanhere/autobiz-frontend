import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import { Send, Bot, User as UserIcon, Loader2, ArrowLeft } from "lucide-react";
import { useGetMyAssistant, getGetMyAssistantQueryKey, useCreateChat, useSendMessage, Message } from "@workspace/api-client-react";
import { Link } from "wouter";

export default function ChatTest() {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: assistant, isLoading: assistantLoading } = useGetMyAssistant({
    query: {
      enabled: isAuthenticated,
      queryKey: getGetMyAssistantQueryKey()
    }
  });

  const createChat = useCreateChat();
  const sendMessage = useSendMessage();

  useEffect(() => {
    // Auto-create a chat session if we have an assistant and no chat ID
    if (assistant?.id && !chatId && !createChat.isPending) {
      createChat.mutate(
        { data: { assistantId: assistant.id, visitorName: "Test User" } },
        {
          onSuccess: (newChat) => {
            setChatId(newChat.id);
            if (assistant.welcomeMessage) {
              setMessages([{
                id: Date.now(),
                chatId: newChat.id,
                role: "assistant",
                content: assistant.welcomeMessage,
                createdAt: new Date().toISOString()
              } as Message]);
            }
          }
        }
      );
    }
  }, [assistant?.id, chatId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sendMessage.isPending]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chatId) return;

    const userMessage = input.trim();
    setInput("");

    // Optimistically add user message
    setMessages(prev => [...prev, {
      id: Date.now(),
      chatId,
      role: "user",
      content: userMessage,
      createdAt: new Date().toISOString()
    } as Message]);

    sendMessage.mutate(
      { chatId, data: { content: userMessage } },
      {
        onSuccess: (res) => {
          // Replace optimistic message and add AI response
          setMessages(prev => {
            const filtered = prev.filter(m => m.id !== Date.now() - 100); // approximate remove optimistic
            return [...filtered, res.userMessage, res.assistantMessage];
          });
        }
      }
    );
  };

  if (assistantLoading || (!chatId && createChat.isPending)) {
    return (
      <AppLayout>
        <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!assistant?.id) {
    return (
      <AppLayout>
        <div className="flex flex-col h-[calc(100vh-10rem)] items-center justify-center text-center space-y-4">
          <Bot className="h-16 w-16 text-muted-foreground opacity-20" />
          <h2 className="text-xl font-semibold">No Assistant Configured</h2>
          <p className="text-muted-foreground max-w-md">You need to set up your AI assistant before you can test the chat interface.</p>
          <Link href="/assistant">
            <Button>Configure Assistant</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight">Test Chat</h1>
          <p className="text-sm text-muted-foreground mt-1">Interact with your assistant exactly as a visitor would.</p>
        </div>

        <Card className="flex-1 flex flex-col overflow-hidden border-primary/10 shadow-lg">
          <div className="bg-primary p-4 text-primary-foreground flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary-foreground/20 p-2 rounded-full">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">{assistant.name}</h3>
                <p className="text-xs text-primary-foreground/80 flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Online
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10" onClick={() => setChatId(null)}>
              Restart Session
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4 bg-muted/10" ref={scrollRef}>
            <div className="space-y-4 max-w-3xl mx-auto flex flex-col">
              <div className="text-center text-xs text-muted-foreground mb-4">
                Chat started today
              </div>

              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}
                >
                  <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-auto ${msg.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-primary text-primary-foreground'}`}>
                      {msg.role === 'user' ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div 
                      className={`px-4 py-2.5 rounded-2xl ${
                        msg.role === 'user' 
                          ? 'bg-primary text-primary-foreground rounded-br-sm' 
                          : 'bg-card border shadow-sm rounded-bl-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}

              {sendMessage.isPending && (
                <div className="flex justify-start w-full">
                  <div className="flex max-w-[80%] flex-row gap-2">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mt-auto">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-card border shadow-sm rounded-bl-sm flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 bg-background border-t">
            <form onSubmit={handleSend} className="flex gap-2 max-w-3xl mx-auto relative">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={sendMessage.isPending || !chatId}
                className="pr-12 rounded-full bg-muted/50 border-transparent focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-primary/50"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={sendMessage.isPending || !input.trim() || !chatId}
                className="absolute right-1 top-1 h-8 w-8 rounded-full transition-transform hover:scale-105 active:scale-95"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}