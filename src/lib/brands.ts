import { supabase } from "@/lib/supabase";
import { MODEL_PRICING, type ModelPricingConfig } from "@/lib/pricing";

export interface Brand {
  id: string;
  name: string;
  logo_url: string;
  is_active: boolean;
  created_at?: string;
}

export interface Model {
  id: string;
  brand_id: string;
  name: string;
  base_price: number;
  pricing_config?: ModelPricingConfig;
  is_active: boolean;
  created_at?: string;
}

// ── Fetch active brands for public UI ──
export async function getActiveBrands(): Promise<Brand[]> {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error || !data || data.length === 0) {
    // Return fallback static brands if table empty or error occurs
    return [
      { id: "apple", name: "Apple", logo_url: "/apple.png", is_active: true },
      { id: "samsung", name: "Samsung", logo_url: "/samsung.jpg", is_active: true },
      { id: "google", name: "Google", logo_url: "/google.png", is_active: true },
      { id: "oneplus", name: "OnePlus", logo_url: "/oneplus.png", is_active: true },
      { id: "mi", name: "MI", logo_url: "/mi.png", is_active: true },
      { id: "vivo", name: "Vivo", logo_url: "/vivo.png", is_active: true },
      { id: "oppo", name: "Oppo", logo_url: "/oppo.png", is_active: true },
      { id: "realme", name: "Realme", logo_url: "/realme.png", is_active: true },
      { id: "iqoo", name: "iQOO", logo_url: "/iqoo.png", is_active: true },
      { id: "motorola", name: "Motorola", logo_url: "/moto.png", is_active: true },
    ];
  }

  return data;
}

// ── Fetch active models by brand for public UI ──
export async function getActiveModels(brandId?: string): Promise<Model[]> {
  let query = supabase.from("models").select("*").eq("is_active", true);
  if (brandId) {
    query = query.eq("brand_id", brandId);
  }

  const { data, error } = await query.order("name", { ascending: true });

  if (error || !data || data.length === 0) {
    // Static fallback models mapping if table empty or error occurs
    const STATIC_MODELS: Record<string, { id: string; name: string }[]> = {
      apple: [
        { id: "ip15pm", name: "iPhone 15 Pro Max" },
        { id: "ip15p", name: "iPhone 15 Pro" },
        { id: "ip15", name: "iPhone 15" },
        { id: "ip14pm", name: "iPhone 14 Pro Max" },
        { id: "ip14", name: "iPhone 14" },
      ],
      samsung: [
        { id: "s24u", name: "Galaxy S24 Ultra" },
        { id: "s24", name: "Galaxy S24" },
        { id: "s23u", name: "Galaxy S23 Ultra" },
      ],
      google: [
        { id: "p8p", name: "Pixel 8 Pro" },
        { id: "p8", name: "Pixel 8" },
        { id: "p7p", name: "Pixel 7 Pro" },
      ],
      oneplus: [
        { id: "op12", name: "OnePlus 12" },
        { id: "op12r", name: "OnePlus 12R" },
        { id: "op11", name: "OnePlus 11" },
      ],
      mi: [
        { id: "mi14u", name: "Xiaomi 14 Ultra" },
        { id: "mi14", name: "Xiaomi 14" },
        { id: "mi13p", name: "Xiaomi 13 Pro" },
      ],
      vivo: [
        { id: "vx100p", name: "Vivo X100 Pro" },
        { id: "vx100", name: "Vivo X100" },
        { id: "vv29", name: "Vivo V29" },
      ],
      oppo: [
        { id: "findn3", name: "Find N3 Flip" },
        { id: "reno11p", name: "Reno 11 Pro" },
        { id: "reno11", name: "Reno 11" },
      ],
      realme: [
        { id: "rm12p", name: "Realme 12 Pro+" },
        { id: "rm12", name: "Realme 12" },
        { id: "rm11p", name: "Realme 11 Pro" },
      ],
      iqoo: [
        { id: "iq12", name: "iQOO 12" },
        { id: "iqneo9", name: "iQOO Neo 9 Pro" },
        { id: "iq11", name: "iQOO 11" },
      ],
      motorola: [
        { id: "motoe50", name: "Edge 50 Pro" },
        { id: "motoe40", name: "Edge 40" },
        { id: "razr40", name: "Razr 40 Ultra" },
      ],
    };

    if (brandId && STATIC_MODELS[brandId]) {
      return STATIC_MODELS[brandId].map((m) => ({
        id: m.id,
        brand_id: brandId,
        name: m.name,
        base_price: MODEL_PRICING[m.id]?.basePrice ?? 30000,
        is_active: true,
      }));
    }

    return Object.entries(STATIC_MODELS).flatMap(([bId, list]) =>
      list.map((m) => ({
        id: m.id,
        brand_id: bId,
        name: m.name,
        base_price: MODEL_PRICING[m.id]?.basePrice ?? 30000,
        is_active: true,
      }))
    );
  }

  return data;
}

// ── Fetch dynamic model pricing configuration ──
export async function getModelPricingConfig(modelId: string): Promise<ModelPricingConfig | null> {
  const { data, error } = await supabase
    .from("models")
    .select("base_price, pricing_config")
    .eq("id", modelId)
    .single();

  if (data && data.base_price) {
    if (data.pricing_config && typeof data.pricing_config === "object") {
      return {
        ...data.pricing_config,
        basePrice: data.base_price,
      };
    }

    // Default configuration template if custom pricing_config JSON isn't specified
    return {
      basePrice: data.base_price,
      variantMultipliers: {
        "6_128": 0.85,
        "8_128": 0.9,
        "8_256": 1.0,
        "12_256": 1.08,
        "12_512": 1.15,
      },
      ageDeductions: {
        "0_3": 0.05,
        "3_6": 0.12,
        "6_11": 0.22,
        "11_plus": 0.38,
      },
      battery: {
        type: modelId.startsWith("ip") ? "iphone" : "android",
      },
      hardware: {
        screen: Math.round(data.base_price * 0.1),
        dead: Math.round(data.base_price * 0.12),
        body: Math.round(data.base_price * 0.04),
        panel: Math.round(data.base_price * 0.08),
        touch: Math.round(data.base_price * 0.09),
        button: Math.round(data.base_price * 0.03),
        bent: Math.round(data.base_price * 0.07),
        loose: Math.round(data.base_price * 0.05),
      },
      software: {
        wifi: Math.round(data.base_price * 0.04),
        mic: Math.round(data.base_price * 0.04),
        faceid: Math.round(data.base_price * 0.07),
        charge: Math.round(data.base_price * 0.04),
        camera: Math.round(data.base_price * 0.06),
        bluetooth: Math.round(data.base_price * 0.03),
        fingerprint: Math.round(data.base_price * 0.04),
      },
    };
  }

  // Fallback to static MODEL_PRICING
  return MODEL_PRICING[modelId] ?? null;
}
