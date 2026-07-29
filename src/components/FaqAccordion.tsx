"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How do I get paid?",
    answer: "You receive instant payment via Bank Transfer & UPI. Cash options may also be available depending on your location."
  },
  {
    question: "What if my phone is damaged?",
    answer: "We accept phones in almost all conditions. Just be sure to mention the exact condition while getting a quote, and we will offer the best price."
  },
  {
    question: "Do you ask for original purchase receipt/invoice?",
    answer: "Having the original invoice helps in getting a higher value, but we can also accept the device without it provided you have a valid ID proof."
  },
  {
    question: "How does the doorstep pickup process work?",
    answer: "Once you submit a sell request, our representative will contact you to confirm a pickup time. The agent will inspect the device at your doorstep, verify the condition, and initiate instant payment immediately before collecting the phone."
  },
  {
    question: "Are there any shipping or pickup charges?",
    answer: "No, the doorstep pickup and inspection services are completely free of charge. There are no hidden fees or commissions deducted from your final quoted price."
  },
  {
    question: "What happens to the data on my phone?",
    answer: "We take data privacy very seriously. We mandate that you factory reset your phone before handing it over. Additionally, our processing team performs a secure data wipe on all acquired devices to ensure no personal data can ever be recovered."
  },
  {
    question: "Can I sell a phone that doesn't turn on?",
    answer: "Yes, you can sell dead or non-working phones for their scrap/parts value. Just select the option indicating that the device does not turn on during the sell flow to get an estimate."
  }
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section className="py-20 bg-white text-gray-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold mb-10 text-gray-900 border-b-2 border-green-500 pb-2 inline-block">
          Frequently Asked <span className="text-green-600">Questions</span>
        </h2>

         <div className="space-y-4">
           {faqs.map((faq, i) => (
             <div key={i} className="border-b border-gray-100 pb-4">
               <button 
                 onClick={() => setOpenIndex(i === openIndex ? -1 : i)}
                 className="flex w-full items-center justify-between text-left py-4 focus:outline-none group"
               >
                 <span className={`font-semibold md:text-lg transition-colors ${openIndex === i ? 'text-green-600' : 'text-gray-800 group-hover:text-green-600'}`}>
                   {faq.question}
                 </span>
                 <span className={`text-green-600 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`}>
                   {openIndex === i ? <Minus size={20} /> : <Plus size={20} />}
                 </span>
               </button>
               
               <AnimatePresence>
                 {openIndex === i && (
                   <motion.div
                     initial={{ height: 0, opacity: 0 }}
                     animate={{ height: "auto", opacity: 1 }}
                     exit={{ height: 0, opacity: 0 }}
                     transition={{ duration: 0.3 }}
                     className="overflow-hidden"
                   >
                     <p className="pb-4 text-gray-600 text-sm md:text-base pr-8">
                       {faq.answer}
                     </p>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
           ))}
         </div>
      </div>
    </section>
  );
}
