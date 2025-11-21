// Script para verificar la estructura de documentos en initialDocs

const initialDocs = {
    segmentacion: [
        { id: 'seg-1', title: 'Acta de Constitución', type: 'acta' },
        { id: 'seg-2', title: 'Cronograma', type: 'cronograma' },
        { id: 'seg-3', title: 'Prototipo', type: 'prototipo' },
        { id: 'seg-4', title: 'Manual de Usuario', type: 'manual' },
        { id: 'seg-5', title: 'Manual de Sistema', type: 'manual' },
        { id: 'seg-6', title: 'Lecciones Aprendidas', type: 'lecciones' },
        { id: 'seg-7', title: 'Requerimientos Funcionales', type: 'requerimientos' },
        { id: 'seg-8', title: 'Product Backlog', type: 'backlog' },
        { id: 'seg-9', title: 'Acta de Conformidad', type: 'acta' },
        { id: 'seg-10', title: 'Arquitectura de Software', type: 'arquitectura' },
        { id: 'seg-11', title: 'Diagrama de Flujo', type: 'diagrama' },
        { id: 'seg-12', title: 'Diagrama de Proceso', type: 'diagrama' },
        { id: 'seg-13', title: 'Repositorios', type: 'repositorios' },
        { id: 'seg-14', title: 'Manual de Base de Datos', type: 'manual-bd' },
        { id: 'seg-15', title: 'Documentación de API', type: 'doc-api' },
    ],
    reclutamiento: [
        { id: 'rec-1', title: 'Acta de Constitución', type: 'acta' },
        { id: 'rec-2', title: 'Cronograma', type: 'cronograma' },
        { id: 'rec-3', title: 'Prototipo', type: 'prototipo' },
        { id: 'rec-4', title: 'Manual de Usuario', type: 'manual' },
        { id: 'rec-5', title: 'Manual de Sistema', type: 'manual' },
        { id: 'rec-6', title: 'Lecciones Aprendidas', type: 'lecciones' },
        { id: 'rec-7', title: 'Requerimientos Funcionales', type: 'requerimientos' },
        { id: 'rec-8', title: 'Product Backlog', type: 'backlog' },
        { id: 'rec-9', title: 'Acta de Conformidad', type: 'acta' },
        { id: 'rec-10', title: 'Arquitectura de Software', type: 'arquitectura' },
        { id: 'rec-11', title: 'Diagrama de Flujo', type: 'diagrama' },
        { id: 'rec-12', title: 'Diagrama de Proceso', type: 'diagrama' },
        { id: 'rec-13', title: 'Repositorios', type: 'repositorios' },
        { id: 'rec-14', title: 'Manual de Base de Datos', type: 'manual-bd' },
        { id: 'rec-15', title: 'Documentación de API', type: 'doc-api' },
    ],
    capacitacion: [
        { id: 'cap-1', title: 'Acta de Constitución', type: 'acta' },
        { id: 'cap-2', title: 'Cronograma', type: 'cronograma' },
        { id: 'cap-3', title: 'Prototipo', type: 'prototipo' },
        { id: 'cap-4', title: 'Manual de Usuario', type: 'manual' },
        { id: 'cap-5', title: 'Manual de Sistema', type: 'manual' },
        { id: 'cap-6', title: 'Lecciones Aprendidas', type: 'lecciones' },
        { id: 'cap-7', title: 'Requerimientos Funcionales', type: 'requerimientos' },
        { id: 'cap-8', title: 'Product Backlog', type: 'backlog' },
        { id: 'cap-9', title: 'Acta de Conformidad', type: 'acta' },
        { id: 'cap-10', title: 'Arquitectura de Software', type: 'arquitectura' },
        { id: 'cap-11', title: 'Diagrama de Flujo', type: 'diagrama' },
        { id: 'cap-12', title: 'Diagrama de Proceso', type: 'diagrama' },
        { id: 'cap-13', title: 'Repositorios', type: 'repositorios' },
        { id: 'cap-14', title: 'Manual de Base de Datos', type: 'manual-bd' },
        { id: 'cap-15', title: 'Documentación de API', type: 'doc-api' },
    ],
    logistica: [
        { id: 'log-1', title: 'Acta de Constitución', type: 'acta' },
        { id: 'log-2', title: 'Cronograma', type: 'cronograma' },
        { id: 'log-3', title: 'Prototipo', type: 'prototipo' },
        { id: 'log-4', title: 'Manual de Usuario', type: 'manual' },
        { id: 'log-5', title: 'Manual de Sistema', type: 'manual' },
        { id: 'log-6', title: 'Lecciones Aprendidas', type: 'lecciones' },
        { id: 'log-7', title: 'Requerimientos Funcionales', type: 'requerimientos' },
        { id: 'log-8', title: 'Product Backlog', type: 'backlog' },
        { id: 'log-9', title: 'Acta de Conformidad', type: 'acta' },
        { id: 'log-10', title: 'Arquitectura de Software', type: 'arquitectura' },
        { id: 'log-11', title: 'Diagrama de Flujo', type: 'diagrama' },
        { id: 'log-12', title: 'Diagrama de Proceso', type: 'diagrama' },
        { id: 'log-13', title: 'Repositorios', type: 'repositorios' },
        { id: 'log-14', title: 'Manual de Base de Datos', type: 'manual-bd' },
        { id: 'log-15', title: 'Documentación de API', type: 'doc-api' },
    ],
    'capdatos-apk': [
        { id: 'apk-1', title: 'Acta de Constitución', type: 'acta' },
        { id: 'apk-2', title: 'Cronograma', type: 'cronograma' },
        { id: 'apk-3', title: 'Prototipo', type: 'prototipo' },
        { id: 'apk-4', title: 'Manual de Usuario', type: 'manual' },
        { id: 'apk-5', title: 'Manual de Sistema', type: 'manual' },
        { id: 'apk-6', title: 'Lecciones Aprendidas', type: 'lecciones' },
        { id: 'apk-7', title: 'Requerimientos Funcionales', type: 'requerimientos' },
        { id: 'apk-8', title: 'Product Backlog', type: 'backlog' },
        { id: 'apk-9', title: 'Acta de Conformidad', type: 'acta' },
        { id: 'apk-10', title: 'Arquitectura de Software', type: 'arquitectura' },
        { id: 'apk-11', title: 'Diagrama de Flujo', type: 'diagrama' },
        { id: 'apk-12', title: 'Diagrama de Proceso', type: 'diagrama' },
        { id: 'apk-13', title: 'Repositorios', type: 'repositorios' },
        { id: 'apk-14', title: 'Manual de Base de Datos', type: 'manual-bd' },
        { id: 'apk-15', title: 'Documentación de API', type: 'doc-api' },
    ],
    'censo-linea': [
        { id: 'cen-1', title: 'Acta de Constitución', type: 'acta' },
        { id: 'cen-2', title: 'Cronograma', type: 'cronograma' },
        { id: 'cen-3', title: 'Prototipo', type: 'prototipo' },
        { id: 'cen-4', title: 'Manual de Usuario', type: 'manual' },
        { id: 'cen-5', title: 'Manual de Sistema', type: 'manual' },
        { id: 'cen-6', title: 'Lecciones Aprendidas', type: 'lecciones' },
        { id: 'cen-7', title: 'Requerimientos Funcionales', type: 'requerimientos' },
        { id: 'cen-8', title: 'Product Backlog', type: 'backlog' },
        { id: 'cen-9', title: 'Acta de Conformidad', type: 'acta' },
        { id: 'cen-10', title: 'Arquitectura de Software', type: 'arquitectura' },
        { id: 'cen-11', title: 'Diagrama de Flujo', type: 'diagrama' },
        { id: 'cen-12', title: 'Diagrama de Proceso', type: 'diagrama' },
        { id: 'cen-13', title: 'Repositorios', type: 'repositorios' },
        { id: 'cen-14', title: 'Manual de Base de Datos', type: 'manual-bd' },
        { id: 'cen-15', title: 'Documentación de API', type: 'doc-api' },
    ],
    consistencia: [
        { id: 'con-1', title: 'Acta de Constitución', type: 'acta' },
        { id: 'con-2', title: 'Cronograma', type: 'cronograma' },
        { id: 'con-3', title: 'Prototipo', type: 'prototipo' },
        { id: 'con-4', title: 'Manual de Usuario', type: 'manual' },
        { id: 'con-5', title: 'Manual de Sistema', type: 'manual' },
        { id: 'con-6', title: 'Lecciones Aprendidas', type: 'lecciones' },
        { id: 'con-7', title: 'Requerimientos Funcionales', type: 'requerimientos' },
        { id: 'con-8', title: 'Product Backlog', type: 'backlog' },
        { id: 'con-9', title: 'Acta de Conformidad', type: 'acta' },
        { id: 'con-10', title: 'Arquitectura de Software', type: 'arquitectura' },
        { id: 'con-11', title: 'Diagrama de Flujo', type: 'diagrama' },
        { id: 'con-12', title: 'Diagrama de Proceso', type: 'diagrama' },
        { id: 'con-13', title: 'Repositorios', type: 'repositorios' },
        { id: 'con-14', title: 'Manual de Base de Datos', type: 'manual-bd' },
        { id: 'con-15', title: 'Documentación de API', type: 'doc-api' },
    ],
    monitoreo: [
        { id: 'mon-1', title: 'Acta de Constitución', type: 'acta' },
        { id: 'mon-2', title: 'Cronograma', type: 'cronograma' },
        { id: 'mon-3', title: 'Prototipo', type: 'prototipo' },
        { id: 'mon-4', title: 'Manual de Usuario', type: 'manual' },
        { id: 'mon-5', title: 'Manual de Sistema', type: 'manual' },
        { id: 'mon-6', title: 'Lecciones Aprendidas', type: 'lecciones' },
        { id: 'mon-7', title: 'Requerimientos Funcionales', type: 'requerimientos' },
        { id: 'mon-8', title: 'Product Backlog', type: 'backlog' },
        { id: 'mon-9', title: 'Acta de Conformidad', type: 'acta' },
        { id: 'mon-10', title: 'Arquitectura de Software', type: 'arquitectura' },
        { id: 'mon-11', title: 'Diagrama de Flujo', type: 'diagrama' },
        { id: 'mon-12', title: 'Diagrama de Proceso', type: 'diagrama' },
        { id: 'mon-13', title: 'Repositorios', type: 'repositorios' },
        { id: 'mon-14', title: 'Manual de Base de Datos', type: 'manual-bd' },
        { id: 'mon-15', title: 'Documentación de API', type: 'doc-api' },
    ],
    yanapaq: [
        { id: 'yan-1', title: 'Acta de Constitución', type: 'acta' },
        { id: 'yan-2', title: 'Cronograma', type: 'cronograma' },
        { id: 'yan-3', title: 'Prototipo', type: 'prototipo' },
        { id: 'yan-4', title: 'Manual de Usuario', type: 'manual' },
        { id: 'yan-5', title: 'Manual de Sistema', type: 'manual' },
        { id: 'yan-6', title: 'Lecciones Aprendidas', type: 'lecciones' },
        { id: 'yan-7', title: 'Requerimientos Funcionales', type: 'requerimientos' },
        { id: 'yan-8', title: 'Product Backlog', type: 'backlog' },
        { id: 'yan-9', title: 'Acta de Conformidad', type: 'acta' },
        { id: 'yan-10', title: 'Arquitectura de Software', type: 'arquitectura' },
        { id: 'yan-11', title: 'Diagrama de Flujo', type: 'diagrama' },
        { id: 'yan-12', title: 'Diagrama de Proceso', type: 'diagrama' },
        { id: 'yan-13', title: 'Repositorios', type: 'repositorios' },
        { id: 'yan-14', title: 'Manual de Base de Datos', type: 'manual-bd' },
        { id: 'yan-15', title: 'Documentación de API', type: 'doc-api' },
    ]
};

