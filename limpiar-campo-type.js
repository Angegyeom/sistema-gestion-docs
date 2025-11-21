/**
 * Script para eliminar el campo 'type' de todos los documentos en Firestore
 *
 * IMPORTANTE: Este script modificará la base de datos. Úsalo con precaución.
 *
 * Uso:
 * 1. Asegúrate de tener Node.js instalado
 * 2. Instala las dependencias: npm install firebase-admin dotenv
 * 3. Configura las credenciales de Firebase en .env
 * 4. Ejecuta: node limpiar-campo-type.js
 */

// Cargar variables de entorno desde .env
require('dotenv').config();

const admin = require('firebase-admin');

// Configuración de Firebase Admin SDK usando variables de entorno
const privateKey = process.env.GCP_PRIVATE_KEY ?
  process.env.GCP_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined;

if (!process.env.GCP_PROJECT_ID || !process.env.GCP_CLIENT_EMAIL || !privateKey) {
  console.error('❌ Error: Faltan variables de entorno requeridas');
  console.error('   Asegúrate de tener configuradas:');
  console.error('   - GCP_PROJECT_ID');
  console.error('   - GCP_CLIENT_EMAIL');
  console.error('   - GCP_PRIVATE_KEY');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.GCP_PROJECT_ID,
    clientEmail: process.env.GCP_CLIENT_EMAIL,
    privateKey: privateKey,
  })
});

const db = admin.firestore();

async function limpiarCampoType() {
  try {
    console.log('🚀 Iniciando limpieza del campo "type" en la colección "documentos"...\n');

    // Obtener todos los documentos
    const snapshot = await db.collection('documentos').get();

    if (snapshot.empty) {
      console.log('⚠️  No se encontraron documentos en la colección');
      return;
    }

    console.log(`📄 Se encontraron ${snapshot.size} documentos\n`);

    // Contador de documentos actualizados
    let actualizados = 0;
    let sinCambios = 0;

    // Usar batch para actualizar múltiples documentos eficientemente
    const batch = db.batch();
    let batchCount = 0;
    const BATCH_SIZE = 500; // Firestore permite máximo 500 operaciones por batch

    for (const doc of snapshot.docs) {
      const data = doc.data();

      // Solo actualizar si el documento tiene el campo 'type'
      if (data.type !== undefined) {
        batch.update(doc.ref, {
          type: admin.firestore.FieldValue.delete()
        });

        batchCount++;
        actualizados++;

        console.log(`✓ ${doc.id}: Eliminando campo "type" (valor: "${data.type}")`);

        // Commit del batch si alcanzamos el límite
        if (batchCount >= BATCH_SIZE) {
          await batch.commit();
          console.log(`\n💾 Guardando cambios (batch de ${batchCount} documentos)...\n`);
          batchCount = 0;
        }
      } else {
        sinCambios++;
        console.log(`- ${doc.id}: Ya no tiene campo "type"`);
      }
    }

    // Commit final si quedan operaciones pendientes
    if (batchCount > 0) {
      await batch.commit();
      console.log(`\n💾 Guardando cambios finales (${batchCount} documentos)...\n`);
    }

    // Resumen
    console.log('\n' + '='.repeat(50));
    console.log('✅ LIMPIEZA COMPLETADA');
    console.log('='.repeat(50));
    console.log(`📊 Documentos actualizados: ${actualizados}`);
    console.log(`📋 Documentos sin cambios: ${sinCambios}`);
    console.log(`📁 Total procesados: ${snapshot.size}`);
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
    throw error;
  }
}

// Ejecutar el script
limpiarCampoType()
  .then(() => {
    console.log('👋 Script finalizado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });
