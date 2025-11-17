import { Storage } from '@google-cloud/storage';

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID || 'decent-vertex-477811-b3',
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

const bucketName = process.env.GCP_BUCKET_NAME || 'mi-app-archivos-cpv';
const bucket = storage.bucket(bucketName);

export interface UploadResult {
  filePath: string;
  publicUrl?: string;
  fileName: string;
}

export interface FileMetadata {
  name: string;
  size: number;
  contentType: string;
  updated: Date;
  fullPath: string;
}

/**
 * Upload a file to Google Cloud Storage
 * @param file - File to upload (File or Buffer)
 * @param category - Category/folder to organize files
 * @param fileName - Optional custom file name
 * @returns Upload result with file path and URL
 */
export async function uploadFile(
  file: File | Buffer,
  category: string,
  fileName?: string
): Promise<UploadResult> {
  try {
    // Generate file name if not provided
    const timestamp = Date.now();
    let finalFileName: string;

    if (file instanceof File) {
      const originalName = fileName || file.name;
      // Sanitize filename: remove accents and special characters
      const sanitizedName = originalName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w.\-_]/g, '_');

      finalFileName = `${timestamp}-${sanitizedName}`;
    } else {
      finalFileName = fileName || `${timestamp}-file`;
    }

    const filePath = `${category}/${finalFileName}`;
    const fileBlob = bucket.file(filePath);

    // Get file buffer
    let buffer: Buffer;
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      buffer = file;
    }

    // Upload file with metadata
    await fileBlob.save(buffer, {
      metadata: {
        contentType: file instanceof File ? file.type : 'application/octet-stream',
        metadata: {
          uploadedAt: new Date().toISOString(),
          category,
        },
      },
      // Files are private by default
      public: false,
    });

    return {
      filePath,
      fileName: finalFileName,
    };
  } catch (error) {
    console.error('Error uploading file to GCS:', error);
    throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get a signed URL for downloading a private file
 * @param filePath - Path to the file in the bucket
 * @param expiresInMinutes - URL expiration time in minutes (default: 60)
 * @returns Signed URL for downloading the file
 */
export async function getFileUrl(
  filePath: string,
  expiresInMinutes: number = 60
): Promise<string> {
  try {
    const file = bucket.file(filePath);

    const [exists] = await file.exists();
    if (!exists) {
      throw new Error('File not found');
    }

    // Generate signed URL
    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + expiresInMinutes * 60 * 1000,
    });

    return url;
  } catch (error) {
    console.error('Error getting file URL from GCS:', error);
    throw new Error(`Failed to get file URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Download a file (alias for getFileUrl for consistency)
 * @param filePath - Path to the file in the bucket
 * @returns Signed URL for downloading the file
 */
export async function downloadFile(filePath: string): Promise<string> {
  return getFileUrl(filePath);
}

/**
 * Delete a file from Google Cloud Storage
 * @param filePath - Path to the file in the bucket
 */
export async function deleteFile(filePath: string): Promise<void> {
  try {
    const file = bucket.file(filePath);
    await file.delete();
  } catch (error) {
    console.error('Error deleting file from GCS:', error);
    throw new Error(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Delete an entire folder from Google Cloud Storage (all files with the given prefix)
 * @param folderName - Name of the folder to delete
 */
export async function deleteFolder(folderName: string): Promise<void> {
  try {
    // List all files in the folder
    const [files] = await bucket.getFiles({ prefix: `${folderName}/` });

    // Delete all files in parallel
    await Promise.all(files.map(file => file.delete()));

    console.log(`Deleted ${files.length} files from folder: ${folderName}/`);
  } catch (error) {
    console.error('Error deleting folder from GCS:', error);
    throw new Error(`Failed to delete folder: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * List all files in a specific category/folder
 * @param category - Category/folder to list files from
 * @returns Array of file metadata
 */
export async function listFiles(category?: string): Promise<FileMetadata[]> {
  try {
    const options = category ? { prefix: `${category}/` } : {};
    const [files] = await bucket.getFiles(options);

    return files.map(file => ({
      name: file.name.split('/').pop() || file.name,
      size: parseInt(String(file.metadata.size || '0')),
      contentType: file.metadata.contentType || 'application/octet-stream',
      updated: new Date(file.metadata.updated || Date.now()),
      fullPath: file.name,
    }));
  } catch (error) {
    console.error('Error listing files from GCS:', error);
    throw new Error(`Failed to list files: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check if a file exists in the bucket
 * @param filePath - Path to the file in the bucket
 * @returns Boolean indicating if file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    const file = bucket.file(filePath);
    const [exists] = await file.exists();
    return exists;
  } catch (error) {
    console.error('Error checking file existence in GCS:', error);
    return false;
  }
}

/**
 * Get file metadata
 * @param filePath - Path to the file in the bucket
 * @returns File metadata
 */
export async function getFileMetadata(filePath: string): Promise<FileMetadata> {
  try {
    const file = bucket.file(filePath);
    const [metadata] = await file.getMetadata();

    return {
      name: file.name.split('/').pop() || file.name,
      size: parseInt(String(metadata.size || '0')),
      contentType: metadata.contentType || 'application/octet-stream',
      updated: new Date(metadata.updated || Date.now()),
      fullPath: file.name,
    };
  } catch (error) {
    console.error('Error getting file metadata from GCS:', error);
    throw new Error(`Failed to get file metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
