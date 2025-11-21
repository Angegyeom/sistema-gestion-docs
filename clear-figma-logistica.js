/**
 * Script para limpiar el campo figmaUrl del documento Prototipo en Logística
 *
 * Para ejecutar:
 * 1. Abre la consola del navegador en la página /documentacion
 * 2. Copia y pega este código
 * 3. Presiona Enter
 */

(async () => {
    try {
        // Importar Firebase desde el contexto global
        const { getFirestore, collection, query, where, getDocs, updateDoc, doc, deleteField } = window.firebase || {};

        if (!getFirestore) {
            console.error('Firebase no está disponible. Asegúrate de estar en la página /documentacion');
            return;
        }

        const firestore = getFirestore();

        // Buscar el documento de tipo 'prototipo' en la categoría 'logistica'
        const q = query(
            collection(firestore, 'documentos'),
            where('type', '==', 'prototipo'),
            where('category', '==', 'logistica')
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log('No se encontró el documento Prototipo en Logística');
            return;
        }

        // Actualizar el documento para eliminar el campo figmaUrl
        const docData = snapshot.docs[0];
        const docRef = doc(firestore, 'documentos', docData.id);

        await updateDoc(docRef, {
            figmaUrl: deleteField(),
            updatedAt: new Date()
        });

        console.log('✅ Campo figmaUrl eliminado exitosamente del documento Prototipo en Logística');
        console.log('Documento ID:', docData.id);
        console.log('Recarga la página para ver los cambios');

    } catch (error) {
        console.error('Error al limpiar el campo:', error);
    }
})();
