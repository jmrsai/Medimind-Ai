'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a medical illustration from a doodle and a text prompt.
 *
 * - generateFromDoodle - A function that takes a doodle image and a text prompt to generate an illustration.
 * - GenerateFromDoodleInput - The input type for the generateFromDoodle function.
 * - GenerateFromDoodleOutput - The return type for the generateFromDoodle function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateFromDoodleInputSchema = z.object({
  doodleDataUri: z
    .string()
    .describe(
      "A user-drawn doodle, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:image/png;base64,<encoded_data>'."
    ),
  prompt: z.string().describe('A detailed text description to guide the illustration generation based on the doodle.'),
  advancementsAndResults: z.string().optional().describe('Optional recent medical advancements and clinical trial results to consider for a more accurate illustration.'),
});
export type GenerateFromDoodleInput = z.infer<typeof GenerateFromDoodleInputSchema>;

const GenerateFromDoodleOutputSchema = z.object({
  imageUrl: z.string().describe("The data URI of the generated medical illustration. Expected format: 'data:image/...;base64,...'"),
});
export type GenerateFromDoodleOutput = z.infer<typeof GenerateFromDoodleOutputSchema>;

export async function generateFromDoodle(
  input: GenerateFromDoodleInput
): Promise<GenerateFromDoodleOutput> {
  return generateFromDoodleFlow(input);
}

const generateFromDoodleFlow = ai.defineFlow(
  {
    name: 'generateFromDoodleFlow',
    inputSchema: GenerateFromDoodleInputSchema,
    outputSchema: GenerateFromDoodleOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        {
          text: `Transform the following user-drawn doodle and prompt into a photorealistic, high-quality medical illustration. The doodle provides the basic structure, and the prompt provides the details. The final image should be accurate, clear, and suitable for clinical and educational use.
          {{#if advancementsAndResults}}
          To ensure the highest accuracy, consider the following recent medical advancements and clinical trial results in your illustration:
          {{{advancementsAndResults}}}
          {{/if}}
          ---
          Prompt: ${input.prompt}`
        },
        {
            media: { url: input.doodleDataUri },
        }
      ],
      config: {
        responseModalities: ['IMAGE'],
      },
    });

    if (!media?.url) {
        throw new Error('Image generation from doodle failed to produce an output.');
    }
    
    return {
      imageUrl: media.url,
    };
  }
);
