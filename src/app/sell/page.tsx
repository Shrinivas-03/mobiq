"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, MapPin, ChevronRight, Smartphone, ArrowLeft, Cpu, 
  Banknote, HelpCircle, CheckCircle, WifiOff, MicOff, 
  ScanFace, BatteryWarning, CameraOff, BluetoothOff, Fingerprint, Battery, AlertCircle
} from "lucide-react";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

// ----------------- SVG Icons for Hardware Defects ----------------- //
const ScreenDamageIcon = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 100 130" fill="none" className={className} stroke="currentColor" strokeWidth="3">
    <rect x="20" y="10" width="60" height="110" rx="10" />
    <line x1="40" y1="15" x2="60" y2="15" strokeLinecap="round" />
    <line x1="40" y1="115" x2="60" y2="115" strokeLinecap="round" />
    <path d="M35 50 L55 35" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
    <path d="M45 70 L60 55" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const LineDamageIcon = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 100 130" fill="none" className={className}>
    <rect x="20" y="10" width="60" height="110" rx="10" stroke="currentColor" strokeWidth="3" />
    <line x1="40" y1="15" x2="60" y2="15" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <line x1="40" y1="115" x2="60" y2="115" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <line x1="35" y1="10" x2="35" y2="120" stroke="#f87171" strokeWidth="2" />
    <line x1="38" y1="10" x2="38" y2="120" stroke="#10b981" strokeWidth="2" />
    <circle cx="65" cy="50" r="3" fill="#10b981" />
    <circle cx="30" cy="80" r="2" fill="#10b981" />
    <circle cx="70" cy="90" r="1.5" fill="#10b981" />
  </svg>
);

const BodyDamageIcon = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 100 130" fill="none" className={className} stroke="currentColor" strokeWidth="3">
    <path d="M25 20 C25 15, 30 10, 35 10 L70 10 C75 10, 80 15, 80 20 L80 40 C75 45, 75 50, 80 55 L80 75 C85 80, 85 85, 80 90 L80 110 C80 115, 75 120, 70 120 L30 120 C25 120, 20 115, 20 110 L20 85 C25 80, 25 75, 20 70 L20 40 C15 35, 15 30, 20 25 Z" />
    <circle cx="30" cy="25" r="2" fill="currentColor" />
    <rect x="30" y="40" width="3" height="10" rx="1" fill="currentColor" />
    <path d="M10 30 L5 25 M10 80 L5 85" strokeWidth="2" strokeLinecap="round" />
    <path d="M90 50 L95 45 M90 90 L95 95" strokeWidth="2" strokeLinecap="round" />
    <path d="M40 80 L60 65" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
    <path d="M50 100 L70 85" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const PanelMissingIcon = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 100 130" fill="none" className={className}>
    <rect x="40" y="10" width="10" height="110" rx="5" stroke="currentColor" strokeWidth="3" />
    <path d="M50 40 L60 38 L60 60 L50 65" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="70" cy="50" r="15" stroke="currentColor" strokeWidth="2" fill="white" />
    <path d="M60 40 L80 60 M65 40 L65 60" stroke="#10b981" strokeWidth="2" />
    <rect x="45" y="30" width="3" height="8" rx="1" fill="#10b981" />
    <rect x="45" y="45" width="3" height="8" rx="1" fill="#10b981" />
  </svg>
);

const TouchIssueIcon = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 100 130" fill="none" className={className} stroke="currentColor" strokeWidth="3">
    <rect x="20" y="10" width="60" height="110" rx="10" />
    <line x1="40" y1="15" x2="60" y2="15" strokeLinecap="round" />
    <line x1="40" y1="115" x2="60" y2="115" strokeLinecap="round" />
    <circle cx="50" cy="65" r="12" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />
    <path d="M45 60 L55 70 M55 60 L45 70" stroke="#f87171" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const ButtonMissingIcon = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 100 130" fill="none" className={className}>
    <rect x="30" y="10" width="40" height="110" rx="8" stroke="currentColor" strokeWidth="3" />
    <circle cx="25" cy="40" r="8" stroke="#f87171" strokeWidth="2" strokeDasharray="2 2" />
    <path d="M22 37 L28 43 M28 37 L22 43" stroke="#f87171" strokeWidth="2" />
    <rect x="25" y="60" width="5" height="15" rx="2" fill="#10b981" />
  </svg>
);

const BentPanelIcon = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 100 130" fill="none" className={className} stroke="currentColor" strokeWidth="3">
    <path d="M40 10 C60 50, 60 80, 40 120" strokeLinecap="round" />
    <path d="M50 10 C70 50, 70 80, 50 120" strokeLinecap="round" />
    <path d="M40 10 L50 10 M40 120 L50 120" strokeLinecap="round" strokeWidth="2" />
    <path d="M70 65 L80 65 M75 55 L85 60 M75 75 L85 70" stroke="#f87171" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const LooseScreenIcon = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 100 130" fill="none" className={className}>
    <rect x="40" y="10" width="15" height="110" rx="5" stroke="currentColor" strokeWidth="3" />
    <path d="M30 5 C35 10, 40 20, 40 40 L40 120" stroke="#10b981" strokeWidth="3" fill="none" />
    <path d="M55 10 L55 120" stroke="currentColor" strokeWidth="3" />
    <path d="M20 20 L30 20 M25 15 L30 20 L25 25" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);


