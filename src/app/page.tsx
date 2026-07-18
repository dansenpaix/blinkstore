"use client";

import React, { useState } from "react";
import { useDashboard } from "@/context/DashboardState";
import { AnalyticsView } from "@/components/AnalyticsView";
import { ConfiguratorView } from "@/components/ConfiguratorView";
import { InventoryView } from "@/components/InventoryView";
import { IntegrationsView } from "@/components/IntegrationsView";
import { 
  Activity, 
  Sparkles, 
  Archive, 
  Terminal, 
  Wallet, 
  ShieldCheck,
  Menu,
  X,
  PlusCircle,
  Coins
} from "lucide-react";

export default function DashboardPage() {
  const { activeTab, setActiveTab, totalYield } = useDashboard();
  
  // Wallet state simulator
  const [isWalletConnected, setIsWalletConnected] = useState(true);
  const [walletBalance, setWalletBalance] = useState(245.50);

  // Mobile sidebar menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: "analytics", name: "Telemetry Analytics", icon: Activity },
    { id: "configurator", name: "Action Configurator", icon: Sparkles },
    { id: "inventory", name: "Inventory Vault", icon: Archive },
    { id: "integrations", name: "Integrations & Keys", icon: Terminal },
  ];

  const handleWalletToggle = () => {
    if (isWalletConnected) {
      setIsWalletConnected(false);
      setWalletBalance(0);
    } else {
      setIsWalletConnected(true);
      setWalletBalance(245.50);
    }
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case "analytics":
        return <AnalyticsView />;
      case "configurator":
        return <ConfiguratorView />;
      case "inventory":
        return <InventoryView />;
      case "integrations":
        return <IntegrationsView />;
      default:
        return <AnalyticsView />;
    }
  };

  return (
    <div className="flex min-h-screen md:h-screen md:overflow-hidden bg-zinc-950 text-zinc-100 flex-col md:flex-row">
      
      {/* SIDEBAR NAVIGATION (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-zinc-900 border-r border-zinc-800 shrink-0 overflow-y-auto">
        
        {/* Sidebar Header Brand */}
        <div className="h-16 px-6 border-b border-zinc-800 flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-indigo-650 flex items-center justify-center font-bold text-white shadow-lg">
            B
          </div>
          <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-450">
            BlinkStore
          </span>
          <span className="text-[10px] text-accent-emerald bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/25 font-bold uppercase tracking-wider">
            Console
          </span>
        </div>

        {/* Sidebar Tabs Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer
                  ${isActive 
                    ? "bg-zinc-800 text-white shadow border-l-2 border-accent-indigo" 
                    : "text-zinc-450 hover:bg-zinc-850 hover:text-zinc-200"
                  }
                `}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? "text-accent-indigo" : "text-zinc-500"}`} />
                {tab.name}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer (Wallet Simulation Widget) */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/40">
          <div className="bg-zinc-950/80 border border-zinc-850 rounded-xl p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Solana Wallet</span>
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isWalletConnected ? "bg-accent-emerald" : "bg-zinc-600"}`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isWalletConnected ? "bg-accent-emerald" : "bg-zinc-655"}`} />
              </span>
            </div>

            {isWalletConnected ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-zinc-300">3aef...4f81</span>
                  <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-0.5">
                    <Coins className="h-3 w-3 text-accent-emerald" />
                    {walletBalance.toFixed(2)}
                  </span>
                </div>
                <div className="text-[10px] text-zinc-550 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent-emerald" />
                  Devnet Authority (Demo Mode)
                </div>
              </div>
            ) : (
              <p className="text-xs text-zinc-550 italic leading-relaxed">
                Wallet disconnected. Switch connection to simulate active transactions.
              </p>
            )}

            <button
              onClick={handleWalletToggle}
              className={`w-full py-1.5 px-3 rounded-lg text-[11px] font-bold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5
                ${isWalletConnected
                  ? "bg-zinc-900 hover:bg-zinc-850 text-zinc-400 border border-zinc-800"
                  : "bg-accent-emerald hover:bg-emerald-650 text-black shadow-lg hover:shadow-emerald-500/10"
                }
              `}
            >
              <Wallet className="h-3.5 w-3.5" />
              {isWalletConnected ? "Disconnect Wallet" : "Connect Simulated Wallet"}
            </button>
          </div>
        </div>

      </aside>

      {/* MOBILE HEADER (Collapsible Sidebar menu toggler) */}
      <header className="md:hidden h-16 bg-zinc-900 border-b border-zinc-800 px-6 flex items-center justify-between shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-gradient-to-tr from-emerald-500 to-indigo-650 flex items-center justify-center font-bold text-white text-xs shadow">
            B
          </div>
          <span className="font-bold text-md tracking-tight">BlinkStore</span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg border border-zinc-850 hover:bg-zinc-800 text-zinc-400 transition-colors cursor-pointer"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* MOBILE SLIDE-OUT MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="absolute top-16 left-0 right-0 bg-zinc-900 border-b border-zinc-800 p-6 flex flex-col gap-4 animate-slideDown">
            <nav className="flex flex-col gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors cursor-pointer
                      ${isActive 
                        ? "bg-zinc-800 text-white" 
                        : "text-zinc-450 hover:bg-zinc-850 hover:text-zinc-200"
                      }
                    `}
                  >
                    <Icon className={`h-4.5 w-4.5 ${isActive ? "text-accent-indigo" : "text-zinc-550"}`} />
                    {tab.name}
                  </button>
                );
              })}
            </nav>

            {/* Mobile Wallet Toggle */}
            <div className="border-t border-zinc-850 pt-4 mt-2">
              <button
                onClick={() => {
                  handleWalletToggle();
                  setMobileMenuOpen(false);
                }}
                className={`w-full py-2 px-4 rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5
                  ${isWalletConnected
                    ? "bg-zinc-950 text-zinc-400 border border-zinc-800"
                    : "bg-accent-emerald text-black shadow-lg"
                  }
                `}
              >
                <Wallet className="h-4 w-4" />
                {isWalletConnected ? "Disconnect Wallet" : "Connect Simulated Wallet"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto w-full">
        <div className="max-w-7xl mx-auto px-6 py-8 md:px-10 md:py-10 pb-24 md:pb-10">
          {renderActiveView()}
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR (Slick SaaS ergonomic control) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-md border-t border-zinc-800 h-16 z-40 flex justify-around items-center px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMobileMenuOpen(false);
              }}
              className="flex flex-col items-center justify-center gap-1 text-[10px] font-bold cursor-pointer h-full px-2"
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-accent-indigo scale-110" : "text-zinc-550"} transition-all`} />
              <span className={isActive ? "text-white" : "text-zinc-550"}>
                {tab.name.split(" ")[0]}
              </span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}
