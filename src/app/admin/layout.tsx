import { headers } from "next/headers";
import { ReactNode } from "react";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    // 1. Read the secure role injected by the Edge Middleware
    const headersList = await headers();
    const role = headersList.get("x-user-role") || "admin";

    // 2. Pass the role securely to the client-side Admin Sidebar layout
    return <AdminLayoutClient role={role}>{children}</AdminLayoutClient>;
}
