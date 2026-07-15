"use client";

import React, { useState } from "react";
import { useDashboard, Product } from "@/context/DashboardState";
import { 
  Search, 
  Copy, 
  Terminal, 
  Power, 
  PowerOff, 
  Check, 
  ExternalLink,
  Coins,
  Activity,
  Archive,
  Eye,
  SlidersHorizontal
} from "lucide-react";

export const InventoryView: React.FC = () => {
  const { products, toggleProductStatus, addToast } = useDashboard();
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedEndpointId, setCopiedEndpointId] = useState<string | null>(null);

  // Search logic
  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    return (
      product.title.toLowerCase().includes(term) ||
      product.id.toLowerCase().includes(term) ||
      (product.metadata && product.metadata.toLowerCase().includes(term))
    );
  });

  const handleCopyBlinkLink = (product: Product) => {
    const formattedLink = `https://dial.to/?action=solana-action:https://blinkstore.dev/api/actions/${product.id}`;
    navigator.clipboard.writeText(formattedLink);
    addToast("Dial.to Blink Link copied!", "success");
    setCopiedId(product.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyRawEndpoint = (product: Product) => {
    const rawEndpoint = `https://blinkstore.dev/api/actions/${product.id}`;
    navigator.clipboard.writeText(rawEndpoint);
    addToast("API JSON endpoint copied!", "success");
    setCopiedEndpointId(product.id);
    setTimeout(() => setCopiedEndpointId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Inventory Vault
          </h1>
          <p className="text-zinc-400 mt-1">
            Browse, manage, and distribute Solana Action links deployed across the decentralized ledger.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs text-zinc-300">
          <Archive className="h-4 w-4 text-accent-indigo" />
          <span>{products.length} Total Blinks</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden p-6 space-y-6">
        
        {/* Search & Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-zinc-550" />
            </span>
            <input
              type="text"
              placeholder="Search by title, ID, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-zinc-550 focus:border-accent-indigo/50 focus:ring-1 focus:ring-accent-indigo/35 outline-none transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-zinc-400">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>High Density Console View</span>
          </div>
        </div>

        {/* Catalog Table */}
        <div className="overflow-x-auto border border-zinc-850 rounded-lg bg-zinc-950/20">
          {filteredProducts.length > 0 ? (
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-zinc-850 bg-zinc-950/40 text-zinc-450 text-xs uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4">Product Preview</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Clicks</th>
                  <th className="px-6 py-4">Sales</th>
                  <th className="px-6 py-4">Gross Revenue</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850/50">
                {filteredProducts.map((product) => (
                  <tr 
                    key={product.id} 
                    className="hover:bg-zinc-900/25 transition-colors duration-150 group"
                  >
                    {/* Preview / Image + Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0 flex items-center justify-center">
                          {product.coverImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img 
                              src={product.coverImage} 
                              alt={product.title} 
                              className="object-cover h-full w-full opacity-85 group-hover:opacity-100 transition-opacity"
                            />
                          ) : (
                            <div className="h-4 w-4 bg-zinc-800 rounded" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-white group-hover:text-accent-indigo transition-colors">
                            {product.title}
                          </div>
                          <div className="font-mono text-[10px] text-zinc-500 mt-0.5 flex items-center gap-1.5">
                            <span>ID: {product.id}</span>
                            {product.metadata && (
                              <span className="hidden sm:inline text-zinc-650 bg-zinc-900/60 px-1 py-0.2 rounded border border-zinc-850">
                                {product.metadata.split(",")[0]}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 text-zinc-205 font-medium">
                      {product.price.toFixed(2)} SOL
                    </td>

                    {/* Clicks */}
                    <td className="px-6 py-4 font-mono text-xs text-zinc-400">
                      {product.clicks.toLocaleString()}
                    </td>

                    {/* Sales */}
                    <td className="px-6 py-4 font-mono text-xs text-zinc-400">
                      {product.sales.toLocaleString()}
                    </td>

                    {/* Gross Revenue */}
                    <td className="px-6 py-4 text-zinc-200 font-semibold">
                      <span className="flex items-center gap-1">
                        <Coins className="h-3.5 w-3.5 text-accent-emerald" />
                        {(product.price * product.sales).toFixed(2)} SOL
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      {product.status === "active" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 glow-emerald">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-zinc-550" />
                          Paused
                        </span>
                      )}
                    </td>

                    {/* Utility Quick-Actions Matrix */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        
                        {/* Copy Blink Link */}
                        <button
                          type="button"
                          onClick={() => handleCopyBlinkLink(product)}
                          title="Copy Dial.to Blink Link"
                          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-850 hover:border-accent-indigo hover:text-accent-indigo transition-all cursor-pointer text-zinc-400"
                        >
                          {copiedId === product.id ? (
                            <Check className="h-3.5 w-3.5 text-accent-emerald" />
                          ) : (
                            <ExternalLink className="h-3.5 w-3.5" />
                          )}
                        </button>

                        {/* Copy Raw Endpoint */}
                        <button
                          type="button"
                          onClick={() => handleCopyRawEndpoint(product)}
                          title="Copy Raw JSON API Endpoint"
                          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-850 hover:border-accent-sky hover:text-accent-sky transition-all cursor-pointer text-zinc-400"
                        >
                          {copiedEndpointId === product.id ? (
                            <Check className="h-3.5 w-3.5 text-accent-emerald" />
                          ) : (
                            <Terminal className="h-3.5 w-3.5" />
                          )}
                        </button>

                        {/* Deactivate / Pause */}
                        <button
                          type="button"
                          onClick={() => toggleProductStatus(product.id)}
                          title={product.status === "active" ? "Pause Blink" : "Activate Blink"}
                          className={`p-1.5 rounded-lg bg-zinc-900 border border-zinc-850 transition-all cursor-pointer 
                            ${product.status === "active" 
                              ? "hover:border-red-500/50 hover:text-red-400 text-zinc-400" 
                              : "hover:border-emerald-500/50 hover:text-emerald-400 text-zinc-550"
                            }
                          `}
                        >
                          {product.status === "active" ? (
                            <PowerOff className="h-3.5 w-3.5" />
                          ) : (
                            <Power className="h-3.5 w-3.5" />
                          )}
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-zinc-500 font-medium">
              No products found matching your search query.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
