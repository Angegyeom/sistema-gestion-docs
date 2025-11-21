/**
 * Script para agregar los nuevos documentos: Acta de Reunión y Solicitud de Cambio
 * a todos los módulos
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

async function agregarNuevosDocumentos() {
    try {
        console.log('🔄 Iniciando agregación de nuevos documentos...\n');

        const batch = db.batch();
        let count = 0;

        for (const module of modules) {
            // Acta de Reunión
            const actaReunionId = `${module.prefix}-acta-reunion`;
            const actaReunionRef = db.collection('documentos').doc(actaReunionId);
            batch.set(actaReunionRef, {
                id: actaReunionId,
                title: 'Acta de Reunión',
                description: `Actas de las reuniones del proyecto de ${module.name}`,
                type: 'acta-reunion',
                version: '1.0',
                category: module.id,
                estado: 'Pendiente',
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            count++;
            console.log(`✅ Agregando: ${actaReunionId} - Acta de Reunión (${module.name})`);

            // Solicitud de Cambio
            const solicitudCambioId = `${module.prefix}-solicitud-cambio`;
            const solicitudCambioRef = db.collection('documentos').doc(solicitudCambioId);
            batch.set(solicitudCambioRef, {
                id: solicitudCambioId,
                title: 'Solicitud de Cambio',
                description: `Solicitudes de cambio del proyecto de ${module.name}`,
                version: '1.0',
                category: module.id,
                estado: 'Pendiente',
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            count++;
            console.log(`✅ Agregando: ${solicitudCambioId} - Solicitud de Cambio (${module.name})`);
        }

        await batch.commit();

        console.log(`\n✅ ¡Agregación completada exitosamente!`);
        console.log(`📊 Total de documentos agregados: ${count} (${count/2} por módulo × 9 módulos)`);
        console.log('\n💡 Nuevos documentos agregados:');
        console.log('   - Acta de Reunión (acta-reunion)');
        console.log('   - Solicitud de Cambio (solicitud-cambio)');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error durante la agregación:', error.message);
        process.exit(1);
    }
}

agregarNuevosDocumentos();
