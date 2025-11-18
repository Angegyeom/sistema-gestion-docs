import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Configurar para desarrollo (evitar errores de certificado SSL)
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

// Initialize Firebase Admin
if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.GCP_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || process.env.GCP_CLIENT_EMAIL,
        privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY || process.env.GCP_PRIVATE_KEY)?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
  }
}

const auth = getAuth();

export async function POST(request: NextRequest) {
  try {
    const { uid, password } = await request.json();

    if (!uid || !password) {
      return NextResponse.json(
        { error: 'UID y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Validar que la contraseña tenga al menos 6 caracteres
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Verificar que Firebase Admin esté inicializado
    if (!getApps().length) {
      throw new Error('Firebase Admin no está inicializado. Verifica las credenciales en .env');
    }

    // Update user password in Firebase Auth
    await auth.updateUser(uid, {
      password: password,
    });

    return NextResponse.json({
      success: true,
      message: 'Contraseña actualizada exitosamente',
    });
  } catch (error: any) {
    console.error('Error updating password:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });

    // Handle specific Firebase errors
    if (error.code === 'auth/user-not-found') {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Handle SSL certificate errors
    if (error.message && error.message.includes('certificate')) {
      return NextResponse.json(
        { error: 'Error de certificado SSL. Verifica las variables de entorno y reinicia el servidor.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Error al actualizar contraseña' },
      { status: 500 }
    );
  }
}
