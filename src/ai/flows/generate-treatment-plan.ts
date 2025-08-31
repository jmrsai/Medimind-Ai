'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating treatment plans based on AI analysis.
 *
 * - generateTreatmentPlan - A function that generates a treatment plan based on AI analysis and optional guidelines.
 * - GenerateTreatmentPlanInput - The input type for the generateTreatmentPlan function.
 * - GenerateTreatmentPlanOutput - The return type for the generateTreatmentPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTreatmentPlanInputSchema = z.object({
  aiAnalysis: z
    .string()
    .describe('The AI analysis of the patient data, including diagnosis and reasoning.'),
  treatmentPlanGuidelines: z
    .string()
    .optional()
    .describe('Optional treatment plan guidelines to be incorporated.'),
  advancementsAndResults: z.string().optional().describe('Optional recent medical advancements and clinical trial results to consider for the treatment plan.'),
});
export type GenerateTreatmentPlanInput = z.infer<typeof GenerateTreatmentPlanInputSchema>;

const GenerateTreatmentPlanOutputSchema = z.object({
  treatmentPlan: z.object({
      pharmacological: z.string().describe("Medication recommendations, including drug name, dosage, and frequency."),
      nonPharmacological: z.string().describe("Therapeutic procedures, lifestyle modifications, and other non-medication-based treatments."),
      monitoring: z.string().describe("A plan for monitoring patient progress and treatment efficacy."),
      patientEducation: z.string().describe("Key points to discuss with the patient regarding their condition and treatment.")
  }).describe('The comprehensive, structured treatment plan.'),
});
export type GenerateTreatmentPlanOutput = z.infer<typeof GenerateTreatmentPlanOutputSchema>;

export async function generateTreatmentPlan(
  input: GenerateTreatmentPlanInput
): Promise<GenerateTreatmentPlanOutput> {
  return generateTreatmentPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTreatmentPlanPrompt',
  input: {schema: GenerateTreatmentPlanInputSchema},
  output: {schema: GenerateTreatmentPlanOutputSchema},
  prompt: `You are an AI medical expert tasked with creating a detailed, evidence-based treatment plan for a healthcare professional.

  Based on the provided AI analysis, construct a comprehensive and structured treatment plan.

  AI Analysis:
  {{{aiAnalysis}}}

  {{#if treatmentPlanGuidelines}}
  Incorporate the following specific guidelines into the plan:
  {{{treatmentPlanGuidelines}}}
  {{/if}}

  {{#if advancementsAndResults}}
  To ensure the highest quality of care, consider the following recent medical advancements and clinical trial results in your treatment plan:
  {{{advancementsAndResults}}}
  {{/if}}

  Your output must be a JSON object with a 'treatmentPlan' key. The value should be another object containing the following four sections:
  - pharmacological: Detail specific medications, dosages, and administration schedules.
  - nonPharmacological: Outline recommended therapies, lifestyle adjustments, and other non-drug interventions.
  - monitoring: Describe the key parameters to track, and the recommended frequency for follow-up appointments.
  - patientEducation: Summarize the crucial information the patient needs to understand about their condition and treatment.
  `,
});

const generateTreatmentPlanFlow = ai.defineFlow(
  {
    name: 'generateTreatmentPlanFlow',
    inputSchema: GenerateTreatmentPlanInputSchema,
    outputSchema: GenerateTreatmentPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
