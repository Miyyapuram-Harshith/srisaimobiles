"use client";

import React, { useState, useEffect } from "react";
import { UserPlus, ShieldAlert, Loader2, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface TeamMember {
    id: string;
    email: string;
    role: string;
    phone: string | null;
    created_at: string;
}

export default function TeamManagement() {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // New Admin Form
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState(""); // Currently mocked for UI

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/team');
            if (res.ok) {
                const { data } = await res.json();
                setTeam(data || []);
            }
        } catch (error) {
            toast.error("Failed to load team data.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddSubAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);

        try {
            const res = await fetch('/api/admin/team', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: newEmail, password: newPassword })
            });

            if (res.ok) {
                toast.success("Sub-admin created successfully!");
                setNewEmail("");
                setNewPassword("");
                fetchTeam(); // Refresh the list
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to create admin.");
            }
        } catch (error) {
            toast.error("Network error.");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Team Management</h1>
                <p className="text-sm text-zinc-500 mt-1">Manage staff access and roles.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Current Admins List */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            Authorized Personnel
                        </h2>
                    </div>

                    {isLoading ? (
                        <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 text-zinc-300 animate-spin" /></div>
                    ) : (
                        <ul className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                            {team.map((member) => (
                                <li key={member.id} className="px-6 py-5 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold shadow-sm">
                                            {member.email ? member.email[0].toUpperCase() : 'A'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-zinc-900 dark:text-white">{member.email || member.phone || 'System Admin'}</p>
                                            <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                                                {member.role.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-sm text-zinc-500">
                                        Joined {new Date(member.created_at).toLocaleDateString()}
                                    </div>
                                </li>
                            ))}
                            {team.length === 0 && (
                                <li className="px-6 py-12 text-center text-zinc-500 text-sm">No team members found in database.</li>
                            )}
                        </ul>
                    )}
                </div>

                {/* Add New Admin Form */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm h-fit">
                    <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                            <UserPlus className="w-5 h-5 text-blue-500" />
                            Provision Sub-Admin
                        </h2>
                    </div>

                    <form onSubmit={handleAddSubAdmin} className="p-6 space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-zinc-500 mb-1">Work Email</label>
                            <div className="relative">
                                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                <input
                                    type="email"
                                    required
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="staff@srisaimobiles.com"
                                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-black dark:focus:ring-white dark:text-white transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-zinc-500 mb-1">Temporary Password</label>
                            <input
                                type="text"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Auto-generate or type"
                                className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-black dark:focus:ring-white dark:text-white transition-all font-mono"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isCreating}
                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-black text-white dark:bg-white dark:text-black rounded-lg text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition duration-300 shadow-md disabled:opacity-70"
                            >
                                {isCreating ? <Loader2 className="animate-spin w-4 h-4" /> : "Authorize Sub-Admin"}
                            </button>
                        </div>

                        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/10 text-amber-800 dark:text-amber-500 text-[11px] rounded flex gap-2 border border-amber-200 dark:border-amber-900/50">
                            <ShieldAlert className="w-4 h-4 shrink-0" />
                            <p>Sub-admins have full read/write access to orders and inventory, but cannot access Storefront CMS or Team Management.</p>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}
