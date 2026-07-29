"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface BrandItem {
  id: string;
  name: string;
  logo: string;
}

const STATIC_BRANDS: BrandItem[] = [
  { name: "Apple", id: "apple", logo: "/apple.png" },
  { name: "Samsung", id: "samsung", logo: "/samsung.jpg" },
  { name: "Google", id: "google", logo: "/google.png" },
  { name: "OnePlus", id: "oneplus", logo: "/oneplus.png" },
  { name: "MI", id: "mi", logo: "/mi.png" },
  { name: "Vivo", id: "vivo", logo: "/vivo.png" },
  { name: "Oppo", id: "oppo", logo: "/oppo.png" },
  { name: "Realme", id: "realme", logo: "/realme.png" },
  { name: "iQOO", id: "iqoo", logo: "/iqoo.png" },
  { name: "Motorola", id: "motorola", logo: "/moto.png" },
];

export default function Brands() {
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/brands")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.brands) && data.brands.length > 0) {
          setBrands(
            data.brands.map((b: { id: string; name: string; logo_url: string }) => ({
              id: b.id,
              name: b.name,
              logo: b.logo_url,
            }))
          );
        } else {
          setBrands(STATIC_BRANDS);
        }
      })
      .catch(() => {
        setBrands(STATIC_BRANDS);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-800 mb-8 border-b-2 border-gray-100 pb-2 inline-block">
            All Top Brands
          </h2>
          <div className="flex gap-6 sm:gap-12 flex-wrap items-center justify-center sm:justify-start">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="w-32 h-32 md:w-48 md:h-32 border border-gray-100 bg-zinc-50 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-gray-800 mb-8 border-b-2 border-gray-100 pb-2 inline-block">
          All Top Brands
        </h2>

        <div className="flex gap-6 sm:gap-12 flex-wrap items-center justify-center sm:justify-start">
          {brands.map((brand) => (
            <Link
              href={`/sell?brand=${brand.id}`}
              key={brand.id}
              className="relative group w-32 h-32 md:w-48 md:h-32 border border-gray-100 shadow-sm rounded-xl flex flex-col items-center justify-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white overflow-hidden p-4 hover-shine"
            >
              <img
                src={brand.logo}
                alt={`${brand.name} logo`}
                className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-300 mb-2"
              />
              <span className="font-semibold text-xs text-gray-700">{brand.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Floating Whatsapp Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <a
          href="https://wa.me/919593299593"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </div>
    </section>
  );
}
