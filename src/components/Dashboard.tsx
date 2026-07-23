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

    // Group for chart
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
    <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-3 gap-6 h-full overflow-y-auto bg-transparent selection:bg-amber-500/20 text-slate-200">
      
      {/* Bento Item 1: Total Items */}
      <div className={`col-span-1 bg-[#121215] border border-[#212126] rounded-2xl p-6 flex flex-col justify-between ${currentTheme.dashboardGlow} transition-all duration-300 group`}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">Total Items in Stock</p>
            <h2 className="text-4xl font-extrabold text-white font-sans mt-2 tracking-tight">{metrics.totalItems}</h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
            <Package className="w-5 h-5" />
          </div>
        </div>
        <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-4">
          <TrendingUp className="w-3 h-3" />
          <span>+12.4% vs last quarter</span>
        </div>
      </div>

      {/* Bento Item 2: Low Stock Alerts */}
      <div className="col-span-1 bg-[#121215] border border-[#212126] rounded-2xl p-6 flex flex-col justify-between hover:border-red-500/15 hover:shadow-[0_4px_30px_rgba(239,68,68,0.02)] transition-all duration-300 group">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">Low Stock Alerts</p>
            <h2 className={`text-4xl font-extrabold font-sans mt-2 tracking-tight ${metrics.lowStockItems > 0 ? 'text-red-400' : 'text-slate-300'}`}>
              {metrics.lowStockItems}
            </h2>
          </div>
          <div className={`w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center transition-colors ${metrics.lowStockItems > 0 ? 'text-red-400 bg-red-500/5' : 'text-slate-400'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${metrics.lowStockItems > 0 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-slate-800 text-slate-400'}`}>
            {metrics.lowStockItems > 0 ? 'Action Required' : 'Optimal Levels'}
          </span>
        </div>
      </div>

      {/* Bento Item 3: Total Value (Dynamic Theme) */}
      <div className={`col-span-1 lg:col-span-2 bg-gradient-to-br ${currentTheme.dashboardValGrad} border ${currentTheme.borderAccentTwenty} rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group hover:border-opacity-80 transition-all duration-300 ${currentTheme.dashboardValGlow}`}>
        {/* Subtle decorative glow */}
        <div className="absolute right-[-10%] top-[-10%] w-48 h-48 rounded-full bg-slate-500/5 blur-[50px] pointer-events-none" />
        
        <div className="flex justify-between items-start relative z-10">
          <div>
            <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-1">Total Valuation</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white font-sans mt-2 tracking-tight flex items-center">
              <span className={`${currentTheme.accentText} mr-1.5 font-mono`}>₹</span>
              {metrics.totalValue.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </h2>
          </div>
          <div className={`w-12 h-12 rounded-xl bg-[#070708] border ${currentTheme.borderAccentTwenty} flex items-center justify-center ${currentTheme.accentText} shadow-md`}>
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>
        <div className={`flex items-center gap-1.5 text-[11px] ${currentTheme.accentText} font-medium mt-4 relative z-10 ${currentTheme.bgAccentTen} border ${currentTheme.borderAccentTwenty} px-2.5 py-1 rounded-xl w-fit`}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>Calculated across active stock inventory</span>
        </div>
      </div>

      {/* Bento Item 4: Category chart */}
      <div className={`col-span-1 lg:col-span-2 lg:row-span-2 bg-[#121215] border border-[#212126] rounded-2xl p-6 flex flex-col ${currentTheme.dashboardGlow} transition-all duration-300`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-extrabold text-white text-base tracking-tight">Stock Distribution</h3>
            <p className="text-slate-500 text-xs">Visual breakdown of units per category</p>
          </div>
          <div className="flex gap-2">
            <span className={`w-2.5 h-2.5 rounded-full animate-pulse`} style={{ backgroundColor: currentTheme.primaryColorHex }} />
            <span className="w-2.5 h-2.5 bg-slate-700 rounded-full" />
          </div>
        </div>
        <div className="flex-1 min-h-[220px] overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.chartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1d1d23" vertical={false} />
              <XAxis dataKey="name" stroke="#52525b" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#52525b" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#121215', borderColor: '#212126', borderRadius: '12px', color: '#f8fafc' }}
                itemStyle={{ color: currentTheme.primaryColorHex }}
                cursor={{ fill: '#18181c' }}
              />
              <Bar dataKey="stock" radius={[6, 6, 0, 0]} maxBarSize={45}>
                {metrics.chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bento Item 5: Recent Table */}
      <div className={`col-span-1 lg:col-span-2 lg:row-span-2 bg-[#121215] border border-[#212126] rounded-2xl overflow-hidden flex flex-col ${currentTheme.dashboardGlow} transition-all duration-300`}>
        <div className="p-6 border-b border-[#1e1e24] flex justify-between items-center bg-[#16161a]/30">
          <div>
            <h3 className="font-extrabold text-white text-base tracking-tight">Active Catalog Overview</h3>
            <p className="text-slate-500 text-xs">Quick look at real-time catalog items</p>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-[#16161a]/50 text-slate-400 border-b border-[#1e1e24]">
              <tr>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-widest text-slate-500">Item</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-widest text-slate-500">Stock</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-widest text-slate-500 text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24] text-white">
              {inventory.slice(0, 5).map(item => (
                <tr key={item.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-200">{item.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${item.stock < 15 ? 'text-amber-500 bg-amber-500/5 border border-amber-500/10' : 'text-slate-400'}`}>
                      {item.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold font-mono text-slate-300" style={{ color: currentTheme.primaryColorHex }}>₹{item.price.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
