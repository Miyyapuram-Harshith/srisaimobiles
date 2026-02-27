"use client";

import React, { useState, useEffect } from "react";
import {
    createColumnHelper, flexRender, getCoreRowModel, useReactTable, getSortedRowModel, SortingState, getFilteredRowModel
} from "@tanstack/react-table";
import { Plus, Search, Loader2, PackageX, PackageCheck, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";

// Initialize standard client for READ operations (RPB handled downstream)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseKey);

type Product = {
    id: string;
    name: string;
    brand: string;
    price: number;
    category: string;
    condition: string;
    is_out_of_stock: boolean;
    created_at: string;
};

const columnHelper = createColumnHelper<Product>();

export default function InventoryOMS() {
    const [data, setData] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    const fetchInventory = async () => {
        setIsLoading(true);
        try {
            const { data: products, error } = await supabase
                .from("products")
                .select("id, name, brand, price, category, condition, is_out_of_stock, created_at")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setData(products || []);
        } catch (error) {
            toast.error("Failed to fetch inventory from Supabase.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    // Quick Action Mutation
    const toggleStockStatus = async (id: string, currentStatus: boolean) => {
        // Optimistic UI update
        setData(prev => prev.map(p => p.id === id ? { ...p, is_out_of_stock: !currentStatus } : p));

        try {
            const res = await fetch('/api/admin/inventory', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, is_out_of_stock: !currentStatus })
            });

            if (res.ok) {
                toast.success(!currentStatus ? "Marked as Out of Stock" : "Restored to In Stock");
            } else {
                // Revert if failed
                setData(prev => prev.map(p => p.id === id ? { ...p, is_out_of_stock: currentStatus } : p));
                toast.error("Failed to update database.");
            }
        } catch (err) {
            setData(prev => prev.map(p => p.id === id ? { ...p, is_out_of_stock: currentStatus } : p));
            toast.error("Network error modifying stock.");
        }
    };

    // TanStack Columns Definition
    const columns = [
        columnHelper.accessor("name", {
            header: ({ column }) => (
                <button className="flex items-center gap-2" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Product Name <ArrowUpDown className="w-4 h-4" />
                </button>
            ),
            cell: info => <div className="font-semibold text-zinc-900 dark:text-zinc-100 max-w-[250px] truncate">{info.getValue()}</div>,
        }),
        columnHelper.accessor("brand", {
            header: "Brand",
            cell: info => <span className="uppercase text-xs font-bold text-zinc-500">{info.getValue()}</span>
        }),
        columnHelper.accessor("condition", {
            header: "Condition",
            cell: info => {
                const isNew = info.getValue().toLowerCase() === "new" || info.getValue().toLowerCase() === "open box";
                return (
                    <span className={`px-2 py-1 rounded text-xs font-bold ${isNew ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                        {info.getValue()}
                    </span>
                );
            }
        }),
        columnHelper.accessor("price", {
            header: ({ column }) => (
                <button className="flex items-center gap-2" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Price <ArrowUpDown className="w-4 h-4" />
                </button>
            ),
            cell: info => <span className="font-mono">₹{info.getValue().toLocaleString('en-IN')}</span>,
        }),
        columnHelper.accessor("is_out_of_stock", {
            id: "status",
            header: "Availability",
            cell: info => {
                const isOOS = info.getValue();
                return (
                    <div className="flex items-center gap-3">
                        <span className={`flex items-center gap-1.5 text-xs font-bold ${isOOS ? 'text-red-500' : 'text-emerald-500'}`}>
                            {isOOS ? <PackageX className="w-4 h-4" /> : <PackageCheck className="w-4 h-4" />}
                            {isOOS ? "OUT OF STOCK" : "IN STOCK"}
                        </span>

                        {/* Toggle Button */}
                        <label className="relative inline-flex items-center cursor-pointer ml-auto">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={!isOOS}
                                onChange={() => toggleStockStatus(info.row.original.id, isOOS)}
                            />
                            <div className="w-9 h-5 bg-red-200 peer-focus:outline-none rounded-full peer dark:bg-red-900/40 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500"></div>
                        </label>
                    </div>
                );
            }
        }),
    ];

    const table = useReactTable({
        data,
        columns,
        state: { sorting, globalFilter },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <div className="space-y-6 pb-20">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Inventory OMS</h1>
                    <p className="text-sm text-zinc-500 mt-1">Manage stock availability and products.</p>
                </div>

                <Link
                    href="/admin/add-product"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    Add New Device
                </Link>
            </div>

            {/* Table Area */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">

                {/* Search / Filter Bar */}
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            value={globalFilter ?? ""}
                            onChange={e => setGlobalFilter(e.target.value)}
                            placeholder="Search products by name or brand..."
                            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                        />
                    </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center p-20 text-zinc-500">
                            <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
                            <p className="text-sm font-medium">Syncing inventory from database...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400">
                            <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 tracking-wider">
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <th key={header.id} className="px-6 py-4 font-semibold">
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {table.getRowModel().rows.length > 0 ? (
                                    table.getRowModel().rows.map(row => (
                                        <tr key={row.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                                            {row.getVisibleCells().map(cell => (
                                                <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={columns.length} className="px-6 py-12 text-center text-zinc-500">
                                            No products found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
