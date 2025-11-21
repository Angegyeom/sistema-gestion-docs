/**
 * Script para eliminar documentos duplicados: Acta de Reunión y Solicitud de Cambio
 * de todos los módulos (o solo de módulos específicos)
 */

require('dotenv').config();
const admin = require('firebase-admin');

const serviceAccount = {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.GCP_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || process.env.GCP_CLIENT_EMAIL,
    privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY || process.env.GCP_PRIVATE_KEY)?.replace(/\\n/g, '\n'),
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.projectId,
});

const db = admin.firestore();

const modules = [
    { id: 'segmentacion', name: 'Segmentación', prefix: 'seg' },
    { id: 'reclutamiento', name: 'Reclutamiento', prefix: 'rec' },
    { id: 'capacitacion', name: 'Capacitación', prefix: 'cap' },
    { id: 'logistica', name: 'Logística', prefix: 'log' },
    { id: 'capdatos-apk', name: 'Captura Datos APK', prefix: 'apk' },
    { id: 'censo-linea', name: 'Censo en Línea', prefix: 'cen' },
    { id: 'consistencia', name: 'Consistencia', prefix: 'con' },
    { id: 'monitoreo', name: 'Monitoreo', prefix: 'mon' },
    { id: 'yanapaq', name: 'Yanapaq', prefix: 'yan' },
];

async function eliminarDocumentosDuplicados() {
    try {
        console.log('🔄 Iniciando eliminación de documentos duplicados...\n');

        const batch = db.batch();
        let count = 0;
        const deletedDocs = [];

        for (const module of modules) {
            // Intentar eliminar: Acta de Reunión
            const actaReunionId = `${module.prefix}-acta-reunion`;
            const actaReunionRef = db.collection('documentos').doc(actaReunionId);

            // Verificar si existe antes de eliminar
            const actaDoc = await actaReunionRef.get();
            if (actaDoc.exists) {
                batch.delete(actaReunionRef);
                count++;
                deletedDocs.push(`${actaReunionId} (${module.name})`);
                console.log(`🗑️  Eliminando: ${actaReunionId} - Acta de Reunión (${module.name})`);
            }

            // Intentar eliminar: Solicitud de Cambio
            const solicitudCambioId = `${module.prefix}-solicitud-cambio`;
            const solicitudCambioRef = db.collection('documentos').doc(solicitudCambioId);

            // Verificar si existe antes de eliminar
            const solicitudDoc = await solicitudCambioRef.get();
            if (solicitudDoc.exists) {
                batch.delete(solicitudCambioRef);
                count++;
                deletedDocs.push(`${solicitudCambioId} (${module.name})`);
                console.log(`🗑️  Eliminando: ${solicitudCambioId} - Solicitud de Cambio (${module.name})`);
            }
        }

        if (count === 0) {
            console.log('ℹ️  No se encontraron documentos duplicados para eliminar.');
            process.exit(0);
        }

        await batch.commit();

        console.log(`\n✅ ¡Eliminación completada exitosamente!`);
        console.log(`📊 Total de documentos eliminados: ${count}`);
        console.log('\n💡 Documentos eliminados:');
        deletedDocs.forEach(doc => console.log(`   - ${doc}`));

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error durante la eliminación:', error.message);
        console.error(error);
        process.exit(1);
    }
}

eliminarDocumentosDuplicados();
