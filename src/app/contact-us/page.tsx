"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import { MapPin, Mail, Phone, CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: "", email: "", subject: "", message: "" };

    if (!formData.name.trim()) { newErrors.name = "Name is required"; valid = false; }
    
    if (!formData.email.trim()) { newErrors.email = "Email is required"; valid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { newErrors.email = "Invalid email format"; valid = false; }
    
    if (!formData.subject.trim()) { newErrors.subject = "Subject is required"; valid = false; }
    
    if (!formData.message.trim()) { newErrors.message = "Message is required"; valid = false; }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setIsSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        setApiError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setApiError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TopBar />
      <Header />
      
      <main className="flex-grow w-full overflow-hidden">
        
        {/* Banner Section */}
        <div className="relative w-full h-[200px] md:h-[300px] bg-gray-100 flex items-center justify-center overflow-hidden">
             {/* Banner Background */}
             <div className="absolute inset-0">
                  <Image src="/contact-banner.png" alt="Contact Us Banner" fill className="object-cover opacity-60" priority />
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white/60"></div>
             </div>
            <div className="z-10 text-center px-4 relative">
                <p className="text-sm font-semibold text-gray-500 mb-2 tracking-widest uppercase">Home &gt; Contact</p>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Contact Us</h1>
            </div>
        </div>

        {/* Contact Form Section */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            
            <div className="text-center mb-16">
                <p className="text-green-600 font-bold text-sm tracking-wider uppercase mb-2">Contact Us</p>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Get in Touch With Us</h2>
                <p className="text-gray-500">If you have any further questions or queries please do not hesitate to get in touch.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                
                {/* Contact Information */}
                <div className="space-y-10 flex flex-col justify-center">
                    
                    <div className="flex items-start gap-6 group">
                        <div className="flex-shrink-0 mt-1">
                            <div className="w-12 h-12 rounded-full border border-green-200 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                <MapPin className="w-6 h-6" strokeWidth={1.5} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">Address</h3>
                            <p className="text-gray-600 leading-relaxed">
                                J.P Nagar, Phase 1, <br/> Bengaluru 560078
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-6 group">
                        <div className="flex-shrink-0 mt-1">
                            <div className="w-12 h-12 rounded-full border border-green-200 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                <Mail className="w-6 h-6" strokeWidth={1.5} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">Email Address</h3>
                            <a href="mailto:info@themobbiq.com" className="text-gray-600 hover:text-green-600 transition-colors">info@themobbiq.com</a>
                        </div>
                    </div>

                    <div className="flex items-start gap-6 group">
                        <div className="flex-shrink-0 mt-1">
                            <div className="w-12 h-12 rounded-full border border-green-200 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                <Phone className="w-6 h-6" strokeWidth={1.5} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">Phone Number</h3>
                            <a href="tel:+919593299593" className="text-gray-600 hover:text-green-600 transition-colors">+91 95932 99593</a>
                        </div>
                    </div>

                </div>

                {/* Form */}
                <div className="bg-white">
                    {isSubmitted && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700 font-medium">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            Thank you! Your message has been sent successfully.
                        </div>
                    )}
                    {apiError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 font-medium">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            {apiError}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder="Name" 
                                    className={`w-full bg-gray-50 border ${errors.name ? 'border-red-500' : 'border-transparent'} focus:ring-2 focus:ring-green-500 rounded-md py-4 px-5 text-gray-700 placeholder-gray-400 block`}
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.name}</p>}
                            </div>
                            <div>
                                <input 
                                    type="email" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    placeholder="E-mail" 
                                    className={`w-full bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-transparent'} focus:ring-2 focus:ring-green-500 rounded-md py-4 px-5 text-gray-700 placeholder-gray-400 block`}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.email}</p>}
                            </div>
                        </div>
                        
                        <div>
                            <input 
                                type="text" 
                                value={formData.subject}
                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                placeholder="Subject" 
                                className={`w-full bg-gray-50 border ${errors.subject ? 'border-red-500' : 'border-transparent'} focus:ring-2 focus:ring-green-500 rounded-md py-4 px-5 text-gray-700 placeholder-gray-400 block`}
                            />
                            {errors.subject && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.subject}</p>}
                        </div>

                        <div>
                            <textarea 
                                rows={6} 
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                                placeholder="Message" 
                                className={`w-full bg-gray-50 border ${errors.message ? 'border-red-500' : 'border-transparent'} focus:ring-2 focus:ring-green-500 rounded-md py-4 px-5 text-gray-700 placeholder-gray-400 block resize-none`}
                            ></textarea>
                            {errors.message && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.message}</p>}
                        </div>

                        <div>
                            <button 
                                type="submit" 
                                disabled={isLoading || isSubmitted}
                                className="bg-green-600 hover:bg-green-700 disabled:opacity-70 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-green-600/30 transition-all transform hover:scale-105 active:scale-95 uppercase text-sm"
                            >
                                {isLoading ? "Sending..." : isSubmitted ? "Sent ✓" : "Send Message"}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </section>

        {/* Map Section */}
        <section className="w-full h-[400px] md:h-[500px] bg-gray-200 relative mb-[-4rem]"> {/* Negative margin to pull footer slightly up if desired, or let footer handle it. Footer has `pt-16` so keeping standard flow is fine usually. Removed negative margin for safety. */}
           <div className="w-full h-full relative border-t border-b border-gray-300">
               {/* Embed Google Maps */}
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d59108.937832079275!2d77.64469501574145!3d13.035460795966712!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae172dcec4f1b7%3A0x523cf40021c3ff8a!2sHennur%20Gardens%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1775062482420!5m2!1sen!2sin" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, filter: 'grayscale(0.5) contrast(1.1) opacity(0.8)' }} 
                    allowFullScreen={false} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="MobiQ Location Map"
                ></iframe>
                
                {/* Floating WhatsApp Button (matches About Us style) */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30">
                    <button className="bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-xl transition-transform hover:scale-110 border-2 border-white">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.277-.927-3.541 0-5.132 4.168-9.3 9.3-9.3 5.131 0 9.3 4.168 9.3 9.3 0 5.132-4.169 9.3-9.3 9.3z"/>
                        </svg>
                    </button>
                </div>
           </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
