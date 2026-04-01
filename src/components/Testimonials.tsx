"use client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    {
      id: 1,
      name: "Daniel EST",
      text: "Customer support is very prompt, helps you resolving any doubts, very clear and quick process.",
      rating: 5,
    },
    {
      id: 2,
      name: "Ravi Chand",
      text: "The service is exceptional. Highly recommend their prompt pick up and hassle free instant cash.",
      rating: 5,
    },
    {
      id: 3,
      name: "Maria DB",
      text: "Sold my old iPhone in minutes and got better value compared to others check out MobiQ.",
      rating: 5,
    }
  ];

  return (
    <section className="py-20 bg-gray-100 text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="text-green-600 font-bold uppercase tracking-widest text-sm mb-3">SOME REVIEWS</div>
        <h2 className="text-3xl font-extrabold mb-12 text-gray-900 text-center">
          Reviews on MobiQ
        </h2>

        {/* Horizontal Scroll Container */}
        <div className="relative w-full max-w-5xl overflow-hidden rounded-xl bg-gray-50/50 py-8">
           {/* Fading Edges */}
           <div className="absolute left-0 inset-y-0 w-16 bg-gradient-to-r from-gray-100 to-transparent z-10 pointer-events-none"></div>
           <div className="absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-gray-100 to-transparent z-10 pointer-events-none"></div>

           <div className="flex w-fit gap-6 animate-scroll-horizontal hover:pause px-4">
             {/* Duplicate array for seamless looping */}
             {[...reviews, ...reviews, ...reviews, ...reviews].map((review, i) => (
                <div 
                  key={`${review.id}-${i}`}
                  className={`bg-white p-8 w-80 shrink-0 rounded-xl text-left border border-gray-100 shadow-sm transition-transform hover:scale-[1.02] ${review.id === 2 ? 'border-t-4 border-green-500 shadow-md' : ''}`}
                >
                   <div className="flex gap-1 text-green-500 mb-4">
                     {[...Array(review.rating)].map((_, j) => (
                       <Star key={j} size={16} fill="currentColor" />
                     ))}
                   </div>
                   <p className="text-gray-600 italic mb-6">&quot;{review.text}&quot;</p>
                   <div className="font-bold text-gray-900">{review.name}</div>
                </div>
             ))}
           </div>
        </div>
      </div>
    </section>
  );
}
