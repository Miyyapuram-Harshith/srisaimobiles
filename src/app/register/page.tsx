import Navbar from "@/components/ui/Navbar";
import Link from "next/link";

export default function RegisterPage() {
    return (
        <>
            <Navbar />
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center">
                    <h1 className="text-3xl font-semibold tracking-tight text-apple-text mb-2">Create an Account</h1>
                    <p className="text-apple-text-secondary mb-8">One account to manage your orders securely.</p>

                    <form className="space-y-4">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                placeholder="First Name"
                                className="w-full px-4 py-3 rounded-lg border border-apple-border bg-apple-card focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all"
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                className="w-full px-4 py-3 rounded-lg border border-apple-border bg-apple-card focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all"
                            />
                        </div>
                        <input
                            type="email"
                            placeholder="name@example.com"
                            className="w-full px-4 py-3 rounded-lg border border-apple-border bg-apple-card focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full px-4 py-3 rounded-lg border border-apple-border bg-apple-card focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all"
                        />
                        <button
                            type="button"
                            className="w-full py-3 bg-apple-blue text-white rounded-lg font-medium hover:bg-apple-blue-hover transition duration-300 mt-6"
                        >
                            Continue
                        </button>
                    </form>

                    <div className="mt-6 text-sm border-t border-apple-border pt-6">
                        <span className="text-apple-text-secondary">Already have an account? </span>
                        <Link href="/login" className="text-apple-blue hover:underline">Sign In.</Link>
                    </div>
                </div>
            </div>
        </>
    );
}
