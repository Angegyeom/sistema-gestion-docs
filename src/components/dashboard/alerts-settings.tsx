"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, Trash2 } from "lucide-react";
import type { Alert } from "@/lib/types";

const initialAlerts: Alert[] = [
  {
    id: "1",
    metric: "CPU Usage",
    threshold: 90,
    unit: "%",
    notifications: ["Email", "SMS"],
  },
  {
    id: "2",
    metric: "Network Latency",
    threshold: 200,
    unit: "ms",
    notifications: ["Email"],
  },
  {
    id: "3",
    metric: "Memory Usage",
    threshold: 85,
    unit: "%",
    notifications: ["SMS"],
  },
];

export default function AlertsSettings() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Active Alerts</CardTitle>
            <CardDescription>
              Manage your performance threshold alerts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead>Threshold</TableHead>
                    <TableHead>Notifications</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-medium">
                        {alert.metric}
                      </TableCell>
                      <TableCell>
                        &gt; {alert.threshold}
                        {alert.unit}
                      </TableCell>
                      <TableCell>{alert.notifications.join(", ")}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Create New Alert</CardTitle>
            <CardDescription>
              Set up a new notification for a metric threshold.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metric">Metric</Label>
              <Select>
                <SelectTrigger id="metric">
                  <SelectValue placeholder="Select a metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cpu">CPU Usage</SelectItem>
                  <SelectItem value="memory">Memory Usage</SelectItem>
                  <SelectItem value="latency">Network Latency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="threshold">Threshold</Label>
              <Input id="threshold" type="number" placeholder="e.g. 90" />
            </div>
            <div className="space-y-2">
              <Label>Notification Channels</Label>
              <div className="flex items-center space-x-2">
                <Checkbox id="email" />
                <Label htmlFor="email" className="font-normal">Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="sms" />
                <Label htmlFor="sms" className="font-normal">SMS</Label>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Create Alert</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
