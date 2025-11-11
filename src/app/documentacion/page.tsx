"use client";

import React, { useState, useEffect } from 'react';
import AppHeader from "@/components/layout/app-header";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc, writeBatch } from "firebase/firestore";
import { supabase } from '@/lib/supabase-client';
import { Loader2, Upload, Edit, Eye, Download, Plus } from 'lucide-react';

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
        { id: '1', title: 'Acta de Constitución', description: 'Acta de constitución del proyecto para el área de segmentacion', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: 'https://docs.google.com/document/d/1example/edit', category: 'segmentacion' },
        { id: '2', title: 'Cronograma', description: 'Cronograma detallado de actividades para segmentacion', type: 'cronograma', version: '2.1', updatedAt: '15 Sep 2025', url: 'https://docs.google.com/spreadsheets/d/1example/edit', category: 'segmentacion' },
        { id: '3', title: 'Prototipo', description: 'Prototipo y diseño del sistema de segmentacion', type: 'prototipo', version: '2.1', updatedAt: '15 Sep 2025', url: 'https://www.figma.com/file/1example', category: 'segmentacion' },
        { id: '4', title: 'Manual de Usuario', description: 'Manual de usuario del sistema de segmentacion', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: 'https://docs.google.com/document/d/1example/edit', category: 'segmentacion' },
        { id: '5', title: 'Manual de Sistema', description: 'Manual de usuario del sistema de segmentacion', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: 'https://docs.google.com/document/d/1example/edit', category: 'segmentacion' },
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
        if (!firestore || !allDocs || allDocs.length > 0) return;
        console.log("No documents found, seeding initial data...");
        try {
            const batch = writeBatch(firestore);
            const docsToSeed = initialDocs.segmentacion;
            docsToSeed.forEach(docData => {
                const docRef = doc(firestore, "documentos", docData.id);
                batch.set(docRef, { ...docData, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
            });
            await batch.commit();
            console.log("Initial data seeded successfully.");
        } catch (error) {
            console.error("Error seeding data: ", error);
        }
    };
    
    useEffect(() => {
        if (!isLoadingDocs && allDocs && allDocs.length === 0) {
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
    
    const openPreviewModal = (doc) => {
        if (!doc.url || doc.url === '#') {
            alert("No hay un documento adjunto para previsualizar.");
            return;
        }
        let embedUrl = doc.url;
        if (doc.url.includes('docs.google.com') && !doc.url.includes('/embed') && !doc.url.includes('/preview')) {
             if (doc.url.includes('/presentation/')) {
                 embedUrl = doc.url.replace('/edit', '/embed').replace('/view', '/embed');
             } else {
                 embedUrl = doc.url.replace('/edit', '/preview').replace('/view', '/preview');
             }
        }
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
                                            {docs.map(doc => <DocCard key={doc.id} doc={doc} onPreview={openPreviewModal} onEdit={openUploadModal} />)}
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {docs.map(doc => <DocListItem key={doc.id} doc={doc} onPreview={openPreviewModal} onEdit={openUploadModal} />)}
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
            {uploadModalConfig.isOpen && <UploadDocModal onClose={closeUploadModal} onUploadSuccess={handleUploadSuccess} docToEdit={uploadModalConfig.docToEdit} activeCategory={activeCategory} />}

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

const DocCard = ({ doc, onPreview, onEdit }) => (
    <div className={`bg-white rounded-xl p-5 shadow-md border-l-4 ${getDocClass(doc.type)} flex flex-col justify-between`}>
        <div>
            <div className="flex items-start justify-between mb-3">
                 <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl ${getDocIconBg(doc.type)}`}>
                        {getDocumentIcon(doc.type)}
                    </div>
                    <h4 className="font-semibold text-gray-800">{doc.title}</h4>
                 </div>
                 <button onClick={(e) => { e.stopPropagation(); onEdit(doc); }} className="text-gray-400 hover:text-gray-700 p-1" title="Actualizar documento">
                    <Edit size={16} />
                 </button>
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
                 <a href={doc.url} target="_blank" rel="noopener noreferrer" className="flex-1 text-sm bg-green-100 text-green-700 font-semibold py-2 px-3 rounded-lg hover:bg-green-200 flex items-center justify-center gap-1">
                    <Download size={14}/> Descargar
                 </a>
            </div>
        </div>
    </div>
);

const DocListItem = ({ doc, onPreview, onEdit }) => (
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
            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-xs bg-green-100 text-green-700 font-semibold py-1 px-3 rounded-full hover:bg-green-200 flex items-center gap-1"><Download size={12}/> Descargar</a>
            <button onClick={() => onEdit(doc)} className="text-xs bg-yellow-100 text-yellow-700 font-semibold py-1 px-3 rounded-full hover:bg-yellow-200 flex items-center gap-1">
                <Edit size={12} /> Actualizar
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

const UploadDocModal = ({ onClose, onUploadSuccess, docToEdit, activeCategory }) => {
    const firestore = useFirestore();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(activeCategory);
    const [type, setType] = useState('acta');
    const [version, setVersion] = useState('1.0');
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    const isEditMode = Boolean(docToEdit);

    useEffect(() => {
        if (isEditMode) {
            setTitle(docToEdit.title);
            setCategory(docToEdit.category);
            setType(docToEdit.type);
            setVersion(docToEdit.version || '1.0');
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
        
        if (!isEditMode && !file) {
            setError('Por favor, seleccione un archivo.');
            return;
        }
        if (!firestore) {
            setError('Error de conexión con la base de datos.');
            return;
        }

        setIsUploading(true);
        setError('');

        try {
            let newFileUrl = docToEdit?.url;

            if (file) {
                const filePath = `${category}/${Date.now()}-${file.name}`;
                const { error: uploadError } = await supabase.storage
                    .from('documentos')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: urlData } = supabase.storage
                    .from('documentos')
                    .getPublicUrl(filePath);
                
                newFileUrl = urlData.publicUrl;
            } else if (!isEditMode) {
                 setError('Por favor, seleccione un archivo para subir.');
                 setIsUploading(false);
                 return;
            }

            const docData = {
                title,
                category,
                type,
                url: newFileUrl,
                version,
                updatedAt: serverTimestamp(),
            };
            
            if (isEditMode) {
                const docRef = doc(firestore, 'documentos', docToEdit.id);
                await updateDoc(docRef, docData);
            } else {
                const collectionRef = collection(firestore, 'documentos');
                await addDoc(collectionRef, { ...docData, createdAt: serverTimestamp() });
            }
            
            onUploadSuccess();

        } catch (err: any) {
            console.error('Error al subir/actualizar documento:', err);
            setError('Hubo un error al procesar el documento. ' + (err.message || ''));
        } finally {
            setIsUploading(false);
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
                        <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">{isEditMode ? 'Reemplazar Archivo (Opcional)' : 'Seleccionar Archivo'}</label>
                        <input type="file" id="file" onChange={handleFileChange} required={!isEditMode} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                        {isEditMode ? <p className="text-xs text-gray-500 mt-1">Sube un archivo solo si quieres reemplazar el existente.</p> : <p className="text-xs text-gray-500 mt-1">El archivo es obligatorio al crear un nuevo documento.</p>}
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
