"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white w-full sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <Image 
                src="/logo.png" 
                alt="MobiQ Logo" 
                width={150} 
                height={50} 
                className="h-12 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 items-center text-sm font-semibold text-gray-700">
            <Link href="/" className="hover:text-green-600 transition-colors uppercase">Home</Link>
            <Link href="/about-us" className="hover:text-green-600 transition-colors uppercase">About Us</Link>
            <Link href="/contact-us" className="hover:text-green-600 transition-colors uppercase">Contact Us</Link>
          </nav>

          {/* CTA & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Link 
              href="/sell"
              className="hidden sm:inline-flex bg-green-600 hover:bg-green-700 text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-bold shadow-lg shadow-green-600/30 transition-all transform hover:scale-105 active:scale-95 uppercase text-sm"
            >
              Sell Now
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-700 hover:text-green-600 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="flex flex-col px-4 py-6 space-y-4 shadow-inner">
              <Link 
                href="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-800 hover:text-green-600 font-semibold p-2 rounded-lg hover:bg-green-50 transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/about-us" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-800 hover:text-green-600 font-semibold p-2 rounded-lg hover:bg-green-50 transition-colors"
              >
                About Us
              </Link>
              <Link 
                href="/contact-us" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-800 hover:text-green-600 font-semibold p-2 rounded-lg hover:bg-green-50 transition-colors"
              >
                Contact Us
              </Link>
              <div className="pt-4 mt-2 border-t border-gray-100">
                <Link 
                  href="/sell"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex justify-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-bold shadow-md transition-colors uppercase text-sm w-full"
                >
                  Sell Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
