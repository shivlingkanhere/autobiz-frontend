import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminLogin } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Loader2, ShieldAlert } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type AdminLoginForm = z.infer<typeof adminLoginSchema>;

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const loginMutation = useAdminLogin();

  const form = useForm<AdminLoginForm>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: AdminLoginForm) => {
    loginMutation.mutate(
      { data },
      {
        onSuccess: (res) => {
          login(res.token, res.user);
          toast.success("Admin access granted");
          setLocation("/admin");
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to log in as admin");
        },
      }
    );
  };

  return (
    <div className="min-h-screen grid items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Admin specific background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(hsl(var(--destructive)/0.1)_1px,transparent_1px)] [background-size:16px_16px] opacity-50 z-0"></div>
      
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-2xl shadow-xl border border-destructive/20 relative z-10">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6 border border-destructive/20">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-destructive">System Admin</h1>
          <p className="text-muted-foreground mt-2">Restricted access portal</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label>Admin Email</Label>
                  <FormControl>
                    <Input placeholder="admin@autobiz.ai" {...field} className="border-destructive/30 focus-visible:ring-destructive" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <Label>Security Key</Label>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} className="border-destructive/30 focus-visible:ring-destructive" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 mt-6" 
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Authenticate
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}