// ----------------- Mock Data ----------------- //
const BRANDS = [
  { id: "apple", name: "Apple", logo: "/apple.png" },
  { id: "samsung", name: "Samsung", logo: "/samsung.jpg" },
  { id: "google", name: "Google", logo: "/google.png" },
  { id: "oneplus", name: "OnePlus", logo: "/oneplus.png" }, 
  { id: "mi", name: "MI", logo: "/mi.png" }, 
  { id: "vivo", name: "Vivo", logo: "/vivo.png" },
  { id: "oppo", name: "Oppo", logo: "/oppo.png" },
  { id: "realme", name: "Realme", logo: "/realme.png" },
  { id: "iqoo", name: "iQOO", logo: "/iqoo.png" },
  { id: "motorola", name: "Motorola", logo: "/moto.png" },
];

const MODELS: Record<string, { id: string; name: string }[]> = {
  apple: [
    { id: "ip15pm", name: "iPhone 15 Pro Max" },
    { id: "ip15p", name: "iPhone 15 Pro" },
    { id: "ip15", name: "iPhone 15" },
    { id: "ip14pm", name: "iPhone 14 Pro Max" },
    { id: "ip14", name: "iPhone 14" },
  ],
  samsung: [
    { id: "s24u", name: "Galaxy S24 Ultra" },
    { id: "s24", name: "Galaxy S24" },
    { id: "s23u", name: "Galaxy S23 Ultra" },
  ],
  google: [
    { id: "p8p", name: "Pixel 8 Pro" },
    { id: "p8", name: "Pixel 8" },
    { id: "p7p", name: "Pixel 7 Pro" },
  ],
  oneplus: [
    { id: "op12", name: "OnePlus 12" },
    { id: "op12r", name: "OnePlus 12R" },
    { id: "op11", name: "OnePlus 11" },
  ],
  mi: [
    { id: "mi14u", name: "Xiaomi 14 Ultra" },
    { id: "mi14", name: "Xiaomi 14" },
    { id: "mi13p", name: "Xiaomi 13 Pro" },
  ],
  vivo: [
    { id: "vx100p", name: "Vivo X100 Pro" },
    { id: "vx100", name: "Vivo X100" },
    { id: "vv29", name: "Vivo V29" },
  ],
  oppo: [
    { id: "findn3", name: "Find N3 Flip" },
    { id: "reno11p", name: "Reno 11 Pro" },
    { id: "reno11", name: "Reno 11" },
  ],
  realme: [
    { id: "rm12p", name: "Realme 12 Pro+" },
    { id: "rm12", name: "Realme 12" },
    { id: "rm11p", name: "Realme 11 Pro" },
  ],
  iqoo: [
    { id: "iq12", name: "iQOO 12" },
    { id: "iqneo9", name: "iQOO Neo 9 Pro" },
    { id: "iq11", name: "iQOO 11" },
  ],
  motorola: [
    { id: "motoe50", name: "Edge 50 Pro" },
    { id: "motoe40", name: "Edge 40" },
    { id: "razr40", name: "Razr 40 Ultra" },
  ],
};

const VARIANTS = [
  { id: "6_128", name: "6 GB / 128 GB" },
  { id: "8_128", name: "8 GB / 128 GB" },
  { id: "8_256", name: "8 GB / 256 GB" },
  { id: "12_256", name: "12 GB / 256 GB" },
  { id: "12_512", name: "12 GB / 512 GB" },
];

const CITIES = ["Bangalore", "Mysore", "Gulbarga/kalaburgi"];

const HARDWARE_DEFECTS = [
  { id: "screen", title: "Broken/scratch on device screen", Icon: ScreenDamageIcon },
  { id: "dead", title: "Dead Spot/Visible line and Discoloration", Icon: LineDamageIcon },
  { id: "body", title: "Scratch/Dent on device body", Icon: BodyDamageIcon },
  { id: "panel", title: "Device panel missing/broken", Icon: PanelMissingIcon },
  { id: "touch", title: "Touch screen not working properly", Icon: TouchIssueIcon },
  { id: "button", title: "Missing of volume or power button", Icon: ButtonMissingIcon },
  { id: "bent", title: "Bent/curved panel", Icon: BentPanelIcon },
  { id: "loose", title: "Loose screen (Gap in screen)", Icon: LooseScreenIcon },
];

const SOFTWARE_DEFECTS = [
  { id: "wifi", title: "Wifi not working", Icon: WifiOff },
  { id: "mic", title: "Speaker or microphone issue", Icon: MicOff },
  { id: "faceid", title: "Face ID not working", Icon: ScanFace },
  { id: "charge", title: "Charging port not working", Icon: BatteryWarning },
  { id: "camera", title: "Camera front/back not working", Icon: CameraOff },
  { id: "bluetooth", title: "Bluetooth not working", Icon: BluetoothOff },
  { id: "fingerprint", title: "Fingerprint not working", Icon: Fingerprint },
];

const AGE_OPTIONS = [
  { id: "0_3", label: "Below 3 months", weight: 0 },
  { id: "3_6", label: "3 - 6 months", weight: 0.1 },
  { id: "6_11", label: "6 - 11 months", weight: 0.2 },
  { id: "11_plus", label: "Above 11 months", weight: 0.35 },
];

