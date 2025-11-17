import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Sparkles, CheckCircle2, XCircle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Subject, QuizQuestion } from "@shared/schema";

export default function Quiz() {
  const [, setLocation] = useLocation();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const subjectData = localStorage.getItem("selectedSubject");
    if (!subjectData) {
      setLocation("/subject");
      return;
    }
    setSubject(JSON.parse(subjectData));
  }, [setLocation]);

  const { data: questions, isLoading } = useQuery<QuizQuestion[]>({
    queryKey: ["/api/quiz/questions", subject?.code],
    queryFn: async () => {
      const response = await fetch(`/api/quiz/questions/${subject?.code}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error("Failed to fetch quiz questions");
      }
      return response.json();
    },
    enabled: !!subject,
  });

  const generateQuizMutation = useMutation({
    mutationFn: async () => {
      if (!subject) return;
      const uid = localStorage.getItem("studentUID") || "default";
      return await apiRequest("POST", "/api/quiz/generate", {
        subject: subject.name,
        code: subject.code,
        uid,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quiz/questions", subject?.code] });
      toast({
        title: "Quiz Generated",
        description: "Your practice quiz is ready!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate quiz. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (questions) {
      setUserAnswers(new Array(questions.length).fill(null));
    }
  }, [questions]);

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...userAnswers];
      newAnswers[currentQuestion] = selectedAnswer;
      setUserAnswers(newAnswers);
    }

    if (currentQuestion < (questions?.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(userAnswers[currentQuestion + 1]);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(userAnswers[currentQuestion - 1]);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...userAnswers];
      newAnswers[currentQuestion] = selectedAnswer;
      setUserAnswers(newAnswers);
    }
    setShowResults(true);
  };

  const calculateScore = () => {
    if (!questions) return 0;
    return userAnswers.reduce((score, answer, index) => {
      return score + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  const handleBack = () => {
    setLocation("/notes");
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setUserAnswers(new Array(questions?.length || 0).fill(null));
    setShowResults(false);
  };

  if (!subject) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <Button variant="ghost" onClick={handleBack} className="gap-2" data-testid="button-back">
            <ArrowLeft className="w-4 h-4" />
            Back to Notes
          </Button>
          <Card className="p-8">
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <Button variant="ghost" onClick={handleBack} className="gap-2" data-testid="button-back">
            <ArrowLeft className="w-4 h-4" />
            Back to Notes
          </Button>
          <Card className="p-12 text-center" data-testid="empty-state">
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-primary" data-testid="icon-empty" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-foreground" data-testid="text-empty-title">
                  No Quiz Available
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto" data-testid="text-empty-desc">
                  Generate a practice quiz for {subject.name} to test your knowledge.
                </p>
              </div>
              <Button
                onClick={() => generateQuizMutation.mutate()}
                disabled={generateQuizMutation.isPending}
                className="gap-2"
                data-testid="button-generate-quiz"
              >
                <Sparkles className="w-4 h-4" />
                {generateQuizMutation.isPending ? "Generating..." : "Generate Quiz"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <Button variant="ghost" onClick={handleBack} className="gap-2" data-testid="button-back">
            <ArrowLeft className="w-4 h-4" />
            Back to Notes
          </Button>

          <Card className="p-8" data-testid="results-card">
            <div className="text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-12 h-12 text-primary" data-testid="icon-results" />
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-foreground" data-testid="text-results-title">
                  Quiz Complete!
                </h2>
                <p className="text-lg text-muted-foreground" data-testid="text-results-subtitle">
                  Here's how you performed
                </p>
              </div>

              <div className="space-y-4">
                <div className="text-6xl font-bold text-primary" data-testid="text-score">
                  {score}/{questions.length}
                </div>
                <div className="text-2xl text-muted-foreground" data-testid="text-percentage">
                  {percentage}%
                </div>
              </div>

              <div className="space-y-4 pt-6">
                {questions.map((q, index) => (
                  <div
                    key={index}
                    className="text-left p-4 rounded-md bg-muted/30 space-y-2"
                    data-testid={`result-question-${index}`}
                  >
                    <div className="flex items-start gap-2">
                      {userAnswers[index] === q.correctAnswer ? (
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-foreground" data-testid={`result-question-text-${index}`}>
                          {q.question}
                        </p>
                        {userAnswers[index] !== q.correctAnswer && (
                          <p className="text-sm text-muted-foreground mt-1" data-testid={`result-correct-answer-${index}`}>
                            Correct answer: {q.options[q.correctAnswer]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 justify-center pt-4">
                <Button variant="outline" onClick={handleBack} data-testid="button-back-to-notes">
                  Back to Notes
                </Button>
                <Button onClick={handleRetake} data-testid="button-retake">
                  Retake Quiz
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" onClick={handleBack} className="gap-2" data-testid="button-back">
          <ArrowLeft className="w-4 h-4" />
          Back to Notes
        </Button>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground" data-testid="text-question-counter">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-primary" data-testid="text-progress-percentage">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" data-testid="progress-bar" />
        </div>

        <Card className="p-8" data-testid="question-card">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground" data-testid="text-question">
              {question.question}
            </h2>

            <RadioGroup
              value={selectedAnswer?.toString()}
              onValueChange={(value) => setSelectedAnswer(parseInt(value))}
            >
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-4 rounded-md border border-border hover-elevate cursor-pointer"
                    onClick={() => setSelectedAnswer(index)}
                    data-testid={`option-${index}`}
                  >
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer text-base"
                      data-testid={`label-option-${index}`}
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                data-testid="button-previous"
              >
                Previous
              </Button>

              {currentQuestion === questions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={selectedAnswer === null}
                  data-testid="button-submit"
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={selectedAnswer === null}
                  data-testid="button-next"
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
