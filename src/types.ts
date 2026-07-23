export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
}

export type ViewType = "dashboard" | "inventory" | "chat" | "marketing" | "settings";
