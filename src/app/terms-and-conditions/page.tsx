import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";

export const metadata = {
  title: "Terms and Conditions - MobiQ",
  description: "Read the Terms and Conditions of MobiQ before using our platform to sell your used devices.",
};

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TopBar />
      <Header />
      
      <main className="flex-grow w-full py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-gray-800">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b-2 border-green-500 pb-2 inline-block">
          Terms & Conditions
        </h1>
        
        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p className="text-sm text-gray-400">Last updated: July 2026</p>
          
          <p>
            Please read these Terms and Conditions carefully before using our platform. By accessing or using MobiQ to sell your used mobile phones or other electronics, you agree to be bound by these Terms.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">1. Ownership and Representation of Devices</h2>
          <p>
            When selling a device on MobiQ, you represent, warrant, and confirm that:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>You are the sole and lawful owner of the device, or have explicit legal authority to sell it.</li>
            <li>The device is free from any liens, locks (including iCloud/Google FRP locks), or active financing schemes.</li>
            <li>The device was not obtained through theft, fraud, or any other illegal means. We maintain a strict zero-tolerance policy for stolen items and will report suspicious activity to law enforcement.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">2. Accurate Device Assessment</h2>
          <p>
            Quotes provided online are tentative estimates based on the details you submit (brand, model, age, accessories, and issues). During doorstep pickup, our representative will perform a live verification. If the physical state or specifications do not match your description, we reserve the right to offer a revised quote or cancel the transaction.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">3. Verification and Identification</h2>
          <p>
            To prevent fraud and satisfy local regulations, our representative will ask you to present a valid government-issued ID card (Aadhaar Card, Driver's License, or Passport) at the doorstep before initiating transaction payouts.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">4. Finality of Transaction</h2>
          <p>
            Once our representative inspects the phone, you accept the final quote, and the instant payment is transferred, ownership of the device transfers completely to MobiQ. The sale is final and cannot be cancelled or refunded, and the device cannot be returned to you.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">5. Complete Data Removal Requirement</h2>
          <p>
            You are solely responsible for backing up and removing all personal data, logins, accounts, photos, and files from your device. MobiQ is not liable for the loss or exposure of any data left on devices handed over to our representatives.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">6. Contact Information</h2>
          <p>
            For any queries or concerns regarding these Terms, please contact us at <a href="mailto:info@themobbiq.com" className="text-green-600 font-bold hover:underline">info@themobbiq.com</a>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
