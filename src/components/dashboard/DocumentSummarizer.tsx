'use client';

import { useState } from 'react';
import { summarizeMedicalDocument, SummarizeMedicalDocumentInput } from '@/ai/flows/summarize-medical-document';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Download, Loader2 } from 'lucide-react';


export function DocumentSummarizer() {
  const [documentText, setDocumentText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!documentText) {
      toast({
        variant: 'destructive',
        title: 'Input required',
        description: 'Please enter document text to summarize.',
      });
      return;
    }
    setIsLoading(true);
    setSummary(null);
    try {
      const input: SummarizeMedicalDocumentInput = { documentText };
      const { summary: generatedSummary } = await summarizeMedicalDocument(input);
      setSummary(generatedSummary);
    } catch (error) {
      console.error('Summarization failed:', error);
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
    a.download = 'summary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">AI Document Summarizer</CardTitle>
          <CardDescription>Paste a lengthy medical article or research paper to get a concise summary.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="document-text">Document Text</Label>
            <Textarea
              id="document-text"
              placeholder="Paste the full text of the medical document here..."
              className="min-h-[300px]"
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Summarize Document
          </Button>
        </CardFooter>
      </Card>
      
      <div className="space-y-6">
        {isLoading && (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Summarizing...</CardTitle>
                    <CardDescription>The AI is condensing the document into key points.</CardDescription>
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
                <CardTitle className="font-headline">AI-Generated Summary</CardTitle>
                <CardDescription>Below is the concise summary of the provided document.</CardDescription>
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
