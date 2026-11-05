import { Item } from "@/types/item";

// In-memory data store for demonstration
let items: Item[] = [
  {
    id: "1",
    name: "Next.js 16 App Router",
    category: "Framework",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Tailwind CSS v4",
    category: "Styling",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "ShadCN UI",
    category: "UI Library",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Route Handlers (API)",
    category: "Backend",
    status: "active",
    createdAt: new Date().toISOString(),
  },
];

export const itemsStore = {
  getAll: (query?: string, category?: string): Item[] => {
    let result = [...items];
    if (query) {
      const q = query.toLowerCase();
      result = result.filter((item) => item.name.toLowerCase().includes(q));
    }
    if (category && category !== "all") {
      result = result.filter((item) => item.category.toLowerCase() === category.toLowerCase());
    }
    return result;
  },

  getById: (id: string): Item | undefined => {
    return items.find((item) => item.id === id);
  },

  create: (data: Omit<Item, "id" | "createdAt">): Item => {
    const newItem: Item = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
    };
    items.unshift(newItem);
    return newItem;
  },

  update: (id: string, data: Partial<Omit<Item, "id" | "createdAt">>): Item | null => {
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    items[index] = {
      ...items[index],
      ...data,
    };
    return items[index];
  },

  delete: (id: string): boolean => {
    const initialLength = items.length;
    items = items.filter((item) => item.id !== id);
    return items.length < initialLength;
  },
};

