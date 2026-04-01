import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Brands from "@/components/Brands";
import WelcomeSection from "@/components/WelcomeSection";
import Testimonials from "@/components/Testimonials";
import FaqAccordion from "@/components/FaqAccordion";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />
      
      <main className="flex flex-col w-full overflow-hidden">
        <Hero />
        <Brands />
        <WelcomeSection />
        <Testimonials />
        <FaqAccordion />
      </main>

      <Footer />
    </div>
  );
}
