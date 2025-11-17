import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Search, Sparkles, HelpCircle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Subject, Faq } from "@shared/schema";

export default function FAQPage() {
  const [, setLocation] = useLocation();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const uid = localStorage.getItem("studentUID");
    if (!uid) {
      setLocation("/");
      return;
    }
    
    const subjectData = localStorage.getItem("selectedSubject");
    if (!subjectData) {
      setLocation("/subject");
      return;
    }
    setSubject(JSON.parse(subjectData));
  }, [setLocation]);

  const { data: faqs, isLoading } = useQuery<Faq[]>({
    queryKey: ["/api/faq", subject?.code],
    queryFn: async () => {
      const uid = localStorage.getItem("studentUID");
      if (!uid) {
        throw new Error("UID not found");
      }
      const response = await fetch(`/api/faq/${subject?.code}?uid=${encodeURIComponent(uid)}`);
      if (!response.ok) {
        throw new Error("Failed to fetch FAQs");
      }
      return response.json();
    },
    enabled: !!subject,
  });

  const generateFAQsMutation = useMutation({
    mutationFn: async () => {
      if (!subject) return;
      const uid = localStorage.getItem("studentUID");
      if (!uid) {
        throw new Error("UID not found. Please restart from the beginning.");
      }
      return await apiRequest("POST", "/api/faq/generate", {
        subject: subject.name,
        code: subject.code,
        uid,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faq", subject?.code] });
      toast({
        title: "FAQs Generated",
        description: "Frequently asked questions are now available!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate FAQs. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleBack = () => {
    setLocation("/notes");
  };

  const filteredFaqs = faqs?.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!subject) return null;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="gap-2"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Notes
          </Button>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground" data-testid="text-page-title">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground" data-testid="text-page-subtitle">
            {subject.name} ({subject.code})
          </p>
        </div>

        {isLoading ? (
          <Card className="p-8">
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </Card>
        ) : faqs && faqs.length > 0 ? (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" data-testid="icon-search" />
              <Input
                type="search"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
                data-testid="input-search"
              />
            </div>

            {filteredFaqs && filteredFaqs.length > 0 ? (
              <Card className="p-6" data-testid="faq-list">
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem key={faq.id} value={`item-${index}`} data-testid={`faq-item-${index}`}>
                      <AccordionTrigger className="text-left hover:text-primary transition-colors" data-testid={`faq-question-${index}`}>
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground" data-testid={`faq-answer-${index}`}>
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            ) : (
              <Card className="p-12 text-center" data-testid="no-results">
                <div className="space-y-4">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto" data-testid="icon-no-results" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground" data-testid="text-no-results-title">
                      No Results Found
                    </h3>
                    <p className="text-muted-foreground" data-testid="text-no-results-desc">
                      Try adjusting your search query
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </>
        ) : (
          <Card className="p-12 text-center" data-testid="empty-state">
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <HelpCircle className="w-8 h-8 text-primary" data-testid="icon-empty" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-foreground" data-testid="text-empty-title">
                  No FAQs Available
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto" data-testid="text-empty-desc">
                  Generate frequently asked questions for {subject.name} to get quick answers to common queries.
                </p>
              </div>
              <Button
                onClick={() => generateFAQsMutation.mutate()}
                disabled={generateFAQsMutation.isPending}
                className="gap-2"
                data-testid="button-generate-faq"
              >
                <Sparkles className="w-4 h-4" />
                {generateFAQsMutation.isPending ? "Generating..." : "Generate FAQs"}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
