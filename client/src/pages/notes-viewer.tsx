import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, BookOpen, FileQuestion, Sparkles } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Subject, GeneratedNotes } from "@shared/schema";

export default function NotesViewer() {
  const [, setLocation] = useLocation();
  const [subject, setSubject] = useState<Subject | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const subjectData = localStorage.getItem("selectedSubject");
    if (!subjectData) {
      setLocation("/subject");
      return;
    }
    setSubject(JSON.parse(subjectData));
  }, [setLocation]);

  const { data: notes, isLoading } = useQuery<GeneratedNotes>({
    queryKey: ["/api/notes", subject?.code],
    queryFn: async () => {
      const response = await fetch(`/api/notes/${subject?.code}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error("Failed to fetch notes");
      }
      return response.json();
    },
    enabled: !!subject,
  });

  const generateNotesMutation = useMutation({
    mutationFn: async () => {
      if (!subject) return;
      const uid = localStorage.getItem("studentUID") || "default";
      return await apiRequest("POST", "/api/notes/generate", {
        subject: subject.name,
        code: subject.code,
        uid,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes", subject?.code] });
      toast({
        title: "Notes Generated",
        description: "Your study notes have been created successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate notes. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleBack = () => {
    setLocation("/subject");
  };

  const handleTakeQuiz = () => {
    setLocation("/quiz");
  };

  const handleViewFAQs = () => {
    setLocation("/faq");
  };

  if (!subject) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border sticky top-0 bg-background z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="gap-2"
                data-testid="button-back"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-xl font-semibold text-foreground flex items-center gap-2" data-testid="text-subject-name">
                  <BookOpen className="w-5 h-5 text-primary" />
                  {subject.name}
                </h1>
                <p className="text-sm text-muted-foreground" data-testid="text-subject-code">
                  {subject.code}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleViewFAQs}
                className="gap-2"
                data-testid="button-view-faqs"
              >
                <FileQuestion className="w-4 h-4" />
                View FAQs
              </Button>
              <Button
                onClick={handleTakeQuiz}
                className="gap-2"
                data-testid="button-take-quiz"
              >
                <Sparkles className="w-4 h-4" />
                Take Quiz
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        {isLoading ? (
          <Card className="p-8" data-testid="loading-skeleton">
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-6 w-1/2 mt-6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </Card>
        ) : notes ? (
          <Card className="p-8" data-testid="notes-content">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="prose prose-invert max-w-none">
                <div
                  className="text-foreground space-y-4"
                  dangerouslySetInnerHTML={{ __html: notes.content }}
                  data-testid="text-notes-content"
                />
              </div>
            </ScrollArea>
          </Card>
        ) : (
          <Card className="p-12 text-center" data-testid="empty-state">
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8 text-primary" data-testid="icon-empty" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-foreground" data-testid="text-empty-title">
                  No Notes Available
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto" data-testid="text-empty-desc">
                  Generate AI-powered study notes for {subject.name} to get started with your learning journey.
                </p>
              </div>
              <Button
                onClick={() => generateNotesMutation.mutate()}
                disabled={generateNotesMutation.isPending}
                className="gap-2"
                data-testid="button-generate-notes"
              >
                <Sparkles className="w-4 h-4" />
                {generateNotesMutation.isPending ? "Generating..." : "Generate Notes"}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
