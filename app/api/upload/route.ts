import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import sharp from 'sharp';

/**
 * POST /api/upload
 * Handles image uploads with compression and optimization
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}_${sanitizedName}`;
    const filepath = path.join(uploadDir, filename);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Process image with sharp: resize and compress
    let processedBuffer = buffer;
    
    try {
      processedBuffer = await sharp(buffer)
        .resize(2000, 2000, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 85, progressive: true })
        .toBuffer();
    } catch (sharpError) {
      console.warn('Sharp processing failed, using original:', sharpError);
      // If sharp fails (e.g., unsupported format), use original buffer
    }

    // Write the file
    await writeFile(filepath, processedBuffer);

    // Return the public URL
    const publicUrl = `/images/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

// Increase max file size for Next.js API routes
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
