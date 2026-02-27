import Navbar from "@/components/ui/Navbar";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function OrderSuccessPage() {
    return (
        <>
            <Navbar />
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
                <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
                <h1 className="text-4xl font-semibold tracking-tight text-apple-text mb-4">Thank you for your order.</h1>
                <p className="text-apple-text-secondary mb-8">
                    Thank you for your purchase. We&apos;re processing your order and will send you an email with tracking information shortly.
                </p>
                <div className="space-y-4">
                    <Link href="/" className="px-8 py-3 bg-apple-blue text-white rounded-full font-medium hover:bg-apple-blue-hover transition duration-300">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </>
    );
}
