"use client";

import { useFormState, useFormStatus } from "react-dom";
import { getForecastAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles, TrendingUp, CheckCircle, HelpCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

const initialState = {
  message: null,
  result: null,
  timestamp: Date.now(),
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-4 w-4" />
      )}
      Generate Forecast
    </Button>
  );
}

export default function ResourceForecasting() {
  const [state, formAction] = useFormState(getForecastAction, initialState);
  const { toast } = useToast();
  const lastToastTimestamp = useRef(0);

  useEffect(() => {
    if (state.message && state.message !== "success" && state.timestamp && state.timestamp > lastToastTimestamp.current) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.message,
      });
      lastToastTimestamp.current = state.timestamp;
    }
  }, [state, toast]);

  const defaultHistoricalData = `timestamp,cpu_usage,memory_usage,network_traffic_mb
2023-10-01T00:00:00Z,45,60,120
2023-10-01T01:00:00Z,48,62,130
2023-10-01T02:00:00Z,50,61,125
2023-10-01T03:00:00Z,55,65,140
2023-10-01T04:00:00Z,52,64,135
2023-10-01T05:00:00Z,60,70,150`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Forecast Future Resource Usage</CardTitle>
          <CardDescription>
            Provide historical data to let our AI predict future resource
            demands and suggest scaling actions.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
            <div className="grid w-full gap-2">
              <Label htmlFor="historicalData">Historical Data (CSV)</Label>
              <Textarea
                id="historicalData"
                name="historicalData"
                rows={8}
                defaultValue={defaultHistoricalData}
              />
            </div>
            <div className="grid w-full max-w-sm gap-2">
              <Label htmlFor="forecastHorizon">Forecast Horizon</Label>
              <Select name="forecastHorizon" defaultValue="P7D">
                <SelectTrigger>
                  <SelectValue placeholder="Select a horizon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="P7D">Next 7 Days</SelectItem>
                  <SelectItem value="P1M">Next 1 Month</SelectItem>
                  <SelectItem value="P3M">Next 3 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      {state.result && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="text-primary" />
                Usage Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {state.result.forecast}
              </p>
            </CardContent>
          </Card>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="text-yellow-500" />
                  Confidence Interval
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {state.result.confidenceInterval}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="text-accent" />
                  Scaling Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {state.result.recommendations}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
