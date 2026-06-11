import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sell Your Mobile Phone - Best Prices',
  description: 'Sell your old smartphone for the best price in Bangalore, Mysore, and Kalaburagi. Get instant online valuation, free doorstep pickup, and instant cash.',
  keywords: [
    'sell used phone online', 'sell mobile instant cash', 'sell iphone best price',
    'sell samsung old phone', 'sell oneplus', 'sell mi phone', 'sell vivo', 'sell oppo',
    'sell realme', 'sell asus', 'sell google pixel',
    'mobile buyer bangalore', 'sell smartphone mysore', 'mobile exchange Kalaburagi',
    'sell used phones in Kalaburagi', 'buy used phones Bangalore', 'used mobiles Mysore'
  ],
  openGraph: {
    title: 'Sell Your Mobile Phone | MobiQ',
    description: 'Get an instant quote for your old smartphone today. Best rates and instant cash in your city.',
    url: 'https://www.themobiq.com/sell',
  }
};

export default function SellLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
