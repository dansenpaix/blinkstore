"use client";

import React, { useEffect, useState } from "react";
import { useDashboard } from "@/context/DashboardState";
import { 
  TrendingUp, 
  Layers, 
  Activity, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2 
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// Mock data for sales history chart
const initialChartData = [
  { day: "Mon", yield: 12.4 },
  { day: "Tue", yield: 15.8 },
  { day: "Wed", yield: 14.2 },
  { day: "Thu", yield: 18.9 },
  { day: "Fri", yield: 21.3 },
  { day: "Sat", yield: 19.5 },
  { day: "Sun", yield: 24.3 },
];

export const AnalyticsView: React.FC = () => {
  const { totalYield, totalTransactions, products, settlements } = useDashboard();
  const [chartData, setChartData] = useState(initialChartData);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update chart data slightly based on live metrics updates
  useEffect(() => {
    if (totalYield > 86.40) {
      const difference = totalYield - 86.40;
      setChartData((prev) => {
        const updated = [...prev];
        // add the diff to the last day
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          yield: parseFloat((initialChartData[initialChartData.length - 1].yield + difference).toFixed(2))
        };
        return updated;
      });
    }
  }, [totalYield]);

  // Calculate dynamic conversion rate
  const totalClicks = products.reduce((acc, p) => acc + p.clicks, 0);
  const totalSales = products.reduce((acc, p) => acc + p.sales, 0);
  const avgConversion = totalClicks > 0 
    ? ((totalSales / totalClicks) * 100).toFixed(2) 
    : "5.82";

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Live Analytics</h1>
        <p className="text-zinc-400 mt-1">Real-time performance monitoring & telemetry logs for your Blinks.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI 1: Gross Yield */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 glow-border relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-25 transition-opacity">
            <TrendingUp className="h-24 w-24 text-accent-emerald" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-400">Gross Yield</span>
            <div className="flex items-center gap-1 text-xs text-accent-emerald bg-accent-emerald/10 px-2 py-0.5 rounded-full font-semibold">
              <TrendingUp className="h-3 w-3" />
              <span>+12.4%</span>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-white">{totalYield.toFixed(2)}</span>
            <span className="text-sm font-semibold text-accent-emerald">SOL</span>
          </div>
          <p className="text-xs text-zinc-500 mt-2">Lifetime earnings across all active actions</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-emerald/20 to-accent-emerald/80" />
        </div>

        {/* KPI 2: Active Blinks */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 glow-border relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-25 transition-opacity">
            <Layers className="h-24 w-24 text-accent-indigo" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-400">Active Blinks Deployed</span>
            <span className="text-xs text-accent-indigo bg-accent-indigo/10 px-2 py-0.5 rounded-full font-semibold">
              Live
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold tracking-tight text-white">{products.length}</span>
            <span className="text-sm text-zinc-400 ml-2">Contracts</span>
          </div>
          <p className="text-xs text-zinc-500 mt-2">Currently listening for web3 signatures</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-indigo/20 to-accent-indigo/80" />
        </div>

        {/* KPI 3: Avg Conversion Velocity */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 glow-border relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-25 transition-opacity">
            <Activity className="h-24 w-24 text-accent-sky" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-400">Avg Conversion Velocity</span>
            <div className="flex items-center gap-1 text-xs text-accent-sky bg-accent-sky/10 px-2 py-0.5 rounded-full font-semibold">
              <span>Optimal</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold tracking-tight text-white">{avgConversion}%</span>
          </div>
          <p className="text-xs text-zinc-500 mt-2">Conversion velocity (Sales / Clicks)</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-sky/20 to-accent-sky/80" />
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Yield Timeline</h2>
            <p className="text-xs text-zinc-400">Weekly tracking of merchant payout settlement flow</p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg border border-zinc-700">
              <span className="h-2 w-2 rounded-full bg-accent-emerald" />
              SOL Earnings
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  stroke="#71717a" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#71717a" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `${val} SOL`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#0f0f11", 
                    borderColor: "#27272a", 
                    borderRadius: "8px",
                    color: "#fff"
                  }} 
                  labelClassName="text-xs text-zinc-400 font-semibold mb-1"
                  formatter={(val: any) => [`${val} SOL`, "Yield"]}
                />
                <Area 
                  type="monotone" 
                  dataKey="yield" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#yieldGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-zinc-950/20 border border-dashed border-zinc-800 rounded-lg">
              <Loader2 className="h-8 w-8 animate-spin text-zinc-600" />
            </div>
          )}
        </div>
      </div>

      {/* Settlements Table */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Recent Settlements Ledger</h2>
            <p className="text-xs text-zinc-400">Live feed of transactions signatures passing validation</p>
          </div>
          <div className="bg-zinc-950 px-3 py-1 rounded-lg border border-zinc-850 text-xs text-zinc-400 flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-emerald opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-emerald"></span>
            </span>
            {totalTransactions} Total
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-850 bg-zinc-950/40 text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Transaction Ref</th>
                <th className="px-6 py-4">Destination Asset</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Yield</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850/50">
              {settlements.map((settlement) => (
                <tr 
                  key={settlement.id} 
                  className="hover:bg-zinc-900/30 transition-colors duration-150 group"
                >
                  <td className="px-6 py-4 font-mono text-xs font-semibold text-zinc-400 group-hover:text-white transition-colors">
                    {settlement.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-zinc-200">
                    {settlement.productTitle}
                  </td>
                  <td className="px-6 py-4 text-zinc-400 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-zinc-500" />
                    {settlement.timestamp}
                  </td>
                  <td className="px-6 py-4">
                    {settlement.status === "success" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 glow-emerald">
                        <CheckCircle2 className="h-3 w-3" />
                        Success
                      </span>
                    )}
                    {settlement.status === "simulating" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Simulating
                      </span>
                    )}
                    {settlement.status === "failed" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                        <AlertCircle className="h-3 w-3" />
                        Failed
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-white">
                    +{settlement.yield.toFixed(2)} SOL
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
