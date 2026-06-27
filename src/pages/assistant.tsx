import { AppLayout } from "@/components/layout/AppLayout";
import { 
  useGetMyAssistant, 
  getGetMyAssistantQueryKey, 
  useCreateAssistant, 
  useUpdateAssistant, 
  useToggleAssistantStatus,
  useListFaqs,
  getListFaqsQueryKey,
  useCreateFaq,
  useUpdateFaq,
  useDeleteFaq,
  Assistant,
  Faq
} from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Save, Plus, Trash2, Edit2, CheckCircle2, XCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const assistantSchema = z.object({
  name: z.string().min(1, "Assistant name is required"),
  welcomeMessage: z.string().optional(),
  businessInfo: z.string().optional(),
});

const faqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

type AssistantForm = z.infer<typeof assistantSchema>;
type FaqForm = z.infer<typeof faqSchema>;

export default function AssistantConfig() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  
  const { data: assistant, isLoading: isAssistantLoading } = useGetMyAssistant({
    query: {
      enabled: isAuthenticated,
      queryKey: getGetMyAssistantQueryKey(),
      retry: false
    }
  });

  const { data: faqs, isLoading: isFaqsLoading } = useListFaqs(assistant?.id || 0, {
    query: {
      enabled: !!assistant?.id,
      queryKey: getListFaqsQueryKey(assistant?.id || 0)
    }
  });

  const createMutation = useCreateAssistant();
  const updateMutation = useUpdateAssistant();
  const toggleMutation = useToggleAssistantStatus();
  
  const createFaqMutation = useCreateFaq();
  const updateFaqMutation = useUpdateFaq();
  const deleteFaqMutation = useDeleteFaq();

  const form = useForm<AssistantForm>({
    resolver: zodResolver(assistantSchema),
    defaultValues: {
      name: "Support Assistant",
      welcomeMessage: "Hi there! How can I help you today?",
      businessInfo: "",
    },
  });

  const faqForm = useForm<FaqForm>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: "",
      answer: "",
    },
  });

  useEffect(() => {
    if (assistant) {
      form.reset({
        name: assistant.name,
        welcomeMessage: assistant.welcomeMessage || "",
        businessInfo: assistant.businessInfo || "",
      });
    }
  }, [assistant, form]);

  useEffect(() => {
    if (editingFaq) {
      faqForm.reset({
        question: editingFaq.question,
        answer: editingFaq.answer,
      });
    } else {
      faqForm.reset({ question: "", answer: "" });
    }
  }, [editingFaq, faqForm]);

  const onAssistantSubmit = (data: AssistantForm) => {
    const submitData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, value === "" ? undefined : value])
    ) as any;

    if (assistant?.id) {
      updateMutation.mutate(
        { id: assistant.id, data: submitData },
        {
          onSuccess: (updated) => {
            queryClient.setQueryData(getGetMyAssistantQueryKey(), updated);
            toast.success("Assistant settings updated");
          },
          onError: (err: any) => toast.error(err.message || "Update failed")
        }
      );
    } else {
      createMutation.mutate(
        { data: submitData },
        {
          onSuccess: (created) => {
            queryClient.setQueryData(getGetMyAssistantQueryKey(), created);
            toast.success("Assistant created");
          },
          onError: (err: any) => toast.error(err.message || "Creation failed")
        }
      );
    }
  };

  const handleToggleStatus = (checked: boolean) => {
    if (!assistant?.id) return;
    toggleMutation.mutate(
      { id: assistant.id, data: { isActive: checked } },
      {
        onSuccess: (updated) => {
          queryClient.setQueryData(getGetMyAssistantQueryKey(), updated);
          toast.success(checked ? "Assistant activated" : "Assistant paused");
        },
        onError: (err: any) => toast.error("Failed to change status")
      }
    );
  };

  const onFaqSubmit = (data: FaqForm) => {
    if (!assistant?.id) return;

    if (editingFaq) {
      updateFaqMutation.mutate(
        { id: editingFaq.id, data },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListFaqsQueryKey(assistant.id) });
            toast.success("FAQ updated");
            setIsFaqOpen(false);
            setEditingFaq(null);
          },
          onError: (err: any) => toast.error("Failed to update FAQ")
        }
      );
    } else {
      createFaqMutation.mutate(
        { data: { ...data, assistantId: assistant.id } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListFaqsQueryKey(assistant.id) });
            toast.success("FAQ added");
            setIsFaqOpen(false);
          },
          onError: (err: any) => toast.error("Failed to add FAQ")
        }
      );
    }
  };

  const handleDeleteFaq = (faqId: number) => {
    if (!assistant?.id || !confirm("Are you sure you want to delete this FAQ?")) return;
    
    deleteFaqMutation.mutate(
      { id: faqId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListFaqsQueryKey(assistant.id) });
          toast.success("FAQ deleted");
        },
        onError: () => toast.error("Failed to delete FAQ")
      }
    );
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
            <p className="text-muted-foreground mt-1">Configure your bot's personality, behavior, and knowledge.</p>
          </div>
          
          {assistant && (
            <Card className="flex items-center px-4 py-2 border-primary/20 bg-primary/5">
              <div className="flex items-center gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="assistant-status" className="text-base font-semibold">
                    Assistant Status
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {assistant.isActive ? "Currently responding to visitors" : "Paused. Will not respond."}
                  </p>
                </div>
                <Switch
                  id="assistant-status"
                  checked={assistant.isActive}
                  onCheckedChange={handleToggleStatus}
                  disabled={toggleMutation.isPending}
                />
              </div>
            </Card>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Core Settings</CardTitle>
              <CardDescription>Identity and main instructions.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              {isAssistantLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin" /></div>
              ) : (
                <Form {...form}>
                  <form id="assistant-form" onSubmit={form.handleSubmit(onAssistantSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bot Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Support Bot" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="welcomeMessage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Welcome Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Hi! How can I help?" 
                              className="resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="businessInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom Instructions / Background Context</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Provide custom prompt instructions for the AI here..." 
                              className="min-h-[150px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              )}
            </CardContent>
            <CardFooter className="border-t pt-6 bg-muted/20">
              <Button type="submit" form="assistant-form" className="w-full" disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Configuration
              </Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>Knowledge Base (FAQs)</CardTitle>
                <CardDescription className="mt-1.5">Direct answers to common questions.</CardDescription>
              </div>
              <Dialog open={isFaqOpen} onOpenChange={(open) => {
                setIsFaqOpen(open);
                if (!open) setEditingFaq(null);
              }}>
                <DialogTrigger asChild>
                  <Button size="sm" disabled={!assistant?.id}>
                    <Plus className="h-4 w-4 mr-2" /> Add FAQ
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingFaq ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
                    <DialogDescription>
                      Provide a specific answer to a common question.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...faqForm}>
                    <form id="faq-form" onSubmit={faqForm.handleSubmit(onFaqSubmit)} className="space-y-4 py-4">
                      <FormField
                        control={faqForm.control}
                        name="question"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Question</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. What are your hours?" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={faqForm.control}
                        name="answer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Answer</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Provide the exact answer the bot should use." className="min-h-[100px]" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsFaqOpen(false)}>Cancel</Button>
                    <Button type="submit" form="faq-form" disabled={createFaqMutation.isPending || updateFaqMutation.isPending}>
                      Save FAQ
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto max-h-[500px]">
              {!assistant?.id ? (
                <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                  <p>Save your assistant configuration first to add FAQs.</p>
                </div>
              ) : isFaqsLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin" /></div>
              ) : faqs && faqs.length > 0 ? (
                <div className="space-y-3">
                  {faqs.map((faq) => (
                    <div key={faq.id} className="p-4 rounded-lg border bg-card text-sm space-y-2 group relative">
                      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => {
                          setEditingFaq(faq);
                          setIsFaqOpen(true);
                        }}>
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteFaq(faq.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <p className="font-semibold pr-16">{faq.question}</p>
                      <p className="text-muted-foreground whitespace-pre-wrap">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                  <p className="mb-2">No FAQs added yet.</p>
                  <p className="text-xs">Adding specific FAQs helps the AI provide accurate, immediate answers.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}