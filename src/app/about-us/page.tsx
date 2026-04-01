import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import Image from "next/image";

export const metadata = {
  title: "About Us - MobiQ",
  description: "Learn more about MobiQ and what we do.",
};

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TopBar />
      <Header />
      
      <main className="flex-grow w-full overflow-hidden">
        {/* Banner Section */}
        <div className="relative w-full h-[200px] md:h-[300px] bg-gray-100 flex items-center justify-center overflow-hidden">
        <Image
            src="/about-banner.png"
            alt="About Us Banner"
            fill
            className="object-cover opacity-60"
            priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-white/50" />
            <div className="z-10 text-center px-4">
                <p className="text-sm font-semibold text-green-600 mb-2 tracking-widest uppercase">Home &gt; Pages</p>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">About Us</h1>
            </div>
        </div>

        {/* Content Section - Who We Are */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Text Content */}
            <div className="space-y-6">
              <p className="text-green-600 font-bold text-sm tracking-wider uppercase">The About Us</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">Who We Are</h2>
              
              <div className="text-gray-600 leading-relaxed space-y-4">
                <p>
                  At MobiQ, we understand that selling your old smartphone can often be time-consuming and complicated. That's why we've created a platform designed to make the process simple, fast, and worry-free. Here's what sets us apart:
                </p>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                    <li><strong className="text-gray-800">Best Value Guaranteed:</strong> Get the most competitive price for your old phone, backed by fair and transparent pricing.</li>
                    <li><strong className="text-gray-800">Instant Cash:</strong> No waiting around! We ensure quick payouts so you can enjoy the cash for your device immediately.</li>
                    <li><strong className="text-gray-800">Hassle-Free Process:</strong> From valuation to doorstep pickup, we handle it all. Just a few clicks, and you're done.</li>
                </ul>
              </div>
              
              <div className="pt-4">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-green-600/30 transition-all transform hover:scale-105 active:scale-95 uppercase text-sm">
                    Contact Us
                  </button>
              </div>
            </div>

            {/* Image Content */}
            <div className="relative h-[400px] lg:h-[500px] w-full bg-gray-50 rounded-2xl p-8 flex items-center justify-center shadow-inner overflow-hidden shadow-xl border border-gray-100">
               <div className="absolute inset-0 bg-white/40 z-0"></div>
               {/* Decorative elements to simulate dynamic device display if actual image is missing, 
                   or use the visual as inspiration to place devices dynamically. */}
               <div className="relative z-10 w-full h-full flex items-center justify-center">
                   <div className="relative w-full h-full rounded-xl overflow-hidden border-4 border-white shadow-lg">
                        <Image src="/who-we-are-devices.png" alt="Devices Showcase" fill className="object-cover" />
                    </div>
               </div>
               {/* 
               If provided a specific composite image:
               <Image src="/devices-showcase.png" alt="Devices Showcase" fill className="object-contain p-4 drop-shadow-2xl z-20" /> 
               */}
            </div>
          </div>
        </section>

        {/* Vision / Mission Section */}
        <section className="w-full bg-[#91eb34] py-20 lg:py-0 relative mt-12 overflow-hidden">
           <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center relative z-10 min-h-[400px]">
                {/* Text Content */}
                <div className="w-full lg:w-1/2 p-8 lg:p-16 text-white z-20">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-md">Our Mission</h2>
                    <p className="text-lg md:text-xl font-medium leading-relaxed drop-shadow-sm opacity-90 max-w-lg">
                        Our mission is to provide a seamless, reliable, and rewarding experience for users looking to sell their old phones. By combining technology, transparency, and trust, we strive to: Offer the best market value for used smartphones. Simplify the resale process with a user-friendly platform.
                    </p>
                </div>
                
                {/* Image Composition simulating the provided design */}
                <div className="w-full lg:w-1/2 h-[400px] lg:h-full relative flex items-center justify-center lg:justify-end overflow-hidden lg:overflow-visible">
                    <div className="absolute lg:-left-20 top-1/2 transform -translate-y-1/2 w-full max-w-[600px] h-[300px] lg:h-[600px] flex items-center justify-center">
                        <Image src="/mission-gadgets.png" alt="Mission Devices" fill className="object-contain lg:object-cover drop-shadow-2xl mix-blend-luminosity opacity-80" />
                    </div>
                </div>
           </div>
           
           {/* WhatsApp Button floating right vertically centered - simulate relative to section or viewport based on requirement. Let's do absolute to right side. */}
           <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30">
                <button className="bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-xl transition-transform hover:scale-110 border-2 border-white">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.277-.927-3.541 0-5.132 4.168-9.3 9.3-9.3 5.131 0 9.3 4.168 9.3 9.3 0 5.132-4.169 9.3-9.3 9.3z"/>
                    </svg>
                </button>
           </div>
        </section>

        {/* Core Values Section */}
        <section className="w-full bg-[#718aa6] py-20 relative overflow-hidden">
           <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between z-10 pb-8 px-4 sm:px-6 lg:px-8">
                
                {/* Product Composition */}
                <div className="w-full lg:w-1/2 relative min-h-[400px] flex items-end justify-center mt-12 lg:mt-0">
                    <div className="relative w-full max-w-[500px] h-[350px] lg:h-[450px] rounded-3xl overflow-hidden shadow-2xl border-[6px] border-[#718aa6]">
                        <Image src="/core-values-tech.png" alt="Core Values Devices" fill className="object-cover" />
                    </div>
                </div>

                {/* Text Content */}
                <div className="w-full lg:w-1/2 lg:pl-16 text-white text-center lg:text-left">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight drop-shadow-md">Core Values</h2>
                    <p className="text-lg md:text-xl font-medium leading-relaxed drop-shadow-sm opacity-90 max-w-lg mx-auto lg:mx-0">
                        At MobiQ, our core values are built around the principles of transparency, convenience, security, customer satisfaction, sustainability, and trust. We believe in clear and honest communication, ensuring that our pricing is fair and transparent so that you always know exactly what you're getting for your device.
                    </p>
                </div>

           </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
