/**
 * Client-Side Gemini API integration with high-end robust Mock Fallback Mode
 * Built strictly according to client-only / frontend-only specifications.
 */

// Helper to wait
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface ChatMessage {
  role: "user" | "model";
  content: string;
}

/**
 * Retrieves the configured Gemini API key from localStorage or Vite environment.
 */
export function getApiKey(): string {
  const customKey = localStorage.getItem("mobileking_gemini_api_key");
  if (customKey && customKey.trim().length > 5) {
    return customKey.trim();
  }
  return ((import.meta as any).env?.VITE_GEMINI_API_KEY || "").trim();
}

/**
 * Checks if the application is currently running in mock fallback mode.
 * True if no valid key is configured or if mock mode is manually forced.
 */
export function isMockMode(): boolean {
  if (localStorage.getItem("mobileking_force_mock") === "true") {
    return true;
  }
  const key = getApiKey();
  return !key || key.length < 5;
}

/**
 * Saves a custom Gemini API key into localStorage.
 */
export function setCustomApiKey(key: string) {
  localStorage.setItem("mobileking_gemini_api_key", key);
}

/**
 * Clears custom Gemini API key from localStorage.
 */
export function removeCustomApiKey() {
  localStorage.removeItem("mobileking_gemini_api_key");
}

/**
 * Helper to execute fetch call to Google Generative Language API
 */
