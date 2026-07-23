import { Product } from "./types";

const brands = [
  "iPhone 15 Pro", "iPhone 15", "iPhone 14 Pro", "Galaxy S24 Ultra", "Galaxy S23 FE", 
  "OnePlus 12", "OnePlus Nord 4", "Pixel 8 Pro", "Redmi Note 13", "Vivo V30"
];

const categories = [
  {
    name: "Cases" as const,
    items: ["Liquid Silicone Case", "MagSafe Armor Case", "Ultra Slim Clear Case", "Vintage Leather Wallet", "Carbon Fiber Cover"],
    priceRange: [299, 1299]
  },
  {
    name: "Audio" as const,
    items: ["TWS Earbuds Mini", "Hi-Fi Wired Earphones", "ANC Bass Headphones", "Sports Bluetooth Neckband", "True Wireless Pods"],
    priceRange: [499, 2999]
  },
  {
    name: "Cables & Power" as const,
    items: ["30W GaN Wall Adapter", "65W Multi-Port Charger", "100W Braided Type-C Cable", "MagSafe Wireless Pad", "3-in-1 Charging Dock"],
    priceRange: [349, 1999]
  },
  {
    name: "Screen Protectors" as const,
    items: ["9H Tempered Glass", "Privacy Screen Guard", "UV Liquid Glue Protector", "Premium Matte Film", "3D Camera Lens Protector"],
    priceRange: [199, 599]
  },
  {
    name: "Other" as const,
    items: ["Magnetic Ring Holder", "Aluminium Desk Stand", "Universal Car Air-Vent Mount", "Anti-Dust Port Plugs", "3-in-1 Screen Cleaning Kit"],
    priceRange: [149, 799]
  }
];

export const generateInitialInventory = (): Product[] => {
  const products: Product[] = [];
  
  for (let i = 0; i < 100; i++) {
    const brand = brands[i % brands.length];
    const catConfig = categories[i % categories.length];
    const itemType = catConfig.items[(i >> 1) % catConfig.items.length];
    
    // Create a realistic name
    const name = `${brand} ${itemType}`;
    
    // Deterministic price calculation
    const [minPrice, maxPrice] = catConfig.priceRange;
    const priceStep = Math.round((maxPrice - minPrice) / 20);
    const price = minPrice + ((i * 7) % 21) * priceStep;
    
    // Deterministic stock allocation:
    // - 3 items with stock = 14 (42)
    // - 5 items with stock = 20 (100)
    // - 15 items with stock = 10 (150)
    // - 77 items with stock = 5 (385)
    // Total stock = 677. Total products = 100.
    let stock = 5; 
    if (i < 3) {
      stock = 14; 
    } else if (i < 8) {
      stock = 20; 
    } else if (i < 23) {
      stock = 10; 
    }
    
    products.push({
      id: `p-${i + 1}`,
      name,
      category: catConfig.name,
      price,
      stock,
    });
  }
  
  return products;
};

export const initialInventory = generateInitialInventory();
