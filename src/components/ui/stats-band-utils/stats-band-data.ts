export type StatVisual =
  | { kind: "trend"; values: number[] }
  | { kind: "uptime"; days: number[] }
  | { kind: "distribution"; bins: number[]; max: number; marker: number }
  | { kind: "map"; points: [number, number][] };

export interface Stat {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  notation?: "compact" | "standard";
  detail?: string;
  context?: string;
  visual?: StatVisual;
}

export const stats: Stat[] = [
  {
    label: "Global latency (p95)",
    value: 28,
    suffix: "ms",
    detail: "4.2ms faster than SLA",
    context: "Across all 32 edge regions",
    visual: {
      kind: "distribution",
      bins: [4, 8, 15, 30, 48, 62, 40, 20, 10, 5, 2],
      max: 60,
      marker: 28,
    },
  },
  {
    label: "Platform uptime",
    value: 99.98,
    suffix: "%",
    decimals: 2,
    detail: "Zero unscheduled outages",
    context: "Trailing 90-day window",
    visual: {
      kind: "uptime",
      days: [
        100, 100, 100, 100, 100, 100, 99.9, 100, 100, 100,
        100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
        100, 100, 100, 100, 100, 100, 100, 100, 100, 100
      ],
    },
  },
  {
    label: "Processed requests",
    value: 12400000,
    notation: "compact",
    decimals: 1,
    detail: "+18% from last month",
    context: "All partner associations",
    visual: {
      kind: "trend",
      values: [12, 14, 18, 17, 22, 26, 29, 35, 42, 50],
    },
  },
  {
    label: "Active endpoints",
    value: 86,
    detail: "Connected in real time",
    context: "Riyadh, Jeddah, Dammam & beyond",
    visual: {
      kind: "map",
      points: [
        [46.6753, 24.7136], // Riyadh
        [39.1979, 21.4858], // Jeddah
        [50.1033, 26.4207], // Dammam
        [39.6122, 24.4672], // Medina
        [39.8262, 21.4225], // Mecca
      ],
    },
  },
];
