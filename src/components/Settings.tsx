import React, { useState } from "react";
import { ThemeConfig, THEMES } from "../theme";
import { Palette, Play, Eye, Sliders, Check, Sparkles, Database } from "lucide-react";

interface SettingsProps {
  currentTheme: ThemeConfig;
  setTheme: (themeId: string) => void;
  animationSpeed: "fast" | "normal" | "slow" | "off";
  setAnimationSpeed: (speed: "fast" | "normal" | "slow" | "off") => void;
  onClearCache: () => void;
}

export function Settings({
  currentTheme,
  setTheme,
  animationSpeed,
  setAnimationSpeed,
  onClearCache,
}: SettingsProps) {
  const [saveFeedback, setSaveFeedback] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [previewTriggered, setPreviewTriggered] = useState(false);

  const [customApiKey, setCustomApiKeyVal] = useState(() => {
    return localStorage.getItem("mobileking_gemini_api_key") || "";
  });
  const [forceMock, setForceMock] = useState(() => {
    return localStorage.getItem("mobileking_force_mock") === "true";
  });

  const handleCustomApiKeyChange = (val: string) => {
    setCustomApiKeyVal(val);
    if (val.trim()) {
      localStorage.setItem("mobileking_gemini_api_key", val.trim());
    } else {
      localStorage.removeItem("mobileking_gemini_api_key");
    }
    triggerFeedback();
    window.dispatchEvent(new Event("storage"));
  };

  const handleClearCustomApiKey = () => {
    setCustomApiKeyVal("");
    localStorage.removeItem("mobileking_gemini_api_key");
    triggerFeedback();
    window.dispatchEvent(new Event("storage"));
  };

  const handleForceMockToggle = () => {
    const newVal = !forceMock;
    setForceMock(newVal);
    localStorage.setItem("mobileking_force_mock", newVal ? "true" : "false");
    triggerFeedback();
    window.dispatchEvent(new Event("storage"));
  };

  const isCurrentMock = forceMock || !customApiKey.trim();

  // Read diagnostics info live from localStorage safely
  const [cacheDiagnostics, setCacheDiagnostics] = useState(() => {
    try {
      const savedInv = localStorage.getItem("mobileking_inventory");
      const count = savedInv ? JSON.parse(savedInv).length : 0;
      const size = savedInv ? (savedInv.length / 1024).toFixed(2) : "0.00";
      return { count, size };
    } catch (e) {
      return { count: 0, size: "0.00" };
    }
  });

  const triggerFeedback = () => {
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2500);
  };

  const handleThemeChange = (id: string) => {
    setTheme(id);
    triggerFeedback();
  };

  const handleSpeedChange = (speed: "fast" | "normal" | "slow" | "off") => {
    setAnimationSpeed(speed);
    triggerFeedback();
  };

  const handlePreviewTrigger = () => {
    setPreviewTriggered(true);
    setTimeout(() => setPreviewTriggered(false), 2500);
  };

  return (
    <div className="p-4 sm:p-8 pb-16 h-full bg-transparent selection:bg-amber-500/20 text-slate-200 overflow-y-auto">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight uppercase">Workspace Settings</h2>
          <p className="text-slate-400 text-sm mt-1">
            Personalize your store cockpit layout, theme coordinates, and physical environment.
          </p>
        </div>
        {saveFeedback && (
          <div 
            className="bg-[#121215] border text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 animate-fade-in shadow-lg w-full sm:w-auto justify-center"
            style={{ borderColor: currentTheme.primaryColorHex }}
          >
            <Check className="w-4 h-4" style={{ color: currentTheme.primaryColorHex }} />
            <span>Preferences Saved Globally</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl">
        {/* Left Col: Themes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#121215] border border-[#212126] p-6 rounded-2xl relative overflow-hidden group shadow-xl">
            <div className="absolute right-[-10%] top-[-10%] w-32 h-32 rounded-full bg-amber-500/5 blur-[40px] pointer-events-none" />
            <h3 className="text-base font-bold text-white mb-4 tracking-wide uppercase flex items-center gap-2">
              <Palette className={`w-5 h-5 ${currentTheme.accentText}`} />
              <span>Workspace Theme Palette</span>
            </h3>
            <p className="text-slate-400 text-xs mb-6">
              Pick a style to update all interactive buttons, text highlights, graphics, and background canvas glows immediately.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.values(THEMES).map((theme) => {
                const isSelected = theme.id === currentTheme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={`p-5 rounded-xl text-left border cursor-pointer transition-all duration-300 relative overflow-hidden ${
                      isSelected
                        ? `${theme.borderAccentFifty} bg-slate-900/40 shadow-[0_0_20px_rgba(${theme.primaryColorHex === "#f59e0b" ? "245,158,11" : theme.primaryColorHex === "#f43f5e" ? "244,63,94" : theme.primaryColorHex === "#10b981" ? "16,185,129" : "59,130,246"},0.05)]`
                        : "border-[#212126] bg-[#18181d] hover:bg-slate-900/60 hover:border-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-4.5 h-4.5 rounded-full border border-white/10"
                          style={{ backgroundColor: theme.primaryColorHex }}
                        />
                        <span className="font-bold text-sm text-white tracking-tight">{theme.name}</span>
                      </div>
                      {isSelected && (
                        <div className={`w-5 h-5 rounded-md ${theme.bgAccentTen} border ${theme.borderAccentTwentyFive} flex items-center justify-center text-white`}>
                          <Check className={`w-3 h-3 ${theme.accentText}`} />
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed pr-2">
                      {theme.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-[#121215] border border-[#212126] p-6 rounded-2xl relative overflow-hidden group shadow-xl">
            <h3 className="text-base font-bold text-white mb-4 tracking-wide uppercase flex items-center gap-2">
              <Play className={`w-5 h-5 ${currentTheme.accentText}`} />
              <span>Background Physics & Motion</span>
            </h3>
            <p className="text-slate-400 text-xs mb-6">
              Configure the floating rate of the ambient cosmic gas clouds behind your dashboard. Slow down or pause physics to maximize performance.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(["fast", "normal", "slow", "off"] as const).map((speed) => {
                const isActive = animationSpeed === speed;
                return (
                  <button
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    className={`py-3.5 px-3 rounded-xl text-[11px] font-bold uppercase tracking-wider text-center cursor-pointer transition-all border ${
                      isActive
                        ? `${currentTheme.borderAccentFifty} ${currentTheme.bgAccentTen} ${currentTheme.accentText} shadow-md`
                        : "border-[#212126] bg-[#18181d] text-slate-400 hover:text-slate-100 hover:border-slate-800"
                    }`}
                  >
                    {speed === "fast" && "Hyper Flow"}
                    {speed === "normal" && "Standard"}
                    {speed === "slow" && "Zen Drift"}
                    {speed === "off" && "Static"}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Metadata & Info */}
        <div className="space-y-6">
          <div className="bg-[#121215] border border-[#212126] p-6 rounded-2xl relative overflow-hidden group shadow-xl">
            <h3 className="text-base font-bold text-white mb-4 tracking-wide uppercase flex items-center gap-2">
              <Sparkles className={`w-5 h-5 ${currentTheme.accentText}`} />
              <span>AI Connectivity Credentials</span>
            </h3>
            <p className="text-slate-400 text-xs mb-5 leading-relaxed">
              Mobile King runs as a client-side offline-first demo. Optionally save your personal Gemini API Key here to run live AI operations directly in your browser.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Personal Gemini API Key</label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder={customApiKey ? "••••••••••••••••••••" : "AIzaSy..."}
                    value={customApiKey}
                    onChange={(e) => handleCustomApiKeyChange(e.target.value)}
                    className="flex-1 bg-[#18181d] border border-[#212126] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/40 font-mono"
                  />
                  {customApiKey && (
                    <button
                      onClick={handleClearCustomApiKey}
                      className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-950/30 p-3 rounded-xl border border-[#212126]">
                <div>
                  <h4 className="text-xs font-bold text-white">Force Demo Fallback</h4>
                  <p className="text-[9px] text-slate-500 mt-0.5">Bypasses networks entirely.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={forceMock} 
                    onChange={handleForceMockToggle}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500" />
                </label>
              </div>

              <div className="p-3 bg-slate-950/20 border border-[#212126] rounded-xl text-[10px] text-slate-400 leading-normal flex items-center gap-2 font-mono">
                <span className={`w-2 h-2 rounded-full ${isCurrentMock ? "bg-amber-500 animate-pulse" : "bg-emerald-500 animate-pulse"}`} />
                <span>
                  Mode: <strong className={isCurrentMock ? "text-amber-500 uppercase" : "text-emerald-400 uppercase"}>{isCurrentMock ? "Demo Fallback Active" : "Direct API Active"}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#121215] border border-[#212126] p-6 rounded-2xl relative overflow-hidden group shadow-xl">
            <h3 className="text-base font-bold text-white mb-4 tracking-wide uppercase flex items-center gap-2">
              <Eye className={`w-5 h-5 ${currentTheme.accentText}`} />
              <span>Cockpit Preview</span>
            </h3>
            
            <div className="rounded-xl border border-[#212126] p-4 bg-slate-950/40 text-center relative overflow-hidden">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-3">Live Themed Mockup</div>
              <div className="p-4 bg-[#121215] rounded-xl border border-[#212126] hover:border-current transition-all inline-block w-full text-left">
                <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${currentTheme.bgAccentTen} ${currentTheme.accentText} border ${currentTheme.borderAccentTwentyFive}`}>
                  Status: {animationSpeed === "off" ? "Static" : animationSpeed === "slow" ? "Zen Drift" : animationSpeed === "normal" ? "Optimal Speed" : "Hyper Drive"}
                </span>
                <h4 className="text-xs font-bold text-white mt-2.5 mb-1">Interactive Card Preset</h4>
                <p className="text-[10px] text-slate-400 mb-4">Demonstrating responsive highlights and styling bounds.</p>
                <button 
                  onClick={handlePreviewTrigger}
                  className={`w-full py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-center cursor-pointer transition-all ${currentTheme.buttonStyles}`}
                >
                  Action Trigger
                </button>
              </div>

              {previewTriggered && (
                <div 
                  className="mt-3 p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] rounded-lg text-center animate-fade-in font-bold uppercase tracking-wider flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Telemetry Verified & Loaded!</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#121215] border border-[#212126] p-6 rounded-2xl relative overflow-hidden group shadow-xl">
            <h3 className="text-base font-bold text-white mb-4 tracking-wide uppercase flex items-center gap-2">
              <Database className="w-5 h-5 text-red-400" />
              <span>Storage & Diagnostics</span>
            </h3>
            <p className="text-slate-400 text-xs mb-5 leading-relaxed">
              Resets all custom configurations, theme selections, and product stock adjustments back to factory defaults.
            </p>

            <div className="space-y-3 mb-5 text-[11px] text-slate-400 bg-slate-950/30 p-3 rounded-xl border border-[#212126] font-mono">
              <div className="flex justify-between">
                <span>Cached Catalog Items:</span>
                <span className="text-white font-bold">{cacheDiagnostics.count || 0} items</span>
              </div>
              <div className="flex justify-between">
                <span>Calculated Cache Size:</span>
                <span className="text-white font-bold">{cacheDiagnostics.size || "0.00"} KB</span>
              </div>
              <div className="flex justify-between">
                <span>Client Integrity:</span>
                <span className="text-emerald-400 font-bold uppercase tracking-wider">Pass</span>
              </div>
            </div>

            {!showConfirmReset ? (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
              >
                Flush Cache & Reload Defaults
              </button>
            ) : (
              <div className="bg-red-950/20 border border-red-500/30 p-4 rounded-xl animate-fade-in">
                <p className="text-[10px] text-red-200 mb-3 font-semibold text-left">
                  Are you absolutely sure? This will wipe your custom products, theme, and animations from your browser storage.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onClearCache();
                      setShowConfirmReset(false);
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded-lg text-[10px] uppercase tracking-wider cursor-pointer"
                  >
                    Yes, Reset
                  </button>
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="flex-1 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 py-2 rounded-lg text-[10px] uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
