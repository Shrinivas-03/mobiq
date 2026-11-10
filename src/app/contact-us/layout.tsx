import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Qmobiles Support',
  description: 'Get in touch with the Qmobiles team for support on buying and selling used products and smartphones. Dedicated assistance for Bangalore, Mysore, and Kalaburagi.',
  keywords: [
    'contact qmobiles', 'sell phone support', 'qmobiles phone number', 
    'sell smartphone contact', 'mobile selling helpline', 'bangalore mobile buyers contact',
    'used products support Kalaburagi', 'buy used mobiles help Mysore'
  ],
  openGraph: {
    title: 'Contact Qmobiles Support',
    description: 'Need help selling your phone? Reach out to us today for free pickup and instant cash solutions.',
    url: 'https://www.qmobiles.in/contact-us',
  }
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
