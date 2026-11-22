"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const PALETTE = [
  "var(--color-primary)",
  "var(--color-accent)",
  "var(--color-info)",
  "var(--color-secondary)",
  "var(--color-success)",
  "var(--color-error)",
];

const tooltipStyle = {
  contentStyle: {
    background: "var(--color-base-100)",
    border: "1px solid var(--color-base-300)",
    borderRadius: 14,
    color: "var(--color-base-content)",
    fontSize: 13,
    boxShadow: "0 12px 30px -12px rgba(0,0,0,.25)",
  },
  labelStyle: { fontWeight: 700, color: "var(--color-base-content)" },
  cursor: { fill: "var(--color-base-200)" },
};

const axis = { stroke: "var(--color-base-content)", strokeOpacity: 0.45, fontSize: 12, tickLine: false, axisLine: false };

export function ChartCard({ title, sub, children, className = "" }) {
  return (
    <div className={`card-surface p-5 md:p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-bold">{title}</h3>
        {sub && <p className="text-xs text-base-content/55">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

export function TrendChart({ data, dataKey, label, money = false, color = "var(--color-primary)" }) {
  const fmt = (v) => (money ? `$${Number(v).toLocaleString()}` : v);
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.45} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--color-base-300)" strokeDasharray="4 4" />
          <XAxis dataKey="month" {...axis} />
          <YAxis {...axis} tickFormatter={fmt} allowDecimals={false} />
          <Tooltip {...tooltipStyle} formatter={(v) => [fmt(v), label]} />
          <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} fill={`url(#grad-${dataKey})`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SimpleBarChart({ data, dataKey, xKey = "name", label, money = false, color = "var(--color-accent)", horizontal = false }) {
  const fmt = (v) => (money ? `$${Number(v).toLocaleString()}` : v);
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout={horizontal ? "vertical" : "horizontal"} margin={{ top: 10, right: 16, left: horizontal ? 10 : -10, bottom: 0 }}>
          <CartesianGrid vertical={horizontal} horizontal={!horizontal} stroke="var(--color-base-300)" strokeDasharray="4 4" />
          {horizontal ? (
            <>
              <XAxis type="number" {...axis} tickFormatter={fmt} />
              <YAxis type="category" dataKey={xKey} {...axis} width={120} tickFormatter={(v) => (String(v).length > 16 ? `${String(v).slice(0, 15)}…` : v)} />
            </>
          ) : (
            <>
              <XAxis dataKey={xKey} {...axis} />
              <YAxis {...axis} tickFormatter={fmt} allowDecimals={false} />
            </>
          )}
          <Tooltip {...tooltipStyle} formatter={(v) => [fmt(v), label]} />
          <Bar dataKey={dataKey} fill={color} radius={horizontal ? [0, 8, 8, 0] : [8, 8, 0, 0]} maxBarSize={44} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="relative h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="85%" paddingAngle={3} stroke="var(--color-base-100)" strokeWidth={3}>
            {data.map((d, i) => (
              <Cell key={d.name} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip {...tooltipStyle} />
          <Legend iconType="circle" formatter={(v) => <span className="text-xs capitalize text-base-content/70">{v}</span>} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-x-0 top-[38%] text-center">
        <p className="font-display text-3xl font-extrabold">{total}</p>
        <p className="text-xs text-base-content/50">total</p>
      </div>
    </div>
  );
}
