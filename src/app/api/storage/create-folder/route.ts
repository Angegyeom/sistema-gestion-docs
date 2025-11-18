import { NextRequest, NextResponse } from 'next/server';
import { createFolder } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const { folderName } = await request.json();

    if (!folderName) {
      return NextResponse.json(
        { error: 'No folderName provided' },
        { status: 400 }
      );
    }

    // Create folder in GCS
    await createFolder(folderName);

    return NextResponse.json({
      success: true,
      message: 'Folder created successfully',
    });
  } catch (error) {
    console.error('Error creating folder:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create folder' },
      { status: 500 }
    );
  }
}
