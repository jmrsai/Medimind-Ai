'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating medical illustrations.
 *
 * - generateMedicalIllustration - A function that takes a text prompt and generates a medical illustration.
 * - GenerateMedicalIllustrationInput - The input type for the generateMedicalIllustration function.
 * - GenerateMedicalIllustrationOutput - The return type for the generateMedicalIllustration function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateMedicalIllustrationInputSchema = z.object({
  prompt: z.string().describe('A detailed text description of the medical illustration to generate.'),
  advancementsAndResults: z.string().optional().describe('Optional recent medical advancements and clinical trial results to consider for a more accurate illustration.'),
});
export type GenerateMedicalIllustrationInput = z.infer<typeof GenerateMedicalIllustrationInputSchema>;

const GenerateMedicalIllustrationOutputSchema = z.object({
  illustrationUrl: z.string().describe("The data URI of the generated medical illustration. Expected format: 'data:image/...;base64,...'"),
});
export type GenerateMedicalIllustrationOutput = z.infer<typeof GenerateMedicalIllustrationOutputSchema>;

export async function generateMedicalIllustration(
  input: GenerateMedicalIllustrationInput
): Promise<GenerateMedicalIllustrationOutput> {
  return generateMedicalIllustrationFlow(input);
}

const generateMedicalIllustrationFlow = ai.defineFlow(
  {
    name: 'generateMedicalIllustrationFlow',
    inputSchema: GenerateMedicalIllustrationInputSchema,
    outputSchema: GenerateMedicalIllustrationOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        {text: `Generate a photorealistic, high-quality medical illustration for use in a clinical setting.
      Focus on accuracy and clarity. The illustration should be suitable for patient education and professional presentations.
      {{#if advancementsAndResults}}
      To ensure the highest accuracy, consider the following recent medical advancements and clinical trial results in your illustration:
      {{{advancementsAndResults}}}
      {{/if}}
      ---
      Prompt: ${input.prompt}`}
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
        throw new Error('Image generation failed to produce an output.');
    }
    
    return {
      illustrationUrl: media.url,
    };
  }
);
