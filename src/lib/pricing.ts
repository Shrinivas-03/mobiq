// ──────────────────────────────────────────────
// SHARED PRICING ENGINE
// Used by both /api/sell/calculate (preview) and
// /api/sell/submit (server-side validation).
// ──────────────────────────────────────────────

export interface ModelPricingConfig {
  basePrice: number;
  variantMultipliers: Record<string, number>;
  ageDeductions: Record<string, number>;
  battery: {
    type: "iphone" | "android";
    deductions?: Record<string, number>;
    iphoneDeductions?: Record<string, number>;
  };
  hardware: Record<string, number>;
  software: Record<string, number>;
  accessories?: Record<string, number>;
}

export const MODEL_PRICING: Record<string, ModelPricingConfig> = {
  ip15pm: {
    basePrice: 85000,
    variantMultipliers: {
      "6_128":  0.85,
      "8_128":  0.90,
      "8_256":  1.00,
      "12_256": 1.08,
      "12_512": 1.15,
    },
    ageDeductions: {
      "0_3":     0.05,
      "3_6":     0.12,
      "6_11":    0.22,
      "11_plus": 0.38,
    },
    battery: {
      type: "iphone",
    },
    hardware: {
      screen: 7000,
      dead:   8000,
      body:   2000,
      panel:  6000,
      touch:  6500,
      button: 2500,
      bent:   5000,
      loose:  4000,
    },
    software: {
      wifi:        3000,
      mic:         3500,
      faceid:      5000,
      charge:      3000,
      camera:      4500,
      bluetooth:   2500,
      fingerprint: 0,
    },
  },
  ip15p: {
    basePrice: 75000,
    variantMultipliers: {
      "6_128":  0.85,
      "8_128":  0.90,
      "8_256":  1.00,
      "12_256": 1.08,
      "12_512": 1.15,
    },
    ageDeductions: {
      "0_3":     0.05,
      "3_6":     0.12,
      "6_11":    0.22,
      "11_plus": 0.38,
    },
    battery: {
      type: "iphone",
    },
    hardware: {
      screen: 7000,
      dead:   8000,
      body:   2000,
      panel:  6000,
      touch:  6500,
      button: 2500,
      bent:   5000,
      loose:  4000,
    },
    software: {
      wifi:        3000,
      mic:         3500,
      faceid:      5000,
      charge:      3000,
      camera:      4500,
      bluetooth:   2500,
      fingerprint: 0,
    },
  },
  ip15: {
    basePrice: 60000,
    variantMultipliers: {
      "6_128":  0.85,
      "8_128":  0.90,
      "8_256":  1.00,
      "12_256": 1.08,
      "12_512": 1.15,
    },
    ageDeductions: {
      "0_3":     0.05,
      "3_6":     0.12,
      "6_11":    0.22,
      "11_plus": 0.38,
    },
    battery: {
      type: "iphone",
    },
    hardware: {
      screen: 7000,
      dead:   8000,
      body:   2000,
      panel:  6000,
      touch:  6500,
      button: 2500,
      bent:   5000,
      loose:  4000,
    },
    software: {
      wifi:        3000,
      mic:         3500,
      faceid:      5000,
      charge:      3000,
      camera:      4500,
      bluetooth:   2500,
      fingerprint: 0,
    },
  },
  ip14pm: {
    basePrice: 55000,
    variantMultipliers: {
      "6_128":  0.85,
      "8_128":  0.90,
      "8_256":  1.00,
      "12_256": 1.08,
      "12_512": 1.15,
    },
    ageDeductions: {
      "0_3":     0.05,
      "3_6":     0.12,
      "6_11":    0.22,
      "11_plus": 0.38,
    },
    battery: {
      type: "iphone",
    },
    hardware: {
      screen: 7000,
      dead:   8000,
      body:   2000,
      panel:  6000,
      touch:  6500,
      button: 2500,
      bent:   5000,
      loose:  4000,
    },
    software: {
      wifi:        3000,
      mic:         3500,
      faceid:      5000,
      charge:      3000,
      camera:      4500,
      bluetooth:   2500,
      fingerprint: 0,
    },
  },
  ip14: {
    basePrice: 40000,
    variantMultipliers: {
      "6_128":  0.85,
      "8_128":  0.90,
      "8_256":  1.00,
      "12_256": 1.08,
      "12_512": 1.15,
    },
    ageDeductions: {
      "0_3":     0.05,
      "3_6":     0.12,
      "6_11":    0.22,
      "11_plus": 0.38,
    },
    battery: {
      type: "iphone",
    },
    hardware: {
      screen: 7000,
      dead:   8000,
      body:   2000,
      panel:  6000,
      touch:  6500,
      button: 2500,
      bent:   5000,
      loose:  4000,
    },
    software: {
      wifi:        3000,
      mic:         3500,
      faceid:      5000,
      charge:      3000,
      camera:      4500,
      bluetooth:   2500,
      fingerprint: 0,
    },
  },
  s24u: {
    basePrice: 70000,
    variantMultipliers: {
      "6_128":  0.85,
      "8_128":  0.90,
      "8_256":  1.00,
      "12_256": 1.08,
      "12_512": 1.15,
    },
    ageDeductions: {
      "0_3":     0.05,
      "3_6":     0.12,
      "6_11":    0.22,
      "11_plus": 0.38,
    },
    battery: {
      type: "android",
    },
    hardware: {
      screen: 4000,
      dead:   5000,
      body:   1200,
      panel:  3000,
      touch:  3500,
      button: 1000,
      bent:   2500,
      loose:  2000,
    },
    software: {
      wifi:        2000,
      mic:         2200,
      faceid:      1500,
      charge:      2500,
      camera:      3000,
      bluetooth:   1800,
      fingerprint: 2200,
    },
  },
  s24: {
    basePrice: 50000,
    variantMultipliers: {
      "6_128":  0.85,
      "8_128":  0.90,
      "8_256":  1.00,
      "12_256": 1.08,
      "12_512": 1.15,
    },
    ageDeductions: {
      "0_3":     0.05,
      "3_6":     0.12,
      "6_11":    0.22,
      "11_plus": 0.38,
    },
    battery: {
      type: "android",
    },
    hardware: {
      screen: 4000,
      dead:   5000,
      body:   1200,
      panel:  3000,
      touch:  3500,
      button: 1000,
      bent:   2500,
      loose:  2000,
    },
    software: {
      wifi:        2000,
      mic:         2200,
      faceid:      1500,
      charge:      2500,
      camera:      3000,
      bluetooth:   1800,
      fingerprint: 2200,
    },
  },
  s23u: {
    basePrice: 55000,
    variantMultipliers: {
      "6_128":  0.85,
      "8_128":  0.90,
      "8_256":  1.00,
      "12_256": 1.08,
      "12_512": 1.15,
    },
    ageDeductions: {
      "0_3":     0.05,
      "3_6":     0.12,
      "6_11":    0.22,
      "11_plus": 0.38,
    },
    battery: {
      type: "android",
    },
    hardware: {
      screen: 4000,
      dead:   5000,
      body:   1200,
      panel:  3000,
      touch:  3500,
      button: 1000,
      bent:   2500,
      loose:  2000,
    },
    software: {
      wifi:        2000,
      mic:         2200,
      faceid:      1500,
      charge:      2500,
      camera:      3000,
      bluetooth:   1800,
      fingerprint: 2200,
    },
  },
  p8p: {
    basePrice: 50000,
    variantMultipliers: {
      "6_128":  0.85,
      "8_128":  0.90,
      "8_256":  1.00,
      "12_256": 1.08,
      "12_512": 1.15,
    },
    ageDeductions: {
      "0_3":     0.05,
      "3_6":     0.12,
      "6_11":    0.22,
      "11_plus": 0.38,
    },
    battery: {
      type: "android",
    },
    hardware: {
      screen: 4000,
      dead:   5000,
      body:   1200,
      panel:  3000,
      touch:  3500,
      button: 1000,
      bent:   2500,
      loose:  2000,
    },
    software: {
      wifi:        2000,
      mic:         2200,
      faceid:      1500,
      charge:      2500,
      camera:      3000,
      bluetooth:   1800,
      fingerprint: 2200,
    },
  },
  p8: {
    basePrice: 38000,
    variantMultipliers: {
      "6_128":  0.85,
      "8_128":  0.90,
      "8_256":  1.00,
      "12_256": 1.08,
      "12_512": 1.15,
    },
    ageDeductions: {
      "0_3":     0.05,
      "3_6":     0.12,
      "6_11":    0.22,
      "11_plus": 0.38,
    },
    battery: {
      type: "android",
    },
    hardware: {
      screen: 4000,
      dead:   5000,
      body:   1200,
      panel:  3000,
      touch:  3500,
      button: 1000,
      bent:   2500,
      loose:  2000,
    },
    software: {
      wifi:        2000,
      mic:         2200,
      faceid:      1500,
      charge:      2500,
      camera:      3000,
      bluetooth:   1800,
      fingerprint: 2200,
    },
  },
  p7p: {
    basePrice: 35000,
    variantMultipliers: {
      "6_128":  0.85,
      "8_128":  0.90,
      "8_256":  1.00,
      "12_256": 1.08,
      "12_512": 1.15,
    },
    ageDeductions: {
      "0_3":     0.05,
      "3_6":     0.12,
      "6_11":    0.22,
      "11_plus": 0.38,
    },
    battery: {
      type: "android",
    },
    hardware: {
      screen: 4000,
      dead:   5000,
      body:   1200,
      panel:  3000,
      touch:  3500,
      button: 1000,
      bent:   2500,
      loose:  2000,
    },
    software: {
      wifi:        2000,
      mic:         2200,
      faceid:      1500,
      charge:      2500,
      camera:      3000,
      bluetooth:   1800,
      fingerprint: 2200,
    },
  },
  op12: {
    basePrice: 52000,
    variantMultipliers: {
      "6_128":  0.85,
      "8_128":  0.90,
      "8_256":  1.00,
      "12_256": 1.08,
      "12_512": 1.15,
    },
    ageDeductions: {
      "0_3":     0.05,
      "3_6":     0.12,
      "6_11":    0.22,
      "11_plus": 0.38,
    },
    battery: {
      type: "android",
    },
    hardware: {
      screen: 4000,
      dead:   5000,
      body:   1200,
      panel:  3000,
      touch:  3500,
      button: 1000,
      bent:   2500,
      loose:  2000,
    },
    software: {
      wifi:        2000,
      mic:         2200,
      faceid:      1500,
      charge:      2500,
      camera:      3000,
      bluetooth:   1800,
      fingerprint: 2200,
    },
  },
  op12r: {
    basePrice: 35000,
    variantMultipliers: {
      "6_128":  0.85,
      "8_128":  0.90,
      "8_256":  1.00,
      "12_256": 1.08,
      "12_512": 1.15,
    },
    ageDeductions: {
      "0_3":     0.05,
      "3_6":     0.12,
      "6_11":    0.22,
      "11_plus": 0.38,
    },
    battery: {
      type: "android",
    },
    hardware: {
      screen: 4000,
      dead:   5000,
      body:   1200,
      panel:  3000,
      touch:  3500,
      button: 1000,
      bent:   2500,
      loose:  2000,
    },
    software: {
      wifi:        2000,
      mic:         2200,
      faceid:      1500,
      charge:      2500,
      camera:      3000,
      bluetooth:   1800,
      fingerprint: 2200,
    },
  },
  op11: {
    basePrice: 38000,
    variantMultipliers: {
      "6_128":  0.85,
      "8_128":  0.90,
      "8_256":  1.00,
      "12_256": 1.08,
      "12_512": 1.15,
    },
    ageDeductions: {
      "0_3":     0.05,
      "3_6":     0.12,
      "6_11":    0.22,
      "11_plus": 0.38,
    },
    battery: {
      type: "android",
    },
    hardware: {
      screen: 4000,
      dead:   5000,
      body:   1200,
      panel:  3000,
      touch:  3500,
      button: 1000,
      bent:   2500,
      loose:  2000,
    },
    software: {
      wifi:        2000,
      mic:         2200,
      faceid:      1500,
      charge:      2500,
      camera:      3000,
      bluetooth:   1800,
      fingerprint: 2200,
    },
  },
  mi14u: {
    basePrice: 75000,
    variantMultipliers: {
      "6_128":  0.85,
      "8_128":  0.90,
      "8_256":  1.00,
      "12_256": 1.08,
      "12_512": 1.15,
    },
    ageDeductions: {
      "0_3":     0.05,
      "3_6":     0.12,
      "6_11":    0.22,
      "11_plus": 0.38,
    },
    battery: {
      type: "android",
    },
    hardware: {
      screen: 4000,
      dead:   5000,
      body:   1200,
      panel:  3000,
      touch:  3500,
      button: 1000,
      bent:   2500,
      loose:  2000,
    },
    software: {
      wifi:        2000,
      mic:         2200,
      faceid:      1500,
      charge:      2500,
      camera:      3000,
      bluetooth:   1800,
      fingerprint: 2200,
    },
  },
  mi14: {
    basePrice: 50000,
    variantMultipliers: {
      "6_128":  0.85,
      "8_128":  0.90,
      "8_256":  1.00,
      "12_256": 1.08,
      "12_512": 1.15,
    },
    ageDeductions: {
      "0_3":     0.05,
      "3_6":     0.12,
      "6_11":    0.22,
      "11_plus": 0.38,
    },
    battery: {
      type: "android",
    },
    hardware: {
      screen: 4000,
      dead:   5000,
      body:   1200,
      panel:  3000,
      touch:  3500,
      button: 1000,
      bent:   2500,
      loose:  2000,
    },
    software: {
      wifi:        2000,
      mic:         2200,
      faceid:      1500,
      charge:      2500,
      camera:      3000,
      bluetooth:   1800,
      fingerprint: 2200,
    },
  },
  mi13p: {
    basePrice: 45000,
    variantMultipliers: {
      "6_128":  0.85,
      "8_128":  0.90,
      "8_256":  1.00,
      "12_256": 1.08,
      "12_512": 1.15,
    },
    ageDeductions: {
      "0_3":     0.05,
      "3_6":     0.12,
      "6_11":    0.22,
      "11_plus": 0.38,
    },
    battery: {
      type: "android",
    },
    hardware: {
      screen: 4000,
      dead:   5000,
      body:   1200,
      panel:  3000,
      touch:  3500,
      button: 1000,
      bent:   2500,
      loose:  2000,
    },
    software: {
      wifi:        2000,
      mic:         2200,
      faceid:      1500,
      charge:      2500,
      camera:      3000,
      bluetooth:   1800,
      fingerprint: 2200,
    },
  },
  vx100p: {
    basePrice: 65000,
    variantMultipliers: {
      "6_128":  0.85,
      "8_128":  0.90,
      "8_256":  1.00,
      "12_256": 1.08,
      "12_512": 1.15,
    },
    ageDeductions: {
      "0_3":     0.05,
      "3_6":     0.12,
      "6_11":    0.22,
      "11_plus": 0.38,
    },
    battery: {
      type: "android",
    },
    hardware: {
      screen: 4000,
      dead:   5000,
      body:   1200,
      panel:  3000,
      touch:  3500,
      button: 1000,
      bent:   2500,
      loose:  2000,
    },
    software: {
      wifi:        2000,
      mic:         2200,
      faceid:      1500,
      charge:      2500,
      camera:      3000,
      bluetooth:   1800,
      fingerprint: 2200,
    },
  },
  vx100: {
    basePrice: 48000,
    variantMultipliers: {
      "6_128":  0.85,
      "8_128":  0.90,
      "8_256":  1.00,
      "12_256": 1.08,
      "12_512": 1.15,
    },
    ageDeductions: {
      "0_3":     0.05,
      "3_6":     0.12,
      "6_11":    0.22,
      "11_plus": 0.38,
    },
    battery: {
      type: "android",
    },
    hardware: {
      screen: 4000,
      dead:   5000,
      body:   1200,
      panel:  3000,
      touch:  3500,
      button: 1000,
      bent:   2500,
      loose:  2000,
    },
    software: {
      wifi:        2000,
      mic:         2200,
      faceid:      1500,
      charge:      2500,
      camera:      3000,
      bluetooth:   1800,
      fingerprint: 2200,
    },
  },
  vv29: {
    basePrice: 25000,
    variantMultipliers: {
      "6_128":  0.85,
      "8_128":  0.90,
      "8_256":  1.00,
      "12_256": 1.08,
      "12_512": 1.15,
    },
    ageDeductions: {
      "0_3":     0.05,
      "3_6":     0.12,
      "6_11":    0.22,
      "11_plus": 0.38,
    },
    battery: {
      type: "android",
    },
    hardware: {
      screen: 4000,
      dead:   5000,
      body:   1200,
      panel:  3000,
      touch:  3500,
      button: 1000,
      bent:   2500,
      loose:  2000,
    },
    software: {
      wifi:        2000,
      mic:         2200,
      faceid:      1500,
      charge:      2500,
      camera:      3000,
      bluetooth:   1800,
      fingerprint: 2200,
    },
  },
  findn3: {
    basePrice: 60000,
    variantMultipliers: {
      "6_128":  0.85,
      "8_128":  0.90,
      "8_256":  1.00,
      "12_256": 1.08,
      "12_512": 1.15,
    },
    ageDeductions: {
      "0_3":     0.05,
      "3_6":     0.12,
      "6_11":    0.22,
      "11_plus": 0.38,
    },
    battery: {
      type: "android",
    },
    hardware: {
      screen: 4000,
      dead:   5000,
      body:   1200,
      panel:  3000,
      touch:  3500,
      button: 1000,
      bent:   2500,
      loose:  2000,
    },
    software: {
      wifi:        2000,
      mic:         2200,
      faceid:      1500,
      charge:      2500,
      camera:      3000,
      bluetooth:   1800,
      fingerprint: 2200,
    },
  },
  reno11p: {
    basePrice: 30000,
    variantMultipliers: {
      "6_128":  0.85,
      "8_128":  0.90,
      "8_256":  1.00,
      "12_256": 1.08,
      "12_512": 1.15,
    },
    ageDeductions: {
      "0_3":     0.05,
      "3_6":     0.12,
      "6_11":    0.22,
      "11_plus": 0.38,
    },
    battery: {
      type: "android",
    },
    hardware: {
      screen: 4000,
      dead:   5000,
      body:   1200,
      panel:  3000,
      touch:  3500,
      button: 1000,
      bent:   2500,
      loose:  2000,
    },
    software: {
      wifi:        2000,
      mic:         2200,
      faceid:      1500,
      charge:      2500,
      camera:      3000,
      bluetooth:   1800,
      fingerprint: 2200,
    },
  },
  reno11: {
    basePrice: 22000,
    variantMultipliers: {
      "6_128":  0.85,
      "8_128":  0.90,
      "8_256":  1.00,
      "12_256": 1.08,
      "12_512": 1.15,
    },
    ageDeductions: {
      "0_3":     0.05,
      "3_6":     0.12,
      "6_11":    0.22,
      "11_plus": 0.38,
    },
    battery: {
      type: "android",
    },
    hardware: {
      screen: 4000,
      dead:   5000,
      body:   1200,
      panel:  3000,
      touch:  3500,
      button: 1000,
      bent:   2500,
      loose:  2000,
    },
    software: {
      wifi:        2000,
      mic:         2200,
      faceid:      1500,
      charge:      2500,
      camera:      3000,
      bluetooth:   1800,
      fingerprint: 2200,
    },
  },
  rm12p: {
    basePrice: 24000,
    variantMultipliers: {
      "6_128":  0.85,
      "8_128":  0.90,
      "8_256":  1.00,
      "12_256": 1.08,
      "12_512": 1.15,
    },
    ageDeductions: {
      "0_3":     0.05,
      "3_6":     0.12,
      "6_11":    0.22,
      "11_plus": 0.38,
    },
    battery: {
      type: "android",
    },
    hardware: {
      screen: 4000,
      dead:   5000,
      body:   1200,
      panel:  3000,
      touch:  3500,
      button: 1000,
      bent:   2500,
      loose:  2000,
    },
    software: {
      wifi:        2000,
      mic:         2200,
      faceid:      1500,
      charge:      2500,
      camera:      3000,
      bluetooth:   1800,
      fingerprint: 2200,
    },
  },
  rm12: {
    basePrice: 15000,
    variantMultipliers: {
      "6_128":  0.85,
      "8_128":  0.90,
      "8_256":  1.00,
      "12_256": 1.08,
      "12_512": 1.15,
    },
    ageDeductions: {
      "0_3":     0.05,
      "3_6":     0.12,
      "6_11":    0.22,
      "11_plus": 0.38,
    },
    battery: {
      type: "android",
    },
    hardware: {
      screen: 4000,
      dead:   5000,
      body:   1200,
      panel:  3000,
      touch:  3500,
      button: 1000,
      bent:   2500,
      loose:  2000,
    },
    software: {
      wifi:        2000,
      mic:         2200,
      faceid:      1500,
      charge:      2500,
      camera:      3000,
      bluetooth:   1800,
      fingerprint: 2200,
    },
  },
  rm11p: {
    basePrice: 18000,
    variantMultipliers: {
      "6_128":  0.85,
      "8_128":  0.90,
      "8_256":  1.00,
      "12_256": 1.08,
      "12_512": 1.15,
    },
    ageDeductions: {
      "0_3":     0.05,
      "3_6":     0.12,
      "6_11":    0.22,
      "11_plus": 0.38,
    },
    battery: {
      type: "android",
    },
    hardware: {
      screen: 4000,
      dead:   5000,
      body:   1200,
      panel:  3000,
      touch:  3500,
      button: 1000,
      bent:   2500,
      loose:  2000,
    },
    software: {
      wifi:        2000,
      mic:         2200,
      faceid:      1500,
      charge:      2500,
      camera:      3000,
      bluetooth:   1800,
      fingerprint: 2200,
    },
  },
  iq12: {
    basePrice: 42000,
    variantMultipliers: {
      "6_128":  0.85,
      "8_128":  0.90,
      "8_256":  1.00,
      "12_256": 1.08,
      "12_512": 1.15,
    },
    ageDeductions: {
      "0_3":     0.05,
      "3_6":     0.12,
      "6_11":    0.22,
      "11_plus": 0.38,
    },
    battery: {
      type: "android",
    },
    hardware: {
      screen: 4000,
      dead:   5000,
      body:   1200,
      panel:  3000,
      touch:  3500,
      button: 1000,
      bent:   2500,
      loose:  2000,
    },
    software: {
      wifi:        2000,
      mic:         2200,
      faceid:      1500,
      charge:      2500,
      camera:      3000,
      bluetooth:   1800,
      fingerprint: 2200,
    },
  },
  iqneo9: {
    basePrice: 28000,
    variantMultipliers: {
      "6_128":  0.85,
      "8_128":  0.90,
      "8_256":  1.00,
      "12_256": 1.08,
      "12_512": 1.15,
    },
    ageDeductions: {
      "0_3":     0.05,
      "3_6":     0.12,
      "6_11":    0.22,
      "11_plus": 0.38,
    },
    battery: {
      type: "android",
    },
    hardware: {
      screen: 4000,
      dead:   5000,
      body:   1200,
      panel:  3000,
      touch:  3500,
      button: 1000,
      bent:   2500,
      loose:  2000,
    },
    software: {
      wifi:        2000,
      mic:         2200,
      faceid:      1500,
      charge:      2500,
      camera:      3000,
      bluetooth:   1800,
      fingerprint: 2200,
    },
  },
  iq11: {
    basePrice: 32000,
    variantMultipliers: {
      "6_128":  0.85,
      "8_128":  0.90,
      "8_256":  1.00,
      "12_256": 1.08,
      "12_512": 1.15,
    },
    ageDeductions: {
      "0_3":     0.05,
      "3_6":     0.12,
      "6_11":    0.22,
      "11_plus": 0.38,
    },
    battery: {
      type: "android",
    },
    hardware: {
      screen: 4000,
      dead:   5000,
      body:   1200,
      panel:  3000,
      touch:  3500,
      button: 1000,
      bent:   2500,
      loose:  2000,
    },
    software: {
      wifi:        2000,
      mic:         2200,
      faceid:      1500,
      charge:      2500,
      camera:      3000,
      bluetooth:   1800,
      fingerprint: 2200,
    },
  },
  motoe50: {
    basePrice: 27000,
    variantMultipliers: {
      "6_128":  0.85,
      "8_128":  0.90,
      "8_256":  1.00,
      "12_256": 1.08,
      "12_512": 1.15,
    },
    ageDeductions: {
      "0_3":     0.05,
      "3_6":     0.12,
      "6_11":    0.22,
      "11_plus": 0.38,
    },
    battery: {
      type: "android",
    },
    hardware: {
      screen: 4000,
      dead:   5000,
      body:   1200,
      panel:  3000,
      touch:  3500,
      button: 1000,
      bent:   2500,
      loose:  2000,
    },
    software: {
      wifi:        2000,
      mic:         2200,
      faceid:      1500,
      charge:      2500,
      camera:      3000,
      bluetooth:   1800,
      fingerprint: 2200,
    },
  },
  motoe40: {
    basePrice: 20000,
    variantMultipliers: {
      "6_128":  0.85,
      "8_128":  0.90,
      "8_256":  1.00,
      "12_256": 1.08,
      "12_512": 1.15,
    },
    ageDeductions: {
      "0_3":     0.05,
      "3_6":     0.12,
      "6_11":    0.22,
      "11_plus": 0.38,
    },
    battery: {
      type: "android",
    },
    hardware: {
      screen: 4000,
      dead:   5000,
      body:   1200,
      panel:  3000,
      touch:  3500,
      button: 1000,
      bent:   2500,
      loose:  2000,
    },
    software: {
      wifi:        2000,
      mic:         2200,
      faceid:      1500,
      charge:      2500,
      camera:      3000,
      bluetooth:   1800,
      fingerprint: 2200,
    },
  },
  razr40: {
    basePrice: 45000,
    variantMultipliers: {
      "6_128":  0.85,
      "8_128":  0.90,
      "8_256":  1.00,
      "12_256": 1.08,
      "12_512": 1.15,
    },
    ageDeductions: {
      "0_3":     0.05,
      "3_6":     0.12,
      "6_11":    0.22,
      "11_plus": 0.38,
    },
    battery: {
      type: "android",
    },
    hardware: {
      screen: 4000,
      dead:   5000,
      body:   1200,
      panel:  3000,
      touch:  3500,
      button: 1000,
      bent:   2500,
      loose:  2000,
    },
    software: {
      wifi:        2000,
      mic:         2200,
      faceid:      1500,
      charge:      2500,
      camera:      3000,
      bluetooth:   1800,
      fingerprint: 2200,
    },
  },
};

