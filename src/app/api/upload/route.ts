import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join, basename } from 'path';
import { randomUUID } from 'crypto';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

function requireAdmin(request: Request): boolean {
    const role = request.headers.get('x-user-role');
    return role === 'admin' || role === 'super_admin';
}

export async function POST(request: Request) {
    // Auth check — only admin can upload images
    if (!requireAdmin(request)) {
        return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file received.' }, { status: 400 });
        }

        // 1. Strict MIME type whitelist (not just file extension)
        if (!ALLOWED_MIME_TYPES.has(file.type)) {
            return NextResponse.json({ error: 'Only image files (JPEG, PNG, WebP, GIF, AVIF) are allowed.' }, { status: 400 });
        }

        // 2. File size limit
        if (file.size > MAX_FILE_SIZE_BYTES) {
            return NextResponse.json({ error: 'File too large. Maximum size is 10 MB.' }, { status: 413 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 3. Secure filename: UUID prefix + sanitized original name (no path traversal possible)
        // basename() strips any directory components, then we remove all non-alphanumeric chars
        const safeName = basename(file.name)
            .replace(/[^a-zA-Z0-9._-]/g, '_')
            .slice(0, 100); // max 100 chars
        const filename = `${randomUUID()}-${safeName}`;

        // 4. Always write to a fixed safe directory
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        const filepath = join(uploadDir, filename);

        // 5. Double-check the resolved path stays inside uploadDir (defense in depth)
        if (!filepath.startsWith(uploadDir)) {
            return NextResponse.json({ error: 'Invalid file path.' }, { status: 400 });
        }

        await writeFile(filepath, buffer);

        const fileUrl = `/uploads/${filename}`;
        return NextResponse.json({ success: true, url: fileUrl }, { status: 201 });

    } catch (error) {
        console.error('[ERROR] Upload error:', error);
        return NextResponse.json({ error: 'Something went wrong uploading the file.' }, { status: 500 });
    }
}
