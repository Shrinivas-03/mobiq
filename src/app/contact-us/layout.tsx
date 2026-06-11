import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - MobiQ Support',
  description: 'Get in touch with the MobiQ team for support on buying and selling used products and smartphones. Dedicated assistance for Bangalore, Mysore, and Kalaburagi.',
  keywords: [
    'contact themobiq', 'sell phone support', 'mobiq phone number', 
    'sell smartphone contact', 'mobile selling helpline', 'bangalore mobile buyers contact',
    'used products support Kalaburagi', 'buy used mobiles help Mysore'
  ],
  openGraph: {
    title: 'Contact TheMobiQ Support',
    description: 'Need help selling your phone? Reach out to us today for free pickup and instant cash solutions.',
    url: 'https://www.themobiq.com/contact-us',
  }
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
