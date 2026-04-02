import { NextResponse } from "next/server";
import { calculatePrice, type PricingInput, type PriceBreakdownItem } from "@/lib/pricing";

// Re-export types for any consumers that import from this route module directly
export type { PriceBreakdownItem };

export interface PriceCalculationRequest extends PricingInput {}

export interface PriceCalculationResponse {
  success:    boolean;
  basePrice:  number;
  finalPrice: number;
  breakdown:  PriceBreakdownItem[];
}

export async function POST(request: Request) {
  try {
    const body: PriceCalculationRequest = await request.json();

    if (!body.modelId || !body.brandId || !body.variantId || !body.deviceAge) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: modelId, brandId, variantId, deviceAge" },
        { status: 400 }
      );
    }

    const result = calculatePrice(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json(result satisfies PriceCalculationResponse);
  } catch (err) {
    console.error("[/api/sell/calculate] Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
