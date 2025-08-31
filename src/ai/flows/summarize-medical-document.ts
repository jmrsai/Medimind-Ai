'use server';

/**
 * @fileOverview Summarizes a medical document.
 *
 * - summarizeMedicalDocument - A function that summarizes a medical document.
 * - SummarizeMedicalDocumentInput - The input type for the summarizeMedicalDocument function.
 * - SummarizeMedicalDocumentOutput - The return type for the summarizeMedicalDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMedicalDocumentInputSchema = z.object({
  documentText: z
    .string()
    .describe('The text content of the medical document to be summarized.'),
});
export type SummarizeMedicalDocumentInput = z.infer<
  typeof SummarizeMedicalDocumentInputSchema
>;

const SummarizeMedicalDocumentOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise, AI-generated summary of the medical document, structured for a medical professional.'),
});
export type SummarizeMedicalDocumentOutput = z.infer<
  typeof SummarizeMedicalDocumentOutputSchema
>;

export async function summarizeMedicalDocument(
  input: SummarizeMedicalDocumentInput
): Promise<SummarizeMedicalDocumentOutput> {
  return summarizeMedicalDocumentFlow(input);
}

const summarizeMedicalDocumentPrompt = ai.definePrompt({
  name: 'summarizeMedicalDocumentPrompt',
  input: {schema: SummarizeMedicalDocumentInputSchema},
  output: {schema: SummarizeMedicalDocumentOutputSchema},
  prompt: `You are an AI assistant specializing in medical literature analysis for healthcare professionals.

  Your task is to produce a high-quality summary of the following medical document. The summary should be clear, concise, and structured to be easily digestible by a busy clinician.

  Focus on extracting the most critical information, such as:
  - Key Findings
  - Study Objectives
  - Methodology
  - Primary Outcomes
  - Clinical Significance

  Medical Document:
  {{{documentText}}}
  `,
});

const summarizeMedicalDocumentFlow = ai.defineFlow(
  {
    name: 'summarizeMedicalDocumentFlow',
    inputSchema: SummarizeMedicalDocumentInputSchema,
    outputSchema: SummarizeMedicalDocumentOutputSchema,
  },
  async input => {
    const {output} = await summarizeMedicalDocumentPrompt(input);
    return output!;
  }
);
