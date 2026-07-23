import React, { useState, useEffect } from "react";
import { ViewType, Product } from "./types";
import { initialInventory } from "./data";
import { Login } from "./components/Login";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { Inventory } from "./components/Inventory";
import { AIChat } from "./components/AIChat";
import { Marketing } from "./components/Marketing";
import { Settings } from "./components/Settings";
import { THEMES } from "./theme";
import { isMockMode } from "./lib/gemini";
import { LayoutDashboard, Package, BotMessageSquare, Megaphone, Settings as SettingsIcon, LogOut } from "lucide-react";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDemoMode, setIsDemoMode] = useState(() => isMockMode());

  useEffect(() => {
    const handleStorageChange = () => {
      setIsDemoMode(isMockMode());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Persistent Inventory State
  const [inventory, setInventory] = useState<Product[]>(() => {
    const saved = localStorage.getItem("mobileking_inventory");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse inventory from localStorage", e);
      }
    }
    return initialInventory;
  });

  // Persistent Theme State
  const [themeId, setThemeId] = useState<string>(() => {
    return localStorage.getItem("mobileking_theme") || "gold";
  });

  // Persistent Animation Speed State
  const [animationSpeed, setAnimationSpeed] = useState<"fast" | "normal" | "slow" | "off">(() => {
    return (localStorage.getItem("mobileking_animation_speed") as any) || "normal";
  });

  useEffect(() => {
    const authStatus = sessionStorage.getItem("auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Save inventory changes to localStorage
  useEffect(() => {
    localStorage.setItem("mobileking_inventory", JSON.stringify(inventory));
  }, [inventory]);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    sessionStorage.removeItem("auth");
    setIsAuthenticated(false);
  };

  const handleSetTheme = (id: string) => {
    setThemeId(id);
    localStorage.setItem("mobileking_theme", id);
  };

  const handleSetAnimationSpeed = (speed: "fast" | "normal" | "slow" | "off") => {
    setAnimationSpeed(speed);
    localStorage.setItem("mobileking_animation_speed", speed);
  };

  const handleClearCache = () => {
    localStorage.removeItem("mobileking_inventory");
    localStorage.removeItem("mobileking_theme");
    localStorage.removeItem("mobileking_animation_speed");
    window.location.reload();
  };

  const currentTheme = THEMES[themeId] || THEMES.gold;

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard inventory={inventory} currentTheme={currentTheme} />;
      case "inventory":
        return (
          <Inventory
            inventory={inventory}
            setInventory={setInventory}
            filteredInventory={filteredInventory}
            currentTheme={currentTheme}
          />
        );
      case "chat":
        return <AIChat currentTheme={currentTheme} />;
      case "marketing":
        return <Marketing inventory={inventory} currentTheme={currentTheme} />;
      case "settings":
        return (
          <Settings
            currentTheme={currentTheme}
            setTheme={handleSetTheme}
            animationSpeed={animationSpeed}
            setAnimationSpeed={handleSetAnimationSpeed}
            onClearCache={handleClearCache}
          />
        );
      default:
        return <Dashboard inventory={inventory} currentTheme={currentTheme} />;
    }
  };

  return (
    <div className={`flex h-screen bg-[#050506] font-sans text-slate-200 overflow-hidden selection:bg-amber-500/20 selection:text-amber-300 relative physics-${animationSpeed}`}>
      {/* Premium Ambient Moving Wallpaper Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full ${currentTheme.glowColor} blur-[120px] animate-float-1`} />
        <div className={`absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] rounded-full ${currentTheme.glowColorSecondary} blur-[150px] animate-float-2`} />
        <div className={`absolute top-[40%] left-[40%] w-[40%] h-[40%] rounded-full ${currentTheme.glowColorTertiary} blur-[110px] animate-float-3`} />
      </div>

      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={handleLogout}
        currentTheme={currentTheme}
      />
      <main className="flex-1 flex flex-col overflow-hidden relative z-10 bg-transparent">
        <header className="h-16 md:h-20 px-4 md:px-8 flex items-center justify-between border-b border-[#1e1e24] bg-[#0b0b0d]/60 backdrop-blur-md flex-shrink-0">
          <div className="flex items-center gap-3 w-full max-w-[160px] sm:max-w-xs md:w-96">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full bg-[#121215] border border-[#212126] rounded-xl pl-3 pr-8 py-1.5 sm:pl-4 sm:pr-10 sm:py-2.5 text-xs sm:text-sm focus:ring-1 focus:ring-opacity-50 outline-none text-white placeholder-slate-500 transition-all focus:border-opacity-30`}
                style={{
                  borderColor: searchQuery ? currentTheme.primaryColorHex : undefined,
                  boxShadow: searchQuery ? `0 0 10px ${currentTheme.primaryColorHex}15` : undefined
                }}
                placeholder="Search catalog..."
              />
              <svg className="w-3 h-3 sm:w-4 sm:h-4 absolute right-3 top-2.5 sm:top-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex flex-col items-end">
              <span className="text-xs sm:text-sm font-semibold text-white tracking-wide">Store Admin</span>
              <span className={`text-[9px] sm:text-[10px] ${isDemoMode ? "text-amber-500" : "text-emerald-400"} font-bold uppercase tracking-wider flex items-center gap-1.5`}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: isDemoMode ? "#f59e0b" : "#10b981" }} />
                <span>{isDemoMode ? "Demo Mode" : "Direct API Active"}</span>
              </span>
            </div>
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${currentTheme.gradientFromTo} p-[1px]`}>
              <div className="w-full h-full bg-[#121215] rounded-[11px] flex items-center justify-center font-bold text-[10px] sm:text-xs text-white">
                AD
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-hidden relative bg-transparent pb-16 md:pb-0">
          {renderView()}
        </div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0b0b0d]/95 backdrop-blur-md border-t border-[#1e1e24] flex items-center justify-around px-2 z-50 selection:bg-transparent">
        {[
          { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: "inventory", label: "Inventory", icon: <Package className="w-5 h-5" /> },
          { id: "chat", label: "AI Chat", icon: <BotMessageSquare className="w-5 h-5" /> },
          { id: "marketing", label: "Marketing", icon: <Megaphone className="w-5 h-5" /> },
          { id: "settings", label: "Settings", icon: <SettingsIcon className="w-5 h-5" /> },
        ].map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as ViewType)}
              className="flex flex-col items-center justify-center flex-1 py-1 text-center transition-all duration-200 cursor-pointer"
            >
              <div className={`p-1.5 rounded-lg transition-all duration-200 ${isActive ? `${currentTheme.bgAccentTen} ${currentTheme.accentText}` : "text-slate-500 hover:text-slate-300"}`}>
                {item.icon}
              </div>
              <span className={`text-[9px] font-bold mt-0.5 tracking-tight ${isActive ? currentTheme.accentText : "text-slate-600"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

}
