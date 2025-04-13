// 'use server'
'use server';
/**
 * @fileOverview A flow for suggesting tags for sticky notes based on their content.
 *
 * - suggestTags - A function that suggests tags for a given note content.
 * - SuggestTagsInput - The input type for the suggestTags function.
 * - SuggestTagsOutput - The return type for the suggestTags function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestTagsInputSchema = z.object({
  noteContent: z.string().describe('The content of the sticky note.'),
});
export type SuggestTagsInput = z.infer<typeof SuggestTagsInputSchema>;

const SuggestTagsOutputSchema = z.object({
  tags: z.array(z.string()).describe('An array of suggested tags for the note.'),
});
export type SuggestTagsOutput = z.infer<typeof SuggestTagsOutputSchema>;

export async function suggestTags(input: SuggestTagsInput): Promise<SuggestTagsOutput> {
  return suggestTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTagsPrompt',
  input: {
    schema: z.object({
      noteContent: z.string().describe('The content of the sticky note.'),
    }),
  },
  output: {
    schema: z.object({
      tags: z.array(z.string()).describe('An array of suggested tags for the note.'),
    }),
  },
  prompt: `Suggest relevant tags for the following sticky note content. Return them as a list.

Note Content: {{{noteContent}}}

Tags:`,
});

const suggestTagsFlow = ai.defineFlow<
  typeof SuggestTagsInputSchema,
  typeof SuggestTagsOutputSchema
>(
  {
    name: 'suggestTagsFlow',
    inputSchema: SuggestTagsInputSchema,
    outputSchema: SuggestTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

