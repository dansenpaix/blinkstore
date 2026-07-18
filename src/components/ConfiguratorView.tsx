"use client";

import React, { useState } from "react";
import { useDashboard } from "@/context/DashboardState";
import { 
  Sparkles, 
  Terminal, 
  Settings, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Lock, 
  Coins, 
  Database,
  Link,
  Code,
  Check,
  Loader2
} from "lucide-react";

export const ConfiguratorView: React.FC = () => {
  const { addProduct, simulatePurchase, addToast, totalYield } = useDashboard();

  const [title, setTitle] = useState("BlinkStore VIP Founders Pass");
  const [coverImage, setCoverImage] = useState(
    "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80"
  );
  const [description, setDescription] = useState(
    "Unlock elite lifetime access to Solana Actions merchant infrastructure, prioritized API webhooks, and private Discord channels."
  );
  const [price, setPrice] = useState(0.50);
  const [inventory, setInventory] = useState(100);

  const [rulesOpen, setRulesOpen] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("https://blinkstore.dev/vip-onboarding");
  const [webhookUrl, setWebhookUrl] = useState("https://api.blinkstore.dev/webhooks/founders-pass");
  const [metadata, setMetadata] = useState("vip, solana, badge, membership");

  const [isSimulatingBuy, setIsSimulatingBuy] = useState(false);
  const [buySuccess, setBuySuccess] = useState(false);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !coverImage.trim() || !description.trim()) {
      addToast("Please fill in all primary fields.", "error");
      return;
    }
    
    addProduct({
      title,
      coverImage,
      description,
      price: Number(price),
      inventory: Number(inventory),
      status: "active",
      redirectUrl: redirectUrl.trim() || undefined,
      webhookUrl: webhookUrl.trim() || undefined,
      metadata: metadata.trim() || undefined
    });
  };

  const handleSimulateBuy = async () => {
    if (isSimulatingBuy) return;
    setIsSimulatingBuy(true);
    setBuySuccess(false);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      setBuySuccess(true);
      addToast(`Simulation Success! 0.50 SOL received for ${title}`, "success");
      
      // Simulate purchase on standard product to update global telemetry/metrics
      await simulatePurchase("sol-dev-ticket");
      
    } catch (e) {
      addToast("Transaction signature failed", "error");
    } finally {
      setIsSimulatingBuy(false);
      setTimeout(() => setBuySuccess(false), 3000);
    }
  };
  const generatedSchema = JSON.stringify(
    {
      icon: coverImage || "https://blinkstore.dev/placeholder.jpg",
      title: title || "Your Blink Title",
      description: description || "Your Blink Description",
      label: `Buy for ${price} SOL`,
      error: {
        message: "This is a simulated Solana Action schema payload."
      },
      links: {
        actions: [
          {
            label: `Buy for ${price} SOL`,
            href: `/api/actions/purchase?amount=${price}`,
            parameters: webhookUrl ? [
              {
                name: "webhook",
                label: "Webhook Parameters",
                required: false
              }
            ] : []
          }
        ]
      },
      rules: {
        redirectUrl: redirectUrl || undefined,
        webhook: webhookUrl || undefined,
        metadata: metadata ? metadata.split(",").map(m => m.trim()) : []
      }
    },
    null,
    2
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          Action Configurator <Sparkles className="h-6 w-6 text-accent-indigo animate-pulse" />
        </h1>
        <p className="text-zinc-400 mt-1">
          Compose Solana Actions, define access restrictions, and compile them into deployable Blinks.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Settings className="h-4 w-4 text-zinc-400" />
              Blink Parameters
            </h2>
            <span className="text-xs text-accent-indigo font-mono bg-accent-indigo/10 px-2 py-0.5 rounded">
              v1.0.0-Beta
            </span>
          </div>

          <form onSubmit={handlePublish} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Product / Blink Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Solana Dev Course Ticket"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-accent-indigo/50 focus:ring-1 focus:ring-accent-indigo/35 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-650 transition-all outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Cover Image URL
              </label>
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-accent-indigo/50 focus:ring-1 focus:ring-accent-indigo/35 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-650 transition-all outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of the offer..."
                rows={3}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-accent-indigo/50 focus:ring-1 focus:ring-accent-indigo/35 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-650 transition-all outline-none resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                  Price (SOL) <Coins className="h-3 w-3 text-accent-emerald" />
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-accent-indigo/50 focus:ring-1 focus:ring-accent-indigo/35 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-650 transition-all outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                  Inventory Limit <Database className="h-3 w-3 text-accent-sky" />
                </label>
                <input
                  type="number"
                  min="1"
                  value={inventory}
                  onChange={(e) => setInventory(parseInt(e.target.value) || 0)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-accent-indigo/50 focus:ring-1 focus:ring-accent-indigo/35 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-650 transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div className="border border-zinc-800 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setRulesOpen(!rulesOpen)}
                className="w-full bg-zinc-900/60 hover:bg-zinc-900 px-4 py-3 flex items-center justify-between text-sm font-medium text-zinc-300 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-accent-indigo" />
                  Advanced Web3 Rules
                </span>
                {rulesOpen ? (
                  <ChevronUp className="h-4 w-4 text-zinc-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-zinc-500" />
                )}
              </button>

              {rulesOpen && (
                <div className="bg-zinc-950/40 p-4 border-t border-zinc-800 space-y-3 animate-fadeIn">
                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-450 flex items-center gap-1">
                      <Link className="h-3 w-3 text-zinc-500" />
                      Success Redirect URL
                    </label>
                    <input
                      type="url"
                      value={redirectUrl}
                      onChange={(e) => setRedirectUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-accent-indigo/50 focus:ring-1 focus:ring-accent-indigo/35 rounded-lg px-3 py-2.0 text-sm text-white placeholder-zinc-650 transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-450 flex items-center gap-1">
                      <Terminal className="h-3 w-3 text-zinc-500" />
                      Webhook Parameters
                    </label>
                    <input
                      type="url"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-accent-indigo/50 focus:ring-1 focus:ring-accent-indigo/35 rounded-lg px-3 py-2.0 text-sm text-white placeholder-zinc-650 transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-450 flex items-center gap-1">
                      <Code className="h-3 w-3 text-zinc-500" />
                      Metadata tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={metadata}
                      onChange={(e) => setMetadata(e.target.value)}
                      placeholder="solana, actions, blink"
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-accent-indigo/50 focus:ring-1 focus:ring-accent-indigo/35 rounded-lg px-3 py-2.0 text-sm text-white placeholder-zinc-650 transition-all outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-accent-indigo hover:bg-indigo-650 active:bg-indigo-700 text-white font-medium rounded-lg px-4 py-3 text-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-indigo-500/20"
            >
              <Sparkles className="h-4 w-4" />
              Compile & Publish Blink
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h3 className="text-xs font-semibold text-zinc-450 uppercase tracking-wider flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5 text-accent-sky fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Live X (Twitter) Feed Preview
            </h3>

            <div className="bg-black border border-zinc-800 rounded-xl p-4 space-y-3 font-sans text-[15px] leading-relaxed max-w-lg mx-auto">
              
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-650 flex items-center justify-center font-bold text-white text-sm shadow">
                  BS
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white hover:underline cursor-pointer">BlinkStore Merchant</span>
                    <span className="text-zinc-500 text-sm">@BlinkStoreDev</span>
                    <span className="text-zinc-500 text-sm">· Just now</span>
                  </div>
                  <p className="text-zinc-200 mt-1 text-[14px]">
                    Super excited to share our latest Solana Blink! You can buy or secure yours directly inside the feed. 🚀👇
                  </p>
                </div>
              </div>

              <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950 max-w-md mx-auto ml-13">
                <div className="relative h-44 w-full bg-zinc-900 flex items-center justify-center overflow-hidden border-b border-zinc-800/80">
                  {coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={coverImage} 
                      alt="Blink Cover" 
                      className="object-cover h-full w-full opacity-90 group-hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <div className="text-zinc-650 text-xs font-mono">Image Preview Container</div>
                  )}
                  <span className="absolute top-3 right-3 bg-black/60 text-zinc-300 text-[10px] px-2 py-0.5 rounded border border-zinc-800 font-semibold uppercase tracking-wider backdrop-blur-sm">
                    Solana Blink
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-[15px]">{title || "Your Blink Title"}</h4>
                    <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed">
                      {description || "Provide a description in the form to see how it renders here."}
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleSimulateBuy}
                      disabled={isSimulatingBuy || buySuccess}
                      className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer shadow
                        ${buySuccess 
                          ? "bg-emerald-500/20 text-accent-emerald border border-emerald-500/40 glow-emerald" 
                          : isSimulatingBuy
                            ? "bg-zinc-800 text-zinc-400 border border-zinc-700 cursor-not-allowed"
                            : "bg-white text-black hover:bg-zinc-150 active:scale-98"
                        }
                      `}
                    >
                      {isSimulatingBuy ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Signing Solana Transaction...
                        </>
                      ) : buySuccess ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Purchase Successful!
                        </>
                      ) : (
                        `Buy for ${price} SOL`
                      )}
                    </button>
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-2 px-1 font-mono">
                      <span>Ref: dial.to/solana-action</span>
                      <span>Security Secured</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-xs font-semibold text-zinc-450 uppercase tracking-wider flex items-center gap-1.5">
                <Code className="h-4.5 w-4.5 text-accent-indigo" />
                Solana Action Schema (Live JSON)
              </h3>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(generatedSchema);
                  addToast("JSON Schema copied to clipboard", "success");
                }}
                className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-1 rounded hover:bg-zinc-750 border border-zinc-700 font-mono transition-colors"
              >
                Copy JSON
              </button>
            </div>
            
            <div className="bg-black/80 rounded-lg p-4 overflow-x-auto border border-zinc-850">
              <pre className="text-xs font-mono text-indigo-300 leading-relaxed max-h-56 overflow-y-auto scrollbar-thin">
                <code>{generatedSchema}</code>
              </pre>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
