import { ReactNode } from "react";
import { Link } from "wouter";

export function AuthLayout({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center space-x-2 mb-8">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">A</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-foreground">AutoBiz AI</span>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
      <div className="hidden lg:flex bg-primary items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/90 z-10" />
        <div className="relative z-20 max-w-lg text-primary-foreground">
          <h2 className="text-4xl font-bold mb-6">Automate your customer support</h2>
          <p className="text-xl text-primary-foreground/80 mb-8">Deploy an AI assistant in minutes. Capture leads, answer questions, and boost your sales while you sleep.</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary-foreground/10 p-6 rounded-xl backdrop-blur-sm border border-primary-foreground/20">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-primary-foreground/80 text-sm">Instant responses</div>
            </div>
            <div className="bg-primary-foreground/10 p-6 rounded-xl backdrop-blur-sm border border-primary-foreground/20">
              <div className="text-3xl font-bold mb-2">3x</div>
              <div className="text-primary-foreground/80 text-sm">More leads captured</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
