"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import { Star, Smartphone, Film, Play, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch("/api/testimonials");
        const data = await res.json();
        if (data.success) {
          setTestimonials(data.testimonials || []);
        }
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  // Parses Instagram Reel/Post ID
  const getInstagramId = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:\/reel\/|\/p\/|\/tv\/)([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <TopBar />
      <Header />

      <main className="flex-grow w-full overflow-hidden">
        {/* Banner Section */}
        <div className="relative w-full h-[220px] md:h-[300px] bg-slate-900 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/30 to-blue-600/30 mix-blend-multiply z-0" />
          {/* Grid Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] z-0" />
          
          <div className="z-10 text-center px-4">
            <p className="text-sm font-bold text-green-400 mb-2 tracking-widest uppercase">Home &gt; Testimonials</p>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-md">
              Client Testimonials
            </h1>
            <p className="text-slate-300 mt-3 max-w-md mx-auto text-sm md:text-base font-medium">
              See what our customers say about their experience selling phones to MobiQ.
            </p>
          </div>
        </div>

        {/* Testimonials Section */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-500 font-medium animate-pulse">Loading amazing stories...</p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-20 max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <Film className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No Video Reviews Yet</h3>
              <p className="text-slate-500 text-sm mt-2">
                We are currently gathering testimonial videos. Check back soon or visit our social channels!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
              {testimonials.map((t, idx) => {
                const reelId = getInstagramId(t.instagram_url);
                const isPlaying = activeVideoId === t.id;

                return (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    {/* Mock Smartphone Frame */}
                    <div className="relative w-[300px] h-[600px] bg-slate-950 rounded-[45px] shadow-2xl border-[12px] border-slate-900 overflow-hidden ring-4 ring-slate-800/50 flex flex-col group transition-transform duration-300 hover:scale-[1.02]">
                      {/* Notch / Dynamic Island */}
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full z-30 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-slate-800 rounded-full ml-auto mr-4" />
                      </div>

                      {/* Video Player Area */}
                      <div className="relative flex-1 w-full bg-slate-900 overflow-hidden flex items-center justify-center">
                        {isPlaying ? (
                          reelId ? (
                            <iframe
                              src={`https://www.instagram.com/reel/${reelId}/embed/captioned/?cr=1&v=12`}
                              className="w-full h-full border-0 absolute inset-0 z-10"
                              allowFullScreen
                              scrolling="no"
                              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            />
                          ) : (
                            /* Fallback card if link format is different */
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 flex flex-col items-center justify-center p-6 text-center z-10">
                              <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-4 border border-green-500/30 animate-pulse">
                                <Play className="w-8 h-8 fill-current ml-1" />
                              </div>
                              <span className="text-xs font-bold text-green-400 uppercase tracking-widest mb-1">Watch Testimonial</span>
                              <h4 className="text-white font-extrabold text-lg line-clamp-2 px-4">{t.client_name}'s Review</h4>
                            </div>
                          )
                        ) : (
                          /* Visual Video Poster / Play Button Cover */
                          <div 
                            onClick={() => setActiveVideoId(t.id)}
                            className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 flex flex-col items-center justify-center p-6 text-center z-10 cursor-pointer group/poster select-none"
                          >
                            {/* Animated circular wave behind play button */}
                            <div className="relative flex items-center justify-center w-24 h-24 mb-6">
                              <div className="absolute inset-0 rounded-full bg-green-500/10 scale-100 group-hover/poster:scale-125 group-hover/poster:bg-green-500/20 transition-all duration-700 animate-ping" />
                              <div className="absolute inset-2 rounded-full bg-green-500/20 scale-100 group-hover/poster:scale-110 transition-all duration-500" />
                              <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-500/40 border border-green-400 group-hover/poster:scale-105 group-hover/poster:bg-green-400 transition-all duration-300 relative z-10">
                                <Play className="w-7 h-7 fill-current ml-1.5" />
                              </div>
                            </div>
                            
                            <span className="text-xs font-black tracking-widest uppercase bg-green-950 text-green-400 px-3 py-1 rounded-full border border-green-500/30 mb-3 animate-pulse">
                              Video Review
                            </span>
                            
                            <h4 className="text-white font-black text-xl tracking-tight leading-snug px-4">
                              Watch {t.client_name}'s Story
                            </h4>
                            
                            <p className="text-slate-400 text-xs mt-2 px-8 font-medium">
                              Click to load and play video review inside phone
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Client Info Bar inside Mock Phone (Bottom overlay) */}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-6 pt-16 text-white z-20 flex flex-col gap-2 pointer-events-none">
                        <div className="flex items-center justify-between">
                          <h3 className="font-extrabold text-lg tracking-tight">{t.client_name}</h3>
                          <div className="flex gap-0.5 text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} fill="currentColor" />
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-green-400 font-bold bg-green-950/60 w-fit px-3 py-1 rounded-full border border-green-500/30">
                          <Smartphone className="w-3.5 h-3.5" />
                          Sold: {t.model_name}
                        </div>

                        <div className="pointer-events-auto">
                          <a
                            href={t.instagram_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-600/30 hover:shadow-green-600/40"
                          >
                            Watch on Instagram
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
