/**
 * Script para limpiar todos los campos de archivos y URLs de los documentos
 * Ejecutar: node limpiar-documentos.js
 */

require('dotenv').config();
const admin = require('firebase-admin');

// Inicializar Firebase Admin con las credenciales correctas
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

async function limpiarDocumentos() {
    try {
        console.log('🔄 Iniciando limpieza de documentos...\n');

        // Obtener todos los documentos
        const snapshot = await db.collection('documentos').get();

        if (snapshot.empty) {
            console.log('⚠️  No hay documentos en la colección');
            return;
        }

        console.log(`📄 Encontrados ${snapshot.size} documentos\n`);

        // Procesar en lotes de 500 (límite de Firestore)
        const batchSize = 500;
        const batches = [];
        let currentBatch = db.batch();
        let count = 0;

        snapshot.docs.forEach((doc) => {
            // Eliminar campos de archivos y URLs
            currentBatch.update(doc.ref, {
                filePath: admin.firestore.FieldValue.delete(),
                pdfFilePath: admin.firestore.FieldValue.delete(),
                wordFilePath: admin.firestore.FieldValue.delete(),
                excelFilePath: admin.firestore.FieldValue.delete(),
                figmaUrl: admin.firestore.FieldValue.delete(),
                frontendUrl: admin.firestore.FieldValue.delete(),
                backendUrl: admin.firestore.FieldValue.delete(),
                url: admin.firestore.FieldValue.delete(),
                estado: 'Pendiente',
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            count++;

            // Si llegamos al límite del batch, guardarlo y crear uno nuevo
            if (count % batchSize === 0) {
                batches.push(currentBatch);
                currentBatch = db.batch();
            }
        });

        // Agregar el último batch si tiene operaciones
        if (count % batchSize !== 0) {
            batches.push(currentBatch);
        }

        // Ejecutar todos los batches
        console.log(`📦 Ejecutando ${batches.length} lote(s)...\n`);

        for (let i = 0; i < batches.length; i++) {
            await batches[i].commit();
            console.log(`✅ Lote ${i + 1}/${batches.length} completado`);
        }

        console.log('\n✅ ¡Limpieza completada exitosamente!');
        console.log(`📊 Total de documentos actualizados: ${snapshot.size}`);
        console.log('\n💡 Todos los campos de archivos y URLs han sido eliminados');
        console.log('💡 Todos los documentos están ahora en estado "Pendiente"');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error durante la limpieza:', error.message);
        process.exit(1);
    }
}

// Ejecutar la limpieza
limpiarDocumentos();
