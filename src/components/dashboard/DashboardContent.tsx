'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Stethoscope, BookText } from 'lucide-react';

interface DashboardContentProps {
  setActiveView: (view: string) => void;
}

export function DashboardContent({ setActiveView }: DashboardContentProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Welcome to MediMind AI</h1>
        <p className="text-muted-foreground">Your intelligent assistant for medical analysis and planning.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setActiveView('analyzer')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">AI Report Analyzer</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">Analyze Notes</div>
            <p className="text-xs text-muted-foreground">
              Get diagnoses from patient notes or documents.
            </p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setActiveView('planner')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">AI Treatment Planner</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">Create Plans</div>
            <p className="text-xs text-muted-foreground">
              Generate detailed treatment plans based on analysis.
            </p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setActiveView('summarizer')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">AI Document Summarizer</CardTitle>
            <BookText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">Summarize Docs</div>
            <p className="text-xs text-muted-foreground">
              Condense long medical articles into key points.
            </p>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="font-headline">How it Works</CardTitle>
          <CardDescription>
            Leverage the power of AI to streamline your workflow.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
           <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold">Input Data</h3>
                <p className="text-muted-foreground">Choose a tool and provide your medical text—patient notes, analysis results, or a lengthy document.</p>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold">AI Processing</h3>
                <p className="text-muted-foreground">Our advanced AI models analyze the content to generate diagnoses, treatment plans, or summaries.</p>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold">Review Results</h3>
                <p className="text-muted-foreground">Receive a structured, easy-to-read output to inform your clinical decisions.</p>
              </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
