'use server';

/**
 * @fileOverview This file defines a Genkit flow for summarizing a patient's medical chart.
 *
 * - summarizePatientChart - A function that takes structured patient data and generates a concise summary.
 * - SummarizePatientChartInput - The input type for the summarizePatientChart function.
 * - SummarizePatientChartOutput - The return type for the summarizePatientChart function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SummarizePatientChartInputSchema = z.object({
  demographics: z.string().describe("Patient's basic information, such as age, gender, and relevant background."),
  medicalHistory: z.string().describe("Summary of the patient's past medical conditions, surgeries, and family history."),
  currentMedications: z.string().describe("List of all medications the patient is currently taking, including dosage and frequency."),
  recentConsultations: z.string().describe("Notes from recent visits with specialists or primary care physicians."),
  labResults: z.string().describe("Key findings from recent laboratory tests and diagnostic imaging."),
});
export type SummarizePatientChartInput = z.infer<typeof SummarizePatientChartInputSchema>;

const SummarizePatientChartOutputSchema = z.object({
  chartSummary: z.string().describe("A concise, well-structured summary of the patient's chart, highlighting the most critical information for a clinician's review."),
});
export type SummarizePatientChartOutput = z.infer<typeof SummarizePatientChartOutputSchema>;


export async function summarizePatientChart(
  input: SummarizePatientChartInput
): Promise<SummarizePatientChartOutput> {
  return summarizePatientChartFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizePatientChartPrompt',
  input: { schema: SummarizePatientChartInputSchema },
  output: { schema: SummarizePatientChartOutputSchema },
  prompt: `You are a highly efficient AI medical assistant. Your task is to synthesize a patient's medical chart into a brief, organized summary for a busy clinician.

  Review the following structured patient data and generate a clear, scannable summary. Focus on presenting the most clinically relevant information first.

  Patient Chart Data:
  - Demographics: {{{demographics}}}
  - Medical History: {{{medicalHistory}}}
  - Current Medications: {{{currentMedications}}}
  - Recent Consultations: {{{recentConsultations}}}
  - Lab Results: {{{labResults}}}

  Your output must be a single JSON object with a 'chartSummary' key, containing a narrative summary that integrates these components into a coherent overview.
  `,
});


const summarizePatientChartFlow = ai.defineFlow(
  {
    name: 'summarizePatientChartFlow',
    inputSchema: SummarizePatientChartInputSchema,
    outputSchema: SummarizePatientChartOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
