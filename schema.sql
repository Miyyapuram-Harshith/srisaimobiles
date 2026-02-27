-- PostgreSQL Schema for Srisai Mobiles 
-- Utilizing JSONB for flexible specifications and maintaining strict structure

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Base Fields
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Smartphone', 'Accessory', 'Tablet', 'Wearable')),
    condition VARCHAR(20) NOT NULL CHECK (condition IN ('New', 'Used')),
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    images TEXT[] NOT NULL DEFAULT '{}', -- Array of image URLs
    
    -- Dynamic Specifications (JSONB)
    -- This stores varied attributes like Apple's 'face_id_working' vs Accessories' 'compatible_devices' safely
    -- without cluttering the main table schema with null fields
    specifications JSONB DEFAULT '{}'::jsonb,
    
    -- Trust Factor Fields (Global when Used)
    trust_grade VARCHAR(50), -- E.g., 'Flawless', 'Scratched'
    has_original_box BOOLEAN DEFAULT false,
    has_original_bill BOOLEAN DEFAULT false,
    admin_remarks TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing JSONB for fast queries (e.g., finding iPhones with 128GB storage)
CREATE INDEX idx_products_specifications ON products USING GIN (specifications);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_brand ON products(brand);

-- Trigger to auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_modtime
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();
