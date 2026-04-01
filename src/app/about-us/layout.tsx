import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'TheMobiQ is India\'s trusted platform for selling pre-owned mobile phones. Based in Karnataka, we ensure the best valuation, secure data wipes, and instant payments.',
  keywords: [
    'about themobiq', 'trusted mobile buyer', 'secure mobile selling',
    'sell smartphone safely', 'used mobile valuation', 'the mobiq company',
    'sell mobile bangalore', 'sell old phone karnataka'
  ],
  openGraph: {
    title: 'About TheMobiQ | Trusted Mobile Buyers',
    description: 'Learn how TheMobiQ is transforming the way people sell their old devices through transparent pricing and doorstep service.',
    url: 'https://themobbiq.com/about-us',
  }
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
