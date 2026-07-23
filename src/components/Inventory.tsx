import React, { useState, useRef } from "react";
import { Product } from "../types";
import { Plus, Sparkles, X, Image as ImageIcon, FileText, Edit2, Trash2, Download, Upload, RotateCcw } from "lucide-react";
import { ThemeConfig } from "../theme";
import { generateVisionAnalysis } from "../lib/gemini";

interface InventoryProps {
  inventory: Product[];
  setInventory: React.Dispatch<React.SetStateAction<Product[]>>;
  filteredInventory: Product[];
  currentTheme: ThemeConfig;
}

export function Inventory({ inventory, setInventory, filteredInventory, currentTheme }: InventoryProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<Product | null>(null);
  const [showPamphletModal, setShowPamphletModal] = useState<Product | null>(null);

  // Confirmation Modal States
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  // Add Product State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Cases");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Edit Product State
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("Cases");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportCSV = () => {
    // Construct standard CSV content
    const headers = "ID,Name,Category,Price,Stock\n";
    const rows = inventory.map((p) => {
      const escapedName = p.name.includes(",") ? `"${p.name.replace(/"/g, '""')}"` : p.name;
      return `${p.id},${escapedName},${p.category},${p.price},${p.stock}`;
    }).join("\n");
    
    const csvContent = headers + rows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `mobileking_catalog_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split("\n");
        const parsedProducts: Product[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          // Basic split with CSV formatting
          const parts: string[] = [];
          let current = "";
          let inQuotes = false;
          
          for (let charIndex = 0; charIndex < line.length; charIndex++) {
            const char = line[charIndex];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              parts.push(current);
              current = "";
            } else {
              current += char;
            }
          }
          parts.push(current);

          if (parts.length >= 4) {
            const id = parts[0]?.trim() || `p-${Date.now()}-${i}`;
            const name = parts[1]?.trim() || "Imported Product";
            const category = parts[2]?.trim() || "Other";
            const price = parseFloat(parts[3]?.trim()) || 0;
            const stock = parseInt(parts[4]?.trim()) || 0;
            
            parsedProducts.push({
              id,
              name,
              category,
              price,
              stock
            });
          }
        }
        
        if (parsedProducts.length > 0) {
          setInventory(parsedProducts);
        } else {
          alert("No valid product data found in the CSV. Ensure columns match: ID, Name, Category, Price, Stock.");
        }
      } catch (err) {
        console.error(err);
        alert("An error occurred while importing CSV.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: `p${Date.now()}`,
      name,
      category,
      price: parseFloat(price) || 0,
      stock: parseInt(stock) || 0,
    };
    setInventory([...inventory, newProduct]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditClick = (product: Product) => {
    setShowEditModal(product);
    setEditName(product.name);
    setEditCategory(product.category);
    setEditPrice(product.price.toString());
    setEditStock(product.stock.toString());
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditModal) return;

    setInventory((prev) =>
      prev.map((p) =>
        p.id === showEditModal.id
          ? {
              ...p,
              name: editName,
              category: editCategory,
              price: parseFloat(editPrice) || 0,
              stock: parseInt(editStock) || 0,
            }
          : p
      )
    );
    setShowEditModal(null);
  };

  // We now use custom confirmation modals to prevent blocked alert/confirm prompts in iframes.

  const resetForm = () => {
    setName("");
    setCategory("Cases");
    setPrice("");
    setStock("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      await analyzeImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (base64: string) => {
    setIsAnalyzing(true);
    try {
      const data = await generateVisionAnalysis(base64);
      if (data.name) setName(data.name);
      if (data.category) setCategory(data.category);
      if (data.suggestedPrice) setPrice(data.suggestedPrice.toString());
      if (!stock) setStock("10"); // Default stock
    } catch (error) {
      console.error(error);
      alert("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-8 h-full flex flex-col bg-transparent selection:bg-amber-500/20 text-slate-200">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight uppercase">Inventory Catalog</h2>
          <p className="text-slate-400 text-sm mt-1">Add, modify, track stock, and render golden promotional flyers.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className={`px-5 py-2.5 rounded-xl font-bold flex items-center transition-all cursor-pointer ${currentTheme.buttonStyles} shadow-lg`}
        >
          <Plus className="w-5 h-5 mr-2 stroke-[3]" />
          Add Product
        </button>
      </div>

      <div className="bg-[#121215] border border-[#212126] rounded-2xl overflow-hidden flex-1 flex flex-col shadow-2xl">
        
        {/* Catalog Control Toolbar: Import, Export & Reset */}
        <div className="bg-[#16161a]/60 border-b border-[#212126] px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Catalog Statistics</span>
            <div className={`${currentTheme.bgAccentTen} border ${currentTheme.borderAccentTwenty} ${currentTheme.accentText} text-[10px] font-black uppercase px-2 py-0.5 rounded-md`}>
              {filteredInventory.length} of {inventory.length} items
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Hidden File Input for CSV Import */}
            <input
              type="file"
              id="csv-import-file"
              accept=".csv"
              onChange={handleImportCSV}
              className="hidden"
            />
            <label
              htmlFor="csv-import-file"
              className={`bg-[#18181d] hover:bg-[#212126] border border-[#212126] hover:${currentTheme.borderAccentTwenty} text-slate-300 hover:${currentTheme.accentText} px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md select-none`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import CSV</span>
            </label>
            
            <button
              onClick={handleExportCSV}
              className={`bg-[#18181d] hover:bg-[#212126] border border-[#212126] hover:${currentTheme.borderAccentTwenty} text-slate-300 hover:${currentTheme.accentText} px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md select-none`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV / Excel</span>
            </button>

            <button
              onClick={() => setShowResetModal(true)}
              className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md ml-auto md:ml-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Database</span>
            </button>
          </div>
        </div>

        <div className="overflow-auto flex-1">
          <table className="w-full text-left">
            <thead className="bg-[#16161a] border-b border-[#212126] sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-widest text-slate-400">Product Name</th>
                <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-widest text-slate-400">Category</th>
                <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-widest text-slate-400">Price</th>
                <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-widest text-slate-400">Stock Status</th>
                <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-6 py-4.5 text-sm font-semibold text-white">{item.name}</td>
                  <td className="px-6 py-4.5 text-sm text-slate-400">
                    <span className="bg-[#18181d] px-3 py-1 rounded-lg border border-[#212126] text-xs font-medium text-slate-300">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4.5 text-sm font-bold text-amber-400 font-mono">₹{item.price.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4.5">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                      item.stock < 15 
                        ? "text-amber-500 bg-amber-500/5 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.02)]" 
                        : "text-emerald-400 bg-emerald-400/5 border-emerald-400/20"
                    }`}>
                      {item.stock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4.5 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <button
                        onClick={() => handleEditClick(item)}
                        title="Edit Item"
                        className="p-2 text-slate-400 hover:text-amber-400 hover:bg-[#18181d] rounded-xl transition-all cursor-pointer border border-transparent hover:border-[#212126]"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setProductToDelete(item)}
                        title="Delete Item"
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-[#18181d] rounded-xl transition-all cursor-pointer border border-transparent hover:border-[#212126]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowPamphletModal(item)}
                        className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-amber-500 hover:text-amber-400 bg-amber-500/5 hover:bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/10 transition-all cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 mr-1.5" />
                        Flyer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredInventory.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-slate-500 text-sm">
                    No catalog products found matching your search parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#121215] border border-amber-500/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="text-lg font-bold text-white uppercase tracking-tight">Add New Catalog Item</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white cursor-pointer p-1 rounded-lg hover:bg-white/5 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* AI Vision upload styled in high-end gold accent */}
            <div className="mb-6 p-4 bg-[#18181d] border border-amber-500/20 rounded-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex flex-col items-center justify-center text-center relative z-10">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mb-2 border border-amber-500/20">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">AI Smart Auto-fill</h4>
                <p className="text-[11px] text-slate-400 mb-4 max-w-xs">Scan or upload an accessory image. Gemini will extract name, category & price instantly.</p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isAnalyzing}
                  className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black px-4 py-2 rounded-xl text-xs font-bold flex items-center transition-all cursor-pointer"
                >
                  {isAnalyzing ? (
                    <span className="animate-pulse">Analyzing Asset...</span>
                  ) : (
                    <>
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Upload Product Photo
                    </>
                  )}
                </button>
              </div>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 relative z-10">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. OnePlus 12 Tempered Glass"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#18181d] border border-[#212126] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all placeholder-slate-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Category</label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#18181d] border border-[#212126] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all appearance-none cursor-pointer"
                    >
                      <option value="Cases">Cases</option>
                      <option value="Audio">Audio</option>
                      <option value="Cables & Power">Cables & Power</option>
                      <option value="Screen Protectors">Screen Protectors</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="299"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-[#18181d] border border-[#212126] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all placeholder-slate-600 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Initial Stock Quantity</label>
                <input
                  type="number"
                  required
                  placeholder="50"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full bg-[#18181d] border border-[#212126] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all placeholder-slate-600 font-mono"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-[#18181d] hover:bg-slate-800 text-slate-300 border border-[#212126] font-semibold py-2.5 rounded-xl transition-all cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold py-2.5 rounded-xl transition-all cursor-pointer text-sm"
                >
                  Create Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#121215] border border-amber-500/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white uppercase tracking-tight">Edit Catalog Item</h3>
              <button onClick={() => setShowEditModal(null)} className="text-slate-400 hover:text-white cursor-pointer p-1 rounded-lg hover:bg-white/5 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#18181d] border border-[#212126] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full bg-[#18181d] border border-[#212126] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="Cases">Cases</option>
                    <option value="Audio">Audio</option>
                    <option value="Cables & Power">Cables & Power</option>
                    <option value="Screen Protectors">Screen Protectors</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full bg-[#18181d] border border-[#212126] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Stock Quantity</label>
                <input
                  type="number"
                  required
                  value={editStock}
                  onChange={(e) => setEditStock(e.target.value)}
                  className="w-full bg-[#18181d] border border-[#212126] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all font-mono"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(null)}
                  className="flex-1 bg-[#18181d] hover:bg-slate-800 text-slate-300 border border-[#212126] font-semibold py-2.5 rounded-xl transition-all cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold py-2.5 rounded-xl transition-all cursor-pointer text-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pamphlet Flyer Modal - Redesigned as an gorgeous, golden-glowing, ultra-premium poster flyer */}
      {showPamphletModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="relative bg-[#0b0b0d] rounded-3xl overflow-hidden w-full max-w-md shadow-[0_0_50px_rgba(245,158,11,0.2)] border border-amber-500/30 transform transition-all scale-100 p-6 flex flex-col">
            
            {/* Golden Ribbon Badge */}
            <div className="absolute top-0 right-0 bg-amber-500 text-black font-black uppercase text-[9px] tracking-widest px-4 py-1.5 rounded-bl-xl font-sans">
              Special Launch
            </div>

            {/* Flyer Design Layout with print isolation ID */}
            <div id="printable-flyer" className="rounded-2xl border border-amber-500/20 p-6 bg-gradient-to-b from-[#16161c] to-[#0e0e11] text-center relative overflow-hidden flex-1 print-no-shadow">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent pointer-events-none" />
              
              <div className="text-[10px] text-amber-500 font-extrabold tracking-widest uppercase mb-2">Mobile King Elite Products</div>
              <h2 className="text-3xl font-extrabold text-white leading-tight font-sans mb-3 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300">
                {showPamphletModal.name}
              </h2>
              
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto my-4" />

              <div className="text-slate-400 text-xs tracking-wider uppercase mb-6 font-medium">
                Premium Accessories Suite
              </div>

              {/* Price Tag Circle */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 p-[2px] mx-auto mb-6 shadow-[0_0_30px_rgba(245,158,11,0.15)] flex items-center justify-center">
                <div className="w-full h-full bg-[#0b0b0d] rounded-full flex flex-col items-center justify-center">
                  <span className="text-[10px] text-amber-500 uppercase font-bold tracking-widest">Only</span>
                  <span className="text-2xl font-black text-white font-mono mt-0.5">₹{showPamphletModal.price.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <p className="text-slate-400 text-xs leading-relaxed max-w-xs mx-auto mb-6">
                Engineered with high-grade materials for outstanding durability, seamless fit, and premium hand-feel. Fully optimized for Indian tech enthusiasts.
              </p>

              <div className="bg-[#121215] border border-[#212126] p-3 rounded-xl mb-6">
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Authorized Outlet Store</p>
                <p className="text-white text-xs font-bold mt-0.5 uppercase tracking-wider">Mobile King Accessories India</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setShowPamphletModal(null)}
                  className="bg-[#18181d] hover:bg-[#212126] text-slate-300 border border-[#212126] font-bold py-3.5 rounded-xl transition-all cursor-pointer text-xs uppercase tracking-wider"
                >
                  Close
                </button>
                <button 
                  onClick={() => window.print()}
                  className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold py-3.5 rounded-xl transition-all shadow-md text-xs uppercase tracking-wider cursor-pointer"
                >
                  Print Flyer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="relative bg-[#0b0b0d] rounded-2xl overflow-hidden w-full max-w-md shadow-[0_0_50px_rgba(239,68,68,0.15)] border border-red-500/20 p-6 flex flex-col">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20 text-red-500">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-tight">Delete Product?</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Are you sure you want to permanently delete <span className="text-white font-semibold">"{productToDelete.name}"</span> from your catalog?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setProductToDelete(null)}
                  className="flex-1 bg-[#18181d] hover:bg-slate-800 text-slate-300 border border-[#212126] font-semibold py-2.5 rounded-xl transition-all cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setInventory((prev) => prev.filter((p) => p.id !== productToDelete.id));
                    setProductToDelete(null);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-xl transition-all cursor-pointer text-sm shadow-lg shadow-red-600/20"
                >
                  Delete Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Database Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="relative bg-[#0b0b0d] rounded-2xl overflow-hidden w-full max-w-md shadow-[0_0_50px_rgba(239,68,68,0.15)] border border-red-500/20 p-6 flex flex-col">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20 text-red-500">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-tight">Reset Entire Catalog?</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Are you absolutely sure you want to clear your entire inventory? This will set total products and total valuation metrics back to <span className="text-red-500 font-bold">0</span>.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 bg-[#18181d] hover:bg-slate-800 text-slate-300 border border-[#212126] font-semibold py-2.5 rounded-xl transition-all cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setInventory([]);
                    setShowResetModal(false);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-xl transition-all cursor-pointer text-sm shadow-lg shadow-red-600/20"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

