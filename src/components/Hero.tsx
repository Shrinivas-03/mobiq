"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  const { scrollY } = useScroll();
  // We can add simple parallax or fade effects to elements
  const yBg = useTransform(scrollY, [0, 500], [0, 100]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 text-white min-h-[500px] flex items-center py-16">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none"></div>
      
      {/* Sticky Call to Action Button specifically requested by user */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link href="/sell" className="bg-yellow-400 text-blue-950 px-6 py-3 rounded-full font-black text-lg shadow-[0_0_20px_rgba(250,204,21,0.5)] hover:bg-yellow-300 transition-all transform hover:scale-110 active:scale-95 flex items-center gap-2 border-2 border-white/20">
          <span className="bg-white rounded-full p-1 border border-gray-200">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-600"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 16V8M8 12L16 12C12 12 8 12 8 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
          SELL NOW
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="text-green-400 font-extrabold text-2xl tracking-widest uppercase">
            MobiQ
          </div>
          <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight text-white mb-2">
            SELL YOUR<br/>GADGETS
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 font-light mb-8 max-w-lg">
            Now Experience the <span className="font-bold text-white">FAST</span> Payment for Your old Mobile Phone
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link href="/sell" className="bg-white text-blue-900 group hover:bg-gray-100 px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-blue-900/50 transition-all transform hover:-translate-y-1 flex items-center gap-3 w-fit">
              <div className="bg-green-500 rounded-full p-1 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor"/><path d="M8 12h8m-4-4v8" stroke="blue" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
              SELL NOW
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Image Composition */}
        <motion.div 
          style={{ y: yBg }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-[400px] w-full hidden md:block"
        >
          <div className="absolute inset-0 flex items-center justify-center translate-x-10">
             <motion.div animate={{y: [0, -10, 0]}} transition={{repeat: Infinity, duration: 6, ease: "easeInOut"}} className="relative w-full h-[500px]">
                <Image src="/hero-devices.png" alt="MobiQ Devices" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain drop-shadow-2xl" priority />
             </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Decorative geometric wedge */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-auto text-white fill-current">
          <path d="M0,0 L1440,120 L1440,120 L0,120 Z"></path>
        </svg>
      </div>
    </section>
  );
}
