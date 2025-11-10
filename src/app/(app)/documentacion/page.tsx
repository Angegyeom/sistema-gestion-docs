"use client";

import React, { useState, useEffect } from 'react';

const documentDatabase = {
    // ... (same as in the original HTML)
};

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
    const [docs, setDocs] = useState([]);
    const [view, setView] = useState('grid'); // 'grid' or 'list'
    const [activeCategory, setActiveCategory] = useState('segmentacion');
    const [activeType, setActiveType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [modalDoc, setModalDoc] = useState(null);

    useEffect(() => {
        const allDocs = Object.keys(documentDatabase).map(key => ({...documentDatabase[key], id: key}));
        
        const filteredDocs = allDocs.filter(doc => {
            const categoryMatch = doc.category === activeCategory;
            const typeMatch = activeType === 'all' || doc.type === activeType;
            const searchMatch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
            return categoryMatch && typeMatch && searchMatch;
        });

        setDocs(filteredDocs);
    }, [activeCategory, activeType, searchTerm]);
    
    const openModal = (doc) => {
        let embedUrl = doc.url;
        if (doc.url.includes('drive.google.com')) {
            const fileIdMatch = doc.url.match(/\/d\/([a-zA-Z0-9-_]+)/);
            if (fileIdMatch) {
                embedUrl = `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
            }
        }
        setModalDoc({ ...doc, embedUrl });
    }
    
    const closeModal = () => setModalDoc(null);

    return (
        <>
            <div className="max-w-7xl mx-auto p-5 md:p-10">
                <div className="text-center text-white mb-10">
                    <h1 className="text-4xl font-bold mb-2">CENTRO DE DOCUMENTACIÓN</h1>
                    <p className="text-lg opacity-90">Repositorio de documentos y recursos del CPV 2025</p>
                </div>

                <div className="bg-white/95 rounded-2xl p-7 mb-8 shadow-lg">
                    <div className="flex flex-col md:flex-row gap-4 mb-5">
                        <input type="text" placeholder="Buscar documentos..." className="flex-grow p-4 border-2 border-gray-200 rounded-xl outline-none focus:border-[#667eea]" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        <button className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white p-4 rounded-xl font-semibold hover:-translate-y-0.5 transition-transform">🔍 Buscar</button>
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
                        
                        {view === 'grid' ? (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {docs.map(doc => <DocCard key={doc.id} doc={doc} onPreview={openModal} />)}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {docs.map(doc => <DocListItem key={doc.id} doc={doc} onPreview={openModal} />)}
                            </div>
                        )}
                    </main>
                </div>
            </div>
            {modalDoc && <DocModal doc={modalDoc} onClose={closeModal} />}
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
            <p>Actualizado: 15 Sep 2025</p>
            <p>Versión: 2.1</p>
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
            <p className="text-xs text-gray-500">Actualizado: 15 Sep 2025 • Versión: 2.1</p>
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
