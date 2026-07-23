import React from "react";
import { ViewType } from "../types";
import { LayoutDashboard, Package, BotMessageSquare, Megaphone, LogOut, Settings as SettingsIcon } from "lucide-react";
import { ThemeConfig } from "../theme";

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onLogout: () => void;
  currentTheme: ThemeConfig;
}

export function Sidebar({ currentView, onViewChange, onLogout, currentTheme }: SidebarProps) {
  const navItems: { id: ViewType; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "inventory", label: "Inventory", icon: <Package className="w-5 h-5" /> },
    { id: "chat", label: "AI Assistant", icon: <BotMessageSquare className="w-5 h-5" /> },
    { id: "marketing", label: "Marketing Hub", icon: <Megaphone className="w-5 h-5" /> },
    { id: "settings", label: "Settings", icon: <SettingsIcon className="w-5 h-5" /> },
  ];

  return (
    <aside className="hidden md:flex w-64 border-r border-[#1e1e24] flex-col bg-[#0b0b0d] h-full selection:bg-amber-500/20">
      <div className="p-6 flex items-center gap-3">
        <div className={`w-9 h-9 bg-gradient-to-br ${currentTheme.gradientFromTo} rounded-xl flex items-center justify-center font-bold text-black shadow-md`}>
          M
        </div>
        <span className="font-extrabold text-xl tracking-tight text-white uppercase font-sans">
          Mobile <span className={currentTheme.accentText}>King</span>
        </span>
      </div>
      <nav className="flex-1 px-4 space-y-1.5 mt-4">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? `${currentTheme.bgAccentTen} ${currentTheme.accentText} border ${currentTheme.borderAccentTwentyFive} shadow-sm`
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.02]"
              }`}
            >
              <span className={`transition-transform duration-200 ${isActive ? `scale-110 ${currentTheme.accentText}` : "text-slate-400"}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-6 border-t border-[#1e1e24] flex flex-col gap-4">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 text-slate-400 hover:text-red-400 text-sm font-medium transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
        <div className="text-[10px] text-slate-600 uppercase tracking-widest font-mono">Mobile King Admin v3.0</div>
      </div>
    </aside>
  );
}