async function callGeminiAPI(apiKey: string, payload: any, model = "gemini-1.5-flash") {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API returned status ${response.status}: ${errText}`);
  }

  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Invalid response format or empty text from Gemini");
  }
  return text;
}

/* ==========================================
   1. CHAT CONVERSATION SERVICE (Direct / Fallback)
   ========================================== */

export async function generateChatResponse(messages: ChatMessage[]): Promise<string> {
  const userMessage = messages[messages.length - 1]?.content || "";
  
  if (isMockMode()) {
    await delay(1200); // Simulate processing delay
    return getChatFallback(userMessage);
  }

  try {
    const apiKey = getApiKey();
    const systemInstruction = "You are an expert AI assistant for a mobile accessory shop owner in India. You help with inventory management, marketing ideas, and business insights. Be concise, professional, and helpful.";

    // Format chat history for the standard generateContent schema
    const contents = messages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const payload = {
      contents,
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
    };

    return await callGeminiAPI(apiKey, payload);
  } catch (error) {
    console.warn("Direct Gemini Chat API failed. seamless recovery: entering fallback mode.", error);
    return `[Demo Fallback Active] ${getChatFallback(userMessage)}`;
  }
}

function getChatFallback(userInput: string): string {
  const text = userInput.toLowerCase();

  if (text.includes("case") || text.includes("cover") || text.includes("enclosure") || text.includes("silicon")) {
    return "Based on your live catalog, your lowest stock case is **Classic Clear Case** (2 units left). I recommend launching a 15% discount bundle on Cases + Screen Protectors this weekend to clear old stock and boost accessory cross-sales by 30%.";
  }
  
  if (text.includes("cable") || text.includes("charger") || text.includes("power") || text.includes("adapter") || text.includes("charging")) {
    return "Power accessories are highly active! Your **Fast Charger 20W** has stable inventory (18 units). Consider setting up a 'Premium Power Bundle' featuring the 20W Charger paired with a Type-C Braided Cable at a flat rate of ₹1,499. This increases average order value by roughly 22%.";
  }

  if (text.includes("audio") || text.includes("earphone") || text.includes("headphone") || text.includes("buds") || text.includes("wireless")) {
    return "Audio inventory analysis: Your top seller is the **BassBoom Neckband** (₹1,499), operating with a solid 45% profit margin. I advise putting up a highly stylized Instagram Reel emphasizing its battery life and active noise reduction to capture weekend shoppers.";
  }

  if (text.includes("screen") || text.includes("glass") || text.includes("tempered") || text.includes("protector")) {
    return "Screen Protectors are high-frequency, lower-margin items. You have **OnePlus 12 Tempered Glass** in stock. An effective promotion is offering a free premium Tempered Glass installation with any luxury case purchase above ₹999. This drives bulk sales and high-margin case inventory.";
  }

  if (text.includes("stock") || text.includes("inventory") || text.includes("low") || text.includes("count") || text.includes("restock")) {
    return "Critical Inventory Check: You have 3 products operating below your safe alert threshold (15 units):\n1. **Classic Clear Case** (2 units remaining) - *Urgent Restock Needed*\n2. **Type-C Braided Cable** (12 units remaining)\n3. **BassBoom Neckband** (14 units remaining)\n\nI recommend generating a supplier restock request for the Case, or running a clearance bundle to sell off the remaining units quickly.";
  }

  if (text.includes("price") || text.includes("discount") || text.includes("sale") || text.includes("revenue") || text.includes("margin")) {
    return "Strategic pricing insight: Your total catalog valuation stands at ₹24,490 across 168 units. To maximize weekend revenue without diluting margins, focus clearance discount codes (e.g., 20% OFF) strictly on static, slow-moving items (like Cases) while maintaining full retail pricing on fast-moving audio electronics.";
  }

  // General default response
  return "Hello! I am your Mobile King AI Business Assistant. Ask me anything about stock optimization, low-stock notifications, pricing structures, or deploying automated campaign copy. Try asking: 'Which items are low in stock?' or 'Draft a promo campaign for chargers'.";
}

/* ==========================================
   2. IMAGE VISION ANALYSIS (Direct / Fallback)
   ========================================== */

export interface VisionResult {
  name: string;
  category: string;
  suggestedPrice: number;
}

export async function generateVisionAnalysis(imageBase64: string): Promise<VisionResult> {
  if (isMockMode()) {
    await delay(1200); // Simulate network latency
    return getVisionFallback();
  }

  try {
    const apiKey = getApiKey();
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const payload = {
      contents: [
        {
          parts: [
            {
              text: "Analyze this image of a retail product. Return a JSON object with strictly these keys: 'name' (string, a concise product name), 'category' (string, choose one from: Cases, Audio, Cables & Power, Screen Protectors, Other), and 'suggestedPrice' (number, a realistic retail price in INR). Return ONLY valid JSON. Do not write markdown blocks around it.",
            },
            {
              inlineData: {
                data: base64Data,
                mimeType: "image/jpeg",
              },
            },
          ],
        },
      ],
    };

    const textResponse = await callGeminiAPI(apiKey, payload);
    
    // Robust extraction of JSON from markdown code blocks
    let jsonString = textResponse.trim();
    const jsonMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonString = jsonMatch[1].trim();
    } else {
      // Clean up inline markdown code fences if regex didn't match cleanly
      jsonString = jsonString.replace(/```json/g, "").replace(/```/g, "").trim();
    }
    
    const parsed = JSON.parse(jsonString);
    
    return {
      name: parsed.name || "Identified Accessory",
      category: parsed.category || "Other",
      suggestedPrice: Number(parsed.suggestedPrice) || 499,
    };
  } catch (error: any) {
    console.error("Direct Gemini Vision API failed:", error);
    if (!isMockMode()) {
      throw new Error(error.message || error);
    }
    return getVisionFallback();
  }
}

function getVisionFallback(): VisionResult {
  const presets = [
    { name: "Liquid Silicon Case iPhone 15 Pro", category: "Cases", suggestedPrice: 799 },
    { name: "SonicBuds True Wireless Earphones", category: "Audio", suggestedPrice: 2499 },
    { name: "Fast Charger 20W Type-C", category: "Cables & Power", suggestedPrice: 1299 },
    { name: "HD Tempered Glass Screen Protector", category: "Screen Protectors", suggestedPrice: 399 },
    { name: "Magnetic Car Mount AirVent Holder", category: "Other", suggestedPrice: 699 },
  ];

  // Return a random preset so each test feels fresh and live
  const randomIndex = Math.floor(Math.random() * presets.length);
  return presets[randomIndex];
}

/* ==========================================
   3. CAMPAIGN GENERATOR (Direct / Fallback)
   ========================================== */

export async function generateCampaignCopy(
  category: string,
  audience: string,
  discount: string,
  notes: string,
  inventory: any[]
): Promise<string> {
  // Sourcing relevant live items to pass as context
  const relevantItems = inventory
    .filter((p) => p.category.toLowerCase() === category.toLowerCase())
    .slice(0, 3);
  
  const itemsDescription = relevantItems.length > 0
    ? relevantItems.map(p => `"${p.name}" (Price: ₹${p.price})`).join(", ")
    : `items in the ${category} category`;

  if (isMockMode()) {
    await delay(1000);
    return getCampaignFallback(category, audience, discount, notes, itemsDescription);
  }

  try {
    const apiKey = getApiKey();
    const prompt = `Act as an expert digital marketing director. Construct a stunning, high-converting email/newsletter campaign for Mobile King accessories.
Target Category: ${category}
Relevant Live Products in Catalog: ${itemsDescription}
Target Audience Segment: ${audience}
Promotional Offer: ${discount}
Custom Special Instructions: ${notes || "None"}

Please format the newsletter beautifully in flat text markdown:
1. SUBJECT LINE: A high-clickrate subject header
2. PRIMARY PRE-HEADER: Enticing preview sentence
3. MAIN COPY: A professional, premium marketing message highlighting catalog items, pricing, and the specified offer
4. STRONG CALL TO ACTION: Distinct click trigger (e.g. [Buy Accessories Now])
5. URGENCY SENTENCE: To trigger fast conversions.

Keep the copy exceptionally high-end, tailored to the selected audience, and highly readable.`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    return await callGeminiAPI(apiKey, payload);
  } catch (error) {
    console.warn("Direct Gemini Campaign API failed. seamless recovery: entering fallback.", error);
    return getCampaignFallback(category, audience, discount, notes, itemsDescription, true);
  }
}

function getCampaignFallback(
  category: string,
  audience: string,
  discount: string,
  notes: string,
  itemsDescription: string,
  wasFallbackTriggeredByError = false
): string {
  const prefix = wasFallbackTriggeredByError ? "[Demo Fallback Active]\n\n" : "";
  return `${prefix}✉️ **SUBJECT**: 🔥 Upgrade Your Tech Gear: Get ${discount} off ${category} immediately!

✉️ **PRE-HEADER**: Elite accessories, engineered for your device. Unlocked prices for ${audience}.

---

Dear Mobile King Customer,

Your device deserves more than standard utility. It deserves premium craftsmanship, high-grade shock-resistance, and seamless power output.

This week, Mobile King Accessories is launching an exclusive spotlight on our custom-engineered **${category}** collection! We are talking about our finest catalog entries, featuring popular options like:
👉 ${itemsDescription}

For our highly valued **${audience}** segment, we've enabled an immediate **${discount}** promotion! 

🌟 *Why shop this clearance?*
• Certified durable silicones & braided fabrics
• India's highest rated accessories at special catalog price points
• Custom instructions applied: ${notes || "None provided"}

No long checkouts. Just pristine, high-end gear, shipped instantly.

👉 **[CLAIM YOUR ${discount} DISCOUNT NOW]**

*Hurry! This private newsletter event expires in 48 hours or when single-digit store inventory runs dry.*

Best Regards,
**Mobile King Accessories India**
*High-End Devices deserve Elite Protection.*`;
}

/* ==========================================
   4. SOCIAL CAPTION ARCHITECT (Direct / Fallback)
   ========================================== */

export async function generateSocialCaptions(
  productName: string,
  productPrice: string,
  productStock: string,
  tone: string,
  includeHashtags: boolean,
  notes: string
): Promise<string> {
  if (isMockMode()) {
    await delay(1000);
    return getSocialFallback(productName, productPrice, productStock, tone, includeHashtags, notes);
  }

  try {
    const apiKey = getApiKey();
    const prompt = `Act as a top-tier social media content creator. Write high-engaging captions and status templates for a newly printed flyer.
Product Name: ${productName}
Price Accent: ${productPrice}
Catalog Stock Status: ${productStock}
Creative Tone: ${tone}
Include Hashtags: ${includeHashtags ? "Yes (Add relevant high-performing tags)" : "No"}
Custom Context: ${notes || "None"}

Please produce exactly 3 distinct, ready-to-copy variations:
- Option 1: Trendy Instagram Post caption (with spaces, hooks, and clean layout)
- Option 2: Punchy WhatsApp Status updates (short, readable, uses bold emojis)
- Option 3: Professional Facebook / LinkedIn Broadcast (compelling value description)

Ensure everything looks neat and ready for copy-paste.`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    return await callGeminiAPI(apiKey, payload);
  } catch (error) {
    console.warn("Direct Gemini Captions API failed. seamless recovery: entering fallback.", error);
    return getSocialFallback(productName, productPrice, productStock, tone, includeHashtags, notes, true);
  }
}

function getSocialFallback(
  productName: string,
  productPrice: string,
  productStock: string,
  tone: string,
  includeHashtags: boolean,
  notes: string,
  wasFallbackTriggeredByError = false
): string {
  const prefix = wasFallbackTriggeredByError ? "[Demo Fallback Active]\n\n" : "";
  const hashtags = includeHashtags
    ? "\n\n#MobileAccessories #MobileKing #PremiumTech #IndiaGamer #StoreLaunch"
    : "";
  const customNote = notes ? `\n📌 *Special Note:* ${notes}` : "";

  return `${prefix}📸 **OPTION 1: TRENDY INSTAGRAM POST (${tone} VIBE)**

✨ UNLEASH THE SUPREME DEVICE EXPERIENCE ✨

Upgrade your daily carry with the ultra-refined **${productName}**! Handcrafted with extreme precision, offering flawless tactile feedback and peak device utility.

⚡️ **Special Catalog Price:** ${productPrice}
🔥 **Store Stock Status:** Only ${productStock} remaining!
${customNote}

Grab yours before we hit zero! Drop a DM or click the link in bio to secure yours today. 🚀${hashtags}

---

💬 **OPTION 2: PUNCHY WHATSAPP STATUS (DIRECT SALE)**

📱 *BACK IN STOCK!* 📱

Get the elite *${productName}* from Mobile King today!

✨ *Highlight Specs:*
• High-grade scratch-resistance
• Premium ergonomic hand-feel
• Best-in-market price: *${productPrice}*

🔥 *Status:* ${productStock} remaining! Send an instant message to reserve or buy now! 🛒

---

💼 **OPTION 3: PROFESSIONAL BROADCAST (LINKEDIN / FACEBOOK)**

📢 **PRODUCT INVENTORY HIGHLIGHT: ${productName.toUpperCase()}**

We are pleased to introduce a fresh restock of our premium ${productName} at Mobile King Accessories India.

At a highly competitive price point of **${productPrice}**, this mobile essential brings exceptional durability and refined design to your daily workflows without compromising style.

• **Available Stock:** ${productStock}
• **Pricing Point:** ₹${productPrice}
${notes ? `• **Additional Notes:** ${notes}` : ""}

Ensure your device remains protected and pristine. Visit our Mobile King authorized store to feel the premium quality in-person.`;
}
