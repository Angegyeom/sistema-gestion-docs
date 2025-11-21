/**
 * Script para verificar qué campos tienen los documentos
 */

require('dotenv').config();
const admin = require('firebase-admin');

const serviceAccount = {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
});

const db = admin.firestore();

async function verificarCampos() {
    try {
        const snapshot = await db.collection('documentos').limit(5).get();

        console.log('Campos de los primeros 5 documentos:\n');

        snapshot.docs.forEach((doc, index) => {
            console.log(`Documento ${index + 1}: ${doc.id}`);
            console.log('Campos:', Object.keys(doc.data()));
            console.log('Datos:', JSON.stringify(doc.data(), null, 2));
            console.log('\n---\n');
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

verificarCampos();
