import { z } from 'zod';

export const CategoryEnum = z.enum(['Smartphone', 'Accessory', 'Tablet', 'Wearable']);
export const ConditionEnum = z.enum(['New', 'Used']);

export const productSchema = z.object({
    // Base fields
    name: z.string().min(1, "Product name is required"),
    brand: z.string().min(1, "Brand is required"),
    category: CategoryEnum,
    condition: ConditionEnum,
    price: z.coerce.number().min(1, "Price must be a positive number"),
    stock_quantity: z.coerce.number().min(0, "Stock quantity cannot be negative"),
    description: z.string().min(10, "Please provide a detailed description"),
    images: z.array(z.string()).default([]),

    // Conditional fields (Optional at base level, enforced dynamically via superRefine)
    storage: z.string().optional(),
    ram: z.string().optional(),

    // Apple specific Used fields
    batteryHealth: z.coerce.number().min(1).max(100).optional(),
    faceIdWorking: z.boolean().default(true),
    trueToneWorking: z.boolean().default(true),

    // Accessory fields
    compatibleDevices: z.array(z.string()).optional(),
    accessoryType: z.string().optional(),

    // Global Used Trust Factor fields
    trustGrade: z.string().optional(),
    hasOriginalBox: z.boolean().default(false),
    hasOriginalBill: z.boolean().default(false),
    adminRemarks: z.string().optional()
}).superRefine((data, ctx) => {

    // Rule 1: Smartphone & Apple
    if (data.category === 'Smartphone' && data.brand === 'Apple') {
        if (!data.storage) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Storage capacity is required for iPhones",
                path: ['storage']
            });
        }
        // Apple specific used rules
        if (data.condition === 'Used') {
            if (data.batteryHealth === undefined) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Battery Health % is strictly required for used Apple devices",
                    path: ['batteryHealth']
                });
            }
        }
    }

    // Rule 2: Smartphone & Not Apple
    if (data.category === 'Smartphone' && data.brand !== 'Apple') {
        if (!data.storage) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Storage capacity is required",
                path: ['storage']
            });
        }
        if (!data.ram) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "RAM is required for non-Apple smartphones",
                path: ['ram']
            });
        }
    }

    // Rule 3: Accessory Restrictions
    if (data.category === 'Accessory') {
        if (!data.accessoryType) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Accessory Type is required",
                path: ['accessoryType']
            });
        }
    }

    // Rule 4: Global 'Used' Trust Factor Fields
    if (data.condition === 'Used') {
        if (!data.trustGrade) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Condition Grade (e.g., Flawless, Scratched) is required for used devices",
                path: ['trustGrade']
            });
        }
    }
});

export type ProductFormValues = z.infer<typeof productSchema>;
