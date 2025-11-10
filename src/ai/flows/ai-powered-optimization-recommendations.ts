// use server'

/**
 * @fileOverview Provides AI-powered recommendations for optimizing system performance.
 *
 * - getOptimizationRecommendations - A function that generates optimization recommendations.
 * - OptimizationRecommendationsInput - The input type for the getOptimizationRecommendations function.
 * - OptimizationRecommendationsOutput - The return type for the getOptimizationRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizationRecommendationsInputSchema = z.object({
  systemStateDescription: z
    .string()
    .describe(
      'A detailed description of the current system state, including CPU usage, memory consumption, network latency, disk I/O, and any other relevant metrics.'
    ),
});
export type OptimizationRecommendationsInput = z.infer<typeof OptimizationRecommendationsInputSchema>;

const OptimizationRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe(
      'A list of actionable recommendations for optimizing the system, considering factors like resource allocation, configuration settings, and code efficiency.'
    ),
});
export type OptimizationRecommendationsOutput = z.infer<typeof OptimizationRecommendationsOutputSchema>;

export async function getOptimizationRecommendations(
  input: OptimizationRecommendationsInput
): Promise<OptimizationRecommendationsOutput> {
  return optimizationRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizationRecommendationsPrompt',
  input: {schema: OptimizationRecommendationsInputSchema},
  output: {schema: OptimizationRecommendationsOutputSchema},
  prompt: `You are an expert system administrator. Analyze the following system state description and provide actionable recommendations for optimizing the system's performance.

System State Description: {{{systemStateDescription}}}

Recommendations:`, //Crucially, you MUST NOT attempt to directly call functions, use await keywords, or perform any complex logic _within_ the Handlebars template string.
});

const optimizationRecommendationsFlow = ai.defineFlow(
  {
    name: 'optimizationRecommendationsFlow',
    inputSchema: OptimizationRecommendationsInputSchema,
    outputSchema: OptimizationRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
