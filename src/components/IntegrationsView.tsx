"use client";

import React, { useState } from "react";
import { useDashboard } from "@/context/DashboardState";
import { 
  Key, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Copy, 
  Check, 
  Terminal, 
  Globe, 
  Send,
  Loader2,
  Code
} from "lucide-react";

interface LogEntry {
  timestamp: string;
  method: string;
  url: string;
  status: number;
  latency: string;
  payload: string;
}

export const IntegrationsView: React.FC = () => {
  const { 
    secretKey, 
    regenerateSecretKey, 
    webhookUrl, 
    setWebhookUrl, 
    addToast 
  } = useDashboard();

  const [showKey, setShowKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [localWebhook, setLocalWebhook] = useState(webhookUrl);
  const [isSavingWebhook, setIsSavingWebhook] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString().replace('T', ' ').substring(0, 19),
      method: "POST",
      url: webhookUrl,
      status: 200,
      latency: "142ms",
      payload: '{"event": "blink_created", "blinkId": "sol-dev-ticket"}'
    },
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString().replace('T', ' ').substring(0, 19),
      method: "POST",
      url: webhookUrl,
      status: 200,
      latency: "198ms",
      payload: '{"event": "tx_settled", "tx": "#tx_z892", "amount": 0.85}'
    }
  ]);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(secretKey);
    setCopiedKey(true);
    addToast("Secret Key copied to clipboard", "success");
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localWebhook.trim()) {
      addToast("Webhook URL cannot be empty", "error");
      return;
    }
    setIsSavingWebhook(true);
    
    setTimeout(() => {
      setWebhookUrl(localWebhook);
      setIsSavingWebhook(false);
      addToast("Webhook endpoint updated successfully", "success");
      
      const newLog: LogEntry = {
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        method: "SYSTEM",
        url: `Registered target: ${localWebhook}`,
        status: 201,
        latency: "0ms",
        payload: '{"status": "registered", "actions": ["tx_settlement", "blink_state_change"]}'
      };
      setLogs(prev => [newLog, ...prev]);
    }, 1000);
  };

  const handleTestWebhook = () => {
    if (isTestingWebhook) return;
    setIsTestingWebhook(true);
    
    addToast("Dispatching mock transaction settled webhook...", "info");

    setTimeout(() => {
      const isSuccess = Math.random() > 0.05;
      const status = isSuccess ? 200 : 500;
      
      const newLog: LogEntry = {
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        method: "POST",
        url: webhookUrl,
        status,
        latency: `${Math.floor(Math.random() * 200 + 50)}ms`,
        payload: JSON.stringify({
          event: "tx_settled_test",
          tx: `#tx_test_${Math.random().toString(36).substring(2, 6)}`,
          amount: 1.25,
          timestamp: Math.floor(Date.now() / 1000),
          network: "solana-mainnet",
          signature_status: "finalized"
        })
      };

      setLogs(prev => [newLog, ...prev]);
      setIsTestingWebhook(false);

      if (isSuccess) {
        addToast("Test webhook payload delivered: 200 OK", "success");
      } else {
        addToast("Test webhook delivery failed: 500 Internal Server Error", "error");
      }
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          Webhook & Integrations
        </h1>
        <p className="text-zinc-400 mt-1">
          Secure API authorizations, listen to webhook hooks, and track serverless logs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Globe className="h-4.5 w-4.5 text-accent-indigo" />
              On-Chain Webhook Listener
            </h2>
            <p className="text-xs text-zinc-400">
              Deliver secure payload streams immediately after validation signatures land on Solana mainnet.
            </p>

            <form onSubmit={handleSaveWebhook} className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Target Webhook Endpoint
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={localWebhook}
                    onChange={(e) => setLocalWebhook(e.target.value)}
                    placeholder="https://api.yourdomain.com/webhooks"
                    className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-accent-indigo/50 focus:ring-1 focus:ring-accent-indigo/35 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-650 transition-all outline-none"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSavingWebhook}
                    className="bg-zinc-800 hover:bg-zinc-750 active:bg-zinc-700 border border-zinc-700 text-white font-medium rounded-lg px-4 py-2 text-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                  >
                    {isSavingWebhook ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </div>
            </form>

            <div className="pt-2 border-t border-zinc-850 flex items-center justify-between">
              <span className="text-xs text-zinc-500 font-mono">
                Payload format: POST (Application/JSON)
              </span>
              <button
                type="button"
                onClick={handleTestWebhook}
                disabled={isTestingWebhook}
                className="bg-accent-indigo/10 text-accent-indigo hover:bg-accent-indigo/25 active:bg-accent-indigo/30 border border-accent-indigo/20 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all hover:shadow-indigo-500/10"
              >
                {isTestingWebhook ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Delivering Payload...
                  </>
                ) : (
                  <>
                    <Send className="h-3 w-3" />
                    Test Trigger Webhook
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Key className="h-4.5 w-4.5 text-accent-emerald animate-pulse-slow" />
              API Authentication Keys
            </h2>
            <p className="text-xs text-zinc-400">
              Authenticate calls to compile program templates or register new Action triggers programmatically.
            </p>

            <div className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Blink-Merchant-Secret-Key
                </label>
                
                <div className="flex gap-2">
                  <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm font-mono text-zinc-300 flex items-center justify-between overflow-hidden">
                    <span className="truncate select-all text-xs tracking-wider">
                      {showKey ? secretKey : "••••••••••••••••••••••••••••••••••••••••••••"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="text-zinc-500 hover:text-zinc-300 transition-colors ml-2 cursor-pointer shrink-0"
                    >
                      {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyKey}
                    title="Copy Secret Key"
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-750 border border-zinc-750 text-zinc-300 hover:text-white transition-colors cursor-pointer shrink-0"
                  >
                    {copiedKey ? <Check className="h-4 w-4 text-accent-emerald" /> : <Copy className="h-4 w-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={regenerateSecretKey}
                    title="Regenerate Credentials"
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-750 border border-zinc-750 text-zinc-300 hover:text-red-400 hover:border-red-500/20 transition-colors cursor-pointer shrink-0"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>

                </div>
              </div>

              <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-3 text-[11px] leading-relaxed text-amber-305 font-medium">
                <strong>CRITICAL:</strong> Keep your secret credentials isolated. Webhook signatures can be validated locally using the secret key to prevent DNS spoof attacks.
              </div>
            </div>
          </div>

        </div>

        <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 flex flex-col h-full space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Terminal className="h-4.5 w-4.5 text-zinc-400" />
              Event Logs Terminal
            </h2>
            <button
              onClick={() => {
                setLogs([]);
                addToast("Terminal logs cleared", "info");
              }}
              className="text-[10px] text-zinc-500 hover:text-zinc-350 cursor-pointer"
            >
              Clear Logs
            </button>
          </div>

          <div className="flex-1 bg-black border border-zinc-850 rounded-lg font-mono text-[11px] p-4 min-h-[350px] max-h-[460px] overflow-y-auto space-y-4 scrollbar-thin">
            {logs.length > 0 ? (
              logs.map((log, idx) => (
                <div key={idx} className="space-y-1.5 border-b border-zinc-900 pb-3 last:border-b-0 last:pb-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-zinc-550">
                    <span>[{log.timestamp}]</span>
                    <div className="flex gap-2">
                      <span className="text-zinc-600">latency: {log.latency}</span>
                      <span className={log.status === 200 || log.status === 201 ? "text-accent-emerald font-semibold" : "text-red-400 font-semibold"}>
                        HTTP {log.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <span className="text-accent-sky font-semibold bg-accent-sky/5 px-1 py-0.2 rounded border border-accent-sky/15">
                      {log.method}
                    </span>
                    <span className="text-zinc-300 truncate select-all">{log.url}</span>
                  </div>

                  <div className="bg-zinc-950/80 p-2 rounded border border-zinc-900 text-zinc-450 overflow-x-auto">
                    <pre className="max-w-full">
                      <code>{log.payload}</code>
                    </pre>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-650 italic">
                Terminal idle. Dispatch transaction signatures to record event streams...
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
