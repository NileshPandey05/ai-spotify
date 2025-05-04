import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file1 = formData.get('file1') as File;
    const file2 = formData.get('file2') as File;

    if (!file1 || !file2) {
      return NextResponse.json(
        { error: 'Both files are required' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'uploads');
    await writeFile(join(uploadDir, file1.name), Buffer.from(await file1.arrayBuffer()));
    await writeFile(join(uploadDir, file2.name), Buffer.from(await file2.arrayBuffer()));

    return NextResponse.json({
      message: 'Files uploaded successfully',
      files: {
        file1: file1.name,
        file2: file2.name
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Error uploading files' },
      { status: 500 }
    );
  }
} 