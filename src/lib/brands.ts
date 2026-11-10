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

// Brands that use the instant, pre-calculated quote flow.
// Every other brand goes through the "Other Brands" custom request form.
const INSTANT_QUOTE_BRAND_IDS = ["apple", "iphone", "samsung"];

const OTHER_BRAND: Brand = {
  id: "other",
  name: "Other Brands",
  logo_url: "/moto.png",
  is_active: true,
};

// ── Fetch active brands for public UI ──
export async function getActiveBrands(): Promise<Brand[]> {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error || !data || data.length === 0) {
    // Default flagship brands with instant quote calculation
    return [
      { id: "apple", name: "Apple", logo_url: "/apple.png", is_active: true },
      { id: "samsung", name: "Samsung", logo_url: "/samsung.jpg", is_active: true },
      OTHER_BRAND,
    ];
  }

  const instantQuoteBrands = data.filter((b) =>
    INSTANT_QUOTE_BRAND_IDS.includes(b.id)
  );

  return [...instantQuoteBrands, OTHER_BRAND];
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
      iphone: [
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
    };

    if (brandId) {
      const staticBrandModels = STATIC_MODELS[brandId];
      if (!staticBrandModels) {
        // Unknown/unsupported brand (e.g. a custom "other" brand) has no
        // pre-calculated models. Never leak another brand's models here.
        return [];
      }
      return staticBrandModels.map((m) => ({
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
const APPLE_VARIANT_MULTIPLIERS: Record<string, number> = {
  "64gb": 0.70,
  "128gb": 0.85,
  "256gb": 1.00,
  "512gb": 1.15,
  "1tb": 1.25,
  "2tb": 1.35,
};

const ANDROID_VARIANT_MULTIPLIERS: Record<string, number> = {
  "64gb": 0.70,
  "6_128": 0.85,
  "8_128": 0.90,
  "8_256": 1.00,
  "12_256": 1.08,
  "12_512": 1.15,
  "12_1tb": 1.25,
  "16_2tb": 1.35,
};

/**
 * Existing DB rows may still carry the legacy variant keys (6_128, 8_256…)
 * or missing/zero values. Normalise them to the variant set the sell flow
 * actually offers so every selectable variant has a real price.
 */
function normalizeVariantPrices(
  basePrice: number,
  existing: Record<string, number> | undefined,
  isIphone: boolean
): Record<string, number> {
  const multipliers = isIphone ? APPLE_VARIANT_MULTIPLIERS : ANDROID_VARIANT_MULTIPLIERS;
  const normalized: Record<string, number> = {};

  for (const [key, multiplier] of Object.entries(multipliers)) {
    const configured = existing?.[key];
    normalized[key] =
      configured !== undefined && configured !== null && Number(configured) > 0
        ? Number(configured)
        : Math.round(basePrice * multiplier);
  }

  return normalized;
}

export async function getModelPricingConfig(modelId: string): Promise<ModelPricingConfig | null> {
  const { data, error } = await supabase
    .from("models")
    .select("base_price, pricing_config")
    .eq("id", modelId)
    .single();

  if (data && data.base_price) {
    const isIphone = modelId.startsWith("ip");

    if (data.pricing_config && typeof data.pricing_config === "object") {
      const cfg = { ...data.pricing_config, basePrice: data.base_price };
      if (!cfg.variantPrices && cfg.variantMultipliers) {
        cfg.variantPrices = {};
        for (const [k, mult] of Object.entries(cfg.variantMultipliers)) {
          cfg.variantPrices[k] = Math.round(data.base_price * Number(mult));
        }
      }
      cfg.variantPrices = normalizeVariantPrices(
        data.base_price,
        cfg.variantPrices,
        isIphone
      );
      return cfg;
    }

    const bp = data.base_price;
    // Default configuration template if custom pricing_config JSON isn't specified
    return {
      basePrice: bp,
      variantPrices: normalizeVariantPrices(bp, undefined, isIphone),
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
        screen: Math.round(bp * 0.1),
        dead: Math.round(bp * 0.12),
        body: Math.round(bp * 0.04),
        panel: Math.round(bp * 0.08),
        touch: Math.round(bp * 0.09),
        button: Math.round(bp * 0.03),
        bent: Math.round(bp * 0.07),
        loose: Math.round(bp * 0.05),
      },
      software: {
        wifi: Math.round(bp * 0.04),
        mic: Math.round(bp * 0.04),
        faceid: Math.round(bp * 0.07),
        charge: Math.round(bp * 0.04),
        camera: Math.round(bp * 0.06),
        bluetooth: Math.round(bp * 0.03),
        fingerprint: Math.round(bp * 0.04),
      },
    };
  }

  // Fallback to static MODEL_PRICING
  return MODEL_PRICING[modelId] ?? null;
}
