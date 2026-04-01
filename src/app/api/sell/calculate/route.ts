import { NextResponse } from "next/server";

// ──────────────────────────────────────────────
// PRICING DATA TABLES
// ──────────────────────────────────────────────

// Base prices per model (INR)
const MODEL_BASE_PRICES: Record<string, number> = {
  // Apple
  ip15pm: 85000,
  ip15p:  75000,
  ip15:   60000,
  ip14pm: 55000,
  ip14p:  48000,
  ip14:   40000,
  ip13:   28000,
  // Samsung
  s24u:   70000,
  s24:    50000,
  s23u:   55000,
  s23:    38000,
  zfold5: 80000,
  zflip5: 45000,
  // Google
  p8p:    50000,
  p8:     38000,
  p7p:    35000,
  p7a:    25000,
  // OnePlus
  op12:   52000,
  op12r:  35000,
  op11:   38000,
  // Xiaomi / MI
  mi14u:  75000,
  mi14:   50000,
  mi13p:  45000,
  // Vivo
  vx100p: 65000,
  vx100:  48000,
  vv29:   25000,
  // Oppo
  findn3: 60000,
  reno11p: 30000,
  reno11:  22000,
  // Realme
  rm12p:  24000,
  rm12:   15000,
  rm11p:  18000,
  // iQOO
  iq12:   42000,
  iqneo9: 28000,
  iq11:   32000,
  // Motorola
  motoe50: 27000,
  motoe40: 20000,
  razr40:  45000,
};

// Brands that are treated as "Apple" (iPhone) for pricing logic
const APPLE_BRANDS = new Set(["apple"]);

// Variant multipliers
const VARIANT_MULTIPLIERS: Record<string, number> = {
  "6_128":  0.85,
  "8_128":  0.90,
  "8_256":  1.00,
  "12_256": 1.08,
  "12_512": 1.15,
};

// Age deduction (% of variant-adjusted base)
const AGE_DEDUCTIONS: Record<string, number> = {
  "0_3":    0.05,
  "3_6":    0.12,
  "6_11":   0.22,
  "11_plus":0.38,
};

// ──────────────────────────────────────────────
// HARDWARE DEFECT DEDUCTIONS — BRAND SPECIFIC
// ──────────────────────────────────────────────

// iPhone hardware deductions (INR) — generally higher due to repair cost
const IPHONE_HARDWARE_DEDUCTIONS: Record<string, number> = {
  screen:  7000,   // OLED screens are expensive
  dead:    8000,   // Display assembly
  body:    2000,
  panel:   6000,
  touch:   6500,
  button:  2500,
  bent:    5000,
  loose:   4000,
};

// Android hardware deductions (INR)
const ANDROID_HARDWARE_DEDUCTIONS: Record<string, number> = {
  screen:  4000,
  dead:    5000,
  body:    1200,
  panel:   3000,
  touch:   3500,
  button:  1000,
  bent:    2500,
  loose:   2000,
};

// ──────────────────────────────────────────────
// SOFTWARE DEFECT DEDUCTIONS — BRAND SPECIFIC
// ──────────────────────────────────────────────

// iPhone software deductions (INR)
const IPHONE_SOFTWARE_DEDUCTIONS: Record<string, number> = {
  wifi:        3000,
  mic:         3500,
  faceid:      5000,   // Face ID is exclusive to iPhones and costly
  charge:      3000,   // Lightning/USB-C port
  camera:      4500,
  bluetooth:   2500,
  fingerprint: 0,      // iPhones don't have fingerprint (Touch ID removed post-X)
};

// Android software deductions (INR)
const ANDROID_SOFTWARE_DEDUCTIONS: Record<string, number> = {
  wifi:        2000,
  mic:         2200,
  faceid:      1500,   // Face unlock — cheaper sensors
  charge:      2500,
  camera:      3000,
  bluetooth:   1800,
  fingerprint: 2200,
};

// ──────────────────────────────────────────────
// ACCESSORIES BONUSES (same for all brands)
// ──────────────────────────────────────────────

const ACCESSORY_BONUSES: Record<string, number> = {
  box:      500,
  charger:  300,
  invoice:  400,
  warranty: 800,
};

// ──────────────────────────────────────────────
// BATTERY DEDUCTIONS
// ──────────────────────────────────────────────

// Apple: tiered by exact battery health %
function appleBatteryDeduction(healthPercent: number): number {
  if (healthPercent >= 95) return 0;
  if (healthPercent >= 90) return 800;
  if (healthPercent >= 85) return 1800;
  if (healthPercent >= 80) return 3500;
  if (healthPercent >= 75) return 5500;
  return 8000;  // below 75% — battery replacement needed
}

// Android: qualitative deduction
const ANDROID_BATTERY_DEDUCTIONS: Record<string, number> = {
  High:    0,
  Average: 1200,
  Poor:    3000,
};

// ──────────────────────────────────────────────
// REQUEST / RESPONSE INTERFACES
// ──────────────────────────────────────────────

