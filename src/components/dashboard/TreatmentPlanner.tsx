'use client';

import type { AnalyzePatientNotesOutput } from '@/ai/flows/analyze-patient-notes';
import { generateTreatmentPlan, GenerateTreatmentPlanInput, GenerateTreatmentPlanOutput } from '@/ai/flows/generate-treatment-plan';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Download, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TreatmentPlannerProps {
    analysisResult: AnalyzePatientNotesOutput | null;
}

export function TreatmentPlanner({ analysisResult }: TreatmentPlannerProps) {
    const [aiAnalysis, setAiAnalysis] = useState('');
    const [guidelines, setGuidelines] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [plan, setPlan] = useState<GenerateTreatmentPlanOutput['treatmentPlan'] | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (analysisResult) {
            const formattedAnalysis = 
`Primary Diagnosis: ${analysisResult.primaryDiagnosis}
Confidence: ${Math.round(analysisResult.confidenceScore * 100)}%
Reasoning: ${analysisResult.diagnosticReasoning}
Differentials: ${analysisResult.differentialDiagnoses.join(', ')}`;
            setAiAnalysis(formattedAnalysis);
        }
    }, [analysisResult]);

    const handleSubmit = async () => {
        if (!aiAnalysis) {
            toast({
                variant: 'destructive',
                title: 'Input required',
                description: 'Please provide AI analysis to generate a treatment plan.',
            });
            return;
        }
        setIsLoading(true);
        setPlan(null);
        try {
            const input: GenerateTreatmentPlanInput = { aiAnalysis, treatmentPlanGuidelines: guidelines };
            const { treatmentPlan } = await generateTreatmentPlan(input);
            setPlan(treatmentPlan);
        } catch (error) {
            console.error('Plan generation failed:', error);
            toast({
                variant: 'destructive',
                title: 'Plan Generation Failed',
                description: 'An error occurred. Please try again.',
            });
        }
        setIsLoading(false);
    };

    const handleDownload = () => {
        if (!plan) return;

        const planText = `
## Pharmacological Treatment
${plan.pharmacological}

## Non-Pharmacological Treatment
${plan.nonPharmacological}

## Monitoring Plan
${plan.monitoring}

## Patient Education
${plan.patientEducation}
        `;

        const blob = new Blob([planText.trim()], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'treatment-plan.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">AI Treatment Planner</CardTitle>
                    <CardDescription>Generate a treatment plan based on AI analysis.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="ai-analysis">AI Analysis</Label>
                        <Textarea
                            id="ai-analysis"
                            placeholder="Paste the AI analysis here, or generate one from the Report Analyzer."
                            className="min-h-[200px]"
                            value={aiAnalysis}
                            onChange={(e) => setAiAnalysis(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="plan-guidelines">Optional: Treatment Plan Guidelines</Label>
                        <Textarea
                            id="plan-guidelines"
                            placeholder="e.g., 'Prioritize cost-effective medications', 'Include weekly follow-up schedule.'"
                            value={guidelines}
                            onChange={(e) => setGuidelines(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Generate Plan
                    </Button>
                </CardFooter>
            </Card>

            <div className="space-y-6">
                {isLoading && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Generating Plan...</CardTitle>
                            <CardDescription>The AI is creating a comprehensive treatment plan.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center py-12">
                            <Loader2 className="h-16 w-16 animate-spin text-primary" />
                        </CardContent>
                    </Card>
                )}
                {plan && (
                    <Card>
                        <CardHeader className="flex flex-row items-start justify-between">
                            <div>
                                <CardTitle className="font-headline">Generated Treatment Plan</CardTitle>
                                <CardDescription>This is an AI-generated suggestion. Always apply clinical judgment.</CardDescription>
                            </div>
                            <Button variant="outline" size="icon" onClick={handleDownload}>
                                <Download className="h-4 w-4" />
                                <span className="sr-only">Download Plan</span>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2">Pharmacological Treatment</h3>
                                <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap rounded-md bg-secondary/50 p-3">
                                    {plan.pharmacological}
                                </div>
                            </div>
                             <div>
                                <h3 className="font-semibold mb-2">Non-Pharmacological Treatment</h3>
                                <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap rounded-md bg-secondary/50 p-3">
                                    {plan.nonPharmacological}
                                </div>
                            </div>
                             <div>
                                <h3 className="font-semibold mb-2">Monitoring Plan</h3>
                                <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap rounded-md bg-secondary/50 p-3">
                                    {plan.monitoring}
                                </div>
                            </div>
                             <div>
                                <h3 className="font-semibold mb-2">Patient Education</h3>
                                <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap rounded-md bg-secondary/50 p-3">
                                    {plan.patientEducation}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
