"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface Product {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  price: number;
  inventory: number;
  clicks: number;
  sales: number;
  status: "active" | "paused";
  redirectUrl?: string;
  webhookUrl?: string;
  metadata?: string;
}

export interface Settlement {
  id: string;
  productTitle: string;
  timestamp: string;
  status: "success" | "simulating" | "failed";
  yield: number;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "info" | "error";
}

interface DashboardContextType {
  products: Product[];
  totalYield: number;
  totalTransactions: number;
  settlements: Settlement[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  addProduct: (product: Omit<Product, "id" | "clicks" | "sales">) => void;
  toggleProductStatus: (id: string) => void;
  simulatePurchase: (productId: string) => Promise<boolean>;
  toasts: ToastMessage[];
  addToast: (message: string, type?: "success" | "info" | "error") => void;
  removeToast: (id: string) => void;
  secretKey: string;
  regenerateSecretKey: () => void;
  webhookUrl: string;
  setWebhookUrl: (url: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "sol-dev-ticket",
    title: "Solana Dev Course Ticket",
    description: "Complete access to Solana Action and Blink developer masterclass, including project files.",
    coverImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80",
    price: 0.85,
    inventory: 150,
    clicks: 1240,
    sales: 42,
    status: "active",
    redirectUrl: "https://blinkstore.dev/academy/success",
    webhookUrl: "https://api.blinkstore.dev/webhooks/sales",
    metadata: "solana, course, masterclass",
  },
  {
    id: "murim-art-pack",
    title: "Murim Manhwa Art Pack",
    description: "Exclusive digital high-res collection of martial arts webtoon illustration assets and PSD overlays.",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    price: 1.50,
    inventory: 80,
    clicks: 875,
    sales: 31,
    status: "active",
    redirectUrl: "https://blinkstore.dev/downloads/murim-pack",
    webhookUrl: "https://api.blinkstore.dev/webhooks/downloads",
    metadata: "art, manhwa, asset, design",
  },
];

const INITIAL_SETTLEMENTS: Settlement[] = [
  { id: "#tx_z892", productTitle: "Solana Dev Course Ticket", timestamp: "10 mins ago", status: "success", yield: 0.85 },
  { id: "#tx_w721", productTitle: "Murim Manhwa Art Pack", timestamp: "45 mins ago", status: "success", yield: 1.50 },
  { id: "#tx_y044", productTitle: "Solana Dev Course Ticket", timestamp: "2 hours ago", status: "success", yield: 0.85 },
  { id: "#tx_a119", productTitle: "Murim Manhwa Art Pack", timestamp: "5 hours ago", status: "success", yield: 1.50 },
  { id: "#tx_k891", productTitle: "Solana Dev Course Ticket", timestamp: "1 day ago", status: "success", yield: 0.85 },
];

export const DashboardStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [totalYield, setTotalYield] = useState<number>(86.40);
  const [totalTransactions, setTotalTransactions] = useState<number>(234);
  const [settlements, setSettlements] = useState<Settlement[]>(INITIAL_SETTLEMENTS);
  const [activeTab, setActiveTab] = useState<string>("analytics");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [webhookUrl, setWebhookUrl] = useState<string>("https://api.merchant-receiver.io/v1/solana-events");
  const [secretKey, setSecretKey] = useState<string>("bs_sk_live_9a87d0c8f1a23e4b5c6d7e8f9a0b1c2d3e4f");

  const addToast = (message: string, type: "success" | "info" | "error" = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auto-remove toasts after 4 seconds
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prev) => prev.slice(1));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  const addProduct = (newProduct: Omit<Product, "id" | "clicks" | "sales">) => {
    const id = "prod_" + Math.random().toString(36).substring(2, 9);
    const product: Product = {
      ...newProduct,
      id,
      clicks: 0,
      sales: 0,
    };
    setProducts((prev) => [...prev, product]);
    addToast(`Successfully compiled and published: ${product.title}`, "success");
  };

  const toggleProductStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newStatus = p.status === "active" ? "paused" : "active";
          addToast(`Blink Status updated to: ${newStatus.toUpperCase()}`, "info");
          return { ...p, status: newStatus };
        }
        return p;
      })
    );
  };

  const simulatePurchase = async (productId: string): Promise<boolean> => {
    const product = products.find((p) => p.id === productId);
    if (!product) {
      addToast("Error: Product not found for simulation", "error");
      return false;
    }

    if (product.status === "paused") {
      addToast("Cannot simulate purchase: This Blink is deactivated/paused.", "error");
      return false;
    }

    // Add a temporary transaction row with simulating status
    const tempTxId = "#tx_sim_" + Math.random().toString(36).substring(2, 6);
    const newTx: Settlement = {
      id: tempTxId,
      productTitle: product.title,
      timestamp: "Just now",
      status: "simulating",
      yield: product.price,
    };

    setSettlements((prev) => [newTx, ...prev]);

    // Simulate 2.5 second delay for wallet approval & blockchain validation
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Update product click & sale counters
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return { ...p, clicks: p.clicks + 1, sales: p.sales + 1 };
        }
        return p;
      })
    );

    // Update global metrics
    const finalPrice = product.price;
    setTotalYield((prev) => parseFloat((prev + finalPrice).toFixed(2)));
    setTotalTransactions((prev) => prev + 1);

    // Finalize the settlement row
    const finalTxId = "#tx_" + Math.random().toString(36).substring(2, 8);
    setSettlements((prev) =>
      prev.map((s) => {
        if (s.id === tempTxId) {
          return { ...s, id: finalTxId, status: "success" };
        }
        return s;
      })
    );

    addToast(`Payment Cleared: Received ${finalPrice} SOL for ${product.title}`, "success");
    return true;
  };

  const regenerateSecretKey = () => {
    const chars = "abcdef0123456789";
    let newKey = "bs_sk_live_";
    for (let i = 0; i < 32; i++) {
      newKey += chars[Math.floor(Math.random() * chars.length)];
    }
    setSecretKey(newKey);
    addToast("Merchant Secret Key regenerated successfully", "success");
  };

  return (
    <DashboardContext.Provider
      value={{
        products,
        totalYield,
        totalTransactions,
        settlements,
        activeTab,
        setActiveTab,
        addProduct,
        toggleProductStatus,
        simulatePurchase,
        toasts,
        addToast,
        removeToast,
        secretKey,
        regenerateSecretKey,
        webhookUrl,
        setWebhookUrl,
      }}
    >
      {children}
      {/* Floating Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-2xl transition-all duration-300 transform translate-y-0 opacity-100 bg-zinc-950/95 backdrop-blur-md max-w-md
              ${toast.type === "success" 
                ? "border-emerald-500/30 text-white glow-emerald" 
                : toast.type === "error"
                  ? "border-red-500/30 text-white"
                  : "border-indigo-500/30 text-white glow-indigo"
              }
            `}
          >
            {toast.type === "success" && (
              <CheckCircle2 className="h-5 w-5 text-accent-emerald shrink-0 mt-0.5" />
            )}
            {toast.type === "error" && (
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            )}
            {toast.type === "info" && (
              <Info className="h-5 w-5 text-accent-indigo shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-xs font-semibold leading-relaxed">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-550 hover:text-zinc-350 transition-colors cursor-pointer shrink-0 mt-0.5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardStateProvider");
  }
  return context;
};