const ACCESSORY_BONUSES: Record<string, number> = {
  box:      500,
  charger:  300,
  invoice:  400,
  warranty: 800,
};

function appleBatteryDeduction(healthPercent: number): number {
  if (healthPercent >= 95) return 0;
  if (healthPercent >= 90) return 800;
  if (healthPercent >= 85) return 1800;
  if (healthPercent >= 80) return 3500;
  if (healthPercent >= 75) return 5500;
  return 8000;
}

const ANDROID_BATTERY_DEDUCTIONS: Record<string, number> = {
  High:    0,
  Average: 1200,
  Poor:    3000,
};

// ──────────────────────────────────────────────
// PUBLIC TYPES
// ──────────────────────────────────────────────

export interface PricingInput {
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
  batteryQuality?: string | null;
  deviceAge:       string;
}

export interface PriceBreakdownItem {
  label:  string;
  amount: number;
  type:   "base" | "bonus" | "deduction";
}

export interface PricingResult {
  success:    true;
  basePrice:  number;
  finalPrice: number;
  breakdown:  PriceBreakdownItem[];
}

export interface PricingError {
  success: false;
  error:   string;
}

// ──────────────────────────────────────────────
// CORE CALCULATION FUNCTION
// ──────────────────────────────────────────────

export function calculatePrice(input: PricingInput, customModelConfig?: ModelPricingConfig): PricingResult | PricingError {
  const {
    modelId, brandId, variantId, mobileTurnsOn,
    accessories, hardwareDefects, softwareDefects,
    batteryHealth, batteryQuality, deviceAge,
  } = input;

  if (!modelId || !brandId || !variantId || !deviceAge) {
    return { success: false, error: "Missing required fields: modelId, brandId, variantId, deviceAge" };
  }

  // Load the model config (from custom config passed in, or static MODEL_PRICING, or dynamic fallback)
  let model = customModelConfig ?? MODEL_PRICING[modelId];

  if (!model) {
    // Generate dynamic fallback config if not in static object
    const isIphone = brandId === "apple" || modelId.startsWith("ip");
    const basePrice = 30000;
    model = {
      basePrice,
      variantMultipliers: { "6_128": 0.85, "8_128": 0.9, "8_256": 1.0, "12_256": 1.08, "12_512": 1.15 },
      ageDeductions: { "0_3": 0.05, "3_6": 0.12, "6_11": 0.22, "11_plus": 0.38 },
      battery: { type: isIphone ? "iphone" : "android" },
      hardware: { screen: 3000, dead: 3500, body: 1200, panel: 2400, touch: 2700, button: 1000, bent: 2000, loose: 1500 },
      software: { wifi: 1200, mic: 1200, faceid: 2500, charge: 1200, camera: 2000, bluetooth: 1000, fingerprint: 1200 },
    };
  }

  // Scrap value if device won't turn on
  if (!mobileTurnsOn) {
    return {
      success:    true,
      basePrice:  0,
      finalPrice: 3000,
      breakdown:  [{ label: "Device does not turn on (Scrap Value)", amount: 3000, type: "base" }],
    };
  }

  const breakdown: PriceBreakdownItem[] = [];

  // 1. Base price
  const modelBase = model.basePrice;
  breakdown.push({ label: "Base device value", amount: modelBase, type: "base" });

  // 2. Variant multiplier
  const variantMultiplier = model.variantMultipliers[variantId] ?? 1.0;
  const variantAdjustedPrice = Math.round(modelBase * variantMultiplier);
  const variantDiff = variantAdjustedPrice - modelBase;
  if (variantDiff !== 0) {
    breakdown.push({
      label:  "Variant adjustment (" + variantId.replace("_", "GB / ") + "GB)",
      amount: variantDiff,
      type:   variantDiff > 0 ? "bonus" : "deduction",
    });
  }

  let total = variantAdjustedPrice;

  // 3. Accessory bonuses
  const activeAccessoryBonuses = model.accessories ?? ACCESSORY_BONUSES;
  for (const [key, hasIt] of Object.entries(accessories)) {
    if (hasIt && activeAccessoryBonuses[key]) {
      const bonus = activeAccessoryBonuses[key];
      total += bonus;
      breakdown.push({ label: "Has original " + key, amount: bonus, type: "bonus" });
    }
  }

  // 4. Age depreciation
  const agePct  = model.ageDeductions[deviceAge] ?? 0;
  const ageDed  = Math.round(variantAdjustedPrice * agePct);
  if (ageDed > 0) {
    total -= ageDed;
    breakdown.push({ label: "Device age depreciation", amount: -ageDed, type: "deduction" });
  }

  // 5. Battery deduction
  if (model.battery.type === "iphone" && batteryHealth != null) {
    let batDed = 0;
    if (model.battery.iphoneDeductions) {
      const curve = model.battery.iphoneDeductions;
      if (batteryHealth >= 95) batDed = curve["95_100"] ?? 0;
      else if (batteryHealth >= 90) batDed = curve["90_94"] ?? 800;
      else if (batteryHealth >= 85) batDed = curve["85_89"] ?? 1800;
      else if (batteryHealth >= 80) batDed = curve["80_84"] ?? 3500;
      else if (batteryHealth >= 75) batDed = curve["75_79"] ?? 5500;
      else batDed = curve["below_75"] ?? 8000;
    } else {
      batDed = appleBatteryDeduction(batteryHealth);
    }

    if (batDed > 0) {
      total -= batDed;
      breakdown.push({
        label:  "iPhone battery health (" + batteryHealth + "%)",
        amount: -batDed,
        type:   "deduction",
      });
    }
  } else if (model.battery.type === "android" && batteryQuality) {
    const activeAndroidBatteryDeductions = model.battery.deductions ?? ANDROID_BATTERY_DEDUCTIONS;
    const batDed = activeAndroidBatteryDeductions[batteryQuality] ?? 0;
    if (batDed > 0) {
      total -= batDed;
      breakdown.push({
        label:  "Battery condition — " + batteryQuality,
        amount: -batDed,
        type:   "deduction",
      });
    }
  }

  // 6. Hardware defects
  for (const defectId of hardwareDefects) {
    const ded = model.hardware[defectId];
    if (ded) {
      total -= ded;
      breakdown.push({
        label:  "Hardware issue: " + defectId + (model.battery.type === "iphone" ? " (iPhone rate)" : " (Android rate)"),
        amount: -ded,
        type:   "deduction",
      });
    }
  }

  // 7. Software defects
  for (const defectId of softwareDefects) {
    const ded = model.software[defectId];
    if (ded) {
      total -= ded;
      breakdown.push({
        label:  "Software issue: " + defectId + (model.battery.type === "iphone" ? " (iPhone rate)" : " (Android rate)"),
        amount: -ded,
        type:   "deduction",
      });
    }
  }

  // Floor price
  const finalPrice = Math.max(500, total);

  return {
    success:    true,
    basePrice:  modelBase,
    finalPrice,
    breakdown,
  };
}
