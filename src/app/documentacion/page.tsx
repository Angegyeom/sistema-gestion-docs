"use client";

import React, { useState, useEffect } from 'react';
import AppHeader from "@/components/layout/app-header";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { supabase } from '@/lib/supabase-client';
import { Loader2, Upload } from 'lucide-react';

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
    const { data: allDocs, isLoading: isLoadingDocs } = useCollection(docsRef);
    
    const [docs, setDocs] = useState([]);
    const [view, setView] = useState('grid');
    const [activeCategory, setActiveCategory] = useState('segmentacion');
    const [activeType, setActiveType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [modalDoc, setModalDoc] = useState(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    useEffect(() => {
        if (!allDocs) return;
        
        const filteredDocs = allDocs.filter(doc => {
            const categoryMatch = doc.category === activeCategory;
            const typeMatch = activeType === 'all' || doc.type === activeType;
            const searchMatch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
            return categoryMatch && typeMatch && searchMatch;
        });

        setDocs(filteredDocs);
    }, [allDocs, activeCategory, activeType, searchTerm]);
    
    const openModal = (doc) => {
        let embedUrl = doc.url;
        if (doc.url.includes('drive.google.com')) {
            const fileIdMatch = doc.url.match(/\/d\/([a-zA-Z0-9-_]+)/);
            if (fileIdMatch) {
                embedUrl = `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
            }
        } else if (!embedUrl.startsWith('https://')) {
             embedUrl = doc.url;
        }
        setModalDoc({ ...doc, embedUrl });
    }
    
    const closeModal = () => setModalDoc(null);
    const closeUploadModal = () => setIsUploadModalOpen(false);

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
                        <button className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white p-4 rounded-xl font-semibold hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2" onClick={() => setIsUploadModalOpen(true)}>
                            <Upload size={20} /> Subir Documento
                        </button>
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
                        
                        {isLoadingDocs ? <p>Cargando documentos...</p> : (
                            <>
                                {view === 'grid' ? (
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {docs.map(doc => <DocCard key={doc.id} doc={doc} onPreview={openModal} />)}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {docs.map(doc => <DocListItem key={doc.id} doc={doc} onPreview={openModal} />)}
                                    </div>
                                )}
                            </>
                        )}

                    </main>
                </div>
            </div>
            {modalDoc && <DocModal doc={modalDoc} onClose={closeModal} />}
            {isUploadModalOpen && <UploadDocModal onClose={closeUploadModal} onUploadSuccess={closeUploadModal} />}

        </>
    );
}

const DocCard = ({ doc, onPreview }) => (
    <div className={`bg-white rounded-xl p-5 shadow-md border-l-4 ${getDocClass(doc.type)} transition-transform hover:-translate-y-1 cursor-pointer`} onClick={() => onPreview(doc)}>
        <div className="flex items-center gap-4 mb-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl ${getDocIconBg(doc.type)}`}>
                {getDocumentIcon(doc.type)}
            </div>
            <h4 className="font-semibold text-gray-800 flex-1">{doc.title}</h4>
        </div>
        <p className="text-sm text-gray-600 mb-4 h-12">Documento de tipo {doc.type} para el área de {doc.category}</p>
        <div className="text-xs text-gray-500 pt-3 border-t">
            <p>Actualizado: {doc.updatedAt ? new Date(doc.updatedAt.seconds * 1000).toLocaleDateString() : 'N/A'}</p>
            <p>Versión: {doc.version || '1.0'}</p>
        </div>
        <div className="flex gap-2 mt-4">
             <button onClick={(e) => {e.stopPropagation(); window.open(doc.url, '_blank')}} className="text-xs bg-green-100 text-green-700 font-semibold py-1 px-3 rounded-full hover:bg-green-200">Descargar</button>
        </div>
    </div>
);

const DocListItem = ({ doc, onPreview }) => (
    <div className={`flex items-center gap-4 p-4 rounded-lg transition-colors hover:bg-gray-50 cursor-pointer`} onClick={() => onPreview(doc)}>
         <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl shrink-0 ${getDocIconBg(doc.type)}`}>
            {getDocumentIcon(doc.type)}
        </div>
        <div className="flex-1">
            <h4 className="font-semibold text-gray-800">{doc.title}</h4>
            <p className="text-xs text-gray-500">Actualizado: {doc.updatedAt ? new Date(doc.updatedAt.seconds * 1000).toLocaleDateString() : 'N/A'} • Versión: {doc.version || '1.0'}</p>
        </div>
        <div className="flex gap-2">
            <button onClick={(e) => {e.stopPropagation(); onPreview(doc)}} className="text-xs bg-blue-100 text-blue-700 font-semibold py-1 px-3 rounded-full hover:bg-blue-200">Ver</button>
            <button onClick={(e) => {e.stopPropagation(); window.open(doc.url, '_blank')}} className="text-xs bg-green-100 text-green-700 font-semibold py-1 px-3 rounded-full hover:bg-green-200">Descargar</button>
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

const UploadDocModal = ({ onClose, onUploadSuccess }) => {
    const firestore = useFirestore();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('segmentacion');
    const [type, setType] = useState('acta');
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !title) {
            setError('Por favor, complete todos los campos y seleccione un archivo.');
            return;
        }
        if (!firestore) {
            setError('Error de conexión con la base de datos.');
            return;
        }

        setIsUploading(true);
        setError('');

        try {
            const filePath = `${category}/${Date.now()}-${file.name}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('documentos')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from('documentos')
                .getPublicUrl(filePath);

            const newDoc = {
                title,
                category,
                type,
                url: urlData.publicUrl,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                version: '1.0'
            };

            await addDoc(collection(firestore, 'documentos'), newDoc);
            
            onUploadSuccess();

        } catch (err) {
            console.error('Error al subir documento:', err);
            setError('Hubo un error al subir el documento. ' + err.message);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-5 border-b bg-gray-50 rounded-t-2xl">
                    <h3 className="text-lg font-semibold text-gray-800">Subir Nuevo Documento</h3>
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
                            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-[#667eea]">
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
                        <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">Archivo</label>
                        <input type="file" id="file" onChange={handleFileChange} required className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300">Cancelar</button>
                        <button type="submit" disabled={isUploading} className="py-2 px-6 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg font-semibold hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isUploading ? <><Loader2 className="animate-spin" /> Subiendo...</> : 'Guardar Documento'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
