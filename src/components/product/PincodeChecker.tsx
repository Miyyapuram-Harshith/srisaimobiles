"use client";

import React, { useState } from 'react';
import { Truck, Search } from 'lucide-react';

export default function PincodeChecker() {
    const [pincode, setPincode] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleCheck = (e: React.FormEvent) => {
        e.preventDefault();
        if (pincode.length !== 6) return;

        setStatus('loading');

        // Mock API call
        setTimeout(() => {
            // Just a mock: anything starting with '5' or '6' is deliverable for demo purposes
            if (pincode.startsWith('5') || pincode.startsWith('6')) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        }, 800);
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50 p-4 mt-6">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white mb-3">
                <Truck size={18} className="text-blue-600" />
                Check Delivery Time
            </div>

            <form onSubmit={handleCheck} className="flex gap-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="Enter Pincode"
                        className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                    />
                </div>
                <button
                    type="submit"
                    disabled={pincode.length !== 6 || status === 'loading'}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-900/50 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                    {status === 'loading' ? 'Checking...' : 'Check'}
                </button>
            </form>

            {status === 'success' && (
                <p className="text-green-600 dark:text-green-400 text-xs mt-3 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></span>
                    Delivery available in 2-4 business days.
                </p>
            )}
            {status === 'error' && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-3 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                    Currently not delivering to this pincode.
                </p>
            )}
        </div>
    );
}
