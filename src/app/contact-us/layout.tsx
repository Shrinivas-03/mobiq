import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with TheMobiQ team for any queries regarding selling your smartphone. We offer dedicated support for our customers in Bangalore, Mysore, and Gulbarga.',
  keywords: [
    'contact themobiq', 'sell phone support', 'mobiq phone number', 
    'sell smartphone contact', 'mobile selling helpline', 'bangalore mobile buyers contact'
  ],
  openGraph: {
    title: 'Contact TheMobiQ Support',
    description: 'Need help selling your phone? Reach out to us today for free pickup and instant cash solutions.',
    url: 'https://themobbiq.com/contact-us',
  }
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
