export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  primaryText: string;
  accentText: string;
  accentHoverText: string;
  bgAccentTen: string;
  borderAccentTwenty: string;
  borderAccentTwentyFive: string;
  borderAccentFifty: string;
  ringAccentTwenty: string;
  gradientFromTo: string;
  gradientHoverFromTo: string;
  glowColor: string;
  glowColorSecondary: string;
  glowColorTertiary: string;
  dashboardGlow: string;
  dashboardValGlow: string;
  dashboardValGrad: string;
  chipActive: string;
  primaryColorHex: string;
  buttonStyles: string;
}

export const THEMES: Record<string, ThemeConfig> = {
  gold: {
    id: "gold",
    name: "Luxury Amber",
    description: "Elegant amber and gold accents with premium metallic undertones",
    primaryText: "text-amber-500",
    accentText: "text-amber-400",
    accentHoverText: "hover:text-amber-400",
    bgAccentTen: "bg-amber-500/10",
    borderAccentTwenty: "border-amber-500/20",
    borderAccentTwentyFive: "border-amber-500/25",
    borderAccentFifty: "border-amber-500/50",
    ringAccentTwenty: "focus:ring-amber-500/20",
    gradientFromTo: "from-amber-400 to-amber-600",
    gradientHoverFromTo: "hover:from-amber-300 hover:to-amber-500",
    glowColor: "bg-amber-500/10",
    glowColorSecondary: "bg-amber-600/5",
    glowColorTertiary: "bg-yellow-600/5",
    dashboardGlow: "hover:shadow-[0_4px_30px_rgba(245,158,11,0.02)]",
    dashboardValGlow: "shadow-[0_0_40px_rgba(245,158,11,0.03)]",
    dashboardValGrad: "from-amber-500/15 via-amber-600/5 to-[#121215]",
    chipActive: "bg-amber-500/10 border-amber-500/25 text-white",
    primaryColorHex: "#f59e0b",
    buttonStyles: "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black",
  },
  cyber: {
    id: "cyber",
    name: "Cyber Neon",
    description: "Vibrant hot pink and neon cyan tones for a high-tech retro aesthetic",
    primaryText: "text-rose-500",
    accentText: "text-rose-400",
    accentHoverText: "hover:text-rose-400",
    bgAccentTen: "bg-rose-500/10",
    borderAccentTwenty: "border-rose-500/20",
    borderAccentTwentyFive: "border-rose-500/25",
    borderAccentFifty: "border-rose-500/50",
    ringAccentTwenty: "focus:ring-rose-500/20",
    gradientFromTo: "from-rose-400 to-fuchsia-600",
    gradientHoverFromTo: "hover:from-rose-300 hover:to-fuchsia-500",
    glowColor: "bg-rose-500/10",
    glowColorSecondary: "bg-fuchsia-600/5",
    glowColorTertiary: "bg-cyan-600/5",
    dashboardGlow: "hover:shadow-[0_4px_30px_rgba(244,63,94,0.02)]",
    dashboardValGlow: "shadow-[0_0_40px_rgba(244,63,94,0.03)]",
    dashboardValGrad: "from-rose-500/15 via-fuchsia-600/5 to-[#121215]",
    chipActive: "bg-rose-500/10 border-rose-500/25 text-white",
    primaryColorHex: "#f43f5e",
    buttonStyles: "bg-gradient-to-r from-rose-400 to-fuchsia-500 hover:from-rose-300 hover:to-fuchsia-400 text-white",
  },
  emerald: {
    id: "emerald",
    name: "Emerald Forest",
    description: "Sleek and professional deep green palettes built for developers",
    primaryText: "text-emerald-500",
    accentText: "text-emerald-400",
    accentHoverText: "hover:text-emerald-400",
    bgAccentTen: "bg-emerald-500/10",
    borderAccentTwenty: "border-emerald-500/20",
    borderAccentTwentyFive: "border-emerald-500/25",
    borderAccentFifty: "border-emerald-500/50",
    ringAccentTwenty: "focus:ring-emerald-500/20",
    gradientFromTo: "from-emerald-400 to-teal-600",
    gradientHoverFromTo: "hover:from-emerald-300 hover:to-teal-500",
    glowColor: "bg-emerald-500/10",
    glowColorSecondary: "bg-teal-600/5",
    glowColorTertiary: "bg-green-600/5",
    dashboardGlow: "hover:shadow-[0_4px_30px_rgba(16,185,129,0.02)]",
    dashboardValGlow: "shadow-[0_0_40px_rgba(16,185,129,0.03)]",
    dashboardValGrad: "from-emerald-500/15 via-teal-600/5 to-[#121215]",
    chipActive: "bg-emerald-500/10 border-emerald-500/25 text-white",
    primaryColorHex: "#10b981",
    buttonStyles: "bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-black",
  },
  ocean: {
    id: "ocean",
    name: "Oceanic Indigo",
    description: "Calming deep blues and high-contrast sapphire gradients",
    primaryText: "text-blue-500",
    accentText: "text-blue-400",
    accentHoverText: "hover:text-blue-400",
    bgAccentTen: "bg-blue-500/10",
    borderAccentTwenty: "border-blue-500/20",
    borderAccentTwentyFive: "border-blue-500/25",
    borderAccentFifty: "border-blue-500/50",
    ringAccentTwenty: "focus:ring-blue-500/20",
    gradientFromTo: "from-blue-400 to-indigo-600",
    gradientHoverFromTo: "hover:from-blue-300 hover:to-indigo-500",
    glowColor: "bg-blue-500/10",
    glowColorSecondary: "bg-indigo-600/5",
    glowColorTertiary: "bg-sky-600/5",
    dashboardGlow: "hover:shadow-[0_4px_30px_rgba(59,130,246,0.02)]",
    dashboardValGlow: "shadow-[0_0_40px_rgba(59,130,246,0.03)]",
    dashboardValGrad: "from-blue-500/15 via-indigo-600/5 to-[#121215]",
    chipActive: "bg-blue-500/10 border-blue-500/25 text-white",
    primaryColorHex: "#3b82f6",
    buttonStyles: "bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-300 hover:to-indigo-400 text-white",
  }
};
