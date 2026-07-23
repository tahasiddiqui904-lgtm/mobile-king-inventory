import React, { useState } from "react";
import { Product } from "../types";
import { ThemeConfig } from "../theme";
import { 
  Megaphone, Instagram, Sparkles, ArrowUpRight, X, Loader2, Copy, Check, Info, FileText 
} from "lucide-react";
import { generateCampaignCopy, generateSocialCaptions } from "../lib/gemini";

interface MarketingProps {
  inventory: Product[];
  currentTheme: ThemeConfig;
}

type CampaignAudience = "Tech Enthusiasts" | "Luxury Shoppers" | "Budget Buyers" | "General Public";
type CaptionTone = "Sleek & Luxury" | "Trendy & Gen-Z" | "Punchy & Direct" | "Professional Alert";

export function Marketing({ inventory, currentTheme }: MarketingProps) {
  // Campaign Creator states
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campaignCategory, setCampaignCategory] = useState("Cases");
  const [campaignAudience, setCampaignAudience] = useState<CampaignAudience>("Tech Enthusiasts");
  const [campaignDiscount, setCampaignDiscount] = useState("20% Off");
  const [campaignNotes, setCampaignNotes] = useState("");
  const [campaignLoading, setCampaignLoading] = useState(false);
  const [campaignResult, setCampaignResult] = useState<string | null>(null);
  const [copiedCampaign, setCopiedCampaign] = useState(false);

  // Social Captions states
  const [showCaptionsModal, setShowCaptionsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>(inventory[0]?.id || "");
  const [captionTone, setCaptionTone] = useState<CaptionTone>("Sleek & Luxury");
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [captionNotes, setCaptionNotes] = useState("");
  const [captionsLoading, setCaptionsLoading] = useState(false);
  const [captionsResult, setCaptionsResult] = useState<string | null>(null);
  const [copiedCaptions, setCopiedCaptions] = useState(false);

  // Generate Automated Campaign via Gemini
  const handleGenerateCampaign = async () => {
    setCampaignLoading(true);
    setCampaignResult(null);
    setCopiedCampaign(false);

    try {
      const reply = await generateCampaignCopy(
        campaignCategory,
        campaignAudience,
        campaignDiscount,
        campaignNotes,
        inventory
      );
      setCampaignResult(reply);
    } catch (error) {
      console.error(error);
      setCampaignResult("Apologies, I was unable to connect to Gemini to draft your campaign. Please ensure your GEMINI_API_KEY is configured.");
    } finally {
      setCampaignLoading(false);
    }
  };

  // Generate Social Captions via Gemini
  const handleGenerateCaptions = async () => {
    setCaptionsLoading(true);
    setCaptionsResult(null);
    setCopiedCaptions(false);

    const product = inventory.find((p) => p.id === selectedProduct) || inventory[0];
    const productName = product ? product.name : "Cellular Accessories";
    const productPrice = product ? `₹${product.price}` : "the best prices";
    const productStock = product ? `${product.stock} units left` : "limited stock";

    try {
      const reply = await generateSocialCaptions(
        productName,
        productPrice,
        productStock,
        captionTone,
        includeHashtags,
        captionNotes
      );
      setCaptionsResult(reply);
    } catch (error) {
      console.error(error);
      setCaptionsResult("Apologies, I failed to compile social media drafts. Please double-check your API configurations.");
    } finally {
      setCaptionsLoading(false);
    }
  };

  const copyToClipboard = (text: string, setCopied: React.Dispatch<React.SetStateAction<boolean>>) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 h-full bg-transparent selection:bg-amber-500/20 text-slate-200 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-white tracking-tight uppercase">Marketing Suite</h2>
        <p className="text-slate-400 text-sm mt-1">Deploy automated promo campaigns and author premium social captions powered by Gemini AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
        
        {/* Campaign Card 1 */}
        <div className="bg-[#121215] border border-[#212126] p-8 rounded-2xl relative overflow-hidden group hover:border-opacity-60 transition-all duration-300 shadow-xl"
             style={{ hoverBorderColor: currentTheme.primaryColorHex }}>
          <div className={`absolute right-[-10%] top-[-10%] w-32 h-32 rounded-full ${currentTheme.glowColor} blur-[40px] pointer-events-none`} />
          
          <div className={`w-12 h-12 ${currentTheme.bgAccentTen} rounded-xl flex items-center justify-center mb-6 border ${currentTheme.borderAccentTwentyFive} ${currentTheme.accentText}`}>
            <Megaphone className="w-5 h-5" />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Automated Promo Campaigns</h3>
          <p className="text-slate-400 mb-8 text-sm leading-relaxed">
            Instantly formulate optimized newsletter broadcasts based on catalog items. Automatically structures headings, prices, and conversion buttons.
          </p>
          
          <button 
            onClick={() => {
              setShowCampaignModal(true);
              setCampaignResult(null);
            }}
            className="bg-[#18181d] hover:bg-[#212126] text-white px-5 py-3 rounded-xl font-bold border border-[#212126] hover:border-opacity-50 transition-all w-full text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            style={{ hoverBorderColor: currentTheme.primaryColorHex }}
          >
            <span>Configure AI Campaign</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Campaign Card 2 */}
        <div className="bg-[#121215] border border-[#212126] p-8 rounded-2xl relative overflow-hidden group hover:border-opacity-60 transition-all duration-300 shadow-xl">
          <div className={`absolute right-[-10%] top-[-10%] w-32 h-32 rounded-full ${currentTheme.glowColor} blur-[40px] pointer-events-none`} />
          
          <div className={`w-12 h-12 ${currentTheme.bgAccentTen} rounded-xl flex items-center justify-center mb-6 border ${currentTheme.borderAccentTwentyFive} ${currentTheme.accentText}`}>
            <Instagram className="w-5 h-5" />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Social Media Architect</h3>
          <p className="text-slate-400 mb-8 text-sm leading-relaxed">
            Generate high-converting, premium Instagram & WhatsApp status copy for your newly generated printable flyers.
          </p>
          
          <button 
            onClick={() => {
              setShowCaptionsModal(true);
              setCaptionsResult(null);
            }}
            className={`px-5 py-3 rounded-xl font-bold transition-all w-full text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg ${currentTheme.buttonStyles}`}
          >
            <span>Draft Captions with Gemini</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* --- AI Campaign Config Modal --- */}
      {showCampaignModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="relative bg-[#0c0c0e] rounded-2xl overflow-hidden w-full max-w-2xl shadow-2xl border border-[#212126] flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-[#212126] flex justify-between items-center bg-[#111114]">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${currentTheme.bgAccentTen} flex items-center justify-center ${currentTheme.accentText}`}>
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight">AI Campaign Builder</h3>
                  <p className="text-xs text-slate-400">Instruct Gemini to construct premium email and newsletter copies.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowCampaignModal(false)}
                className="text-slate-500 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {!campaignResult && !campaignLoading ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Stock Category</label>
                      <select 
                        value={campaignCategory}
                        onChange={(e) => setCampaignCategory(e.target.value)}
                        className="w-full bg-[#18181d] border border-[#212126] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-opacity-50"
                        style={{ focusBorderColor: currentTheme.primaryColorHex }}
                      >
                        <option value="Cases">Cases & Enclosures</option>
                        <option value="Audio">Audio & Wireless</option>
                        <option value="Cables">Cables & Chargers</option>
                        <option value="Screen Protectors">Screen Protectors</option>
                        <option value="Other">Other / Miscellaneous</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Audience Segment</label>
                      <select 
                        value={campaignAudience}
                        onChange={(e) => setCampaignAudience(e.target.value as CampaignAudience)}
                        className="w-full bg-[#18181d] border border-[#212126] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-opacity-50"
                        style={{ focusBorderColor: currentTheme.primaryColorHex }}
                      >
                        <option value="Tech Enthusiasts">Tech Enthusiasts (Modern, Specs-driven)</option>
                        <option value="Luxury Shoppers">Luxury Shoppers (Sleek, Premium emphasis)</option>
                        <option value="Budget Buyers">Budget Deals (Value, Clearance accents)</option>
                        <option value="General Public">General Public (Catchy, Friendly)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Promotional Offer / Discount</label>
                      <input 
                        type="text"
                        value={campaignDiscount}
                        onChange={(e) => setCampaignDiscount(e.target.value)}
                        placeholder="e.g. 15% OFF, Flat ₹299 Deal"
                        className="w-full bg-[#18181d] border border-[#212126] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-opacity-50 placeholder:text-slate-600"
                        style={{ focusBorderColor: currentTheme.primaryColorHex }}
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      <Info className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <p className="text-[11px] text-slate-400 leading-normal">
                        Gemini automatically pulls matching products from your live catalog to list inside the draft.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Custom Special Instructions (Optional)</label>
                    <textarea 
                      value={campaignNotes}
                      onChange={(e) => setCampaignNotes(e.target.value)}
                      placeholder="e.g. Highlight power kit warranties, stress clearance urgency, or use a conversational vibe..."
                      className="w-full bg-[#18181d] border border-[#212126] rounded-xl px-4 py-3 text-sm text-white focus:outline-none h-24 resize-none placeholder:text-slate-600"
                    />
                  </div>

                  <button
                    onClick={handleGenerateCampaign}
                    className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-4 ${currentTheme.buttonStyles}`}
                  >
                    <span>Generate AI Campaign Proposal</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              ) : campaignLoading ? (
                <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
                  <Loader2 className={`w-12 h-12 animate-spin ${currentTheme.accentText}`} />
                  <div>
                    <h4 className="font-bold text-white uppercase tracking-wider text-sm">Gemini is Synthesizing Campaign...</h4>
                    <p className="text-xs text-slate-400 mt-1">Sourcing real-time store metrics, prices, and conversion copy.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-[#16161a] border border-[#212126] p-4 rounded-xl">
                    <div className="flex items-center gap-2">
                      <FileText className={`w-4 h-4 ${currentTheme.accentText}`} />
                      <span className="text-xs font-bold text-slate-300">Drafted Proposal Copy</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(campaignResult || "", setCopiedCampaign)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                        copiedCampaign
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : "bg-[#1d1d24] border-[#212126] hover:border-slate-700 text-white"
                      }`}
                    >
                      {copiedCampaign ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCampaign ? "Copied!" : "Copy Campaign"}</span>
                    </button>
                  </div>

                  <div className="bg-[#18181d] border border-[#212126] rounded-xl p-6 overflow-auto max-h-[350px] font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap select-text">
                    {campaignResult}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setCampaignResult(null)}
                      className="flex-1 bg-[#18181d] hover:bg-[#212126] text-slate-300 border border-[#212126] hover:border-opacity-40 font-semibold py-3 rounded-xl transition-all cursor-pointer text-xs uppercase tracking-wider"
                      style={{ hoverBorderColor: currentTheme.primaryColorHex }}
                    >
                      Refine Options
                    </button>
                    <button
                      onClick={handleGenerateCampaign}
                      className={`flex-1 font-bold py-3 rounded-xl transition-all cursor-pointer text-xs uppercase tracking-wider ${currentTheme.buttonStyles}`}
                    >
                      Re-generate Draft
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- AI Social Captions Modal --- */}
      {showCaptionsModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="relative bg-[#0c0c0e] rounded-2xl overflow-hidden w-full max-w-2xl shadow-2xl border border-[#212126] flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-[#212126] flex justify-between items-center bg-[#111114]">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${currentTheme.bgAccentTen} flex items-center justify-center ${currentTheme.accentText}`}>
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight">Social Media Architect</h3>
                  <p className="text-xs text-slate-400">Generate hooks and copy variants optimized for mobile catalogs.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowCaptionsModal(false)}
                className="text-slate-500 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {!captionsResult && !captionsLoading ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Target Catalog Product</label>
                      <select 
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        className="w-full bg-[#18181d] border border-[#212126] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-opacity-50"
                        style={{ focusBorderColor: currentTheme.primaryColorHex }}
                      >
                        {inventory.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (Stock: {p.stock} | Price: ₹{p.price})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Creative Persona & Tone</label>
                      <select 
                        value={captionTone}
                        onChange={(e) => setCaptionTone(e.target.value as CaptionTone)}
                        className="w-full bg-[#18181d] border border-[#212126] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-opacity-50"
                        style={{ focusBorderColor: currentTheme.primaryColorHex }}
                      >
                        <option value="Sleek & Luxury">Sleek & Luxury (Clean, Elegant, High-end)</option>
                        <option value="Trendy & Gen-Z">Trendy & Gen-Z (Hype, Fast hooks, Emojis)</option>
                        <option value="Punchy & Direct">Punchy & Direct (Clear specs, Call to Action)</option>
                        <option value="Professional Alert">Professional (Stock report, Retail highlights)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-[#141418] p-4 rounded-xl border border-[#212126]">
                    <div>
                      <h4 className="text-xs font-bold text-white">Include Optimized Hashtags</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Appends high-click mobile accessory tags.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={includeHashtags} 
                        onChange={(e) => setIncludeHashtags(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Custom Hook Context / Remarks (Optional)</label>
                    <textarea 
                      value={captionNotes}
                      onChange={(e) => setCaptionNotes(e.target.value)}
                      placeholder="e.g. Free installation in store, water resistant material, limited edition, etc..."
                      className="w-full bg-[#18181d] border border-[#212126] rounded-xl px-4 py-3 text-sm text-white focus:outline-none h-24 resize-none placeholder:text-slate-600"
                    />
                  </div>

                  <button
                    onClick={handleGenerateCaptions}
                    className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-4 ${currentTheme.buttonStyles}`}
                  >
                    <span>Formulate Captions with Gemini</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              ) : captionsLoading ? (
                <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
                  <Loader2 className={`w-12 h-12 animate-spin ${currentTheme.accentText}`} />
                  <div>
                    <h4 className="font-bold text-white uppercase tracking-wider text-sm">Gemini is Drafting Captions...</h4>
                    <p className="text-xs text-slate-400 mt-1">Generating multi-format captions (Instagram, WhatsApp Status, Facebook).</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-[#16161a] border border-[#212126] p-4 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Instagram className={`w-4 h-4 ${currentTheme.accentText}`} />
                      <span className="text-xs font-bold text-slate-300">Generated Captions Suite</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(captionsResult || "", setCopiedCaptions)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                        copiedCaptions
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : "bg-[#1d1d24] border-[#212126] hover:border-slate-700 text-white"
                      }`}
                    >
                      {copiedCaptions ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCaptions ? "Copied All!" : "Copy All"}</span>
                    </button>
                  </div>

                  <div className="bg-[#18181d] border border-[#212126] rounded-xl p-6 overflow-auto max-h-[350px] font-sans text-xs text-slate-200 leading-relaxed whitespace-pre-wrap select-text">
                    {captionsResult}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setCaptionsResult(null)}
                      className="flex-1 bg-[#18181d] hover:bg-[#212126] text-slate-300 border border-[#212126] hover:border-opacity-40 font-semibold py-3 rounded-xl transition-all cursor-pointer text-xs uppercase tracking-wider"
                      style={{ hoverBorderColor: currentTheme.primaryColorHex }}
                    >
                      Modify Parameters
                    </button>
                    <button
                      onClick={handleGenerateCaptions}
                      className={`flex-1 font-bold py-3 rounded-xl transition-all cursor-pointer text-xs uppercase tracking-wider ${currentTheme.buttonStyles}`}
                    >
                      Re-generate Copy
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
