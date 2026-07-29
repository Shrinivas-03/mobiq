import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";

export const metadata = {
  title: "Privacy Policy - MobiQ",
  description: "Read the Privacy Policy of MobiQ to understand how we manage and protect your personal information.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TopBar />
      <Header />
      
      <main className="flex-grow w-full py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-gray-800">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b-2 border-green-500 pb-2 inline-block">
          Privacy Policy
        </h1>
        
        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p className="text-sm text-gray-400">Last updated: July 2026</p>
          
          <p>
            Welcome to MobiQ. We respect your privacy and are committed to protecting the personal data you share with us. This Privacy Policy explains how we collect, use, and safeguard your details when you visit our website or sell devices through our service.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">1. Information We Collect</h2>
          <p>
            When you use MobiQ to obtain a quote or book a device pickup, we collect personal information necessary to facilitate the transaction. This includes:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Personal Identity Details:</strong> Full name and Government ID details (verified during doorstep inspection).</li>
            <li><strong>Contact Information:</strong> Phone number, secondary phone number, and email address.</li>
            <li><strong>Location & Address Details:</strong> Your physical address where the doorstep evaluation and device pickup will take place.</li>
            <li><strong>Device Details:</strong> Device brand, model, specifications, and condition reports.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">2. How We Use Your Information</h2>
          <p>
            We process your information to fulfill our service agreements, specifically to:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Generate fair pricing quotes for your smartphones.</li>
            <li>Schedule and complete doorstep inspections and pickups.</li>
            <li>Execute instant payments securely via UPI or Bank Transfer.</li>
            <li>Maintain customer accounts and provide support.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">3. Data Security and Sanitization</h2>
          <p>
            Your data security is our top priority. We implement robust physical, technical, and administrative controls to prevent unauthorized access. 
          </p>
          <p className="font-semibold text-gray-800">
            Crucial Note on Device Data: Before handing your mobile phone over to our pickup representative, we mandate that you perform a complete factory reset. After collection, our technical processing team performs secure software sanitization on every device to ensure no remaining personal files or data can ever be recovered.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">4. Sharing Your Data</h2>
          <p>
            We do not sell, trade, or rent your personal identification information to third parties. We may share data only with trusted partners and third-party logistics agents strictly to complete doorstep pickup services.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our practices, please contact us at <a href="mailto:info@themobbiq.com" className="text-green-600 font-bold hover:underline">info@themobbiq.com</a>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
