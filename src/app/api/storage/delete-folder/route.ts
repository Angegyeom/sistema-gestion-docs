import { NextRequest, NextResponse } from 'next/server';
import { deleteFolder } from '@/lib/storage';

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const folderName = searchParams.get('folderName');

    if (!folderName) {
      return NextResponse.json(
        { error: 'No folderName provided' },
        { status: 400 }
      );
    }

    // Delete entire folder from GCS
    await deleteFolder(folderName);

    return NextResponse.json({
      success: true,
      message: 'Folder deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting folder:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete folder' },
      { status: 500 }
    );
  }
}
