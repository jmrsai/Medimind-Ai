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
  primaryDiagnosis: z.string().describe('The most likely primary diagnosis based on the provided clinical information.'),
  differentialDiagnoses: z.array(z.string()).describe('A list of potential differential diagnoses to consider, ordered by likelihood.'),
  confidenceScore: z.number().describe('A confidence score (0-1) reflecting the certainty of the primary diagnosis, considering the quality and completeness of the input data.'),
  diagnosticReasoning: z.object({
    notesAnalysis: z.string().describe("A detailed explanation for the diagnosis based on the patient's notes."),
    imageAnalysis: z.string().optional().describe("A detailed explanation for the diagnosis based on the medical image, if provided.")
  }).describe('A detailed, evidence-based explanation for the primary diagnosis, citing specific findings from the patient notes and image.'),
  urgency: z.enum(["Low", "Medium", "High", "Critical"]).describe("The assessed urgency for medical intervention based on the analysis."),
  recommendedSpecialists: z.array(z.string()).describe("A list of recommended specialists for consultation based on the diagnosis.")
});
export type AnalyzePatientNotesOutput = z.infer<typeof AnalyzePatientNotesOutputSchema>;

export async function analyzePatientNotes(input: AnalyzePatientNotesInput): Promise<AnalyzePatientNotesOutput> {
  return analyzePatientNotesFlow(input);
}

const analyzePatientNotesPrompt = ai.definePrompt({
  name: 'analyzePatientNotesPrompt',
  input: {schema: AnalyzePatientNotesInputSchema},
  output: {schema: AnalyzePatientNotesOutputSchema},
  prompt: `You are a highly skilled AI medical diagnostician. Your task is to provide a thorough and professional analysis of patient information for a healthcare provider.

  Analyze the following patient data, which may include clinical notes and a medical image. Provide a detailed, evidence-based diagnosis.

  Patient Notes:
  {{{notes}}}
  {{#if photoDataUri}}
  Medical Image: {{media url=photoDataUri}}
  {{/if}}

  {{#if treatmentPlanGuidelines}}
  For context, consider these preliminary treatment plan guidelines when formulating your diagnosis:
  {{treatmentPlanGuidelines}}
  {{/if}}

  {{#if advancementsAndResults}}
  To ensure the highest accuracy, consider the following recent medical advancements and clinical trial results in your analysis:
  {{{advancementsAndResults}}}
  {{/if}}

  Your response must be a structured JSON object.
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
