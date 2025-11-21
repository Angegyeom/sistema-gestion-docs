/**
 * Script para ejecutar en la consola del navegador
 *
 * INSTRUCCIONES:
 * 1. Abre la aplicación en el navegador (localhost:3000/documentacion)
 * 2. Abre la consola del navegador (F12)
 * 3. Copia y pega todo este código en la consola
 * 4. Presiona Enter
 * 5. El script eliminará el campo "type" de todos los documentos
 */

(async function limpiarCampoType() {
    console.log('🚀 Iniciando limpieza del campo "type" de la colección "documentos"...\n');

    try {
        // Importar Firestore desde Firebase
        const { getFirestore, collection, getDocs, updateDoc, doc, deleteField } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');

        // Obtener la instancia de Firestore
        const db = getFirestore();

        // Obtener todos los documentos
        const docsRef = collection(db, 'documentos');
        const snapshot = await getDocs(docsRef);

        if (snapshot.empty) {
            console.log('⚠️  No se encontraron documentos en la colección');
            return;
        }

        console.log(`📄 Se encontraron ${snapshot.size} documentos\n`);

        let actualizados = 0;
        let sinCambios = 0;

        // Procesar cada documento
        for (const documento of snapshot.docs) {
            const data = documento.data();

            // Solo actualizar si el documento tiene el campo 'type'
            if (data.type !== undefined) {
                try {
                    await updateDoc(doc(db, 'documentos', documento.id), {
                        type: deleteField()
                    });

                    actualizados++;
                    console.log(`✓ ${documento.id}: Campo "type" eliminado (valor: "${data.type}")`);
                } catch (error) {
                    console.error(`❌ Error al actualizar ${documento.id}:`, error);
                }
            } else {
                sinCambios++;
                console.log(`- ${documento.id}: Ya no tiene campo "type"`);
            }
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
        console.error('\n💡 Asegúrate de:');
        console.error('   1. Estar en la página de la aplicación');
        console.error('   2. Haber iniciado sesión');
        console.error('   3. Tener permisos para editar documentos');
    }
})();
