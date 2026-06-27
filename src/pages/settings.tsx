import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Settings() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account preferences.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>View your user account information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Full Name</Label>
              <Input value={user?.name || ""} disabled readOnly />
            </div>
            <div className="grid gap-2">
              <Label>Email Address</Label>
              <Input value={user?.email || ""} disabled readOnly />
            </div>
            <div className="grid gap-2">
              <Label>Account Role</Label>
              <Input value={user?.role || ""} className="capitalize" disabled readOnly />
            </div>
            <div className="pt-4 text-sm text-muted-foreground">
              Profile editing is currently disabled. Please contact support to change your email or name.
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}