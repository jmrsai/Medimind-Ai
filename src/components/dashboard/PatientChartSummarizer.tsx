'use client';

import { useState } from 'react';
import { summarizePatientChart, SummarizePatientChartInput } from '@/ai/flows/summarize-patient-chart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Download, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

const formSchema = z.object({
    demographics: z.string().min(1, 'Demographics are required.'),
    medicalHistory: z.string().min(1, 'Medical history is required.'),
    currentMedications: z.string().min(1, 'Current medications are required.'),
    recentConsultations: z.string().min(1, 'Recent consultations are required.'),
    labResults: z.string().min(1, 'Lab results are required.'),
});

export function PatientChartSummarizer() {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      demographics: '',
      medicalHistory: '',
      currentMedications: '',
      recentConsultations: '',
      labResults: '',
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setSummary(null);
    try {
      const input: SummarizePatientChartInput = values;
      const { chartSummary } = await summarizePatientChart(input);
      setSummary(chartSummary);
    } catch (error) {
      console.error('Chart summarization failed:', error);
      toast({
        variant: 'destructive',
        title: 'Summarization Failed',
        description: 'An error occurred. Please try again.',
      });
    }
    setIsLoading(false);
  };

  const handleDownload = () => {
    if (!summary) return;
    const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'patient-chart-summary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">AI Patient Chart Summarizer</CardTitle>
          <CardDescription>Enter structured patient data to generate a concise clinical summary.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="demographics"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Demographics</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., 45-year-old male with a history of hypertension..." {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="medicalHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical History</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Appendectomy (2010), Type 2 Diabetes (diagnosed 2015)..." {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentMedications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Medications</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Metformin 500mg BID, Lisinopril 10mg daily..." {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="recentConsultations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recent Consultations</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Cardiology visit (2 weeks ago): Stable angina..." {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="labResults"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lab Results</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., HbA1c: 7.2%, Creatinine: 1.1 mg/dL..." {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CardFooter className="px-0">
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate Summary
                </Button>
             </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        {isLoading && (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Summarizing Chart...</CardTitle>
                    <CardDescription>The AI is synthesizing the patient data into a clinical overview.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-12">
                     <Loader2 className="h-16 w-16 animate-spin text-primary" />
                </CardContent>
            </Card>
        )}
        {summary && (
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="font-headline">AI-Generated Chart Summary</CardTitle>
                <CardDescription>A concise overview of the patient's chart.</CardDescription>
              </div>
              <Button variant="outline" size="icon" onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Download Summary</span>
              </Button>
            </CardHeader>
            <CardContent>
               <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap rounded-md bg-secondary/50 p-4">
                  {summary}
               </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
