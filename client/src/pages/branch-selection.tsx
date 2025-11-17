import { useEffect } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Cpu, Wrench, Plane, Building2, Zap, TestTube } from "lucide-react";
import type { Branch } from "@shared/schema";

const branches: Branch[] = [
  {
    id: "cse",
    name: "Computer Science Engineering",
    description: "Software, algorithms, and computing systems",
  },
  {
    id: "mechanical",
    name: "Mechanical Engineering",
    description: "Design, analysis, and manufacturing",
  },
  {
    id: "aerospace",
    name: "Aerospace Engineering",
    description: "Aircraft and spacecraft systems",
  },
  {
    id: "civil",
    name: "Civil Engineering",
    description: "Infrastructure and construction",
  },
  {
    id: "electrical",
    name: "Electrical Engineering",
    description: "Power systems and electronics",
  },
  {
    id: "chemical",
    name: "Chemical Engineering",
    description: "Process design and chemical production",
  },
];

const branchIcons = {
  cse: Cpu,
  mechanical: Wrench,
  aerospace: Plane,
  civil: Building2,
  electrical: Zap,
  chemical: TestTube,
};

export default function BranchSelection() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const uid = localStorage.getItem("studentUID");
    if (!uid) {
      setLocation("/");
    }
  }, [setLocation]);

  const handleBranchSelect = (branchId: string) => {
    localStorage.setItem("selectedBranch", branchId);
    setLocation("/year");
  };

  const handleBack = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
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
            Select Your Engineering Branch
          </h1>
          <p className="text-lg text-muted-foreground" data-testid="text-page-subtitle">
            Choose your field of study to get personalized content
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch) => {
            const Icon = branchIcons[branch.id as keyof typeof branchIcons];
            return (
              <Card
                key={branch.id}
                className="p-6 hover-elevate active-elevate-2 cursor-pointer transition-all border-card-border"
                onClick={() => handleBranchSelect(branch.id)}
                data-testid={`card-branch-${branch.id}`}
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" data-testid={`icon-branch-${branch.id}`} />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground" data-testid={`text-branch-name-${branch.id}`}>
                      {branch.name}
                    </h3>
                    <p className="text-sm text-muted-foreground" data-testid={`text-branch-desc-${branch.id}`}>
                      {branch.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
