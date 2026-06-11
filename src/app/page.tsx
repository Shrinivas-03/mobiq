import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Brands from "@/components/Brands";
import WelcomeSection from "@/components/WelcomeSection";
import Testimonials from "@/components/Testimonials";
import FaqAccordion from "@/components/FaqAccordion";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";

export const metadata = {
  title: "MobiQ - Best Second Hand Mobile & Used Products Marketplace",
  description: "Looking for the best second hand marketplace in Karnataka? MobiQ is the trusted platform to buy and sell used products, smartphones, and electronics in Kalaburagi, Bengaluru, and Mysuru. Get verified sellers and fast transactions.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />
      
      <main className="flex flex-col w-full overflow-hidden">
        <Hero />
        <FadeIn><Brands /></FadeIn>
        <FadeIn><WelcomeSection /></FadeIn>
        <FadeIn><Testimonials /></FadeIn>
        <FadeIn><FaqAccordion /></FadeIn>
      </main>

      <Footer />
    </div>
  );
}
