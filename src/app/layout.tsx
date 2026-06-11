import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.themobiq.com'),
  title: {
    default: "TheMobiQ - Sell Used Mobiles Online Instantly for Best Price",
    template: "%s | TheMobiQ"
  },
  description: "Sell your used devices instantly for the best price. Free doorstep pickup in Bangalore, Mysore, and Gulbarga (Kalaburagi). Instant cash payment for second hand, refurbished, and pre-owned smartphones.",
  keywords: [
    "Second hand products", "Buy used products", "Sell used products", "Buy and sell used items", 
    "Online marketplace", "Local marketplace", "Used goods marketplace", "Pre-owned products", 
    "Used products near me", "Best second hand marketplace", "Second hand mobiles", "Used mobiles for sale", 
    "Buy used phones", "Refurbished smartphones", "Best mobile deals", "Cheap smartphones", 
    "Second hand iPhone", "Used Samsung phones", "Used OnePlus phones", "Mobile exchange deals", 
    "Pre-owned smartphones", "Budget smartphones", "Kalaburagi", "Second hand products in Kalaburagi", 
    "Buy used mobiles in Kalaburagi", "Sell used phones in Kalaburagi", "Used furniture in Kalaburagi", 
    "Second hand bikes in Kalaburagi", "Buy and sell products in Kalaburagi", "Kalaburagi marketplace", 
    "Bengaluru", "Second hand products in Bengaluru", "Used mobiles in Bengaluru", "Buy used phones in Bangalore", 
    "Bangalore second hand marketplace", "Used electronics in Bangalore", "Sell used products in Bangalore", 
    "Pre-owned gadgets Bangalore", "Mysuru", "Second hand products in Mysuru", "Used mobiles in Mysuru", 
    "Buy and sell products in Mysore", "Mysore second hand marketplace", "Used electronics Mysuru", 
    "Sell old phones Mysuru", "Best place to sell old mobiles in Bangalore", "Buy second hand phones in Kalaburagi", 
    "Affordable used smartphones in Mysore", "Trusted second hand marketplace in Karnataka", 
    "Buy and sell used electronics online", "Used mobile deals near me", "Second hand products at best prices", 
    "Local marketplace for used goods", "Verified sellers for used mobiles", "Best deals on second hand smartphones",
    "sell used mobile", "sell old phone", "sell smartphone", "sell mobile online", "cash for phone",
    "sell iphone", "sell samsung", "sell oneplus", "sell oppo", "sell vivo", "sell mi", "sell realme",
    "second hand mobile price", "mobile exchange", "sell gadgets",
    "sell mobile bangalore", "sell phone bengaluru", "sell mobile mysore", "sell phone mysuru",
    "sell mobile gulbarga", "sell phone kalaburgi"
  ],
  authors: [{ name: "TheMobiQ Team" }],
  creator: "TheMobiQ",
  publisher: "TheMobiQ",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://themobbiq.com",
    siteName: "TheMobiQ",
    title: "Sell Used Mobiles Online | Instant Cash | TheMobiQ",
    description: "Get the best price for your old, broken, or unused smartphone. We offer instant valuation, free doorstep pickup, and instant cash. Serving Bangalore, Mysore, and Gulbarga.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "TheMobiQ - Sell Your Pre-Owned Device",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "TheMobiQ - Sell Used Mobiles Instantly",
    description: "Sell your old mobile phone and get cash instantly. Free pickup available in top Karnataka cities.",
    images: ["/logo.png"]
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
