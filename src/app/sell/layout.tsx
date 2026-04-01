import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sell Your Mobile Phone',
  description: 'Select your mobile brand, model, and answer a few questions about its condition. Get an instant quote and sell your old smartphone for the best price in Bangalore, Mysore, and Kalaburgi.',
  keywords: [
    'sell used phone online', 'sell mobile instant cash', 'sell iphone best price',
    'sell samsung old phone', 'sell oneplus', 'sell mi phone', 'sell vivo', 'sell oppo',
    'sell realme', 'sell asus', 'sell google pixel',
    'mobile buyer bangalore', 'sell smartphone mysore', 'mobile exchange gulbarga'
  ],
  openGraph: {
    title: 'Sell Your Mobile Phone | TheMobiQ',
    description: 'Get an instant quote for your old smartphone today. Best rates and instant cash in your city.',
    url: 'https://themobbiq.com/sell',
  }
};

export default function SellLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
