'use client';

import { useState } from 'react';
import type { AnalyzePatientNotesInput, AnalyzePatientNotesOutput } from '@/ai/flows/analyze-patient-notes';
import { analyzePatientNotes } from '@/ai/flows/analyze-patient-notes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Download, Loader2, Upload, X, ListOrdered, FileText, BrainCircuit } from 'lucide-react';
import { Progress } from '../ui/progress';
import { Input } from '../ui/input';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { UserMd } from '../icons';

interface ReportAnalyzerProps {
  setAnalysisResult: (result: AnalyzePatientNotesOutput & { advancements?: string }) => void;
  setActiveView: (view: string) => void;
}

export function ReportAnalyzer({ setAnalysisResult, setActiveView }: ReportAnalyzerProps) {
  const [notes, setNotes] = useState('');
  const [guidelines, setGuidelines] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzePatientNotesOutput | null>(null);
  const { toast } = useToast();
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [advancements, setAdvancements] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
            if (file.type.startsWith('image/')) {
              setPhotoDataUri(result);
              setNotes((prev) => (prev ? prev : `Analyzing uploaded image: ${file.name}`));
            } else {
              setNotes(result);
              setPhotoDataUri(null);
            }
            toast({
              title: 'File Loaded',
              description: `Successfully loaded content from ${file.name}.`,
            });
        }
      };
      reader.onerror = () => {
          toast({
              variant: 'destructive',
              title: 'File Read Error',
              description: 'Could not read the contents of the selected file.',
          });
      };
      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    }
     // Reset file input to allow uploading the same file again
    event.target.value = '';
  };

  const handleSubmit = async () => {
    if (!notes && !photoDataUri) {
      toast({
        variant: 'destructive',
        title: 'Input required',
        description: 'Please enter patient notes or upload a document to analyze.',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const input: AnalyzePatientNotesInput = { notes, treatmentPlanGuidelines: guidelines, advancementsAndResults: advancements };
      if (photoDataUri) {
        input.photoDataUri = photoDataUri;
      }
      const analysisResult = await analyzePatientNotes(input);
      setResult(analysisResult);
      setAnalysisResult({...analysisResult, advancements }); // Pass result to parent
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'An error occurred while analyzing the notes. Please try again.',
      });
    }
    setIsLoading(false);
  };

  const handleGeneratePlan = () => {
    if (result) {
        setAnalysisResult({...result, advancements});
        setActiveView('planner');
    }
  };

  const clearPhoto = () => {
    setPhotoDataUri(null);
    if (notes.startsWith('Analyzing uploaded image:')) {
        setNotes('');
    }
  }

  const handleDownload = () => {
    if (!result) return;
    const fileContent = `
# MediMind AI Analysis Result

## Primary Diagnosis
**${result.primaryDiagnosis}**

## Urgency
**${result.urgency}**

## Confidence Score
**${Math.round(result.confidenceScore * 100)}%**

---

## Recommended Specialists
${result.recommendedSpecialists.map(s => `- ${s}`).join('\n')}

---

## Differential Diagnoses
${result.differentialDiagnoses.map(d => `- ${d}`).join('\n')}

---

## Diagnostic Reasoning

### Based on Notes
${result.diagnosticReasoning.notesAnalysis}

### Based on Image
${result.diagnosticReasoning.imageAnalysis || 'N/A'}
    `;
    const blob = new Blob([fileContent.trim()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analysis-result.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const UrgencyBadge = ({ urgency }: { urgency: AnalyzePatientNotesOutput['urgency'] }) => {
    const variant = {
        "Low": "default",
        "Medium": "secondary",
        "High": "outline",
        "Critical": "destructive"
    }[urgency];

    return <Badge variant={variant as any}>{urgency}</Badge>
  }


  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">AI Report Analyzer</CardTitle>
          <CardDescription>Paste patient notes, or upload a document for analysis.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload Document or Image</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file-upload"
                type="file"
                className="hidden"
                accept="text/*,image/*"
                onChange={handleFileChange}
                disabled={isLoading}
              />
              <label
                htmlFor="file-upload"
                className="flex-1"
              >
                  <Button asChild variant="outline" disabled={isLoading} className="cursor-pointer">
                    <div>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload file
                    </div>
                  </Button>
              </label>
            </div>
            {photoDataUri && (
                <div className="relative mt-2 rounded-md border border-input p-2 max-w-[200px]">
                    <Image src={photoDataUri} alt="Uploaded document" width={200} height={200} className="rounded-md object-contain" />
                    <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 bg-background/50 hover:bg-background/80" onClick={clearPhoto}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}
          </div>
          <div className="relative space-y-2">
             <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background px-2 text-xs text-muted-foreground">OR</div>
             <hr />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patient-notes">Patient Notes</Label>
            <Textarea
              id="patient-notes"
              placeholder="Enter patient symptoms, history, and observations..."
              className="min-h-[200px]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guidelines">Optional: Treatment Plan Guidelines</Label>
            <Textarea
              id="guidelines"
              placeholder="e.g., 'Consider medication allergies', 'Patient prefers non-invasive options.'"
              value={guidelines}
              onChange={(e) => setGuidelines(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="advancements">Optional: Advancements and Results</Label>
            <Textarea
              id="advancements"
              placeholder="e.g., 'Incorporate findings from recent JAMA articles on this condition.'"
              value={advancements}
              onChange={(e) => setAdvancements(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Analyze Notes
          </Button>
        </CardFooter>
      </Card>
      
      <div className="space-y-6">
        {isLoading && (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Analysis in Progress</CardTitle>
                    <CardDescription>The AI is processing the medical data. Please wait.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-12">
                     <Loader2 className="h-16 w-16 animate-spin text-primary" />
                </CardContent>
            </Card>
        )}
        {result && (
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="font-headline">Analysis Complete</CardTitle>
                <CardDescription>Review the AI-generated diagnostic insights below.</CardDescription>
              </div>
               <Button variant="outline" size="icon" onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Download Analysis</span>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className='p-4 rounded-lg bg-secondary/50'>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Primary Diagnosis</h3>
                    <UrgencyBadge urgency={result.urgency} />
                  </div>
                  <p className="text-xl font-bold text-primary">{result.primaryDiagnosis}</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Confidence Score: {Math.round(result.confidenceScore * 100)}%</h3>
                <Progress value={result.confidenceScore * 100} className="w-full" />
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2"><UserMd /> Recommended Specialists</h3>
                <div className="flex flex-wrap gap-2">
                    {result.recommendedSpecialists.map((specialist, index) => (
                        <Badge key={index} variant="secondary">{specialist}</Badge>
                    ))}
                </div>
              </div>

              <Accordion type="single" collapsible className="w-full" defaultValue='reasoning'>
                <AccordionItem value="differentials">
                  <AccordionTrigger className='text-base font-semibold'><ListOrdered className='mr-2'/>Differential Diagnoses</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-decimal list-inside space-y-2 text-sm text-muted-foreground pl-2">
                      {result.differentialDiagnoses.map((diag, index) => (
                        <li key={index}>{diag}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="reasoning">
                  <AccordionTrigger className='text-base font-semibold'><BrainCircuit className='mr-2' />Diagnostic Reasoning</AccordionTrigger>
                  <AccordionContent className='space-y-4'>
                    <div>
                        <h4 className="font-semibold mb-1 flex items-center gap-2"><FileText size={16}/>From Notes</h4>
                        <p className="text-sm text-muted-foreground bg-background/50 p-3 rounded-md">{result.diagnosticReasoning.notesAnalysis}</p>
                    </div>
                    {result.diagnosticReasoning.imageAnalysis && (
                        <div>
                            <h4 className="font-semibold mb-1 flex items-center gap-2"><X size={16}/>From Image</h4>
                            <p className="text-sm text-muted-foreground bg-background/50 p-3 rounded-md">{result.diagnosticReasoning.imageAnalysis}</p>
                        </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
             
            </CardContent>
            <CardFooter>
                <Button onClick={handleGeneratePlan}>
                    Generate Treatment Plan
                </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
