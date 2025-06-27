'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting project improvements based on data from similar successful projects.
 *
 * The flow takes project details as input and returns AI-driven suggestions for improving the project approach.
 * @file
 * - suggestProjectImprovements - A function that handles the project improvement suggestion process.
 * - SuggestProjectImprovementsInput - The input type for the suggestProjectImprovements function.
 * - SuggestProjectImprovementsOutput - The return type for the suggestProjectImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProjectImprovementsInputSchema = z.object({
  title: z.string().describe('The title of the project.'),
  description: z.string().describe('A detailed description of the project, including its goals and current approach.'),
  details: z.string().optional().describe('Additional project details, such as team members, timeline, and resources.'),
  successfulProjects: z.array(z.string()).describe('Data from similar successful projects, each entry containing details about the approach and outcomes.'),
});
export type SuggestProjectImprovementsInput = z.infer<typeof SuggestProjectImprovementsInputSchema>;

const SuggestProjectImprovementsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of AI-driven suggestions for improving the project approach, based on the provided data from similar successful projects.'),
  rationale: z.string().describe('A clear rationale for each suggestion, explaining how it leverages data from similar successful projects to potentially improve the project outcome.'),
});
export type SuggestProjectImprovementsOutput = z.infer<typeof SuggestProjectImprovementsOutputSchema>;

export async function suggestProjectImprovements(input: SuggestProjectImprovementsInput): Promise<SuggestProjectImprovementsOutput> {
  return suggestProjectImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProjectImprovementsPrompt',
  input: {schema: SuggestProjectImprovementsInputSchema},
  output: {schema: SuggestProjectImprovementsOutputSchema},
  prompt: `You are an AI-powered project assistant that provides suggestions for improving project approaches based on data from similar successful projects.

  Given the following project details and data from similar successful projects, provide a list of suggestions for improving the project approach.
  Explain clearly the rationale for each suggestion, and cite successful project examples. Focus on actionable advice, citing elements of the successful projects to emulate.

Project Title: {{{title}}}
Project Description: {{{description}}}
Project Details: {{{details}}}

Successful Projects Data:
{{#each successfulProjects}}
  - {{{this}}}
{{/each}}

Output the suggestions in a clear, concise format.
  `,
});

const suggestProjectImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestProjectImprovementsFlow',
    inputSchema: SuggestProjectImprovementsInputSchema,
    outputSchema: SuggestProjectImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
