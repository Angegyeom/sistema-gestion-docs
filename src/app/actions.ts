"use server";

import { z } from "zod";
import {
  getOptimizationRecommendations,
  OptimizationRecommendationsOutput,
} from "@/ai/flows/ai-powered-optimization-recommendations";
import {
  forecastResourceUsage,
  ForecastResourceUsageOutput,
} from "@/ai/flows/resource-usage-forecasting";

type RecommendationsState = {
  message?: string | null;
  result?: OptimizationRecommendationsOutput | null;
  timestamp?: number;
};

const recommendationsSchema = z.object({
  systemState: z.string().min(10, "System state description is too short."),
});

export async function getRecommendationsAction(
  prevState: RecommendationsState,
  formData: FormData
): Promise<RecommendationsState> {
  const validatedFields = recommendationsSchema.safeParse({
    systemState: formData.get("systemState"),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors.systemState?.[0],
      timestamp: Date.now(),
    };
  }

  try {
    const result = await getOptimizationRecommendations({
      systemStateDescription: validatedFields.data.systemState,
    });
    return { message: "success", result, timestamp: Date.now() };
  } catch (e) {
    return {
      message: "An error occurred while fetching recommendations.",
      timestamp: Date.now(),
    };
  }
}

type ForecastState = {
  message?: string | null;
  result?: ForecastResourceUsageOutput | null;
  timestamp?: number;
};

const forecastSchema = z.object({
  historicalData: z.string().min(1, "Historical data is required."),
  forecastHorizon: z.string().min(1, "Forecast horizon is required."),
});

export async function getForecastAction(
  prevState: ForecastState,
  formData: FormData
): Promise<ForecastState> {
  const validatedFields = forecastSchema.safeParse({
    historicalData: formData.get("historicalData"),
    forecastHorizon: formData.get("forecastHorizon"),
  });

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    return {
      message: errors.historicalData?.[0] || errors.forecastHorizon?.[0],
      timestamp: Date.now(),
    };
  }

  try {
    const result = await forecastResourceUsage({
      historicalData: validatedFields.data.historicalData,
      forecastHorizon: validatedFields.data.forecastHorizon,
    });
    return { message: "success", result, timestamp: Date.now() };
  } catch (e) {
    return {
      message: "An error occurred while generating the forecast.",
      timestamp: Date.now(),
    };
  }
}
