import { Phone, Mail } from "lucide-react";

export default function TopBar() {
  return (
    <div className="w-full bg-white border-b border-gray-100 py-2 hidden md:block text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Left Side: Contact Info */}
        <div className="flex gap-6 items-center text-gray-700 font-medium">
          <a href="tel:+919593299593" className="flex items-center gap-2 hover:text-green-600 transition-colors">
            <Phone size={14} className="text-green-600" />
            <span>+91 95932 99593</span>
          </a>
          <a href="mailto:info@themobbiq.com" className="flex items-center gap-2 hover:text-green-600 transition-colors">
            <Mail size={14} className="text-gray-400" />
            <span>info@themobbiq.com</span>
          </a>
        </div>

        {/* Right Side: Social Icons */}
        <div className="flex gap-4 items-center">
          <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-sky-500 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-700 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
        </div>
      </div>
    </div>
  );
}
