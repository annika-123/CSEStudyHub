import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import type { Subject } from "@shared/schema";

const subjectsByBranchAndYear: Record<string, Record<number, Subject[]>> = {
  cse: {
    1: [
      { code: "CS101", name: "Introduction to Programming", year: 1, branch: "cse" },
      { code: "CS102", name: "Data Structures", year: 1, branch: "cse" },
      { code: "MA101", name: "Engineering Mathematics I", year: 1, branch: "cse" },
      { code: "PH101", name: "Engineering Physics", year: 1, branch: "cse" },
    ],
    2: [
      { code: "CS201", name: "Algorithms", year: 2, branch: "cse" },
      { code: "CS202", name: "Database Management Systems", year: 2, branch: "cse" },
      { code: "CS203", name: "Computer Networks", year: 2, branch: "cse" },
      { code: "CS204", name: "Operating Systems", year: 2, branch: "cse" },
    ],
    3: [
      { code: "CS301", name: "Machine Learning", year: 3, branch: "cse" },
      { code: "CS302", name: "Compiler Design", year: 3, branch: "cse" },
      { code: "CS303", name: "Software Engineering", year: 3, branch: "cse" },
      { code: "CS304", name: "Web Technologies", year: 3, branch: "cse" },
    ],
    4: [
      { code: "CS401", name: "Artificial Intelligence", year: 4, branch: "cse" },
      { code: "CS402", name: "Cloud Computing", year: 4, branch: "cse" },
      { code: "CS403", name: "Blockchain Technology", year: 4, branch: "cse" },
      { code: "CS404", name: "Final Year Project", year: 4, branch: "cse" },
    ],
  },
  mechanical: {
    1: [
      { code: "ME101", name: "Engineering Drawing", year: 1, branch: "mechanical" },
      { code: "ME102", name: "Engineering Mechanics", year: 1, branch: "mechanical" },
      { code: "MA101", name: "Engineering Mathematics I", year: 1, branch: "mechanical" },
      { code: "CH101", name: "Engineering Chemistry", year: 1, branch: "mechanical" },
    ],
    2: [
      { code: "ME201", name: "Thermodynamics", year: 2, branch: "mechanical" },
      { code: "ME202", name: "Fluid Mechanics", year: 2, branch: "mechanical" },
      { code: "ME203", name: "Manufacturing Processes", year: 2, branch: "mechanical" },
      { code: "ME204", name: "Strength of Materials", year: 2, branch: "mechanical" },
    ],
    3: [
      { code: "ME301", name: "Heat Transfer", year: 3, branch: "mechanical" },
      { code: "ME302", name: "Machine Design", year: 3, branch: "mechanical" },
      { code: "ME303", name: "Control Systems", year: 3, branch: "mechanical" },
      { code: "ME304", name: "CAD/CAM", year: 3, branch: "mechanical" },
    ],
    4: [
      { code: "ME401", name: "Automobile Engineering", year: 4, branch: "mechanical" },
      { code: "ME402", name: "Robotics", year: 4, branch: "mechanical" },
      { code: "ME403", name: "Finite Element Analysis", year: 4, branch: "mechanical" },
      { code: "ME404", name: "Final Year Project", year: 4, branch: "mechanical" },
    ],
  },
  aerospace: {
    1: [
      { code: "AE101", name: "Introduction to Aerospace", year: 1, branch: "aerospace" },
      { code: "AE102", name: "Engineering Mechanics", year: 1, branch: "aerospace" },
      { code: "MA101", name: "Engineering Mathematics I", year: 1, branch: "aerospace" },
      { code: "PH101", name: "Engineering Physics", year: 1, branch: "aerospace" },
    ],
    2: [
      { code: "AE201", name: "Aerodynamics", year: 2, branch: "aerospace" },
      { code: "AE202", name: "Aircraft Structures", year: 2, branch: "aerospace" },
      { code: "AE203", name: "Propulsion Systems", year: 2, branch: "aerospace" },
      { code: "AE204", name: "Flight Mechanics", year: 2, branch: "aerospace" },
    ],
    3: [
      { code: "AE301", name: "Aircraft Design", year: 3, branch: "aerospace" },
      { code: "AE302", name: "Spacecraft Dynamics", year: 3, branch: "aerospace" },
      { code: "AE303", name: "Avionics", year: 3, branch: "aerospace" },
      { code: "AE304", name: "Composite Materials", year: 3, branch: "aerospace" },
    ],
    4: [
      { code: "AE401", name: "Rocket Propulsion", year: 4, branch: "aerospace" },
      { code: "AE402", name: "UAV Systems", year: 4, branch: "aerospace" },
      { code: "AE403", name: "Space Mission Design", year: 4, branch: "aerospace" },
      { code: "AE404", name: "Final Year Project", year: 4, branch: "aerospace" },
    ],
  },
  civil: {
    1: [
      { code: "CE101", name: "Engineering Drawing", year: 1, branch: "civil" },
      { code: "CE102", name: "Engineering Mechanics", year: 1, branch: "civil" },
      { code: "MA101", name: "Engineering Mathematics I", year: 1, branch: "civil" },
      { code: "CH101", name: "Engineering Chemistry", year: 1, branch: "civil" },
    ],
    2: [
      { code: "CE201", name: "Structural Analysis", year: 2, branch: "civil" },
      { code: "CE202", name: "Fluid Mechanics", year: 2, branch: "civil" },
      { code: "CE203", name: "Surveying", year: 2, branch: "civil" },
      { code: "CE204", name: "Building Materials", year: 2, branch: "civil" },
    ],
    3: [
      { code: "CE301", name: "Concrete Technology", year: 3, branch: "civil" },
      { code: "CE302", name: "Geotechnical Engineering", year: 3, branch: "civil" },
      { code: "CE303", name: "Transportation Engineering", year: 3, branch: "civil" },
      { code: "CE304", name: "Water Resources", year: 3, branch: "civil" },
    ],
    4: [
      { code: "CE401", name: "Earthquake Engineering", year: 4, branch: "civil" },
      { code: "CE402", name: "Construction Management", year: 4, branch: "civil" },
      { code: "CE403", name: "Environmental Engineering", year: 4, branch: "civil" },
      { code: "CE404", name: "Final Year Project", year: 4, branch: "civil" },
    ],
  },
  electrical: {
    1: [
      { code: "EE101", name: "Basic Electrical Engineering", year: 1, branch: "electrical" },
      { code: "EE102", name: "Circuit Theory", year: 1, branch: "electrical" },
      { code: "MA101", name: "Engineering Mathematics I", year: 1, branch: "electrical" },
      { code: "PH101", name: "Engineering Physics", year: 1, branch: "electrical" },
    ],
    2: [
      { code: "EE201", name: "Electromagnetic Fields", year: 2, branch: "electrical" },
      { code: "EE202", name: "Power Systems", year: 2, branch: "electrical" },
      { code: "EE203", name: "Control Systems", year: 2, branch: "electrical" },
      { code: "EE204", name: "Electrical Machines", year: 2, branch: "electrical" },
    ],
    3: [
      { code: "EE301", name: "Power Electronics", year: 3, branch: "electrical" },
      { code: "EE302", name: "Digital Signal Processing", year: 3, branch: "electrical" },
      { code: "EE303", name: "Microprocessors", year: 3, branch: "electrical" },
      { code: "EE304", name: "Renewable Energy Systems", year: 3, branch: "electrical" },
    ],
    4: [
      { code: "EE401", name: "Smart Grid Technology", year: 4, branch: "electrical" },
      { code: "EE402", name: "Electric Vehicles", year: 4, branch: "electrical" },
      { code: "EE403", name: "IoT and Automation", year: 4, branch: "electrical" },
      { code: "EE404", name: "Final Year Project", year: 4, branch: "electrical" },
    ],
  },
  chemical: {
    1: [
      { code: "CH101", name: "Chemical Engineering Principles", year: 1, branch: "chemical" },
      { code: "CH102", name: "Process Calculations", year: 1, branch: "chemical" },
      { code: "MA101", name: "Engineering Mathematics I", year: 1, branch: "chemical" },
      { code: "PH101", name: "Engineering Physics", year: 1, branch: "chemical" },
    ],
    2: [
      { code: "CH201", name: "Thermodynamics", year: 2, branch: "chemical" },
      { code: "CH202", name: "Fluid Mechanics", year: 2, branch: "chemical" },
      { code: "CH203", name: "Heat Transfer", year: 2, branch: "chemical" },
      { code: "CH204", name: "Mass Transfer", year: 2, branch: "chemical" },
    ],
    3: [
      { code: "CH301", name: "Chemical Reaction Engineering", year: 3, branch: "chemical" },
      { code: "CH302", name: "Process Control", year: 3, branch: "chemical" },
      { code: "CH303", name: "Industrial Chemistry", year: 3, branch: "chemical" },
      { code: "CH304", name: "Process Equipment Design", year: 3, branch: "chemical" },
    ],
    4: [
      { code: "CH401", name: "Petrochemical Engineering", year: 4, branch: "chemical" },
      { code: "CH402", name: "Environmental Engineering", year: 4, branch: "chemical" },
      { code: "CH403", name: "Process Safety", year: 4, branch: "chemical" },
      { code: "CH404", name: "Final Year Project", year: 4, branch: "chemical" },
    ],
  },
};