export interface PriceCalculationRequest {
  modelId:       string;
  brandId:       string;
  variantId:     string;
  mobileTurnsOn: boolean;
  accessories: {
    box:      boolean;
    charger:  boolean;
    invoice:  boolean;
    warranty: boolean;
  };
  hardwareDefects: string[];
  softwareDefects: string[];
  batteryHealth?:  number | null;
  batteryQuality?: "Poor" | "Average" | "High" | null;
  deviceAge:       string;
}

export interface PriceBreakdownItem {
  label:  string;
  amount: number;
  type:   "base" | "bonus" | "deduction";
}

export interface PriceCalculationResponse {
  success:    boolean;
  basePrice:  number;
  finalPrice: number;
  breakdown:  PriceBreakdownItem[];
}

// ──────────────────────────────────────────────
// HANDLER
// ──────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const body: PriceCalculationRequest = await request.json();

    const {
      modelId, brandId, variantId, mobileTurnsOn,
      accessories, hardwareDefects, softwareDefects,
      batteryHealth, batteryQuality, deviceAge,
    } = body;

    // Basic field validation
    if (!modelId || !brandId || !variantId || !deviceAge) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: modelId, brandId, variantId, deviceAge" },
        { status: 400 }
      );
    }

    const isApple = APPLE_BRANDS.has(brandId);

    // ── Scrap value if device won't turn on ──
    if (!mobileTurnsOn) {
      return NextResponse.json({
        success: true,
        basePrice: 0,
        finalPrice: 3000,
        breakdown: [
          { label: "Device does not turn on (Scrap Value)", amount: 3000, type: "base" },
        ],
      } satisfies PriceCalculationResponse);
    }

    const breakdown: PriceBreakdownItem[] = [];

    // 1. Base price
    const modelBase = MODEL_BASE_PRICES[modelId];
    if (!modelBase) {
      return NextResponse.json(
        { success: false, error: `Unknown model: ${modelId}` },
        { status: 400 }
      );
    }
    breakdown.push({ label: "Base device value", amount: modelBase, type: "base" });

    // 2. Variant multiplier
    const variantMultiplier  = VARIANT_MULTIPLIERS[variantId] ?? 1.0;
    const variantAdjustedPrice = Math.round(modelBase * variantMultiplier);
    const variantDiff = variantAdjustedPrice - modelBase;
    if (variantDiff !== 0) {
      breakdown.push({
        label: `Variant adjustment (${variantId.replace("_", "GB / ")}GB)`,
        amount: variantDiff,
        type:   variantDiff > 0 ? "bonus" : "deduction",
      });
    }

    let total = variantAdjustedPrice;

    // 3. Accessory bonuses
    for (const [key, hasIt] of Object.entries(accessories)) {
      if (hasIt && ACCESSORY_BONUSES[key]) {
        const bonus = ACCESSORY_BONUSES[key];
        total += bonus;
        breakdown.push({ label: `Has original ${key}`, amount: bonus, type: "bonus" });
      }
    }

    // 4. Age depreciation
    const agePct = AGE_DEDUCTIONS[deviceAge] ?? 0;
    const ageDed = Math.round(variantAdjustedPrice * agePct);
    if (ageDed > 0) {
      total -= ageDed;
      breakdown.push({ label: "Device age depreciation", amount: -ageDed, type: "deduction" });
    }

    // 5. Battery deduction (brand-specific)
    if (isApple && batteryHealth != null) {
      const batDed = appleBatteryDeduction(batteryHealth);
      if (batDed > 0) {
        total -= batDed;
        breakdown.push({
          label: `iPhone battery health (${batteryHealth}%)`,
          amount: -batDed, type: "deduction",
        });
      }
    } else if (!isApple && batteryQuality) {
      const batDed = ANDROID_BATTERY_DEDUCTIONS[batteryQuality] ?? 0;
      if (batDed > 0) {
        total -= batDed;
        breakdown.push({
          label: `Battery condition — ${batteryQuality}`,
          amount: -batDed, type: "deduction",
        });
      }
    }

    // 6. Hardware defects (brand-specific rates)
    const hwTable = isApple ? IPHONE_HARDWARE_DEDUCTIONS : ANDROID_HARDWARE_DEDUCTIONS;
    for (const defectId of hardwareDefects) {
      const ded = hwTable[defectId];
      if (ded) {
        total -= ded;
        breakdown.push({
          label: `Hardware issue: ${defectId}${isApple ? " (iPhone rate)" : " (Android rate)"}`,
          amount: -ded, type: "deduction",
        });
      }
    }

    // 7. Software defects (brand-specific rates)
    const swTable = isApple ? IPHONE_SOFTWARE_DEDUCTIONS : ANDROID_SOFTWARE_DEDUCTIONS;
    for (const defectId of softwareDefects) {
      const ded = swTable[defectId];
      if (ded) {
        total -= ded;
        breakdown.push({
          label: `Software issue: ${defectId}${isApple ? " (iPhone rate)" : " (Android rate)"}`,
          amount: -ded, type: "deduction",
        });
      }
    }

    // Floor price
    const finalPrice = Math.max(500, total);

    return NextResponse.json({
      success: true,
      basePrice: modelBase,
      finalPrice,
      breakdown,
    } satisfies PriceCalculationResponse);

  } catch (err) {
    console.error("[/api/sell/calculate] Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
