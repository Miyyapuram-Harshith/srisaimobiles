"use client";

import React from 'react';
import { CheckCircle2, XCircle, BatteryFull, BatteryMedium, BatteryLow, Fingerprint, Box, ReceiptText, Tags } from 'lucide-react';

interface TrustBadgesProps {
    category: string;
    brand: string;
    condition: string;
    specifications: any; // The JSONB data payload
    trustGrade?: string;
    hasOriginalBox?: boolean;
    hasOriginalBill?: boolean;
    adminRemarks?: string;
}

export default function TrustBadges({
    category,
    brand,
    condition,
    specifications,
    trustGrade,
    hasOriginalBox,
    hasOriginalBill,
    adminRemarks
}: TrustBadgesProps) {

    // Visual helper for Battery Health Colors
    const getBatteryHealthColor = (health: number) => {
        if (health >= 85) return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800';
        if (health >= 80) return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800';
        return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800';
    };

    const getBatteryIcon = (health: number) => {
        if (health >= 85) return <BatteryFull size={20} />;
        if (health >= 80) return <BatteryMedium size={20} />;
        return <BatteryLow size={20} />;
    };

    // Safe checks handling possible nulls in JSONB
    const batteryHealth = specifications?.batteryHealth;
    const faceIdWorking = specifications?.faceIdWorking;
    const trueToneWorking = specifications?.trueToneWorking;

    return (
        <div className="space-y-6">

            {/* Dynamic Grid of Specs (RAM / Storage) based on category */}
            {category === 'Smartphone' && specifications?.storage && (
                <div className="flex gap-4 mb-6">
                    <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
                        <span className="text-xs text-gray-500 uppercase font-semibold">Storage</span>
                        <p className="font-bold text-gray-900 dark:text-white mt-1">{specifications.storage}</p>
                    </div>
                    {specifications?.ram && (
                        <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
                            <span className="text-xs text-gray-500 uppercase font-semibold">RAM</span>
                            <p className="font-bold text-gray-900 dark:text-white mt-1">{specifications.ram}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Used / Pre-Owned Trust Zone */}
            {condition === 'Used' && (
                <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                        <Tags size={20} className="text-blue-600" />
                        Device Validation
                    </h3>

                    <div className="grid grid-cols-2 gap-4">

                        {/* Apple Specific Checks */}
                        {category === 'Smartphone' && brand === 'Apple' && batteryHealth && (
                            <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${getBatteryHealthColor(batteryHealth)}`}>
                                {getBatteryIcon(batteryHealth)}
                                <span className="font-bold mt-2 text-lg">{batteryHealth}%</span>
                                <span className="text-xs font-medium uppercase tracking-wider opacity-80">Battery Health</span>
                            </div>
                        )}

                        {category === 'Smartphone' && brand === 'Apple' && faceIdWorking !== undefined && (
                            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col items-center justify-center text-center">
                                {faceIdWorking ? (
                                    <Fingerprint size={24} className="text-blue-600 mb-2" />
                                ) : (
                                    <XCircle size={24} className="text-red-500 mb-2" />
                                )}
                                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Face ID</span>
                                <span className={`text-xs font-medium mt-1 ${faceIdWorking ? 'text-green-600' : 'text-red-500'}`}>
                                    {faceIdWorking ? 'Working Perfectly' : 'Not Working'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Grading & Remarks Box */}
                    {trustGrade && (
                        <div className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">Condition Grade</span>
                                <span className="px-3 py-1 bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full shadow-sm">
                                    {trustGrade}
                                </span>
                            </div>
                            {adminRemarks && (
                                <p className="text-sm text-blue-800 dark:text-blue-200/80 mt-2 border-t border-blue-200/50 dark:border-blue-800/50 pt-2">
                                    <span className="font-medium">Remarks:</span> {adminRemarks}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Box & Bill Checklist */}
                    <div className="mt-6 flex flex-col gap-3">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Included in the Deal</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                            {hasOriginalBox ? <CheckCircle2 size={18} className="text-green-500" /> : <XCircle size={18} className="text-gray-400" />}
                            <Box size={18} className="opacity-50" />
                            <span className={!hasOriginalBox ? 'line-through opacity-50' : 'font-medium'}>Original Box</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                            {hasOriginalBill ? <CheckCircle2 size={18} className="text-green-500" /> : <XCircle size={18} className="text-gray-400" />}
                            <ReceiptText size={18} className="opacity-50" />
                            <span className={!hasOriginalBill ? 'line-through opacity-50' : 'font-medium'}>Original Bill</span>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
