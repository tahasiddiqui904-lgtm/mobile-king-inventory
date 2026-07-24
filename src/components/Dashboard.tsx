import React, { useMemo } from "react";
import { Product } from "../types";
import { 
   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { Package, AlertTriangle, TrendingUp, Sparkles, IndianRupee } from "lucide-react";
import { ThemeConfig } from "../theme";

interface DashboardProps {
  inventory: Product[];
  currentTheme: ThemeConfig;
}

export function Dashboard({ inventory, currentTheme }: DashboardProps) {
  const metrics = useMemo(() => {
    const totalItems = inventory.reduce((acc, p) => acc + p.stock, 0);
    const lowStockItems = inventory.filter((p) => p.stock < 15).length;
    const totalValue = inventory.reduce((acc, p) => acc + p.stock * p.price, 0);

    const categories: Record<string, number> = {};
    inventory.forEach((p) => {
      categories[p.category] = (categories[p.category] || 0) + p.stock;
    });

    const chartData = Object.keys(categories).map((cat) => ({
      name: cat,
      stock: categories[cat],
    }));

    return { totalItems, lowStockItems, totalValue, chartData };
  }, [inventory]);

  const COLORS = [
    currentTheme.primaryColorHex,
    `${currentTheme.primaryColorHex}cc`,
    `${currentTheme.primaryColorHex}99`,
    `${currentTheme.primaryColorHex}66`
  ];

  return (
    <div className="flex-1 p-3 md:p-8 overflow-y-auto bg-transparent selection:bg-amber-500/20 text-slate-200">

      {/* TOP STAT CARDS — 2-col on mobile, 4-col on lg */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-3 md:mb-5">

        {/* Card 1: Total Items */}
        <div className={`bg-[#121215] border border-[#212126] rounded-2xl p-3 md:p-5 flex flex-col justify-between ${currentTheme.dashboardGlow} transition-all duration-300 group`}>
          <div className="flex justify-between items-start">
            <div className="min-w-0">
              <p className="text-slate-400 text-[9px] md:text-xs font-semibold uppercase tracking-widest mb-1">In Stock</p>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white font-sans mt-1 tracking-tight">{metrics.totalItems}</h2>
            </div>
            <div className="w-7 h-7 md:w-10 md:h-10 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0 ml-1">
              <Package className="w-3.5 h-3.5 md:w-5 md:h-5" />
            </div>
          </div>
          <div className="text-[9px] md:text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-2 md:mt-4">
            <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3 flex-shrink-0" />
            <span className="truncate">+12.4% vs last quarter</span>
          </div>
        </div>

        {/* Card 2: Low Stock Alerts */}
        <div className="bg-[#121215] border border-[#212126] rounded-2xl p-3 md:p-5 flex flex-col justify-between hover:border-red-500/15 transition-all duration-300 group">
          <div className="flex justify-between items-start">
            <div className="min-w-0">
              <p className="text-slate-400 text-[9px] md:text-xs font-semibold uppercase tracking-widest mb-1">Low Stock</p>
              <h2 className={`text-2xl md:text-4xl font-extrabold font-sans mt-1 tracking-tight ${metrics.lowStockItems > 0 ? 'text-red-400' : 'text-slate-300'}`}>
                {metrics.lowStockItems}
              </h2>
            </div>
            <div className={`w-7 h-7 md:w-10 md:h-10 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center flex-shrink-0 ml-1 ${metrics.lowStockItems > 0 ? 'text-red-400 bg-red-500/5' : 'text-slate-400'}`}>
              <AlertTriangle className="w-3.5 h-3.5 md:w-5 md:h-5" />
            </div>
          </div>
          <div className="mt-2 md:mt-4">
            <span className={`px-2 py-0.5 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${metrics.lowStockItems > 0 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-slate-800 text-slate-400'}`}>
              {metrics.lowStockItems > 0 ? 'Action Required' : 'Optimal'}
            </span>
          </div>
        </div>

        {/* Card 3: Total Valuation — full width row on mobile */}
        <div className={`col-span-2 lg:col-span-2 bg-gradient-to-br ${currentTheme.dashboardValGrad} border ${currentTheme.borderAccentTwenty} rounded-2xl p-3 md:p-5 flex flex-col justify-between relative overflow-hidden group transition-all duration-300 ${currentTheme.dashboardValGlow}`}>
          <div className="absolute right-[-10%] top-[-10%] w-32 h-32 md:w-48 md:h-48 rounded-full bg-slate-500/5 blur-[50px] pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <div className="min-w-0 flex-1 mr-2">
              <p className="text-slate-300 text-[9px] md:text-xs font-bold uppercase tracking-widest mb-1">Total Valuation</p>
              <h2 className="text-xl md:text-4xl font-extrabold text-white font-sans mt-1 tracking-tight flex items-baseline gap-1 flex-wrap">
                <span className={`${currentTheme.accentText} font-mono text-base md:text-3xl`}>₹</span>
                <span>{metrics.totalValue.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
              </h2>
            </div>
            <div className={`w-8 h-8 md:w-12 md:h-12 rounded-xl bg-[#070708] border ${currentTheme.borderAccentTwenty} flex items-center justify-center ${currentTheme.accentText} shadow-md flex-shrink-0`}>
              <IndianRupee className="w-4 h-4 md:w-6 md:h-6" />
            </div>
          </div>
          <div className={`hidden md:flex items-center gap-1.5 text-[11px] ${currentTheme.accentText} font-medium mt-4 relative z-10 ${currentTheme.bgAccentTen} border ${currentTheme.borderAccentTwenty} px-2.5 py-1 rounded-xl w-fit`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>Calculated across active stock inventory</span>
          </div>
        </div>
      </div>

      {/* BOTTOM CHARTS/TABLE — stacked on mobile, side-by-side on lg */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-5">

        {/* Card 4: Category chart */}
        <div className={`bg-[#121215] border border-[#212126] rounded-2xl p-3 md:p-5 flex flex-col ${currentTheme.dashboardGlow} transition-all duration-300`}>
          <div className="flex items-center justify-between mb-3 md:mb-5">
            <div>
              <h3 className="font-extrabold text-white text-sm md:text-base tracking-tight">Stock Distribution</h3>
              <p className="text-slate-500 text-[10px] md:text-xs hidden sm:block">Visual breakdown of units per category</p>
            </div>
            <div className="flex gap-2">
              <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full animate-pulse" style={{ backgroundColor: currentTheme.primaryColorHex }} />
              <span className="w-2 h-2 md:w-2.5 md:h-2.5 bg-slate-700 rounded-full" />
            </div>
          </div>
          <div className="min-h-[160px] md:min-h-[220px]">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={metrics.chartData} margin={{ top: 5, right: 0, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1d1d23" vertical={false} />
                <XAxis dataKey="name" stroke="#52525b" tick={{ fill: '#71717a', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#52525b" tick={{ fill: '#71717a', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#121215', borderColor: '#212126', borderRadius: '12px', color: '#f8fafc' }}
                  itemStyle={{ color: currentTheme.primaryColorHex }}
                  cursor={{ fill: '#18181c' }}
                />
                <Bar dataKey="stock" radius={[6, 6, 0, 0]} maxBarSize={40}>
                  {metrics.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 5: Recent Table */}
        <div className={`bg-[#121215] border border-[#212126] rounded-2xl overflow-hidden flex flex-col ${currentTheme.dashboardGlow} transition-all duration-300`}>
          <div className="p-3 md:p-5 border-b border-[#1e1e24] flex justify-between items-center bg-[#16161a]/30">
            <div>
              <h3 className="font-extrabold text-white text-sm md:text-base tracking-tight">Catalog Overview</h3>
              <p className="text-slate-500 text-[10px] md:text-xs hidden sm:block">Quick look at real-time catalog items</p>
            </div>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-[#16161a]/50 text-slate-400 border-b border-[#1e1e24]">
                <tr>
                  <th className="px-3 md:px-5 py-2 md:py-4 font-semibold text-[9px] md:text-xs uppercase tracking-widest text-slate-500">Item</th>
                  <th className="px-3 md:px-5 py-2 md:py-4 font-semibold text-[9px] md:text-xs uppercase tracking-widest text-slate-500">Stock</th>
                  <th className="px-3 md:px-5 py-2 md:py-4 font-semibold text-[9px] md:text-xs uppercase tracking-widest text-slate-500 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24] text-white">
                {inventory.slice(0, 5).map(item => (
                  <tr key={item.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-3 md:px-5 py-2 md:py-3.5 text-[11px] md:text-sm font-medium text-slate-200 max-w-[100px] truncate">{item.name}</td>
                    <td className="px-3 md:px-5 py-2 md:py-3.5">
                      <span className={`px-1.5 py-0.5 rounded-lg text-[9px] md:text-xs font-semibold ${item.stock < 15 ? 'text-amber-500 bg-amber-500/5 border border-amber-500/10' : 'text-slate-400'}`}>
                        {item.stock}
                      </span>
                    </td>
                    <td className="px-3 md:px-5 py-2 md:py-3.5 text-right text-[11px] md:text-sm font-semibold font-mono" style={{ color: currentTheme.primaryColorHex }}>₹{item.price.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
