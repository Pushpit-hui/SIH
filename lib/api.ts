const API_BASE = typeof window !== "undefined"
  ? (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes("8000") ? process.env.NEXT_PUBLIC_API_URL : "")
  : (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000");

export interface Product {
  product_id: number;
  product_code: string;
  product_name: string;
  model_number: string;
  status: string;
  category_name?: string;
  category_code?: string;
  manufacturer_name?: string;
  registration_number?: string;
  country_of_origin?: string;
}

export interface Standard {
  standard_id: number;
  standard_number: string;
  standard_title: string;
  description?: string;
  status: string;
  issuing_body?: string;
  category_name?: string;
  category_code?: string;
}

export interface ComplianceRequirement {
  requirement_id: number;
  requirement_code: string;
  requirement_title: string;
  requirement_description?: string;
  requirement_type?: string;
  status: string;
  due_date?: string;
  completed_at?: string;
}

export interface ComplianceAlert {
  alert_id: number;
  alert_type: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | string;
  title: string;
  message: string;
  status: string;
  due_date?: string;
  created_at?: string;
  product_name?: string;
  model_number?: string;
  standard_number?: string;
  requirement_code?: string;
  requirement_title?: string;
}

export interface ComplianceStatus {
  product_id: number;
  product_name: string;
  total_requirements: number;
  completed: number;
  pending: number;
  failed: number;
  readiness_percentage: number;
  applicable_standards: Array<{
    standard_id: number;
    standard_number: string;
    standard_title: string;
    applicability: string;
  }>;
  compliance_gaps: Array<{
    requirement_id: number;
    requirement_code: string;
    requirement_title: string;
    requirement_description: string;
    current_status: string;
  }>;
  recommended_actions: Array<{
    requirement_id: number;
    requirement_code: string;
    status: string;
    recommended_action: string;
  }>;
}

export interface DashboardStats {
  total_products: number;
  active_standards: number;
  active_certifications: number;
  critical_alerts: number;
  recent_activity: Array<{
    title: string;
    detail: string;
    time: string;
    color: string;
  }>;
}

export interface ChatResponse {
  answer: string;
  sources: string[];
  product?: Record<string, any>;
  requirements: Array<Record<string, any>>;
  alerts: Array<Record<string, any>>;
  clarifying_questions?: string[];
  suggested_prompts?: string[];
}

export interface LicenceVerification {
  certificate_number: string;
  certification_type: string;
  issuing_authority: string;
  issue_date: string;
  expiry_date: string;
  status: string;
  product_name: string;
  model_number: string;
  manufacturer_name: string;
  city: string;
  state: string;
  country: string;
}

export interface ComplaintResult {
  complaint_number: string;
  status: string;
  message: string;
  estimated_resolution: string;
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => "");
      throw new Error(`API Error ${res.status}: ${errorBody || res.statusText}`);
    }

    return await res.json();
  } catch (err: any) {
    console.warn(`[API Client] Failed to fetch ${url}:`, err.message);
    throw err;
  }
}

export const api = {
  getHealth: () => request<{ status: string; database: string }>("/api/health"),

  getProducts: () => request<Product[]>("/api/products"),

  createProduct: (data: {
    product_name: string;
    model_number: string;
    category_code: string;
    manufacturer_name: string;
    country_of_origin?: string;
    description?: string;
  }) =>
    request<{ product_id: number; product_name: string; model_number: string; status: string }>("/api/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getProduct: (productId: number) =>
    request<{
      product: Record<string, any>;
      category?: string;
      standards: any[];
      requirements: any[];
      current_requirement_status: Record<string, number>;
      documents?: any[];
      tests?: any[];
      certifications?: any[];
      recommended_actions?: any[];
      compliance_readiness?: any;
      alerts: any[];
    }>(`/api/products/${productId}`),

  getProductCompliance: (productId: number) =>
    request<ComplianceStatus>(`/api/products/${productId}/compliance`),

  getAlerts: (params?: { productId?: number; severity?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.productId) query.set("product_id", String(params.productId));
    if (params?.severity && params.severity !== "All") query.set("severity", params.severity);
    if (params?.status && params.status !== "All") query.set("status", params.status);
    const qs = query.toString();
    return request<ComplianceAlert[]>(`/api/alerts${qs ? `?${qs}` : ""}`);
  },

  resolveAlert: (alertId: number) =>
    request<{ status: string; alert_id: number }>(`/api/alerts/${alertId}/resolve`, {
      method: "POST",
    }),

  getStandards: (params?: { q?: string; category?: string; scheme?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.q) query.set("q", params.q);
    if (params?.category && params.category !== "All") query.set("category", params.category);
    if (params?.scheme && params.scheme !== "All") query.set("scheme", params.scheme);
    if (params?.status && params.status !== "All") query.set("status", params.status);
    const qs = query.toString();
    return request<Standard[]>(`/api/standards${qs ? `?${qs}` : ""}`);
  },

  getDashboardStats: () => request<DashboardStats>("/api/dashboard/stats"),

  sendChat: (message: string, productId?: number) =>
    request<ChatResponse>("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        message,
        product_id: productId,
      }),
    }),

  verifyLicence: (licenceNumber: string) =>
    request<LicenceVerification>(`/api/consumer/verify-licence?licence_number=${encodeURIComponent(licenceNumber)}`),

  submitComplaint: (data: {
    consumer_name: string;
    consumer_email: string;
    consumer_phone?: string;
    product_name: string;
    brand_or_model?: string;
    licence_number?: string;
    complaint_type: string;
    description: string;
  }) =>
    request<ComplaintResult>("/api/consumer/complaint", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

