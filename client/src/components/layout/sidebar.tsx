import { Brain, MessageSquare, Crown, Handshake, CreditCard, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const menuItems = [
    {
      label: "Assistant Chat",
      icon: MessageSquare,
      active: true,
      badge: "live"
    },
    {
      label: "Brain Ingestion",
      icon: Brain,
      active: false
    },
    {
      label: "Godmode",
      icon: Crown,
      active: false,
      badge: "DEV"
    }
  ];

  const integrations = [
    {
      label: "CRM Sync",
      icon: Handshake,
      active: true
    },
    {
      label: "Stripe Tiers",
      icon: CreditCard,
      active: false
    },
    {
      label: "HACP Protocol",
      icon: Shield,
      active: false
    }
  ];

  return (
    <aside className={cn("w-64 bg-slate-800 border-r border-slate-700 flex flex-col", className)}>
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              SaintSal
            </h1>
            <p className="text-xs text-gray-400 font-mono">v70.resurrection</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Core Functions
        </div>
        
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={cn(
              "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all",
              item.active 
                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
                : "text-gray-300 hover:bg-slate-700"
            )}
          >
            <item.icon className="w-4 h-4" />
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <div className={cn(
                "text-xs px-2 py-1 rounded",
                item.badge === "live" 
                  ? "w-2 h-2 bg-emerald-500 rounded-full animate-pulse" 
                  : "bg-purple-500/20 text-purple-400"
              )}>
                {item.badge !== "live" && item.badge}
              </div>
            )}
          </button>
        ))}

        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 mt-6">
          Integrations
        </div>

        {integrations.map((item, index) => (
          <button
            key={index}
            className={cn(
              "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-slate-700 transition-all"
            )}
          >
            <item.icon className="w-4 h-4" />
            <span className="flex-1 text-left">{item.label}</span>
            {item.active && (
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            )}
          </button>
        ))}
      </nav>

      {/* Status Indicator */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-gray-400">System Status: </span>
          <span className="text-emerald-400 font-medium">Resurrected</span>
        </div>
        <div className="mt-2 text-xs text-gray-500 font-mono">
          Mind + Body = Soul
        </div>
      </div>
    </aside>
  );
}
