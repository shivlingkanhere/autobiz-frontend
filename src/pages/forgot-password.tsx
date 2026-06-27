import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForgotPassword } from "@workspace/api-client-react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useState } from "react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const forgotPasswordMutation = useForgotPassword();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordForm) => {
    forgotPasswordMutation.mutate(
      { data },
      {
        onSuccess: () => {
          setSubmitted(true);
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to request password reset");
        },
      }
    );
  };

  if (submitted) {
    return (
      <AuthLayout 
        title="Check your email" 
        subtitle="We've sent you a link to reset your password"
      >
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            If an account exists for {form.getValues("email")}, you will receive an email with instructions on how to reset your password.
          </p>
          <div className="pt-4">
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Back to login
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Reset password" 
      subtitle="Enter your email to receive a reset link"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label>Email</Label>
                <FormControl>
                  <Input placeholder="name@company.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="w-full" 
            disabled={forgotPasswordMutation.isPending}
          >
            {forgotPasswordMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Reset Link
          </Button>
        </form>
      </Form>
      <div className="text-center mt-6 text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link href="/login">
          <span className="text-primary font-medium hover:underline cursor-pointer">
            Sign in
          </span>
        </Link>
      </div>
    </AuthLayout>
  );
}