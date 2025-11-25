import { NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';

// Inicializar GCS
const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

const bucketName = process.env.GCP_BUCKET_NAME || 'mi-app-archivos-cpv';
const bucket = storage.bucket(bucketName);

// Función para normalizar texto para comparación
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[_\-\.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Función para detectar el tipo de documento basado en el nombre del archivo
function detectDocType(fileName: string): string | null {
  const lower = normalize(fileName);

  if (lower.includes('acta') && lower.includes('constitucion')) return 'acta';
  if (lower.includes('acta') && lower.includes('conformidad')) return 'acta';
  if (lower.includes('acta') && lower.includes('reunion')) return 'acta';
  if (lower.includes('cronograma') || lower.includes('mpp')) return 'cronograma';
  if (lower.includes('manual') && (lower.includes('sistema') || lower.includes('tecnico'))) return 'manual';
  if (lower.includes('manual') && lower.includes('usuario')) return 'manual';
  if (lower.includes('manual') && (lower.includes('bd') || lower.includes('base de datos'))) return 'manual-bd';
  if (lower.includes('prototipo') || lower.includes('maqueta')) return 'prototipo';
  if (lower.includes('requerimiento') || lower.includes('rf') || lower.includes('nf')) return 'requerimientos';
  if (lower.includes('arquitectura')) return 'arquitectura';
  if (lower.includes('lecciones')) return 'lecciones';
  if (lower.includes('backlog')) return 'backlog';
  if (lower.includes('api') || lower.includes('documentacion api')) return 'doc-api';
  if (lower.includes('diagrama')) return 'diagrama';

  return null;
}

// Mapeo de tipos de archivo a campos en Firestore
function getFieldForFile(fileName: string, contentType: string | undefined): string {
  const lowerName = fileName.toLowerCase();

  if (contentType === 'application/pdf' || lowerName.endsWith('.pdf')) {
    return 'pdfFilePath';
  }
  if (contentType?.includes('spreadsheet') || lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls')) {
    return 'excelFilePath';
  }
  if (contentType?.includes('word') || lowerName.endsWith('.docx') || lowerName.endsWith('.doc')) {
    return 'wordFilePath';
  }
  if (contentType === 'application/vnd.ms-project' || lowerName.endsWith('.mpp')) {
    return 'excelFilePath';
  }
  return 'pdfFilePath';
}

// Detectar si es manual de sistema o de usuario
function isManualSistema(fileName: string): boolean {
  const lower = normalize(fileName);
  return lower.includes('sistema') || lower.includes('tecnico');
}

function isManualUsuario(fileName: string): boolean {
  const lower = normalize(fileName);
  return lower.includes('usuario');
}

// Detectar si es acta de conformidad o constitución
function isActaConformidad(fileName: string): boolean {
  const lower = normalize(fileName);
  return lower.includes('conformidad');
}

interface BucketFile {
  fullPath: string;
  fileName: string;
  category: string;
  contentType: string | undefined;
  detectedType: string | null;
  fieldToUpdate: string;
  isManualSistema: boolean;
  isManualUsuario: boolean;
  isActaConformidad: boolean;
}

export async function GET() {
  try {
    // 1. Obtener todos los archivos del bucket
    const [files] = await bucket.getFiles();

    // 2. Organizar archivos por carpeta/categoría
    const bucketFiles: BucketFile[] = [];

    for (const file of files) {
      if (file.name.endsWith('.placeholder')) continue;

      const parts = file.name.split('/');
      if (parts.length < 2) continue;

      const category = parts[0];
      const fileName = parts.slice(1).join('/');
      const contentType = file.metadata.contentType;

      bucketFiles.push({
        fullPath: file.name,
        fileName,
        category,
        contentType,
        detectedType: detectDocType(fileName),
        fieldToUpdate: getFieldForFile(fileName, contentType),
        isManualSistema: isManualSistema(fileName),
        isManualUsuario: isManualUsuario(fileName),
        isActaConformidad: isActaConformidad(fileName),
      });
    }

    // Agrupar por categoría para el frontend
    const filesByCategory: Record<string, BucketFile[]> = {};
    for (const file of bucketFiles) {
      if (!filesByCategory[file.category]) {
        filesByCategory[file.category] = [];
      }
      filesByCategory[file.category].push(file);
    }

    return NextResponse.json({
      success: true,
      totalFiles: bucketFiles.length,
      filesByCategory,
      bucketFiles,
    });

  } catch (error) {
    console.error('Error listing bucket files:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to list files' },
      { status: 500 }
    );
  }
}
