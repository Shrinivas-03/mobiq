import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - MobiQ Marketplace',
  description: 'MobiQ is India\'s trusted local marketplace for buying and selling second hand products and pre-owned smartphones. Get instant valuation and door-step service in Karnataka.',
  keywords: [
    'about themobiq', 'trusted mobile buyer', 'secure mobile selling',
    'sell smartphone safely', 'used mobile valuation', 'the mobiq company',
    'sell mobile bangalore', 'sell old phone karnataka', 'second hand products in Kalaburagi',
    'pre-owned products Bengaluru', 'used electronics in Mysore'
  ],
  openGraph: {
    title: 'About MobiQ | Trusted Second Hand Marketplace',
    description: 'Learn how MobiQ is transforming the way people sell their old devices through transparent pricing and doorstep service.',
    url: 'https://www.themobiq.com/about-us',
  }
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
