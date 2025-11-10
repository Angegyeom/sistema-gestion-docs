"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Cpu, MemoryStick, Network } from "lucide-react";

type MetricData = {
  time: string;
  value: number;
};

const generateInitialData = (): MetricData[] => {
  const data: MetricData[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 5000);
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      value: Math.floor(Math.random() * 60) + 10,
    });
  }
  return data;
};

const chartConfig = {
  value: {
    label: "Value",
  },
};

const MetricCard = ({ title, icon, data, unit, colorClass }: { title: string; icon: React.ReactNode; data: MetricData[]; unit: string; colorClass: string }) => {
  const currentValue = data.length > 0 ? data[data.length - 1].value : 0;
  const isHigh = currentValue > 80;
  const isMedium = currentValue > 60 && currentValue <= 80;

  const getStatus = () => {
    if (isHigh) return { text: "High", color: "destructive" as const };
    if (isMedium) return { text: "secondary" as const };
    return { text: "Normal", color: "default" as const };
  };

  const status = getStatus();

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {icon} {title}
        </CardTitle>
        <Badge variant={status.color}>{status.text}</Badge>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="text-2xl font-bold">{Math.round(currentValue)}{unit}</div>
        <p className="text-xs text-muted-foreground">
          Real-time {title.toLowerCase()}
        </p>
        <div className="mt-4 flex-1 h-32">
          <ChartContainer config={chartConfig}>
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={colorClass} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={`hsl(var(--${colorClass}))`} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={`hsl(var(--${colorClass}))`} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={`hsl(var(--${colorClass}))`}
                fillOpacity={1}
                fill={`url(#${colorClass})`}
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};


export default function PerformanceMonitoring() {
  const [cpuData, setCpuData] = useState<MetricData[]>([]);
  const [memoryData, setMemoryData] = useState<MetricData[]>([]);
  const [latencyData, setLatencyData] = useState<MetricData[]>([]);

  useEffect(() => {
    setCpuData(generateInitialData());
    setMemoryData(generateInitialData());
    setLatencyData(generateInitialData().map(d => ({ ...d, value: Math.max(5, Math.floor(d.value / 4)) })));

    const interval = setInterval(() => {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      setCpuData((prev) => [...prev.slice(1), { time: now, value: Math.max(10, Math.min(99, (prev[prev.length - 1]?.value || 50) + (Math.random() * 10 - 5))) }]);
      setMemoryData((prev) => [...prev.slice(1), { time: now, value: Math.max(15, Math.min(95, (prev[prev.length - 1]?.value || 50) + (Math.random() * 8 - 4))) }]);
      setLatencyData((prev) => [...prev.slice(1), { time: now, value: Math.max(5, Math.min(99, (prev[prev.length - 1]?.value || 20) + (Math.random() * 4 - 2))) }]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <MetricCard title="CPU Usage" icon={<Cpu className="h-4 w-4 text-muted-foreground" />} data={cpuData} unit="%" colorClass="chart-1" />
      <MetricCard title="Memory Usage" icon={<MemoryStick className="h-4 w-4 text-muted-foreground" />} data={memoryData} unit="%" colorClass="chart-2" />
      <MetricCard title="Network Latency" icon={<Network className="h-4 w-4 text-muted-foreground" />} data={latencyData} unit="ms" colorClass="chart-3" />
    </div>
  );
}
