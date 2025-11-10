"use client";

import { useFormState, useFormStatus } from "react-dom";
import { getRecommendationsAction } from "@/app/actions";
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
import { Lightbulb, Loader2, Sparkles } from "lucide-react";
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
      Generate Recommendations
    </Button>
  );
}

export default function OptimizationAdvisor() {
  const [state, formAction] = useFormState(
    getRecommendationsAction,
    initialState
  );
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

  const defaultSystemState = `Current System State:
- Service: Web Server (nginx)
- CPU Usage: 85% (Avg), peaks at 95%
- Memory Usage: 7.2GB / 8GB
- Network Latency: 120ms (Avg)
- Disk I/O: High write activity on /var/log
- Recent Errors: '502 Bad Gateway' errors increasing during peak hours.
- App Version: v2.1.3
- DB Queries: some queries are taking > 500ms
`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Get AI-Powered Recommendations</CardTitle>
          <CardDescription>
            Describe your current system state, and our AI will provide
            tailored optimization advice.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent>
            <div className="grid w-full gap-2">
              <Label htmlFor="systemState">System State Description</Label>
              <Textarea
                id="systemState"
                name="systemState"
                placeholder="Enter your system state description here..."
                rows={10}
                defaultValue={defaultSystemState}
              />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      {state.result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="text-accent" />
              Optimization Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap rounded-md bg-muted/50 p-4 font-mono text-sm">
              {state.result.recommendations}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