console.log('\n=== VERIFICACIÓN DE ESTRUCTURA DE DOCUMENTOS ===\n');

const modules = Object.keys(initialDocs);
console.log(`Total de módulos: ${modules.length}`);
console.log(`Módulos: ${modules.join(', ')}\n`);

// Contar documentos por módulo
console.log('--- Cantidad de documentos por módulo ---');
modules.forEach(module => {
    const count = initialDocs[module].length;
    console.log(`${module}: ${count} documentos`);
});

// Verificar que todos tengan la misma cantidad
const counts = modules.map(m => initialDocs[module].length);
const allSame = counts.every(c => c === counts[0]);
console.log(`\n¿Todos los módulos tienen la misma cantidad? ${allSame ? '✓ SÍ' : '✗ NO'}`);

// Tipos de documentos en cada módulo
console.log('\n--- Tipos de documentos en cada módulo ---');
const referenceTypes = initialDocs[modules[0]].map(d => d.type);
console.log(`Tipos de referencia (${modules[0]}): ${referenceTypes.join(', ')}`);

let allTypesMatch = true;
modules.forEach(module => {
    const types = initialDocs[module].map(d => d.type);
    const typesMatch = JSON.stringify(types) === JSON.stringify(referenceTypes);
    if (!typesMatch) {
        console.log(`✗ ${module}: tipos NO coinciden`);
        allTypesMatch = false;
    }
});

