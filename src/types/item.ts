export interface Item {
  id: string;
  name: string;
  category: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

