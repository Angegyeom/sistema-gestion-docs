"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CodeIssue } from "@/lib/types";

const issues: CodeIssue[] = [
  {
    id: "1",
    file: "server/controllers/user.ts",
    line: 87,
    description: "N+1 query detected in `get_user_posts` function.",
    severity: "Critical",
  },
  {
    id: "2",
    file: "client/components/PostList.tsx",
    line: 42,
    description: "Inefficient rendering loop causing high CPU usage on client.",
    severity: "High",
  },
  {
    id: "3",
    file: "lib/data-processing.js",
    line: 153,
    description: "Large object kept in memory, potential memory leak.",
    severity: "High",
  },
  {
    id: "4",
    file: "services/cache.js",
    line: 28,
    description: "Unused variable `maxCacheSize`.",
    severity: "Low",
  },
  {
    id: "5",
    file: "styles/main.css",
    line: 512,
    description: "Redundant CSS selector, increasing parse time.",
    severity: "Medium",
  },
];

const severityVariantMap: Record<CodeIssue["severity"], "destructive" | "secondary" | "outline" | "default"> = {
  Critical: "destructive",
  High: "secondary",
  Medium: "outline",
  Low: "default",
};

export default function CodeAnalysis() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Automated Code Analysis</CardTitle>
          <CardDescription>
            Static analysis has identified the following potential issues.
          </CardDescription>
        </div>
        <Button>Run New Scan</Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Severity</TableHead>
                <TableHead>File</TableHead>
                <TableHead className="hidden md:table-cell">Line</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell>
                    <Badge variant={severityVariantMap[issue.severity]} className={issue.severity === 'High' ? 'bg-orange-500 text-white' : ''}>
                      {issue.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{issue.file}</TableCell>
                  <TableCell className="hidden md:table-cell">{issue.line}</TableCell>
                  <TableCell>{issue.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
