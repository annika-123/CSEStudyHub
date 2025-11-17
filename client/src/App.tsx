import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import UIDEntry from "@/pages/uid-entry";
import BranchSelection from "@/pages/branch-selection";
import YearSelection from "@/pages/year-selection";
import SubjectSelection from "@/pages/subject-selection";
import NotesViewer from "@/pages/notes-viewer";
import Quiz from "@/pages/quiz";
import FAQPage from "@/pages/faq";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={UIDEntry} />
      <Route path="/branch" component={BranchSelection} />
      <Route path="/year" component={YearSelection} />
      <Route path="/subject" component={SubjectSelection} />
      <Route path="/notes" component={NotesViewer} />
      <Route path="/quiz" component={Quiz} />
      <Route path="/faq" component={FAQPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
