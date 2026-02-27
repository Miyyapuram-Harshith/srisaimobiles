import fs from 'fs/promises';
import path from 'path';

// Define paths to database
const dataDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'db.json');

// Types based on the user's requirements
export interface Product {
    id: string;
    title: string;
    price: number;
    storage: string;
    condition: string;
    batteryHealth: string;
    images: string[];
    description: string;
    isSold: boolean;
    createdAt: string;
    timeUsed?: string;
}

export interface Order {
    id: string;
    userId: string;
    productId: string;
    paymentId: string;
    amount: number;
    status: string;
    createdAt: string;
}

interface DatabaseStructure {
    products: Product[];
    orders: Order[];
}

export async function getDb(): Promise<DatabaseStructure> {
    try {
        const data = await fs.readFile(dbPath, 'utf-8');
        return JSON.parse(data) as DatabaseStructure;
    } catch (error) {
        // Return empty state if file missing or corrupted
        return { products: [], orders: [] };
    }
}

export async function saveDb(data: DatabaseStructure): Promise<void> {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}