export default function SubjectSelection() {
  const [, setLocation] = useLocation();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [branchName, setBranchName] = useState("");

  useEffect(() => {
    const branch = localStorage.getItem("selectedBranch");
    const year = parseInt(localStorage.getItem("selectedYear") || "1");

    if (!branch || !year) {
      setLocation("/");
      return;
    }

    const branchSubjects = subjectsByBranchAndYear[branch]?.[year] || [];
    setSubjects(branchSubjects);

    const branchNames: Record<string, string> = {
      cse: "Computer Science Engineering",
      mechanical: "Mechanical Engineering",
      aerospace: "Aerospace Engineering",
      civil: "Civil Engineering",
      electrical: "Electrical Engineering",
      chemical: "Chemical Engineering",
    };
    setBranchName(branchNames[branch] || branch.toUpperCase());
  }, [setLocation]);

  const handleSubjectSelect = (subject: Subject) => {
    localStorage.setItem("selectedSubject", JSON.stringify(subject));
    setLocation("/notes");
  };

  const handleBack = () => {
    setLocation("/year");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
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

        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-4xl font-bold text-foreground" data-testid="text-page-title">
              Select Your Subject
            </h1>
            <Badge variant="secondary" className="text-sm" data-testid="badge-branch">
              {branchName}
            </Badge>
          </div>
          <p className="text-lg text-muted-foreground" data-testid="text-page-subtitle">
            Choose a subject to access notes, quizzes, and FAQs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map((subject) => (
            <Card
              key={subject.code}
              className="p-6 hover-elevate active-elevate-2 cursor-pointer transition-all border-card-border"
              onClick={() => handleSubjectSelect(subject)}
              data-testid={`card-subject-${subject.code}`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <h3 className="text-xl font-semibold text-foreground" data-testid={`text-subject-name-${subject.code}`}>
                      {subject.name}
                    </h3>
                    <p className="text-sm text-muted-foreground" data-testid={`text-subject-code-${subject.code}`}>
                      {subject.code}
                    </p>
                  </div>
                  <Badge variant="outline" className="flex-shrink-0" data-testid={`badge-year-${subject.code}`}>
                    Year {subject.year}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
