import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { YearInfo } from "@shared/schema";

const years: YearInfo[] = [
  {
    year: 1,
    title: "Foundation Year",
    description: "Laying the groundwork for your engineering journey.",
  },
  {
    year: 2,
    title: "Core Subjects",
    description: "Diving into fundamental concepts and theories.",
  },
  {
    year: 3,
    title: "Advanced Topics",
    description: "Exploring specialized areas and complex problems.",
  },
  {
    year: 4,
    title: "Specialization & Project",
    description: "Applying your knowledge to real-world challenges.",
  },
];

export default function YearSelection() {
  const [, setLocation] = useLocation();

  const handleYearSelect = (year: number) => {
    localStorage.setItem("selectedYear", year.toString());
    setLocation("/subject");
  };

  const handleBack = () => {
    setLocation("/branch");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="gap-2"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground" data-testid="text-page-title">
            Welcome, Valued Student!
          </h1>
          <p className="text-lg text-muted-foreground" data-testid="text-page-subtitle">
            Select your current year to personalize your dashboard.
          </p>
        </div>

        <div className="space-y-4">
          {years.map((yearInfo) => (
            <Card
              key={yearInfo.year}
              className="p-6 hover-elevate active-elevate-2 cursor-pointer transition-all border-card-border"
              onClick={() => handleYearSelect(yearInfo.year)}
              data-testid={`card-year-${yearInfo.year}`}
            >
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary" data-testid={`text-year-number-${yearInfo.year}`}>
                      {yearInfo.year}
                      <sup className="text-xs">
                        {yearInfo.year === 1 ? "st" : yearInfo.year === 2 ? "nd" : yearInfo.year === 3 ? "rd" : "th"}
                      </sup>
                    </span>
                  </div>
                </div>
                
                <div className="flex-1 space-y-1">
                  <h3 className="text-xl font-semibold text-foreground" data-testid={`text-year-title-${yearInfo.year}`}>
                    {yearInfo.title}
                  </h3>
                  <p className="text-muted-foreground" data-testid={`text-year-desc-${yearInfo.year}`}>
                    {yearInfo.description}
                  </p>
                </div>

                <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" data-testid={`icon-arrow-${yearInfo.year}`} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