if (allTypesMatch) {
    console.log('✓ Todos los módulos tienen los mismos tipos de documentos');
}

// Resumen de tipos de documentos
console.log('\n--- Resumen de tipos de documentos ---');
const typeCount = {};
referenceTypes.forEach(type => {
    typeCount[type] = (typeCount[type] || 0) + 1;
});

Object.entries(typeCount).forEach(([type, count]) => {
    console.log(`${type}: ${count}`);
});

// Documentos que usan Excel/MPP
console.log('\n--- Documentos que aceptan Excel/MPP ---');
const excelMppTypes = ['lecciones', 'cronograma', 'backlog'];
excelMppTypes.forEach(type => {
    console.log(`- ${type}`);
});

// Documentos que usan PDF/Word
console.log('\n--- Documentos que aceptan PDF/Word ---');
const pdfWordTypes = referenceTypes.filter(t => !excelMppTypes.includes(t) && t !== 'manual' && t !== 'manual-bd' && t !== 'repositorios' && t !== 'prototipo');
pdfWordTypes.forEach(type => {
    console.log(`- ${type}`);
});

// Documentos especiales
console.log('\n--- Documentos con lógica especial ---');
console.log('- manual, manual-bd: Múltiples archivos PDF/Word');
console.log('- repositorios: URLs de frontend y backend');
console.log('- prototipo: URL de Figma o archivo PDF');

console.log('\n=== FIN DE VERIFICACIÓN ===\n');
