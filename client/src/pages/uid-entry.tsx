import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen } from "lucide-react";

export default function UIDEntry() {
  const [, setLocation] = useLocation();
  const [uid, setUid] = useState("");

  const handleContinue = () => {
    if (uid.trim()) {
      localStorage.setItem("studentUID", uid.trim());
      setLocation("/branch");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-8">
            <BookOpen className="w-10 h-10 text-primary" data-testid="icon-logo" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent" data-testid="text-app-title">
              CSE Note Finder
            </h1>
          </div>
          
          <h2 className="text-3xl font-bold text-foreground" data-testid="text-welcome">
            Welcome, Valued Student!
          </h2>
          
          <p className="text-muted-foreground text-lg" data-testid="text-subtitle">
            Enter your student UID to begin your learning journey
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter your UID (e.g., STU2024001)"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleContinue()}
              className="h-14 text-lg border-border focus:border-primary transition-colors"
              data-testid="input-uid"
            />
          </div>

          <Button
            onClick={handleContinue}
            disabled={!uid.trim()}
            className="w-full h-14 text-lg font-semibold"
            data-testid="button-continue"
          >
            Continue
          </Button>

          <p className="text-sm text-muted-foreground text-center" data-testid="text-info">
            Access personalized study materials, quizzes, and FAQs
          </p>
        </div>
      </div>
    </div>
  );
}
