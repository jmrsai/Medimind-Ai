'use server';

/**
 * @fileOverview An AI flow for analyzing patient notes and providing a diagnosis.
 *
 * - analyzePatientNotes - A function that analyzes patient notes and returns a diagnosis.
 * - AnalyzePatientNotesInput - The input type for the analyzePatientNotes function.
 * - AnalyzePatientNotesOutput - The return type for the analyzePatientNotes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePatientNotesInputSchema = z.object({
  notes: z.string().describe('The patient notes or medical document content to analyze.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "A medical image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  treatmentPlanGuidelines: z.string().optional().describe('Optional guidelines for the treatment plan.'),
  advancementsAndResults: z.string().optional().describe('Optional recent medical advancements and clinical trial results to consider for a more accurate diagnosis.'),
});
export type AnalyzePatientNotesInput = z.infer<typeof AnalyzePatientNotesInputSchema>;

const AnalyzePatientNotesOutputSchema = z.object({
  primaryDiagnosis: z.string().describe('The primary diagnosis based on the patient notes.'),
  differentialDiagnoses: z.array(z.string()).describe('A list of differential diagnoses to consider.'),
  confidenceScore: z.number().describe('A confidence score (0-1) indicating the certainty of the diagnosis.'),
  diagnosticReasoning: z.string().describe('The reasoning behind the diagnosis based on the notes.'),
});
export type AnalyzePatientNotesOutput = z.infer<typeof AnalyzePatientNotesOutputSchema>;

export async function analyzePatientNotes(input: AnalyzePatientNotesInput): Promise<AnalyzePatientNotesOutput> {
  return analyzePatientNotesFlow(input);
}

const analyzePatientNotesPrompt = ai.definePrompt({
  name: 'analyzePatientNotesPrompt',
  input: {schema: AnalyzePatientNotesInputSchema},
  output: {schema: AnalyzePatientNotesOutputSchema},
  prompt: `You are an AI assistant that specializes in analyzing patient notes and medical documents to provide a comprehensive medical analysis.

  Given the following patient notes and optional medical image, provide a primary diagnosis, a list of differential diagnoses, a confidence score (0-1), and the reasoning behind the diagnosis.  Make sure the confidence score reflects the certainty of your diagnosis given the data provided.

  Patient Notes: {{{notes}}}
  {{#if photoDataUri}}
  Medical Image: {{media url=photoDataUri}}
  {{/if}}

  {{#if treatmentPlanGuidelines}}
  Consider these treatment plan guidelines when formulating your diagnosis and reasoning:
  {{treatmentPlanGuidelines}}
  {{/if}}

  {{#if advancementsAndResults}}
  For a more accurate diagnosis, consider the following recent medical advancements and clinical trial results:
  {{{advancementsAndResults}}}
  {{/if}}

  Format your output as a JSON object with the following keys:
  - primaryDiagnosis: The primary diagnosis.
  - differentialDiagnoses: A list of differential diagnoses.
  - confidenceScore: A confidence score (0-1).
  - diagnosticReasoning: The reasoning behind the diagnosis.
  `,
});

const analyzePatientNotesFlow = ai.defineFlow(
  {
    name: 'analyzePatientNotesFlow',
    inputSchema: AnalyzePatientNotesInputSchema,
    outputSchema: AnalyzePatientNotesOutputSchema,
  },
  async input => {
    const {output} = await analyzePatientNotesPrompt(input);
    return output!;
  }
);
