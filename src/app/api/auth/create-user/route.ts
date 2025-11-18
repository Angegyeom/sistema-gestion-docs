import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import * as https from 'https';

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
const firestore = getFirestore();

export async function POST(request: NextRequest) {
  try {
    const { email, password, roles, active } = await request.json();

    if (!email || !password || !roles || !Array.isArray(roles)) {
      return NextResponse.json(
        { error: 'Email, password y roles son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que Firebase Admin esté inicializado
    if (!getApps().length) {
      throw new Error('Firebase Admin no está inicializado. Verifica las credenciales en .env');
    }

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      emailVerified: false,
    });

    // Create user document in Firestore
    await firestore.collection('users').doc(userRecord.uid).set({
      email,
      roles,
      active: active !== false,
      requirePasswordReset: true, // User must reset password on first login
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return NextResponse.json({
      success: true,
      uid: userRecord.uid,
      message: 'Usuario creado exitosamente',
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });

    // Handle specific Firebase errors
    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json(
        { error: 'El correo electrónico ya está registrado' },
        { status: 400 }
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
      { error: error.message || 'Error al crear usuario' },
      { status: 500 }
    );
  }
}
