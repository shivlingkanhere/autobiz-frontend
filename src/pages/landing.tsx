import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Bot, MessageSquare, Zap, BarChart3, CheckCircle2, ArrowRight } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">A</span>
            </div>
            <span className="text-xl font-bold tracking-tight">AutoBiz AI</span>
          </div>
          <nav className="hidden md:flex gap-6 items-center text-sm font-medium">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="hidden sm:inline-flex">Log in</Button>
            </Link>
            <Link href="/register">
              <Button>Start Free Trial</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 lg:py-32 overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(hsl(var(--primary)/0.1)_1px,transparent_1px)] [background-size:24px_24px] opacity-50"></div>
          <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-8">
              <Zap className="mr-2 h-4 w-4" />
              AutoBiz AI 2.0 is now live
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-foreground balance">
              Customer support that <span className="text-primary">never sleeps</span>.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Deploy an intelligent AI agent trained on your business data in minutes. Capture leads, answer FAQs, and drive sales 24/7.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto">
                  Build Your Assistant <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto bg-background/50 backdrop-blur-sm">
                  See how it works
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Enterprise-grade AI for everyone</h2>
              <p className="text-muted-foreground text-lg">Stop losing customers because you couldn't reply fast enough. AutoBiz handles the frontline so you can focus on growth.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-card p-8 rounded-2xl border shadow-sm flex flex-col items-center text-center">
                <div className="h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Bot className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Custom Knowledge</h3>
                <p className="text-muted-foreground">Train your assistant on your specific products, policies, and tone of voice. It answers exactly how you want it to.</p>
              </div>
              <div className="bg-card p-8 rounded-2xl border shadow-sm flex flex-col items-center text-center">
                <div className="h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <MessageSquare className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Lead Capture</h3>
                <p className="text-muted-foreground">Automatically collect names, emails, and phone numbers from interested visitors during the conversation.</p>
              </div>
              <div className="bg-card p-8 rounded-2xl border shadow-sm flex flex-col items-center text-center">
                <div className="h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <BarChart3 className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Rich Analytics</h3>
                <p className="text-muted-foreground">Track engagement, view full conversation transcripts, and understand what your customers are asking for.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Simple, transparent pricing</h2>
              <p className="text-muted-foreground text-lg">Start for free, upgrade when you need more power.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Plan */}
              <div className="bg-card rounded-3xl border p-8 flex flex-col">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">Starter</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold">$0</span>
                    <span className="text-muted-foreground font-medium">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">Perfect for trying out AutoBiz AI on your personal site.</p>
                </div>
                <div className="space-y-4 flex-1 mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>1 AI Assistant</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>100 conversations / mo</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Up to 10 custom FAQs</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 opacity-30" />
                    <span>Basic Analytics</span>
                  </div>
                </div>
                <Link href="/register">
                  <Button variant="outline" className="w-full h-12 text-base">Get Started Free</Button>
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="bg-primary text-primary-foreground rounded-3xl border border-primary p-8 flex flex-col relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 bg-primary-foreground/10 px-4 py-1 rounded-bl-xl text-xs font-bold tracking-wider uppercase">Most Popular</div>
                <div className="mb-6 relative z-10">
                  <h3 className="text-2xl font-bold mb-2 text-primary-foreground">Pro</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold">$49</span>
                    <span className="text-primary-foreground/80 font-medium">/month</span>
                  </div>
                  <p className="text-sm text-primary-foreground/80 mt-4">For growing businesses that need serious support power.</p>
                </div>
                <div className="space-y-4 flex-1 mb-8 relative z-10">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                    <span>Unlimited AI Assistants</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                    <span>Unlimited conversations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                    <span>Unlimited FAQs & custom training</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                    <span>Advanced Lead Capture tools</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                    <span>Priority Support</span>
                  </div>
                </div>
                <Link href="/register">
                  <Button className="w-full h-12 text-base bg-background text-primary hover:bg-background/90 z-10 relative">Upgrade to Pro</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-primary rounded md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">A</span>
            </div>
            <span className="font-bold tracking-tight">AutoBiz AI</span>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} AutoBiz AI. All rights reserved.</p>
          <div className="flex gap-4 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Privacy</a>
            <Link href="/admin/login" className="hover:text-foreground">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}