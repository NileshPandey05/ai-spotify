import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const mashupId = searchParams.get('id');

    if (!mashupId) {
      return NextResponse.json(
        { error: 'Mashup ID is required' },
        { status: 400 }
      );
    }

    const mashupPath = join(process.cwd(), 'uploads', `mashup_${mashupId}.mp3`);

    if (!existsSync(mashupPath)) {
      return NextResponse.json(
        { error: 'Mashup not found' },
        { status: 404 }
      );
    }

    // TODO: Implement file streaming here
    // This will be implemented when we set up the file serving

    return NextResponse.json({
      message: 'Mashup found',
      status: 'ready',
      mashupId
    });
  } catch (error) {
    console.error('Mashup retrieval error:', error);
    return NextResponse.json(
      { error: 'Error retrieving mashup' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { vocalsFile, instrumentalsFile } = await request.json();

    if (!vocalsFile || !instrumentalsFile) {
      return NextResponse.json(
        { error: 'Both vocals and instrumentals files are required' },
        { status: 400 }
      );
    }

    // TODO: Implement mashup generation here
    // This will be implemented when we set up the Python backend

    const mashupId = Date.now().toString();
    
    return NextResponse.json({
      message: 'Mashup generation started',
      status: 'processing',
      mashupId
    });
  } catch (error) {
    console.error('Mashup generation error:', error);
    return NextResponse.json(
      { error: 'Error generating mashup' },
      { status: 500 }
    );
  }
} 