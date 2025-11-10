export type Alert = {
  id: string;
  metric: 'CPU Usage' | 'Memory Usage' | 'Network Latency';
  threshold: number;
  unit: '%' | 'ms';
  notifications: ('Email' | 'SMS')[];
};

export type ConfigProfile = {
  id: string;
  name: string;
  parameters: {
    key: string;
    value: string;
  }[];
};

export type CodeIssue = {
  id: string;
  file: string;
  line: number;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
};

export type ViewType = 'dashboard' | 'advisor' | 'forecasting' | 'profiler' | 'analysis' | 'alerts';

export const viewTitles: Record<ViewType, string> = {
  dashboard: 'Performance Monitoring',
  advisor: 'AI-Powered Optimization Advisor',
  forecasting: 'Resource Usage Forecasting',
  profiler: 'Configuration Profiler',
  analysis: 'Automated Code Analysis',
  alerts: 'Customizable Alerting',
};
