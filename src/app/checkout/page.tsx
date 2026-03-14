"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Lock, ShieldCheck, MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Step = 1 | 2 | 3;

export default function CheckoutPage() {
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [completedSteps, setCompletedSteps] = useState<Step[]>([]);

    // Form States
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();

    const completeStep = (step: Step) => {
        if (!completedSteps.includes(step)) {
            setCompletedSteps([...completedSteps, step]);
        }
        setCurrentStep(Math.min(step + 1, 3) as Step);
    };

    const handlePhoneSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isOtpSent) {
            setIsOtpSent(true);
            toast.success("OTP Sent!", { description: "Current mock OTP is auto-filled." });
            setOtp("123456");
        } else {
            completeStep(1);
            toast.success("Phone verified securely.");
        }
    };

    const handlePlaceOrder = () => {
        setIsProcessing(true);
        toast.loading("Processing Payment...", { id: "payment-toast" });
        setTimeout(() => {
            toast.success("Payment Received! Order Confirmed.", { id: "payment-toast" });
            router.push("/order-success");
        }, 2000);
    };

    const StepHeader = ({ step, title, icon: Icon }: { step: Step, title: string, icon: any }) => {
        const isActive = currentStep === step;
        const isCompleted = completedSteps.includes(step) && !isActive;

        return (
            <button
                onClick={() => completedSteps.includes(step) && setCurrentStep(step)}
                disabled={!completedSteps.includes(step) && currentStep !== step}
                className={`w-full flex items-center justify-between p-6 transition-colors ${isActive ? "bg-zinc-50 dark:bg-zinc-800/50" : "hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30"
                    } ${(!completedSteps.includes(step) && currentStep !== step) ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
            >
                <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${isCompleted
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : isActive
                            ? "bg-black text-white dark:bg-white dark:text-black shadow-md ring-4 ring-black/10 dark:ring-white/10"
                            : "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                        }`}>
                        {isCompleted ? <Check className="w-4 h-4" /> : step}
                    </div>
                    <h2 className={`text-lg font-semibold tracking-tight ${isActive || isCompleted ? "text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400"
                        }`}>
                        {title}
                    </h2>
                </div>
                <Icon className={`w-5 h-5 ${isActive ? "text-zinc-900 dark:text-white" : "text-zinc-400"}`} />
            </button>
        );
    };

    const [summaryOpen, setSummaryOpen] = useState(false);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-6 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-center mb-10 opacity-60">
                    <Lock className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium tracking-wide uppercase">Secure Checkout</span>
                </div>

                {/* Mobile Order Summary (collapsed by default) */}
                <div className="lg:hidden mb-4">
                    <button
                        onClick={() => setSummaryOpen(!summaryOpen)}
                        className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm"
                    >
                        <span className="font-semibold text-zinc-900 dark:text-white text-sm">Order Summary — ₹45,999</span>
                        <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${summaryOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {summaryOpen && (
                        <div className="mt-2 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm">
                            <div className="flex gap-3 mb-3">
                                <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-xl flex-shrink-0">📱</div>
                                <div><p className="font-medium text-zinc-900 dark:text-white text-sm leading-tight">iPhone 15 Pro Max</p>
                                    <p className="text-xs text-zinc-500 mt-0.5">Natural Titanium, 256GB</p>
                                    <p className="font-bold text-zinc-900 dark:text-white mt-1 text-sm">₹45,499</p>
                                </div>
                            </div>
                            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3 space-y-1.5">
                                <div className="flex justify-between text-xs text-zinc-500"><span>Subtotal</span><span>₹45,499</span></div>
                                <div className="flex justify-between text-xs"><span className="text-zinc-500">Shipping</span><span className="text-emerald-600 font-medium">Free</span></div>
                                <div className="flex justify-between text-xs text-zinc-500"><span>Taxes</span><span>₹500</span></div>
                                <div className="flex justify-between font-bold text-zinc-900 dark:text-white pt-1 border-t border-zinc-100 dark:border-zinc-800"><span>Total</span><span>₹45,999</span></div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Checkout Accordion */}
                    <div className="flex-1 space-y-4">
                        {/* Step 1: Authentication */}
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm">
                            <StepHeader step={1} title="Login / Phone Verification" icon={ShieldCheck} />
                            <AnimatePresence>
                                {currentStep === 1 && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-zinc-100 dark:border-zinc-800/50"
                                    >
                                        <div className="p-6 sm:p-8">
                                            <form onSubmit={handlePhoneSubmit} className="max-w-md">
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                                            Phone Number
                                                        </label>
                                                        <input
                                                            type="tel"
                                                            disabled={isOtpSent}
                                                            value={phone}
                                                            onChange={(e) => setPhone(e.target.value)}
                                                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all disabled:opacity-50 text-zinc-900 dark:text-white"
                                                            placeholder="+91 98765 43210"
                                                        />
                                                    </div>
                                                    <AnimatePresence>
                                                        {isOtpSent && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="pt-2"
                                                            >
                                                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                                                    Enter OTP
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={otp}
                                                                    onChange={(e) => setOtp(e.target.value)}
                                                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-zinc-900 dark:text-white"
                                                                    placeholder="123456"
                                                                />
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                    <button
                                                        type="submit"
                                                        className="w-full py-3.5 px-4 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black rounded-xl font-medium transition-colors"
                                                    >
                                                        {isOtpSent ? "Verify & Continue" : "Send OTP"}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Step 2: Address */}
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm">
                            <StepHeader step={2} title="Delivery Address" icon={MapPin} />
                            <AnimatePresence>
                                {currentStep === 2 && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-zinc-100 dark:border-zinc-800/50"
                                    >
                                        <div className="p-6 sm:p-8">
                                            <form onSubmit={(e) => { e.preventDefault(); completeStep(2); }} className="space-y-5">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                    <div>
                                                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Full Name</label>
                                                        <input type="text" required className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-zinc-900 dark:text-white" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Pincode</label>
                                                        <input type="text" maxLength={6} required className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-zinc-900 dark:text-white" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Door No & Street</label>
                                                    <input type="text" required className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-zinc-900 dark:text-white" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Landmark (Optional)</label>
                                                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-zinc-900 dark:text-white" />
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="mt-2 py-3.5 px-8 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black rounded-xl font-medium transition-colors inline-block"
                                                >
                                                    Deliver Here
                                                </button>
                                            </form>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Step 3: Payment */}
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm">
                            <StepHeader step={3} title="Payment Options" icon={Lock} />
                            <AnimatePresence>
                                {currentStep === 3 && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-zinc-100 dark:border-zinc-800/50"
                                    >
                                        <div className="p-6 sm:p-8 space-y-4">
                                            {["UPI (Google Pay, PhonePe, Paytm)", "Credit / Debit Card", "Netbanking", "EMI"].map((method, idx) => (
                                                <label key={idx} className="flex items-center p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                                    <input type="radio" name="payment" className="w-4 h-4 text-black dark:text-white border-zinc-300 focus:ring-black dark:focus:ring-white" defaultChecked={idx === 0} />
                                                    <span className="ml-3 font-medium text-zinc-900 dark:text-white">{method}</span>
                                                </label>
                                            ))}

                                            <div className="pt-4">
                                                <button
                                                    onClick={handlePlaceOrder}
                                                    disabled={isProcessing}
                                                    className="w-full relative flex items-center justify-center py-4 px-6 bg-[#3399cc] hover:bg-[#2083b4] disabled:opacity-75 disabled:scale-100 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                                                >
                                                    {isProcessing ? "Processing..." : "Pay ₹45,999"}
                                                    <span className="absolute right-4 opacity-50 text-xs font-normal hidden sm:block">Secured by Razorpay</span>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Sidebar / Order Summary */}
                    <div className="w-full lg:w-96 shrink-0 lg:sticky lg:top-8 self-start">
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                            <h3 className="text-xl font-semibold mb-6 text-zinc-900 dark:text-white">Order Summary</h3>

                            <div className="flex gap-4 mb-6">
                                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden shrink-0">
                                    <div className="w-full h-full flex items-center justify-center text-zinc-400">📱</div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-zinc-900 dark:text-white leading-tight">iPhone 15 Pro Max</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Natural Titanium, 256GB</p>
                                    <p className="font-semibold text-zinc-900 dark:text-white mt-2">₹45,499</p>
                                </div>
                            </div>

                            <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500 dark:text-zinc-400">Subtotal</span>
                                    <span className="font-medium text-zinc-900 dark:text-white">₹45,499</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500 dark:text-zinc-400">Shipping</span>
                                    <span className="font-medium text-emerald-600 dark:text-emerald-400">Free via DTDC</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500 dark:text-zinc-400">Taxes</span>
                                    <span className="font-medium text-zinc-900 dark:text-white">₹500</span>
                                </div>
                            </div>

                            <div className="border-t border-zinc-100 dark:border-zinc-800/80 mt-4 pt-4 flex justify-between items-center">
                                <span className="text-base font-semibold text-zinc-900 dark:text-white">Total</span>
                                <span className="text-2xl font-bold text-zinc-900 dark:text-white">₹45,999</span>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-3 text-center text-xs text-zinc-500 dark:text-zinc-400">
                            <p>By proceeding, you agree to our Terms & Conditions and Privacy Policy.</p>
                            <div className="flex justify-center gap-4 grayscale opacity-60">
                                {/* Visual mock payment icons */}
                                <div className="w-10 h-6 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                <div className="w-10 h-6 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                <div className="w-10 h-6 bg-zinc-200 dark:bg-zinc-800 rounded" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