// ----------------- State Machine Definition ----------------- //
type Step = 
  "brand" | "model" | "city" | "variant" | "estimate" | 
  "accessories" | "hardware_defects" | "software_defects" | 
  "battery" | "age" | "quote" | "checkout" | "thank_you";

function SellFlow() {
  const searchParams = useSearchParams();
  const initialBrand = searchParams.get("brand");

  const [step, setStep] = useState<Step>("brand");
  
  // Selection States
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<{ id: string; name: string } | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<{ id: string; name: string } | null>(null);
  const [mobileTurnsOn, setMobileTurnsOn] = useState<boolean | null>(null);
  
  const [accessories, setAccessories] = useState({
    box: true,
    charger: true,
    invoice: true,
    warranty: true
  });

  const [selectedHardwareDefects, setSelectedHardwareDefects] = useState<string[]>([]);
  const [selectedSoftwareDefects, setSelectedSoftwareDefects] = useState<string[]>([]);
  
  const [batteryHealthInput, setBatteryHealthInput] = useState<string>("");
  const [batteryTypeSelection, setBatteryTypeSelection] = useState<"Poor"|"Average"|"High"|null>(null);
  
  const [deviceAge, setDeviceAge] = useState<string | null>(null);

  // API state
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [priceBreakdown, setPriceBreakdown] = useState<{ label: string; amount: number; type: string }[]>([]);
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "", phone: "", altPhone: "", email: "", address: ""
  });
  const [formErrors, setFormErrors] = useState({
    name: "", phone: "", altPhone: "", email: "", address: ""
  });
  
  const [searchQuery, setSearchQuery] = useState("");

  const validateCheckout = () => {
    let valid = true;
    const errors = { name: "", phone: "", altPhone: "", email: "", address: "" };
    
    if (!formData.name.trim()) { errors.name = "Name is required"; valid = false; }
    if (!formData.email.trim()) { errors.email = "Email is required"; valid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { errors.email = "Invalid format"; valid = false; }
    if (!formData.phone.trim()) { errors.phone = "Phone is required"; valid = false; }
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) { errors.phone = "Must be 10 digits"; valid = false; }
    if (formData.altPhone && !/^\d{10}$/.test(formData.altPhone.replace(/\D/g, ''))) { errors.altPhone = "Must be 10 digits"; valid = false; }
    if (!formData.address.trim()) { errors.address = "Address is required"; valid = false; }
    else if (formData.address.length < 10) { errors.address = "Provide full address"; valid = false; }
    
    setFormErrors(errors);
    return valid;
  };

  // History Tracking for Progress / Navigation
  const historyOrder: Step[] = [
    "brand", "model", "city", "variant", "estimate", 
    "accessories", "hardware_defects", "software_defects", 
    "battery", "age", "quote", "checkout", "thank_you"
  ];
  const currentStepIndex = historyOrder.indexOf(step);

  // Call the calculate API when moving to quote step
  const goToQuote = async () => {
    if (!selectedModel || !selectedBrand || !selectedVariant || !deviceAge) return;
    setPriceLoading(true);
    setPriceError(null);
    try {
      const res = await fetch("/api/sell/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelId: selectedModel.id,
          brandId: selectedBrand,
          variantId: selectedVariant.id,
          mobileTurnsOn: mobileTurnsOn ?? true,
          accessories,
          hardwareDefects: selectedHardwareDefects,
          softwareDefects: selectedSoftwareDefects,
          batteryHealth: batteryHealthInput ? parseInt(batteryHealthInput) : null,
          batteryQuality: batteryTypeSelection,
          deviceAge,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCalculatedPrice(data.finalPrice);
        setPriceBreakdown(data.breakdown);
        setStep("quote");
      } else {
        setPriceError(data.error || "Could not calculate price");
      }
    } catch {
      setPriceError("Network error — please try again");
    } finally {
      setPriceLoading(false);
    }
  };

  useEffect(() => {
    if (initialBrand && step === "brand" && !selectedBrand) {
      const brandObj = BRANDS.find((b) => b.id === initialBrand);
      if (brandObj) {
        setSelectedBrand(brandObj.id);
        setStep("model");
      }
    }
  }, [initialBrand, step, selectedBrand]);

  const goBack = () => {
    if (currentStepIndex > 0 && step !== "thank_you") {
      setStep(historyOrder[currentStepIndex - 1]);
      setSearchQuery("");
      if (step === "estimate") setMobileTurnsOn(null);
    }
  };

  const handleToggleArr = (setArr: React.Dispatch<React.SetStateAction<string[]>>, id: string) => {
    setArr(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
  };

  const activeBrandObj = BRANDS.find((b) => b.id === selectedBrand);
  const availableModels = selectedBrand && MODELS[selectedBrand] ? MODELS[selectedBrand] : [];
  
  const filteredBrands = BRANDS.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredModels = availableModels.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredCities = CITIES.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

  // Formatting utils
  const getBatteryDisplay = () => {
     if (selectedBrand === "apple") return batteryHealthInput ? `${batteryHealthInput}%` : "Not Specified";
     return batteryTypeSelection || "Not Specified";
  };
  
  const getAgeDisplay = () => {
     return AGE_OPTIONS.find(a => a.id === deviceAge)?.label || "Not Specified";
  };

  const displayPrice = calculatedPrice ?? 0;

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
      <TopBar />
      <Header />
      
      <main className="flex-grow flex flex-col py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        
        {/* Progress Tracker (hidden on early/late steps) */}
        {currentStepIndex >= 4 && currentStepIndex <= 10 && (
          <div className="mb-8">
              <div className="flex justify-between text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                 <span>Device Info</span>
                 <span className={currentStepIndex >= 4 ? "text-blue-600" : ""}>Estimate</span>
                 <span className={currentStepIndex >= 5 ? "text-blue-600" : ""}>Details</span>
                 <span className={currentStepIndex >= 10 ? "text-blue-600" : ""}>Quote</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-500 ease-out" 
                    style={{ width: `${Math.max(10, ((currentStepIndex) / 10) * 100)}%` }} 
                  />
              </div>
          </div>
        )}

        {/* Back Button */}
        {step !== "brand" && step !== "thank_you" && (
          <button 
            onClick={goBack} 
            className="flex items-center text-sm font-semibold text-gray-500 hover:text-green-600 mb-6 transition-colors w-fit bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>
        )}

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-10 mb-10 relative min-h-[500px]">
          <AnimatePresence mode="wait">
            
            {/* ------------ VIEW 1: BRAND ------------ */}
            {step === "brand" && (
              <motion.div key="brand" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="text-center mb-8">
                  <h1 className="text-3xl md:text-4xl font-black text-blue-950 mb-3 tracking-tight">Sell Old Mobile Phone</h1>
                  <p className="text-gray-500 text-lg">Select the brand of the phone you want to sell</p>
                </div>
                {/* Search */}
                <div className="relative max-w-2xl mx-auto mb-10 group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-green-500" />
                  </div>
                  <input type="text" placeholder="Search your brand..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="block w-full pl-11 pr-4 py-4 border-2 border-gray-200 rounded-xl leading-5 focus:outline-none focus:border-green-500 text-gray-900 font-medium text-lg"/>
                </div>
                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredBrands.map((brand) => (
                    <button key={brand.id} onClick={() => { setSelectedBrand(brand.id); setSearchQuery(""); setStep("model"); }} className="flex flex-col items-center justify-center p-6 bg-white border-2 border-gray-100 rounded-xl hover:border-green-500 hover:shadow-lg transition-all">
                      <Image src={brand.logo} alt={brand.name} width={64} height={64} className="object-contain h-16 mb-3" />
                      <span className="font-semibold text-gray-700">{brand.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ------------ VIEW 2: MODEL ------------ */}
            {step === "model" && (
              <motion.div key="model" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="text-center mb-8">
                  <h1 className="text-3xl md:text-4xl font-black text-blue-950 mb-3">Select Model</h1>
                  <p className="inline-block font-bold text-gray-900 bg-gray-100 px-4 py-2 rounded-full">{activeBrandObj?.name}</p>
                </div>
                <div className="relative max-w-2xl mx-auto mb-10 group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-green-500" />
                  </div>
                  <input type="text" placeholder={`Search models...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="block w-full pl-11 pr-4 py-4 border-2 border-gray-200 rounded-xl text-lg font-medium focus:outline-none focus:border-green-500"/>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredModels.map((model) => (
                    <button key={model.id} onClick={() => { setSelectedModel(model); setSearchQuery(""); setStep("city"); }} className="flex items-center gap-4 p-4 text-left border-2 border-gray-100 rounded-xl hover:border-blue-500 hover:shadow-md transition-all group">
                      <Smartphone className="w-8 h-8 p-1.5 bg-gray-50 rounded-lg text-gray-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-colors" />
                      <span className="font-semibold text-gray-800 text-base flex-1">{model.name}</span>
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ------------ VIEW 3: CITY ------------ */}
            {step === "city" && (
              <motion.div key="city" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <MapPin className="w-16 h-16 mx-auto text-blue-500 bg-blue-50 p-4 rounded-full mb-4" />
                  <h1 className="text-3xl md:text-4xl font-black text-blue-950 mb-3">Where are you located?</h1>
                </div>
                <div className="relative mb-8">
                  <Search className="absolute top-4 left-4 h-5 w-5 text-gray-400" />
                  <input type="text" placeholder="Search your city..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="block w-full pl-11 pr-4 py-4 border-2 border-gray-200 rounded-xl text-lg font-medium focus:outline-none focus:border-green-500"/>
                </div>
                <div className="space-y-3">
                  {filteredCities.map((city) => (
                    <button key={city} onClick={() => { setSelectedCity(city); setSearchQuery(""); setStep("variant"); }} className="w-full flex items-center p-5 text-left border-2 border-gray-100 rounded-xl hover:border-green-500 transition-all group">
                      <MapPin className="w-6 h-6 mr-4 text-gray-400 group-hover:text-green-500" />
                      <span className="font-bold text-gray-800 text-lg flex-1">{city}</span>
                      <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-green-500" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ------------ VIEW 4: VARIANT SELECT ------------ */}
            {step === "variant" && (
               <motion.div key="variant" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                 <div className="text-center mb-8">
                   <h1 className="text-3xl md:text-4xl font-black text-blue-950 mb-4">Choose Variant</h1>
                   <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                     <Smartphone className="w-4 h-4 text-gray-600"/>
                     <span className="font-bold text-gray-900">{selectedModel?.name}</span>
                   </div>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                   {VARIANTS.map((variant) => (
                     <button key={variant.id} onClick={() => { setSelectedVariant(variant); setStep("estimate"); }} className="group flex flex-col justify-center items-center py-8 border-2 border-gray-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50/30 transition-all">
                        <Cpu className="w-10 h-10 text-gray-400 mb-4 group-hover:text-blue-500 transition-colors" />
                        <span className="font-bold text-gray-800 text-xl">{variant.name}</span>
                     </button>
                   ))}
                 </div>
               </motion.div>
            )}

            {/* ------------ VIEW 5: ESTIMATE & TURN ON ------------ */}
            {step === "estimate" && (
              <motion.div key="estimate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-xl mx-auto text-center">
                 <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-blue-100 rounded-3xl p-8 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <Banknote className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h2 className="text-gray-500 font-bold mb-2 uppercase tracking-wide">Expected Value</h2>
                    <div className="text-5xl font-black text-blue-950 mb-4">₹{"Best Price Guaranteed"}</div>
                    <p className="text-sm text-red-500 bg-red-50 py-2 px-4 rounded-xl flex items-center justify-center gap-2 font-medium border border-red-100">
                      <HelpCircle className="w-4 h-4"/>
                      Price may differ based on the condition of the mobile.
                    </p>
                 </div>
                 <div className="mb-10 text-left">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Is your mobile able to turn on?</h3>
                    <div className="flex gap-4">
                      <button onClick={() => setMobileTurnsOn(true)} className={`flex-1 py-4 text-lg font-bold rounded-xl border-2 transition-all ${mobileTurnsOn === true ? "bg-green-50 border-green-500 text-green-700" : "border-gray-200 text-gray-600 hover:border-green-300"}`}>
                        Yes
                      </button>
                      <button onClick={() => setMobileTurnsOn(false)} className={`flex-1 py-4 text-lg font-bold rounded-xl border-2 transition-all ${mobileTurnsOn === false ? "bg-red-50 border-red-500 text-red-700" : "border-gray-200 text-gray-600 hover:border-red-300"}`}>
                        No
                      </button>
                    </div>
                 </div>
                 <button disabled={mobileTurnsOn === null} onClick={() => setStep(mobileTurnsOn ? "accessories" : "quote")} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg">
                   Get Exact Value
                 </button>
              </motion.div>
            )}

            {/* ------------ VIEW 6: ACCESSORIES ------------ */}
            {step === "accessories" && (
               <motion.div key="accessories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto">
                 <div className="text-center mb-10">
                   <h1 className="text-3xl font-black text-blue-950 mb-3">Device Questionnaire</h1>
                   <p className="text-gray-500 text-lg">Do you have the following accessories available?</p>
                 </div>
                 <div className="space-y-6 mb-10">
                   {[
                     { id: "box", label: "Original Box" },
                     { id: "charger", label: "Original Charger" },
                     { id: "invoice", label: "Original Invoice (Bill)" },
                     { id: "warranty", label: "Is your device under warranty?" },
                   ].map((item) => (
                     <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white border-2 border-gray-100 rounded-xl hover:border-blue-100 gap-4">
                       <span className="font-bold text-gray-700 text-lg">{item.label}</span>
                       <div className="flex gap-3">
                         <button onClick={() => setAccessories(prev => ({ ...prev, [item.id]: true }))} className={`px-6 py-2 font-bold rounded-lg border-2 transition-colors ${accessories[item.id as keyof typeof accessories] ? "bg-green-50 border-green-500 text-green-700" : "border-gray-200 text-gray-500"}`}>Yes</button>
                         <button onClick={() => setAccessories(prev => ({ ...prev, [item.id]: false }))} className={`px-6 py-2 font-bold rounded-lg border-2 transition-colors ${!accessories[item.id as keyof typeof accessories] ? "bg-red-50 border-red-500 text-red-700" : "border-gray-200 text-gray-500"}`}>No</button>
                       </div>
                     </div>
                   ))}
                 </div>
                 <button onClick={() => setStep("hardware_defects")} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all text-lg flex justify-center items-center gap-2">
                   Continue <ChevronRight className="w-5 h-5"/>
                 </button>
               </motion.div>
            )}

            {/* ------------ VIEW 7: HARDWARE DEFECTS ------------ */}
            {step === "hardware_defects" && (
              <motion.div key="hardware" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                 <div className="text-center mb-8">
                   <h1 className="text-3xl font-black text-blue-950 mb-3">Select Mobile Defects</h1>
                   <p className="text-amber-600 bg-amber-50 px-4 py-2 rounded-xl inline-flex font-semibold text-sm border border-amber-200">
                     Warning: Please provide accurate details.
                   </p>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                   {HARDWARE_DEFECTS.map((defect) => {
                     const isSelected = selectedHardwareDefects.includes(defect.id);
                     return (
                       <button key={defect.id} onClick={() => handleToggleArr(setSelectedHardwareDefects, defect.id)} className={`relative flex flex-col items-center p-6 border-2 rounded-2xl transition-all text-center h-full ${isSelected ? "border-green-500 bg-green-50/30" : "border-gray-200 bg-white hover:border-green-300"}`}>
                         {isSelected && <div className="absolute top-4 right-4 text-green-500"><CheckCircle className="w-6 h-6 fill-green-100" /></div>}
                         <div className={`mb-6 p-4 rounded-full ${isSelected ? "text-green-600" : "text-gray-600 bg-gray-50"}`}><defect.Icon /></div>
                         <h3 className={`font-bold mt-auto ${isSelected ? "text-gray-900" : "text-gray-600"}`}>{defect.title}</h3>
                       </button>
                     );
                   })}
                 </div>
                 <div className="max-w-xl mx-auto">
                    <button onClick={() => setStep("software_defects")} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-[0_4px_20px_rgba(37,99,235,0.4)] transition-all text-lg">Continue</button>
                 </div>
              </motion.div>
            )}

            {/* ------------ VIEW 8: SOFTWARE ISSUES ------------ */}
            {step === "software_defects" && (
              <motion.div key="software" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                 <div className="text-center mb-8">
                   <h1 className="text-3xl font-black text-blue-950 mb-3">Software / Functional Issues</h1>
                   <p className="text-gray-500 text-lg">Select any internal features that are not working</p>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 text-center">
                    {SOFTWARE_DEFECTS.map((defect) => {
                       const isSelected = selectedSoftwareDefects.includes(defect.id);
                       return (
                         <button key={defect.id} onClick={() => handleToggleArr(setSelectedSoftwareDefects, defect.id)} className={`relative flex flex-col items-center p-6 border-2 rounded-2xl transition-all h-full ${isSelected ? "border-green-500 bg-green-50/30" : "border-gray-200 bg-white hover:border-green-300"}`}>
                           {isSelected && <div className="absolute top-4 right-4 text-green-500"><CheckCircle className="w-6 h-6 fill-green-100" /></div>}
                           <div className={`mb-4 p-4 rounded-full ${isSelected ? "text-green-600 bg-green-100" : "text-gray-500 bg-gray-50"}`}><defect.Icon className="w-8 h-8" /></div>
                           <h3 className={`font-bold mt-auto ${isSelected ? "text-gray-900" : "text-gray-600"}`}>{defect.title}</h3>
                         </button>
                       );
                    })}
                 </div>
                 <div className="max-w-xl mx-auto">
                    <button onClick={() => setStep("battery")} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all text-lg">Continue</button>
                 </div>
              </motion.div>
            )}

            {/* ------------ VIEW 9: BATTERY ------------ */}
            {step === "battery" && (
               <motion.div key="battery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-xl mx-auto text-center">
                 <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex justify-center items-center mx-auto mb-6">
                    <Battery className="w-10 h-10" />
                 </div>
                 <h1 className="text-3xl font-black text-blue-950 mb-6">Battery Health</h1>
                 
                 {selectedBrand === "apple" ? (
                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 mb-8">
                       <p className="text-gray-600 font-medium mb-4">Enter maximum capacity shown in iPhone Battery Settings</p>
                       <div className="relative max-w-xs mx-auto text-left">
                          <input type="number" min="0" max="100" value={batteryHealthInput} onChange={e => setBatteryHealthInput(e.target.value)} placeholder="e.g. 85" className="w-full text-4xl font-black text-center py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 text-gray-800 bg-white"/>
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">%</span>
                       </div>
                    </div>
                 ) : (
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                       {["Poor", "Average", "High"].map((bType) => (
                          <button key={bType} onClick={() => setBatteryTypeSelection(bType as any)} className={`flex-1 py-4 font-bold rounded-xl border-2 transition-all text-lg ${batteryTypeSelection === bType ? "bg-green-50 border-green-500 text-green-700" : "border-gray-200 text-gray-600 hover:border-green-300"}`}>
                             {bType}
                          </button>
                       ))}
                    </div>
                 )}
                 <button 
                  disabled={(selectedBrand === "apple" && !batteryHealthInput) || (selectedBrand !== "apple" && !batteryTypeSelection)} 
                  onClick={() => setStep("age")} 
                  className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg disabled:opacity-50 transition-all text-lg"
                 >
                   Continue
                 </button>
               </motion.div>
            )}

            {/* ------------ VIEW 10: AGE CALCULATION ------------ */}
            {step === "age" && (
              <motion.div key="age" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-xl mx-auto text-center">
                 <h1 className="text-3xl font-black text-blue-950 mb-3">Device Age</h1>
                 <p className="text-gray-500 text-lg mb-8">When did you purchase this device?</p>
                 <div className="space-y-4 mb-10">
                    {AGE_OPTIONS.map((age) => (
                       <button key={age.id} onClick={() => setDeviceAge(age.id)} className={`w-full p-4 rounded-xl border-2 font-bold text-lg text-left transition-all flex items-center justify-between ${deviceAge === age.id ? "border-green-500 bg-green-50 text-green-800" : "border-gray-200 text-gray-700 hover:border-green-300"}`}>
                          <span>{age.label}</span>
                          {deviceAge === age.id && <CheckCircle className="w-6 h-6 text-green-500"/>}
                       </button>
                    ))}
                 </div>
                 {priceError && (
                   <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium flex items-center gap-2">
                     <AlertCircle className="w-4 h-4"/> {priceError}
                   </div>
                 )}
                 <button 
                   disabled={!deviceAge || priceLoading} 
                   onClick={goToQuote} 
                   className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg disabled:opacity-50 transition-all text-lg flex justify-center items-center gap-2"
                 >
                   {priceLoading ? (
                     <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Calculating...</>
                   ) : "Check Exact Value"}
                 </button>
              </motion.div>
            )}

            {/* ------------ VIEW 11: FINAL QUOTE ------------ */}
            {step === "quote" && (
               <motion.div key="quote" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto">
                 <div className="text-center mb-8">
                   <h1 className="text-3xl md:text-5xl font-black text-blue-950 mb-2">Selling Value</h1>
                   <p className="text-gray-500 text-lg">Based on your evaluation</p>
                 </div>
                 <div className="grid md:grid-cols-2 gap-8 items-start mb-10">
                    {/* Device Summary Card */}
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                       <div className="flex gap-6 items-center mb-6">
                          <div className="w-24 h-24 bg-white border border-gray-200 rounded-xl flex items-center justify-center p-2 relative shadow-sm">
                             <Image src="/hero-devices.png" alt="Device" fill className="object-cover opacity-70 rounded-lg"/>
                          </div>
                          <div>
                             <h2 className="text-2xl font-bold text-gray-900">{selectedModel?.name}</h2>
                             <p className="text-gray-500">{selectedVariant?.name}</p>
                          </div>
                       </div>
                       <div className="space-y-3 pt-4 border-t border-gray-200 text-sm">
                          <div className="flex justify-between"><span className="text-gray-500">City:</span><span className="font-semibold text-gray-800">{selectedCity}</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Age:</span><span className="font-semibold text-gray-800">{getAgeDisplay()}</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Battery:</span><span className="font-semibold text-gray-800">{getBatteryDisplay()}</span></div>
                       </div>
                       {/* Price Breakdown */}
                       {priceBreakdown.length > 0 && (
                         <div className="mt-4 pt-4 border-t border-gray-200">
                           <p className="text-sm font-semibold text-gray-700 mb-2">Price Breakdown</p>
                           <ul className="space-y-1">
                             {priceBreakdown.map((item, i) => (
                               <li key={i} className="flex justify-between text-xs">
                                 <span className="text-gray-500">{item.label}</span>
                                 <span className={item.type === "deduction" ? "text-red-500 font-semibold" : "text-green-600 font-semibold"}>
                                   {item.amount > 0 ? "+" : ""}₹{Math.abs(item.amount).toLocaleString()}
                                 </span>
                               </li>
                             ))}
                           </ul>
                         </div>
                       )}
                    </div>
                    
                    {/* Price Card */}
                    <div className="bg-white rounded-2xl p-8 border-2 border-green-500 shadow-xl shadow-green-500/10 text-center relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                       <p className="text-green-600 font-bold mb-2 uppercase tracking-widest text-sm">MobiQ Quoted Price</p>
                       <div className="text-5xl md:text-6xl font-black text-blue-950 mb-6 py-4">₹{displayPrice.toLocaleString()}</div>
                       <p className="text-gray-500 mb-8 text-sm">Valid for 3 days. Doorstep pickup available.</p>
                       
                       <button onClick={() => setStep("checkout")} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all text-lg flex justify-center items-center gap-2">
                         Proceed to Sell <ChevronRight className="w-5 h-5"/>
                       </button>
                    </div>
                 </div>
               </motion.div>
            )}

            {/* ------------ VIEW 12: CHECKOUT LEAD FORM ------------ */}
            {step === "checkout" && (
              <motion.div key="checkout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto">
                 <div className="text-center mb-8">
                   <h1 className="text-3xl font-black text-blue-950 mb-3">Almost done!</h1>
                   <p className="text-gray-500 text-lg">Provide your details to schedule a free pickup.</p>
                 </div>
                 
                 <div className="bg-white border text-left border-gray-200 shadow-sm rounded-2xl p-6 sm:p-8 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                       <div className="space-y-1">
                          <label className="text-sm font-semibold text-gray-700">Full Name</label>
                          <input type="text" value={formData.name} onChange={e => {setFormData(p => ({...p, name: e.target.value})); setFormErrors(p => ({...p, name:""}))}} className={`w-full border-2 rounded-lg p-3 focus:outline-none transition-colors bg-gray-50 focus:bg-white ${formErrors.name ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}/>
                          {formErrors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {formErrors.name}</p>}
                       </div>
                       <div className="space-y-1">
                          <label className="text-sm font-semibold text-gray-700">Email Address</label>
                          <input type="email" value={formData.email} onChange={e => {setFormData(p => ({...p, email: e.target.value})); setFormErrors(p => ({...p, email:""}))}} className={`w-full border-2 rounded-lg p-3 focus:outline-none transition-colors bg-gray-50 focus:bg-white ${formErrors.email ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}/>
                          {formErrors.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {formErrors.email}</p>}
                       </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                       <div className="space-y-1">
                          <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                          <input type="tel" value={formData.phone} onChange={e => {setFormData(p => ({...p, phone: e.target.value})); setFormErrors(p => ({...p, phone:""}))}} className={`w-full border-2 rounded-lg p-3 focus:outline-none transition-colors bg-gray-50 focus:bg-white ${formErrors.phone ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}/>
                          {formErrors.phone && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {formErrors.phone}</p>}
                       </div>
                       <div className="space-y-1">
                          <label className="text-sm font-semibold text-gray-700">Alternative Phone (Optional)</label>
                          <input type="tel" value={formData.altPhone} onChange={e => {setFormData(p => ({...p, altPhone: e.target.value})); setFormErrors(p => ({...p, altPhone:""}))}} className={`w-full border-2 rounded-lg p-3 focus:outline-none transition-colors bg-gray-50 focus:bg-white ${formErrors.altPhone ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}/>
                          {formErrors.altPhone && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {formErrors.altPhone}</p>}
                       </div>
                    </div>
                    <div className="space-y-1">
                       <label className="text-sm font-semibold text-gray-700">Pick-up Address</label>
                       <textarea rows={3} value={formData.address} onChange={e => {setFormData(p => ({...p, address: e.target.value})); setFormErrors(p => ({...p, address:""}))}} placeholder="Complete address including PIN code" className={`w-full border-2 rounded-lg p-3 focus:outline-none transition-colors bg-gray-50 focus:bg-white ${formErrors.address ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}></textarea>
                       {formErrors.address && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {formErrors.address}</p>}
                    </div>
                    <button 
                       onClick={async () => {
                         if (!validateCheckout()) return;
                         setSubmitLoading(true);
                         try {
                           const res = await fetch("/api/sell/submit", {
                             method: "POST",
                             headers: { "Content-Type": "application/json" },
                             body: JSON.stringify({
                               brandId: selectedBrand,
                               brandName: BRANDS.find(b => b.id === selectedBrand)?.name ?? "",
                               modelId: selectedModel?.id ?? "",
                               modelName: selectedModel?.name ?? "",
                               variantId: selectedVariant?.id ?? "",
                               variantName: selectedVariant?.name ?? "",
                               city: selectedCity ?? "",
                               mobileTurnsOn: mobileTurnsOn ?? true,
                               accessories,
                               hardwareDefects: selectedHardwareDefects,
                               softwareDefects: selectedSoftwareDefects,
                               batteryHealth: batteryHealthInput ? parseInt(batteryHealthInput) : null,
                               batteryQuality: batteryTypeSelection,
                               deviceAge: deviceAge ?? "",
                               quotedPrice: displayPrice,
                               customerName: formData.name,
                               customerPhone: formData.phone,
                               customerAltPhone: formData.altPhone,
                               customerEmail: formData.email,
                               customerAddress: formData.address,
                             }),
                           });
                           const data = await res.json();
                           if (data.success) {
                             setLeadId(data.leadId);
                             setStep("thank_you");
                           } else {
                             setFormErrors(p => ({ ...p, name: data.error || "Submission failed. Please try again." }));
                           }
                         } catch (err) {
                           setFormErrors(p => ({ ...p, name: "Network error. Please try again." }));
                         } finally {
                           setSubmitLoading(false);
                         }
                       }}
                       disabled={submitLoading}
                       className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-4 rounded-xl shadow-lg transition-all text-lg mt-4 flex items-center justify-center gap-2"
                     >
                       {submitLoading
                         ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block"/> Submitting...</>
                         : "Submit Details"}
                     </button>
                 </div>
              </motion.div>
            )}

            {/* ------------ VIEW 13: THANK YOU ------------ */}
            {step === "thank_you" && (
              <motion.div key="thank_you" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10 max-w-xl mx-auto">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                   <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
                   <CheckCircle className="w-12 h-12 text-green-600 relative z-10" />
                </div>
                <h1 className="text-4xl font-black text-blue-950 mb-4 tracking-tight">Thank You!</h1>
                <p className="text-gray-500 text-lg mb-4 leading-relaxed">
                  Your request to sell the <strong className="text-gray-800">{selectedModel?.name}</strong> has been received. Our executive will reach out within <strong className="text-gray-700">24 hours</strong> to schedule your free doorstep pickup.
                </p>
                {leadId && (
                  <p className="text-sm text-gray-400 mb-6">Reference ID: <code className="bg-gray-100 px-2 py-1 rounded font-mono text-gray-600">{leadId}</code></p>
                )}
                {/* Price Disclaimer Warning */}
                <div className="mb-8 p-5 bg-amber-50 border border-amber-300 rounded-2xl text-left">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <HelpCircle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-bold text-amber-800 mb-1">Price Disclaimer</p>
                      <p className="text-amber-700 text-sm leading-relaxed">
                        The quoted price of <strong>&#8377;{displayPrice.toLocaleString()}</strong> is based on the details you provided. If our technician finds any <strong>unreported defects</strong>, inaccurate condition details, or <strong>missing accessories</strong> during physical inspection, <strong>the final offered price may be revised downward</strong>. Please ensure all details are accurate to avoid any difference at pickup.
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-8">A confirmation email has been sent to <strong className="text-gray-600">{formData.email}</strong></p>
                <Link href="/" className="px-10 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/30 transition-all inline-block hover:-translate-y-1">
                  Return to Home
                </Link>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-600 rounded-full animate-spin"></div></div>}>
      <SellFlow />
    </Suspense>
  );
}
