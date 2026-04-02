"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function WelcomeSection() {
  return (
    <section className="py-20 bg-gray-50 overflow-hidden text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side: Text */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-green-600 font-bold uppercase tracking-widest text-sm mb-3">About MobiQ</div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900 leading-snug">
            Welcome to MobiQ, believe in us!
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed text-lg">
            Welcome to MobiQ, the fastest growing portal to sell your old mobile phones quickly and easily for instant cash. With MobiQ, you can sell your used smartphones online right from the comfort of our home and get the best value for your device...
          </p>
          <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all hover:shadow-green-600/30 transform hover:-translate-y-1 uppercase text-sm">
            More About It
          </button>
        </motion.div>

        {/* Right Side: Image/Devices Composition */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative h-96 flex items-center justify-center p-8"
        >
          {/* A soft green structural background blox */}
          <div className="absolute top-10 right-10 w-64 h-64 bg-green-500/20 rounded-3xl -rotate-6"></div>
          
          <div className="relative z-10 w-full h-full max-w-md bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden flex flex-col justify-between">
            <div className="w-full h-full relative">
                <Image src="/welcome-devices.png" alt="Devices supported by MobiQ" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </div>
            <div className="text-center py-4 bg-white/95 backdrop-blur-sm shadow-[0_-10px_10px_rgba(0,0,0,0.05)] absolute bottom-0 w-full text-gray-500 text-sm font-medium">Multiple Devices Supported</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
