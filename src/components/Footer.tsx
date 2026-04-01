import Image from "next/image";
import Link from "next/link";


export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 text-gray-600 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Logo Column */}
          <div className="col-span-1">
            <Link href="/" className="mb-6 block">
              <Image 
                src="/logo.png" 
                alt="MobiQ Logo" 
                width={150} 
                height={50} 
                className="h-12 w-auto object-contain cursor-pointer"
              />
            </Link>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-green-600 font-bold mb-6 text-lg">Get in Touch</h3>
            <div className="space-y-4 text-sm">
              <p>
                <span className="block font-semibold text-gray-800">Address</span>
                J.P Nagar, Phase 1, Bengaluru 560078
              </p>
              <p>
                <span className="block font-semibold text-gray-800">Phone</span>
                <a href="tel:+919593299593" className="hover:text-green-600 transition-colors">+91 95932 99593</a>
              </p>
              <p>
                <span className="block font-semibold text-gray-800">Email</span>
                <a href="mailto:info@themobbiq.com" className="hover:text-green-600 transition-colors">info@themobbiq.com</a>
              </p>
              
              <div className="flex gap-4 pt-2">
                <a href="#" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-green-600 hover:border-green-600 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-green-600 hover:border-green-600 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-green-600 hover:border-green-600 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-green-600 font-bold mb-6 text-lg">Useful Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about-us" className="hover:text-green-600 transition-colors before:content-['›'] before:mr-2 before:text-green-500">About Us</Link></li>
              <li><Link href="/contact-us" className="hover:text-green-600 transition-colors before:content-['›'] before:mr-2 before:text-green-500">Contact Us</Link></li>
              <li><Link href="#privacy" className="hover:text-green-600 transition-colors before:content-['›'] before:mr-2 before:text-green-500">Privacy Policy</Link></li>
              <li><Link href="#terms" className="hover:text-green-600 transition-colors before:content-['›'] before:mr-2 before:text-green-500">Terms and Conditions</Link></li>
            </ul>
          </div>

          {/* Top Cities */}
          <div>
            <h3 className="text-green-600 font-bold mb-6 text-lg">Top Cities</h3>
            <ul className="space-y-3 text-sm">
              <li><span className="hover:text-green-600 cursor-default transition-colors before:content-['›'] before:mr-2 before:text-green-500">Bengaluru</span></li>
              <li><span className="hover:text-green-600 cursor-default transition-colors before:content-['›'] before:mr-2 before:text-green-500">Delhi</span></li>
              <li><span className="hover:text-green-600 cursor-default transition-colors before:content-['›'] before:mr-2 before:text-green-500">Mumbai</span></li>
            </ul>
          </div>
          
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="bg-gray-900 border-t border-gray-800 p-4 pb-24 md:pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:justify-center items-center gap-4 md:gap-12 text-xs text-gray-400">
           <p>© 2026 MobiQ. All rights reserved.</p>
           <p>Design and Developed by Codemates India</p>
        </div>
      </div>
    </footer>
  );
}
