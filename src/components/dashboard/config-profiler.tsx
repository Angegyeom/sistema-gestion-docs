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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ConfigProfile } from "@/lib/types";

const profiles: ConfigProfile[] = [
  {
    id: "prod",
    name: "Production",
    parameters: [
      { key: "DB_CONNECTIONS", value: "100" },
      { key: "CACHE_SIZE_MB", value: "1024" },
      { key: "LOG_LEVEL", value: "ERROR" },
      { key: "REQUEST_TIMEOUT_MS", value: "30000" },
      { key: "MAX_WORKERS", value: "16" },
    ],
  },
  {
    id: "staging",
    name: "Staging",
    parameters: [
      { key: "DB_CONNECTIONS", value: "50" },
      { key: "CACHE_SIZE_MB", value: "512" },
      { key: "LOG_LEVEL", value: "DEBUG" },
      { key: "REQUEST_TIMEOUT_MS", value: "60000" },
      { key: "MAX_WORKERS", value: "8" },
    ],
  },
  {
    id: "dev",
    name: "Development",
    parameters: [
      { key: "DB_CONNECTIONS", value: "10" },
      { key: "CACHE_SIZE_MB", value: "256" },
      { key: "LOG_LEVEL", value: "VERBOSE" },
      { key: "REQUEST_TIMEOUT_MS", value: "120000" },
      { key: "MAX_WORKERS", value: "4" },
    ],
  },
];

export default function ConfigProfiler() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration Profiler</CardTitle>
        <CardDescription>
          Compare configuration settings across different environments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="prod" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {profiles.map((profile) => (
              <TabsTrigger key={profile.id} value={profile.id}>
                {profile.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {profiles.map((profile) => (
            <TabsContent key={profile.id} value={profile.id}>
              <div className="mt-4 rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Parameter</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profile.parameters.map((param) => (
                      <TableRow key={param.key}>
                        <TableCell className="font-medium">{param.key}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {param.value}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
