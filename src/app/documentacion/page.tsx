"use client";

import React, { useState, useEffect } from 'react';
import AppHeader from "@/components/layout/app-header";
import { useFirestore, useCollection, useMemoFirebase, useUser, errorEmitter, FirestorePermissionError } from "@/firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc, writeBatch, deleteDoc } from "firebase/firestore";
import { Loader2, Upload, Edit, Eye, Download, Plus, Trash2 } from 'lucide-react';

const categories = [
  { id: 'segmentacion', name: 'Segmentación y Ruteo', icon: '🗺️' },
  { id: 'rrhh', name: 'Consecución RRHH', icon: '👥' },
  { id: 'logistica', name: 'Logística Censal', icon: '📦' },
  { id: 'capacitacion', name: 'Capacitación', icon: '🎓' },
  { id: 'operacion', name: 'Operación de Campo', icon: '📱' },
  { id: 'procesamiento', name: 'Procesamiento', icon: '⚙️' },
  { id: 'postcensal', name: 'Post Censal', icon: '📊' },
  { id: 'generales', name: 'Documentos Generales', icon: '📋' },
];

const initialDocs = {
    segmentacion: [
        { id: 'seg-1', title: 'Acta de Constitución', description: 'Acta de constitución del proyecto para el área de segmentación', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'segmentacion' },
        { id: 'seg-2', title: 'Cronograma', description: 'Cronograma detallado de actividades para segmentación', type: 'cronograma', version: '2.1', updatedAt: '15 Sep 2025', url: 'https://docs.google.com/spreadsheets/d/1example/edit', category: 'segmentacion' },
        { id: 'seg-3', title: 'Prototipo', description: 'Prototipo y diseño del sistema de segmentación', type: 'prototipo', version: '2.1', updatedAt: '15 Sep 2025', url: 'https://www.figma.com/design/oiFpylOhaKTDZb3e8XalO3/Nueva-Makeup?node-id=0-1&p=f', category: 'segmentacion' },
        { id: 'seg-4', title: 'Manual de Usuario', description: 'Manual de usuario del sistema de segmentación', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: 'https://docs.google.com/document/d/1example/edit', category: 'segmentacion' },
        { id: 'seg-5', title: 'Manual de Sistema', description: 'Manual técnico del sistema de segmentación', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: 'https://docs.google.com/document/d/1example/edit', category: 'segmentacion' },
    ],
    rrhh: [
        { id: 'rrhh-1', title: 'Acta de Constitución', description: 'Acta de constitución del proyecto para el área de RRHH', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'rrhh' },
        { id: 'rrhh-2', title: 'Cronograma', description: 'Cronograma detallado de actividades para RRHH', type: 'cronograma', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'rrhh' },
        { id: 'rrhh-3', title: 'Prototipo', description: 'Prototipo y diseño del sistema de RRHH', type: 'prototipo', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'rrhh' },
        { id: 'rrhh-4', title: 'Manual de Usuario', description: 'Manual de usuario del sistema de RRHH', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'rrhh' },
        { id: 'rrhh-5', title: 'Manual de Sistema', description: 'Manual técnico del sistema de RRHH', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'rrhh' },
    ],
    logistica: [
        { id: 'log-1', title: 'Acta de Constitución', description: 'Acta de constitución del proyecto para el área de logística', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'logistica' },
        { id: 'log-2', title: 'Cronograma', description: 'Cronograma detallado de actividades para logística', type: 'cronograma', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'logistica' },
        { id: 'log-3', title: 'Prototipo', description: 'Prototipo y diseño del sistema de logística', type: 'prototipo', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'logistica' },
        { id: 'log-4', title: 'Manual de Usuario', description: 'Manual de usuario del sistema de logística', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'logistica' },
        { id: 'log-5', title: 'Manual de Sistema', description: 'Manual técnico del sistema de logística', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'logistica' },
    ],
    capacitacion: [
        { id: 'cap-1', title: 'Acta de Constitución', description: 'Acta de constitución del proyecto para el área de capacitación', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capacitacion' },
        { id: 'cap-2', title: 'Cronograma', description: 'Cronograma detallado de actividades para capacitación', type: 'cronograma', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capacitacion' },
        { id: 'cap-3', title: 'Prototipo', description: 'Prototipo y diseño del sistema de capacitación', type: 'prototipo', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capacitacion' },
        { id: 'cap-4', title: 'Manual de Usuario', description: 'Manual de usuario del sistema de capacitación', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capacitacion' },
        { id: 'cap-5', title: 'Manual de Sistema', description: 'Manual técnico del sistema de capacitación', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capacitacion' },
    ],
    operacion: [
        { id: 'ope-1', title: 'Acta de Constitución', description: 'Acta de constitución del proyecto para el área de operación de campo', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'operacion' },
        { id: 'ope-2', title: 'Cronograma', description: 'Cronograma detallado de actividades para operación de campo', type: 'cronograma', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'operacion' },
        { id: 'ope-3', title: 'Prototipo', description: 'Prototipo y diseño del sistema de operación de campo', type: 'prototipo', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'operacion' },
        { id: 'ope-4', title: 'Manual de Usuario', description: 'Manual de usuario del sistema de operación de campo', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'operacion' },
        { id: 'ope-5', title: 'Manual de Sistema', description: 'Manual técnico del sistema de operación de campo', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'operacion' },
    ],
    procesamiento: [
        { id: 'pro-1', title: 'Acta de Constitución', description: 'Acta de constitución del proyecto para el área de procesamiento', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'procesamiento' },
        { id: 'pro-2', title: 'Cronograma', description: 'Cronograma detallado de actividades para procesamiento', type: 'cronograma', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'procesamiento' },
        { id: 'pro-3', title: 'Prototipo', description: 'Prototipo y diseño del sistema de procesamiento', type: 'prototipo', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'procesamiento' },
        { id: 'pro-4', title: 'Manual de Usuario', description: 'Manual de usuario del sistema de procesamiento', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'procesamiento' },
        { id: 'pro-5', title: 'Manual de Sistema', description: 'Manual técnico del sistema de procesamiento', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'procesamiento' },
    ],
    postcensal: [
        { id: 'pos-1', title: 'Acta de Constitución', description: 'Acta de constitución del proyecto para el área post censal', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'postcensal' },
        { id: 'pos-2', title: 'Cronograma', description: 'Cronograma detallado de actividades para post censal', type: 'cronograma', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'postcensal' },
        { id: 'pos-3', title: 'Prototipo', description: 'Prototipo y diseño del sistema post censal', type: 'prototipo', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'postcensal' },
        { id: 'pos-4', title: 'Manual de Usuario', description: 'Manual de usuario del sistema post censal', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'postcensal' },
        { id: 'pos-5', title: 'Manual de Sistema', description: 'Manual técnico del sistema post censal', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'postcensal' },
    ],
    generales: [
        { id: 'gen-1', title: 'Acta de Constitución', description: 'Acta de constitución del proyecto general CPV 2025', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'generales' },
        { id: 'gen-2', title: 'Cronograma', description: 'Cronograma detallado de actividades del proyecto CPV 2025', type: 'cronograma', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'generales' },
        { id: 'gen-3', title: 'Prototipo', description: 'Prototipo y diseño del sistema general CPV 2025', type: 'prototipo', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'generales' },
        { id: 'gen-4', title: 'Manual de Usuario', description: 'Manual de usuario general del CPV 2025', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'generales' },
        { id: 'gen-5', title: 'Manual de Sistema', description: 'Manual técnico general del CPV 2025', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'generales' },
    ]
};


const docTypes = {
  acta: '📝',
  cronograma: '📅',
  prototipo: '🎨',
  manual: '📖',
  default: '📄',
};

const docTypeClasses = {
    acta: 'border-blue-500',
    cronograma: 'border-yellow-500',
    manual: 'border-green-500',
    prototipo: 'border-purple-500',
    default: 'border-gray-500',
};

const docTypeIconBg = {
    acta: 'bg-blue-500',
    cronograma: 'bg-yellow-500',
    manual: 'bg-green-500',
    prototipo: 'bg-purple-500',
    default: 'bg-gray-500',
}

const getDocumentIcon = (type) => docTypes[type] || docTypes.default;
const getDocClass = (type) => docTypeClasses[type] || docTypeClasses.default;
const getDocIconBg = (type) => docTypeIconBg[type] || docTypeIconBg.default;

export default function DocumentacionPage() {
    const firestore = useFirestore();
    const docsRef = useMemoFirebase(() => firestore ? collection(firestore, 'documentos') : null, [firestore]);
    const { data: allDocs, isLoading: isLoadingDocs, error: firestoreError } = useCollection(docsRef);
    
    const [docs, setDocs] = useState([]);
    const [view, setView] = useState('grid');
    const [activeCategory, setActiveCategory] = useState('segmentacion');
    const [activeType, setActiveType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [modalDoc, setModalDoc] = useState(null);
    const [uploadModalConfig, setUploadModalConfig] = useState({ isOpen: false, docToEdit: null });

    const seedData = async () => {
        if (!firestore || !allDocs) return;

        console.log("Checking for missing documents...");
        try {
            // Get existing document IDs
            const existingIds = new Set(allDocs.map(doc => doc.id));

            // Find missing documents across all categories
            const allInitialDocs = Object.values(initialDocs).flat();
            const missingDocs = allInitialDocs.filter(docData => !existingIds.has(docData.id));

            if (missingDocs.length === 0) {
                console.log("All documents already exist.");
                return;
            }

            console.log(`Found ${missingDocs.length} missing documents. Seeding...`);
            const batch = writeBatch(firestore);

            missingDocs.forEach(docData => {
                const docRef = doc(firestore, "documentos", docData.id);
                batch.set(docRef, { ...docData, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
            });

            await batch.commit();
            console.log("Missing documents seeded successfully.");
        } catch (error) {
            console.error("Error seeding data: ", error);
        }
    };

    useEffect(() => {
        if (!isLoadingDocs && allDocs) {
            seedData();
        }
    }, [isLoadingDocs, allDocs, firestore]);

    useEffect(() => {
        if (allDocs) {
            const filteredDocs = allDocs.filter(doc => {
                const categoryMatch = doc.category === activeCategory;
                const typeMatch = activeType === 'all' || doc.type === activeType;
                const searchMatch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
                return categoryMatch && typeMatch && searchMatch;
            });
            setDocs(filteredDocs);
        }
    }, [allDocs, activeCategory, activeType, searchTerm]);
    
    const openPreviewModal = async (doc) => {
        if (!doc.url || doc.url === '#') {
            alert("No hay un documento adjunto para previsualizar.");
            return;
        }

        // If it's a Google Drive folder, file, Sheets, or Figma, open in new tab
        if (doc.url.includes('drive.google.com/drive/folders') ||
            doc.url.includes('drive.google.com/file') ||
            doc.url.includes('docs.google.com/spreadsheets') ||
            doc.url.includes('figma.com')) {
            window.open(doc.url, '_blank');
            return;
        }

        let embedUrl = doc.url;

        // If document has a filePath (GCS file), generate a fresh signed URL via API
        if (doc.filePath) {
            try {
                const response = await fetch(`/api/storage/download?filePath=${encodeURIComponent(doc.filePath)}&expiresIn=60`);
                if (!response.ok) {
                    throw new Error('Failed to get signed URL');
                }
                const result = await response.json();
                embedUrl = result.url;
            } catch (error) {
                console.error('Error getting signed URL:', error);
                alert('Error al obtener la URL del archivo.');
                return;
            }
        } else if (doc.url.includes('supabase.co')) {
            // Handle legacy Supabase URLs
            const fileExtension = doc.url.split('.').pop()?.toLowerCase();
            const embeddableExtensions = ['pdf'];
            if (embeddableExtensions.includes(fileExtension)) {
                 embedUrl = doc.url;
            } else {
                 embedUrl = `https://docs.google.com/gview?url=${encodeURIComponent(doc.url)}&embedded=true`;
            }
        } else if (doc.url.includes('docs.google.com') && !doc.url.includes('/embed') && !doc.url.includes('/preview')) {
            // Handle Google Docs URLs
            if (doc.url.includes('/presentation/')) {
                embedUrl = doc.url.replace('/edit', '/embed').replace('/view', '/embed');
            } else {
                embedUrl = doc.url.replace('/edit', '/preview').replace('/view', '/preview');
            }
        }
        // For other URLs (like Figma), we can assume they are directly embeddable or just open them.

        setModalDoc({ ...doc, embedUrl });
    }
    
    const closePreviewModal = () => setModalDoc(null);

    const openUploadModal = (docToEdit = null) => {
        setUploadModalConfig({ isOpen: true, docToEdit });
    };

    const closeUploadModal = () => {
        setUploadModalConfig({ isOpen: false, docToEdit: null });
    };
    
    const handleUploadSuccess = () => {
        closeUploadModal();
    }

    const handleDownload = async (doc) => {
        // If document has a filePath (GCS file), generate a fresh signed URL via API
        if (doc.filePath) {
            try {
                const response = await fetch(`/api/storage/download?filePath=${encodeURIComponent(doc.filePath)}&expiresIn=60`);
                if (!response.ok) {
                    throw new Error('Failed to get download URL');
                }
                const result = await response.json();
                window.open(result.url, '_blank');
            } catch (error) {
                console.error('Error getting download URL:', error);
                alert('Error al obtener la URL de descarga.');
            }
        } else {
            // For legacy URLs, open directly
            window.open(doc.url, '_blank');
        }
    }

    const handleDelete = async (document) => {
        if (!firestore) {
            alert('Error de conexión con la base de datos.');
            return;
        }

        const confirmDelete = confirm(`¿Estás seguro de eliminar el documento "${document.title}"?`);
        if (!confirmDelete) return;

        try {
            const docRef = doc(firestore, 'documentos', document.id);
            await deleteDoc(docRef);
            console.log('Documento eliminado:', document.title);
        } catch (error) {
            console.error('Error eliminando documento:', error);
            alert('Error al eliminar el documento.');
        }
    }

    return (
        <>
            <AppHeader />
            <div className="max-w-7xl mx-auto p-5 md:p-10">
                <div className="text-center text-white mb-10">
                    <h1 className="text-4xl font-bold mb-2">CENTRO DE DOCUMENTACIÓN</h1>
                    <p className="text-lg opacity-90">Repositorio de documentos y recursos del CPV 2025</p>
                </div>

                <div className="bg-white/95 rounded-2xl p-7 mb-8 shadow-lg">
                    <div className="flex flex-col md:flex-row gap-4 mb-5">
                        <input type="text" placeholder="Buscar documentos..." className="flex-grow p-4 border-2 border-gray-200 rounded-xl outline-none focus:border-[#667eea]" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {['all', 'acta', 'cronograma', 'prototipo', 'manual'].map(type => (
                            <button key={type} onClick={() => setActiveType(type)} className={`py-2 px-4 rounded-full text-sm font-medium border-2 transition-colors ${activeType === type ? 'bg-[#667eea] text-white border-[#667eea]' : 'bg-white border-gray-200 hover:bg-gray-100'}`}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-[280px_1fr] gap-8">
                    <aside className="bg-white/95 rounded-2xl p-6 shadow-lg h-fit">
                        <h3 className="text-lg font-semibold text-gray-800 mb-5">📂 Categorías</h3>
                        <ul className="space-y-2">
                            {categories.map(cat => (
                                <li key={cat.id}>
                                    <a href="#" onClick={(e) => { e.preventDefault(); setActiveCategory(cat.id); }} className={`flex items-center gap-3 p-3 rounded-lg transition-all ${activeCategory === cat.id ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-gray-100'}`}>
                                        <span>{cat.icon}</span>
                                        <span>{cat.name}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </aside>
                    
                    <main className="bg-white/95 rounded-2xl p-7 shadow-lg">
                        <header className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {categories.find(c => c.id === activeCategory)?.name}
                            </h2>
                            <div className="bg-gray-100 p-1 rounded-lg flex gap-1">
                                <button onClick={() => setView('grid')} className={`p-2 rounded-md ${view === 'grid' ? 'bg-white shadow' : ''}`}>⊞</button>
                                <button onClick={() => setView('list')} className={`p-2 rounded-md ${view === 'list' ? 'bg-white shadow' : ''}`}>☰</button>
                            </div>
                        </header>
                        
                        {isLoadingDocs ? <div className="text-center p-10"><Loader2 className="animate-spin inline-block mr-2" />Cargando documentos...</div> : (
                           firestoreError ? <div className="text-center p-10 text-red-500">Error: {firestoreError.message}</div> : 
                           docs.length > 0 ? (
                                <>
                                    {view === 'grid' ? (
                                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                            {docs.map(doc => <DocCard key={doc.id} doc={doc} onPreview={openPreviewModal} onEdit={openUploadModal} onDownload={handleDownload} onDelete={handleDelete} />)}
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {docs.map(doc => <DocListItem key={doc.id} doc={doc} onPreview={openPreviewModal} onEdit={openUploadModal} onDownload={handleDownload} onDelete={handleDelete} />)}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center p-10 text-gray-500">
                                    <p>No hay documentos en esta categoría.</p>
                                </div>
                            )
                        )}

                    </main>
                </div>
            </div>
            {modalDoc && <DocModal doc={modalDoc} onClose={closePreviewModal} />}
            {uploadModalConfig.isOpen && <UploadDocModal onClose={closeUploadModal} onUploadSuccess={handleUploadSuccess} docToEdit={uploadModalConfig.docToEdit} activeCategory={activeCategory} allDocs={allDocs} />}

            <button
                onClick={() => openUploadModal()}
                className="fixed bottom-10 right-10 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                title="Subir Nuevo Documento"
            >
                <Plus size={32} />
            </button>
        </>
    );
}

const DocCard = ({ doc, onPreview, onEdit, onDownload, onDelete }) => (
    <div className={`bg-white rounded-xl p-5 shadow-md border-l-4 ${getDocClass(doc.type)} flex flex-col justify-between`}>
        <div>
            <div className="flex items-start justify-between mb-3">
                 <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl ${getDocIconBg(doc.type)}`}>
                        {getDocumentIcon(doc.type)}
                    </div>
                    <h4 className="font-semibold text-gray-800">{doc.title}</h4>
                 </div>
                 <div className="flex gap-1">
                    <button onClick={(e) => { e.stopPropagation(); onEdit(doc); }} className="text-gray-400 hover:text-blue-600 p-1" title="Actualizar documento">
                        <Edit size={16} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(doc); }} className="text-gray-400 hover:text-red-600 p-1" title="Eliminar documento">
                        <Trash2 size={16} />
                    </button>
                 </div>
            </div>
            <p className="text-sm text-gray-600 mb-4 h-12">{doc.description}</p>
        </div>
        <div>
            <div className="text-xs text-gray-500 pt-3 border-t">
                <p>Actualizado: {doc.updatedAt?.seconds ? new Date(doc.updatedAt.seconds * 1000).toLocaleDateString() : doc.updatedAt}</p>
                <p>Versión: {doc.version || '1.0'}</p>
            </div>
            <div className="flex gap-2 mt-4">
                 <button onClick={() => onPreview(doc)} className="flex-1 text-sm bg-blue-100 text-blue-700 font-semibold py-2 px-3 rounded-lg hover:bg-blue-200 flex items-center justify-center gap-1">
                    <Eye size={14}/> Ver
                 </button>
                 <button onClick={() => onDownload(doc)} className="flex-1 text-sm bg-green-100 text-green-700 font-semibold py-2 px-3 rounded-lg hover:bg-green-200 flex items-center justify-center gap-1">
                    <Download size={14}/> Descargar
                 </button>
            </div>
        </div>
    </div>
);

const DocListItem = ({ doc, onPreview, onEdit, onDownload, onDelete }) => (
    <div className={`flex items-center gap-4 p-4 rounded-lg transition-colors hover:bg-gray-50`}>
         <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl shrink-0 cursor-pointer ${getDocIconBg(doc.type)}`} onClick={() => onPreview(doc)}>
            {getDocumentIcon(doc.type)}
        </div>
        <div className="flex-1 cursor-pointer" onClick={() => onPreview(doc)}>
            <h4 className="font-semibold text-gray-800">{doc.title}</h4>
            <p className="text-xs text-gray-500">Actualizado: {doc.updatedAt?.seconds ? new Date(doc.updatedAt.seconds * 1000).toLocaleDateString() : doc.updatedAt} • Versión: {doc.version || '1.0'}</p>
        </div>
        <div className="flex gap-2">
            <button onClick={() => onPreview(doc)} className="text-xs bg-blue-100 text-blue-700 font-semibold py-1 px-3 rounded-full hover:bg-blue-200 flex items-center gap-1"><Eye size={12}/> Ver</button>
            <button onClick={() => onDownload(doc)} className="text-xs bg-green-100 text-green-700 font-semibold py-1 px-3 rounded-full hover:bg-green-200 flex items-center gap-1"><Download size={12}/> Descargar</button>
            <button onClick={() => onEdit(doc)} className="text-xs bg-yellow-100 text-yellow-700 font-semibold py-1 px-3 rounded-full hover:bg-yellow-200 flex items-center gap-1">
                <Edit size={12} /> Actualizar
            </button>
            <button onClick={() => onDelete(doc)} className="text-xs bg-red-100 text-red-700 font-semibold py-1 px-3 rounded-full hover:bg-red-200 flex items-center gap-1">
                <Trash2 size={12} /> Eliminar
            </button>
        </div>
    </div>
);


const DocModal = ({ doc, onClose }) => {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        }
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-5 border-b bg-gray-50 rounded-t-2xl">
                    <h3 className="text-lg font-semibold text-gray-800">{doc.title}</h3>
                    <button onClick={onClose} className="w-9 h-9 rounded-full bg-red-500 text-white font-bold text-xl hover:bg-red-600 transition-colors">×</button>
                </header>
                <div className="flex-1 p-2 md:p-8 bg-gray-100">
                    <iframe src={doc.embedUrl} className="w-full h-full border-0 rounded-lg bg-white" title={doc.title}></iframe>
                </div>
            </div>
        </div>
    );
};

const UploadDocModal = ({ onClose, onUploadSuccess, docToEdit, activeCategory, allDocs }) => {
    const firestore = useFirestore();
    const { user } = useUser();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(activeCategory);
    const [type, setType] = useState('acta');
    const [version, setVersion] = useState('1.0');
    const [file, setFile] = useState<File | null>(null);
    const [externalUrl, setExternalUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    const isEditMode = Boolean(docToEdit);

    useEffect(() => {
        if (isEditMode) {
            setTitle(docToEdit.title);
            setCategory(docToEdit.category);
            setType(docToEdit.type);
            setVersion(docToEdit.version || '1.0');
            setExternalUrl(docToEdit.url || '');
        } else {
            setCategory(activeCategory);
        }
    }, [docToEdit, isEditMode, activeCategory]);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isEditMode && !file && !externalUrl) {
            setError('Por favor, seleccione un archivo o proporcione un enlace externo.');
            return;
        }
        if (!firestore) {
            setError('Error de conexión con la base de datos.');
            return;
        }
        if (!user) {
            setError('Debe iniciar sesión para subir archivos.');
            return;
        }

        // Validar que no exista un documento con el mismo título en la misma categoría
        const duplicateDoc = allDocs?.find(doc =>
            doc.title === title &&
            doc.category === category &&
            (!isEditMode || doc.id !== docToEdit.id) // Permitir si estamos editando el mismo documento
        );

        if (duplicateDoc) {
            setError(`Ya existe un documento con el título "${title}" en esta categoría. Por favor, use otro título.`);
            return;
        }

        setIsUploading(true);
        setError('');

        let newFileUrl = docToEdit?.url;
        let newFilePath = docToEdit?.filePath;

        // If external URL is provided, use it directly
        if (externalUrl && externalUrl.trim() !== '') {
            newFileUrl = externalUrl.trim();
            newFilePath = undefined; // Clear filePath if using external URL
        } else if (file) {
            try {
                // Upload file to Google Cloud Storage via API
                const formData = new FormData();
                formData.append('file', file);
                formData.append('category', category);

                const uploadResponse = await fetch('/api/storage/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!uploadResponse.ok) {
                    const errorData = await uploadResponse.json();
                    throw new Error(errorData.error || 'Upload failed');
                }

                const uploadResult = await uploadResponse.json();
                newFilePath = uploadResult.filePath;

                // Get a signed URL for the file (valid for 60 minutes) via API
                const downloadResponse = await fetch(`/api/storage/download?filePath=${encodeURIComponent(newFilePath)}&expiresIn=60`);

                if (!downloadResponse.ok) {
                    const errorData = await downloadResponse.json();
                    throw new Error(errorData.error || 'Failed to get download URL');
                }

                const downloadResult = await downloadResponse.json();
                newFileUrl = downloadResult.url;
            } catch (err: any) {
                setError('Hubo un error al subir el archivo a Google Cloud Storage. ' + (err.message || ''));
                setIsUploading(false);
                return;
            }
        } else if (!isEditMode) {
             setError('Por favor, seleccione un archivo o proporcione un enlace externo.');
             setIsUploading(false);
             return;
        }

        const docData: any = {
            title,
            category,
            type,
            url: newFileUrl,
            version,
            updatedAt: serverTimestamp(),
        };

        // Only include filePath if it exists (for GCS files)
        if (newFilePath) {
            docData.filePath = newFilePath;
        }
        
        if (isEditMode) {
            const docRef = doc(firestore, 'documentos', docToEdit.id);
            updateDoc(docRef, docData)
                .then(() => {
                    onUploadSuccess();
                })
                .catch((err) => {
                    const permissionError = new FirestorePermissionError({
                        path: docRef.path,
                        operation: 'update',
                        requestResourceData: docData,
                    });
                    errorEmitter.emit('permission-error', permissionError);
                    setError('Error de permisos al actualizar el documento en Firestore.');
                })
                .finally(() => {
                    setIsUploading(false);
                });
        } else {
            const collectionRef = collection(firestore, 'documentos');
            const finalDocData = { ...docData, createdAt: serverTimestamp() };
            addDoc(collectionRef, finalDocData)
                .then(() => {
                    onUploadSuccess();
                })
                .catch((err) => {
                    const permissionError = new FirestorePermissionError({
                        path: collectionRef.path,
                        operation: 'create',
                        requestResourceData: finalDocData,
                    });
                    errorEmitter.emit('permission-error', permissionError);
                    setError('Error de permisos al crear el documento en Firestore.');
                })
                .finally(() => {
                    setIsUploading(false);
                });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-5 border-b bg-gray-50 rounded-t-2xl">
                    <h3 className="text-lg font-semibold text-gray-800">{isEditMode ? 'Actualizar Documento' : 'Subir Nuevo Documento'}</h3>
                    <button onClick={onClose} className="w-9 h-9 rounded-full bg-red-500 text-white font-bold text-xl hover:bg-red-600 transition-colors">×</button>
                </header>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && <p className="text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título del Documento</label>
                        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-[#667eea]" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                             <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 bg-gray-100 border-2 border-gray-200 rounded-lg" disabled={isEditMode}>
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                            <select id="type" value={type} onChange={(e) => setType(e.target.value)} className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-[#667eea]">
                                {Object.keys(docTypes).filter(k => k !== 'default').map(key => <option key={key} value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</option>)}
                            </select>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="version" className="block text-sm font-medium text-gray-700 mb-1">Versión</label>
                        <input type="text" id="version" value={version} onChange={(e) => setVersion(e.target.value)} required className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-[#667eea]" placeholder="Ej: 1.0"/>
                    </div>
                    <div>
                        <label htmlFor="externalUrl" className="block text-sm font-medium text-gray-700 mb-1">Enlace Externo (Opcional)</label>
                        <input type="url" id="externalUrl" value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-[#667eea]" placeholder="https://drive.google.com/..."/>
                        <p className="text-xs text-gray-500 mt-1">Puedes proporcionar un enlace a Google Drive, Docs, Figma, etc. en lugar de subir un archivo.</p>
                    </div>
                    <div>
                        <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">O Seleccionar Archivo</label>
                        <input type="file" id="file" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                        <p className="text-xs text-gray-500 mt-1">Sube un archivo si no proporcionaste un enlace externo.</p>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300">Cancelar</button>
                        <button type="submit" disabled={isUploading} className="py-2 px-6 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg font-semibold hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isUploading ? <><Loader2 className="animate-spin" /> Procesando...</> : (isEditMode ? 'Actualizar Documento' : 'Subir Documento')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
