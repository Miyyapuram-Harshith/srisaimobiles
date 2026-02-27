"use client";

import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppShareProps {
    productName: string;
    price: number;
}

export default function WhatsAppShare({ productName, price }: WhatsAppShareProps) {
    const handleShare = () => {
        // We encode the URL to prevent breaking the link
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(`Hi! I'm interested in the ${productName} listed for ₹${price.toLocaleString('en-IN')}. Is this still available?\n\nCheck it out here: `);

        // Attempting to open WhatsApp directly
        window.open(`https://wa.me/?text=${text}${url}`, '_blank');
    };

    return (
        <button
            onClick={handleShare}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 px-4 rounded-xl font-semibold transition-all active:scale-95 shadow-sm"
        >
            <MessageCircle size={20} />
            Share on WhatsApp
        </button>
    );
}
