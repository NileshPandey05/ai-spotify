import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const { file1, file2 } = await request.json();

    if (!file1 || !file2) {
      return NextResponse.json(
        { error: 'Both file names are required' },
        { status: 400 }
      );
    }

    const uploadDir = join(process.cwd(), 'uploads');
    const file1Path = join(uploadDir, file1);
    const file2Path = join(uploadDir, file2);

    // Check if files exist
    if (!existsSync(file1Path) || !existsSync(file2Path)) {
      return NextResponse.json(
        { error: 'One or both files not found' },
        { status: 404 }
      );
    }

    // TODO: Implement Demucs processing here
    // This will be implemented when we set up the Python backend

    return NextResponse.json({
      message: 'Processing started',
      status: 'processing',
      files: {
        file1,
        file2
      }
    });
  } catch (error) {
    console.error('Processing error:', error);
    return NextResponse.json(
      { error: 'Error processing files' },
      { status: 500 }
    );
  }
} 