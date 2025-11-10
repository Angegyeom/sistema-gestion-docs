'use server';

/**
 * @fileOverview An AI agent for forecasting future resource usage based on historical data.
 *
 * - forecastResourceUsage - A function that forecasts resource usage.
 * - ForecastResourceUsageInput - The input type for the forecastResourceUsage function.
 * - ForecastResourceUsageOutput - The return type for the forecastResourceUsage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ForecastResourceUsageInputSchema = z.object({
  historicalData: z
    .string()
    .describe(
      'Historical resource usage data in CSV format, with columns for timestamp, CPU usage, memory usage, and network traffic.'
    ),
  forecastHorizon: z
    .string()
    .describe(
      'The time horizon for the forecast, e.g., 1 week, 1 month. Use ISO 8601 duration format (e.g., P7D for 7 days, P1M for 1 month)'
    ),
});
export type ForecastResourceUsageInput = z.infer<typeof ForecastResourceUsageInputSchema>;

const ForecastResourceUsageOutputSchema = z.object({
  forecast: z.string().describe('A forecast of future resource usage, including CPU usage, memory usage, and network traffic.'),
  confidenceInterval: z
    .string()
    .describe('The confidence interval for the forecast.'),
  recommendations: z
    .string()
    .describe(
      'Recommendations for proactive resource scaling based on the forecast.'
    ),
});
export type ForecastResourceUsageOutput = z.infer<typeof ForecastResourceUsageOutputSchema>;

export async function forecastResourceUsage(
  input: ForecastResourceUsageInput
): Promise<ForecastResourceUsageOutput> {
  return forecastResourceUsageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'forecastResourceUsagePrompt',
  input: {schema: ForecastResourceUsageInputSchema},
  output: {schema: ForecastResourceUsageOutputSchema},
  prompt: `You are an AI system administrator responsible for forecasting resource usage and providing recommendations for proactive resource scaling.

  Analyze the following historical resource usage data and provide a forecast for the next {{{forecastHorizon}}}.

  Historical Data:
  {{historicalData}}

  Provide a forecast of future resource usage, including CPU usage, memory usage, and network traffic.
  Also, provide a confidence interval for the forecast and recommendations for proactive resource scaling based on the forecast.
  Remember to set the recommendations field with the generated recommendations.
  Consider the impact of any trends or patterns in the historical data on future resource usage.
  For the confidenceInterval field, use clear units, e.g. '±5%'.
  `,
});

const forecastResourceUsageFlow = ai.defineFlow(
  {
    name: 'forecastResourceUsageFlow',
    inputSchema: ForecastResourceUsageInputSchema,
    outputSchema: ForecastResourceUsageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
