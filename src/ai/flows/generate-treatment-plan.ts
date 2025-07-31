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
});
export type GenerateTreatmentPlanInput = z.infer<typeof GenerateTreatmentPlanInputSchema>;

const GenerateTreatmentPlanOutputSchema = z.object({
  treatmentPlan: z.string().describe('The generated treatment plan.'),
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
  prompt: `You are an AI assistant designed to generate treatment plans for healthcare professionals.

  Based on the AI analysis provided, generate a comprehensive treatment plan, including recommended medications, therapies, and lifestyle modifications.

  {{#if treatmentPlanGuidelines}}
  Incorporate the following treatment plan guidelines:
  {{{treatmentPlanGuidelines}}}
  {{/if}}

  AI Analysis:
  {{{aiAnalysis}}}
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
