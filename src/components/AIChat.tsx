import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { ThemeConfig } from "../theme";
import { generateChatResponse, ChatMessage as GeminiChatMessage } from "../lib/gemini";

interface AIChatProps {
  currentTheme: ThemeConfig;
}

export function AIChat({ currentTheme }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      role: "model",
      content: "Welcome to your Mobile King AI Suite. I can assist you in generating promotional campaigns, optimizing catalog titles, or composing high-end social media captions. Write a custom directive or query below.",
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "Draft a promo campaign for premium Cases.",
    "Formulate high-converting captions for Tempered Glasses.",
    "Draft an overstock clearance message for power kits."
  ];

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendAction = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: textToSend };
    const newMessages = [...messages, userMsg];
    
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const mappedHistory: GeminiChatMessage[] = newMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const reply = await generateChatResponse(mappedHistory);
      
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "model", content: reply }
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "model", content: "Apologies, I encountered an internal transmission error. Please retry." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const text = input;
    setInput("");
    handleSendAction(text);
  };

  return (
    <div className="flex flex-col h-full bg-transparent p-3 md:p-6 selection:bg-amber-500/20 text-slate-200">
      <div className="mb-6 flex-shrink-0">
        <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight uppercase flex items-center gap-2">
          <span>AI Intelligence Suite</span>
          <Sparkles className={`w-5 h-5 ${currentTheme.accentText}`} />
        </h2>
        <p className="text-slate-400 text-sm mt-1">Converse with Gemini to orchestrate smart catalog directives.</p>
      </div>

      <div className="flex-1 bg-[#121215] border border-[#212126] rounded-2xl overflow-hidden flex flex-col relative shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-[#18181d]/10 via-transparent to-transparent pointer-events-none" />
        
        {/* Chat History Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10">
          {messages.map((msg) => {
            const isModel = msg.role === "model";
            return (
              <div
                key={msg.id}
                className={`flex ${isModel ? "justify-start" : "justify-end"}`}
              >
                <div className={`flex max-w-[80%] ${isModel ? "flex-row" : "flex-row-reverse"} gap-3`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0 ${
                    isModel 
                      ? `${currentTheme.bgAccentTen} ${currentTheme.borderAccentTwentyFive} ${currentTheme.accentText}` 
                      : "bg-[#212126] border-[#2e2e35] text-slate-200"
                  }`}>
                    {isModel ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>
                  <div className={`px-4 py-3 rounded-2xl border text-sm leading-relaxed ${
                    isModel
                      ? "bg-[#18181d] text-slate-200 border-[#212126] rounded-tl-none font-medium"
                      : "bg-[#212126] text-white border-[#2e2e35] rounded-tr-none font-semibold"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%] flex-row gap-3">
                <div className={`w-9 h-9 rounded-xl ${currentTheme.bgAccentTen} border ${currentTheme.borderAccentTwentyFive} ${currentTheme.accentText} flex items-center justify-center animate-spin`}>
                  <Bot className="w-4 h-4" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-[#18181d] text-slate-400 border border-[#212126] rounded-tl-none flex items-center gap-2">
                  <Loader2 className={`w-4 h-4 animate-spin ${currentTheme.accentText}`} />
                  <span className={`text-xs uppercase tracking-wider font-bold ${currentTheme.accentText}/75`}>Gemini is writing...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>

        {/* Suggestion Chips */}
        {messages.length === 1 && !isLoading && (
          <div className="px-6 pb-4 pt-2 flex flex-col gap-2 relative z-10 bg-[#121215]">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Recommended Directives</p>
            <div className="flex flex-wrap gap-2.5">
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSendAction(sug)}
                  className={`bg-[#18181d] hover:bg-[#212126] border border-[#212126] hover:${currentTheme.borderAccentTwenty} px-3.5 py-2 rounded-xl text-xs text-slate-300 hover:${currentTheme.accentText} text-left transition-all cursor-pointer`}
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="p-4 bg-[#16161a]/30 border-t border-[#1e1e24] relative z-10">
          <form onSubmit={handleFormSubmit} className="relative flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your inventory, e.g. 'What cases are low in stock?'"
              className={`flex-1 bg-[#18181d] border border-[#212126] focus:border-opacity-60 text-sm text-white px-4 py-3 rounded-xl focus:outline-none transition-all placeholder:text-slate-600`}
              style={{
                borderColor: input ? currentTheme.primaryColorHex : undefined,
                boxShadow: input ? `0 0 10px ${currentTheme.primaryColorHex}15` : undefined
              }}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`disabled:opacity-40 text-black p-3.5 rounded-xl font-bold flex items-center justify-center transition-all cursor-pointer shadow-lg disabled:cursor-not-allowed ${currentTheme.buttonStyles}`}
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
