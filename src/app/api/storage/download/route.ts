import { NextRequest, NextResponse } from 'next/server';
import { getFileUrl } from '@/lib/storage';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filePath = searchParams.get('filePath');
    const expiresIn = parseInt(searchParams.get('expiresIn') || '60');

    if (!filePath) {
      return NextResponse.json(
        { error: 'No filePath provided' },
        { status: 400 }
      );
    }

    // Get signed URL from GCS
    const signedUrl = await getFileUrl(filePath, expiresIn);

    return NextResponse.json({
      success: true,
      url: signedUrl,
    });
  } catch (error) {
    console.error('Error getting file URL:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get file URL' },
      { status: 500 }
    );
  }
}
