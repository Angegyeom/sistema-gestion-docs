"use client";

import React, { useState, useEffect } from 'react';
import AppHeader from "@/components/layout/app-header";
import { useFirestore, useCollection, useMemoFirebase, useUser, errorEmitter, FirestorePermissionError } from "@/firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc, writeBatch } from "firebase/firestore";
import { Loader2, Upload, Edit, Eye, Download, Plus, FileText, FileSpreadsheet, FileStack } from 'lucide-react';
import Swal from 'sweetalert2';
import { usePermissions } from '@/hooks/use-permissions';

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
        { id: 'seg-2', title: 'Cronograma', description: 'Cronograma detallado de actividades para segmentación', type: 'cronograma', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'segmentacion' },
        { id: 'seg-3', title: 'Prototipo', description: 'Prototipo y diseño del sistema de segmentación', type: 'prototipo', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'segmentacion' },
        { id: 'seg-4', title: 'Manual de Usuario', description: 'Manual de usuario del sistema de segmentación', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'segmentacion' },
        { id: 'seg-5', title: 'Manual de Sistema', description: 'Manual técnico del sistema de segmentación', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'segmentacion' },
        { id: 'seg-6', title: 'Lecciones Aprendidas', description: 'Lecciones aprendidas durante el desarrollo del sistema de segmentación', type: 'lecciones', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'segmentacion' },
        { id: 'seg-7', title: 'Requerimientos Funcionales', description: 'Especificación de requerimientos funcionales del sistema de segmentación', type: 'requerimientos', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'segmentacion' },
        { id: 'seg-8', title: 'Product Backlog', description: 'Product Backlog del sistema de segmentación', type: 'backlog', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'segmentacion' },
        { id: 'seg-9', title: 'Acta de Conformidad', description: 'Acta de conformidad del sistema de segmentación', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'segmentacion' },
    ],
    rrhh: [
        { id: 'rrhh-1', title: 'Acta de Constitución', description: 'Acta de constitución del proyecto para el área de RRHH', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'rrhh' },
        { id: 'rrhh-2', title: 'Cronograma', description: 'Cronograma detallado de actividades para RRHH', type: 'cronograma', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'rrhh' },
        { id: 'rrhh-3', title: 'Prototipo', description: 'Prototipo y diseño del sistema de RRHH', type: 'prototipo', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'rrhh' },
        { id: 'rrhh-4', title: 'Manual de Usuario', description: 'Manual de usuario del sistema de RRHH', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'rrhh' },
        { id: 'rrhh-5', title: 'Manual de Sistema', description: 'Manual técnico del sistema de RRHH', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'rrhh' },
        { id: 'rrhh-6', title: 'Lecciones Aprendidas', description: 'Lecciones aprendidas durante el desarrollo del sistema de RRHH', type: 'lecciones', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'rrhh' },
        { id: 'rrhh-7', title: 'Requerimientos Funcionales', description: 'Especificación de requerimientos funcionales del sistema de RRHH', type: 'requerimientos', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'rrhh' },
        { id: 'rrhh-8', title: 'Product Backlog', description: 'Product Backlog del sistema de RRHH', type: 'backlog', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'rrhh' },
        { id: 'rrhh-9', title: 'Acta de Conformidad', description: 'Acta de conformidad del sistema de RRHH', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'rrhh' },
    ],
    logistica: [
        { id: 'log-1', title: 'Acta de Constitución', description: 'Acta de constitución del proyecto para el área de logística', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'logistica' },
        { id: 'log-2', title: 'Cronograma', description: 'Cronograma detallado de actividades para logística', type: 'cronograma', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'logistica' },
        { id: 'log-3', title: 'Prototipo', description: 'Prototipo y diseño del sistema de logística', type: 'prototipo', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'logistica' },
        { id: 'log-4', title: 'Manual de Usuario', description: 'Manual de usuario del sistema de logística', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'logistica' },
        { id: 'log-5', title: 'Manual de Sistema', description: 'Manual técnico del sistema de logística', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'logistica' },
        { id: 'log-6', title: 'Lecciones Aprendidas', description: 'Lecciones aprendidas durante el desarrollo del sistema de logística', type: 'lecciones', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'logistica' },
        { id: 'log-7', title: 'Requerimientos Funcionales', description: 'Especificación de requerimientos funcionales del sistema de logística', type: 'requerimientos', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'logistica' },
        { id: 'log-8', title: 'Product Backlog', description: 'Product Backlog del sistema de logística', type: 'backlog', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'logistica' },
        { id: 'log-9', title: 'Acta de Conformidad', description: 'Acta de conformidad del sistema de logística', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'logistica' },
    ],
    capacitacion: [
        { id: 'cap-1', title: 'Acta de Constitución', description: 'Acta de constitución del proyecto para el área de capacitación', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capacitacion' },
        { id: 'cap-2', title: 'Cronograma', description: 'Cronograma detallado de actividades para capacitación', type: 'cronograma', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capacitacion' },
        { id: 'cap-3', title: 'Prototipo', description: 'Prototipo y diseño del sistema de capacitación', type: 'prototipo', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capacitacion' },
        { id: 'cap-4', title: 'Manual de Usuario', description: 'Manual de usuario del sistema de capacitación', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capacitacion' },
        { id: 'cap-5', title: 'Manual de Sistema', description: 'Manual técnico del sistema de capacitación', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capacitacion' },
        { id: 'cap-6', title: 'Lecciones Aprendidas', description: 'Lecciones aprendidas durante el desarrollo del sistema de capacitación', type: 'lecciones', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capacitacion' },
        { id: 'cap-7', title: 'Requerimientos Funcionales', description: 'Especificación de requerimientos funcionales del sistema de capacitación', type: 'requerimientos', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capacitacion' },
        { id: 'cap-8', title: 'Product Backlog', description: 'Product Backlog del sistema de capacitación', type: 'backlog', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capacitacion' },
        { id: 'cap-9', title: 'Acta de Conformidad', description: 'Acta de conformidad del sistema de capacitación', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capacitacion' },
    ],
    operacion: [
        { id: 'ope-1', title: 'Acta de Constitución', description: 'Acta de constitución del proyecto para el área de operación de campo', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'operacion' },
        { id: 'ope-2', title: 'Cronograma', description: 'Cronograma detallado de actividades para operación de campo', type: 'cronograma', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'operacion' },
        { id: 'ope-3', title: 'Prototipo', description: 'Prototipo y diseño del sistema de operación de campo', type: 'prototipo', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'operacion' },
        { id: 'ope-4', title: 'Manual de Usuario', description: 'Manual de usuario del sistema de operación de campo', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'operacion' },
        { id: 'ope-5', title: 'Manual de Sistema', description: 'Manual técnico del sistema de operación de campo', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'operacion' },
        { id: 'ope-6', title: 'Lecciones Aprendidas', description: 'Lecciones aprendidas durante el desarrollo del sistema de operación de campo', type: 'lecciones', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'operacion' },
        { id: 'ope-7', title: 'Requerimientos Funcionales', description: 'Especificación de requerimientos funcionales del sistema de operación de campo', type: 'requerimientos', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'operacion' },
        { id: 'ope-8', title: 'Product Backlog', description: 'Product Backlog del sistema de operación de campo', type: 'backlog', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'operacion' },
        { id: 'ope-9', title: 'Acta de Conformidad', description: 'Acta de conformidad del sistema de operación de campo', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'operacion' },
    ],
    procesamiento: [
        { id: 'pro-1', title: 'Acta de Constitución', description: 'Acta de constitución del proyecto para el área de procesamiento', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'procesamiento' },
        { id: 'pro-2', title: 'Cronograma', description: 'Cronograma detallado de actividades para procesamiento', type: 'cronograma', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'procesamiento' },
        { id: 'pro-3', title: 'Prototipo', description: 'Prototipo y diseño del sistema de procesamiento', type: 'prototipo', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'procesamiento' },
        { id: 'pro-4', title: 'Manual de Usuario', description: 'Manual de usuario del sistema de procesamiento', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'procesamiento' },
        { id: 'pro-5', title: 'Manual de Sistema', description: 'Manual técnico del sistema de procesamiento', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'procesamiento' },
        { id: 'pro-6', title: 'Lecciones Aprendidas', description: 'Lecciones aprendidas durante el desarrollo del sistema de procesamiento', type: 'lecciones', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'procesamiento' },
        { id: 'pro-7', title: 'Requerimientos Funcionales', description: 'Especificación de requerimientos funcionales del sistema de procesamiento', type: 'requerimientos', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'procesamiento' },
        { id: 'pro-8', title: 'Product Backlog', description: 'Product Backlog del sistema de procesamiento', type: 'backlog', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'procesamiento' },
        { id: 'pro-9', title: 'Acta de Conformidad', description: 'Acta de conformidad del sistema de procesamiento', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'procesamiento' },
    ],
    postcensal: [
        { id: 'pos-1', title: 'Acta de Constitución', description: 'Acta de constitución del proyecto para el área post censal', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'postcensal' },
        { id: 'pos-2', title: 'Cronograma', description: 'Cronograma detallado de actividades para post censal', type: 'cronograma', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'postcensal' },
        { id: 'pos-3', title: 'Prototipo', description: 'Prototipo y diseño del sistema post censal', type: 'prototipo', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'postcensal' },
        { id: 'pos-4', title: 'Manual de Usuario', description: 'Manual de usuario del sistema post censal', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'postcensal' },
        { id: 'pos-5', title: 'Manual de Sistema', description: 'Manual técnico del sistema post censal', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'postcensal' },
        { id: 'pos-6', title: 'Lecciones Aprendidas', description: 'Lecciones aprendidas durante el desarrollo del sistema post censal', type: 'lecciones', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'postcensal' },
        { id: 'pos-7', title: 'Requerimientos Funcionales', description: 'Especificación de requerimientos funcionales del sistema post censal', type: 'requerimientos', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'postcensal' },
        { id: 'pos-8', title: 'Product Backlog', description: 'Product Backlog del sistema post censal', type: 'backlog', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'postcensal' },
        { id: 'pos-9', title: 'Acta de Conformidad', description: 'Acta de conformidad del sistema post censal', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'postcensal' },
    ],
    generales: [
        { id: 'gen-1', title: 'Acta de Constitución', description: 'Acta de constitución del proyecto general CPV 2025', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'generales' },
        { id: 'gen-2', title: 'Cronograma', description: 'Cronograma detallado de actividades del proyecto CPV 2025', type: 'cronograma', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'generales' },
        { id: 'gen-3', title: 'Prototipo', description: 'Prototipo y diseño del sistema general CPV 2025', type: 'prototipo', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'generales' },
        { id: 'gen-4', title: 'Manual de Usuario', description: 'Manual de usuario general del CPV 2025', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'generales' },
        { id: 'gen-5', title: 'Manual de Sistema', description: 'Manual técnico general del CPV 2025', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'generales' },
        { id: 'gen-6', title: 'Lecciones Aprendidas', description: 'Lecciones aprendidas durante el desarrollo del proyecto CPV 2025', type: 'lecciones', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'generales' },
        { id: 'gen-7', title: 'Requerimientos Funcionales', description: 'Especificación de requerimientos funcionales del proyecto CPV 2025', type: 'requerimientos', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'generales' },
        { id: 'gen-8', title: 'Product Backlog', description: 'Product Backlog del proyecto CPV 2025', type: 'backlog', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'generales' },
        { id: 'gen-9', title: 'Acta de Conformidad', description: 'Acta de conformidad del proyecto CPV 2025', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'generales' },
    ]
};


const docTypes = {
  acta: '📝',
  cronograma: '📅',
  prototipo: '🎨',
  manual: '📖',
  lecciones: '💡',
  requerimientos: '📋',
  backlog: '📊',
  conformidad: '✅',
  default: '📄',
};

const docTypeClasses = {
    acta: 'border-blue-500',
    cronograma: 'border-yellow-500',
    manual: 'border-green-500',
    prototipo: 'border-purple-500',
    lecciones: 'border-orange-500',
    requerimientos: 'border-pink-500',
    backlog: 'border-teal-500',
    conformidad: 'border-cyan-500',
    default: 'border-gray-500',
};

const docTypeIconBg = {
    acta: 'bg-blue-500',
    cronograma: 'bg-yellow-500',
    manual: 'bg-green-500',
    prototipo: 'bg-purple-500',
    lecciones: 'bg-orange-500',
    requerimientos: 'bg-pink-500',
    backlog: 'bg-teal-500',
    conformidad: 'bg-cyan-500',
    default: 'bg-gray-500',
}

const getDocumentIcon = (type) => docTypes[type] || docTypes.default;
const getDocClass = (type) => docTypeClasses[type] || docTypeClasses.default;
const getDocIconBg = (type) => docTypeIconBg[type] || docTypeIconBg.default;

// Plantillas de formatos
const formatTemplates = [
    { id: 'acta', name: 'Acta de Constitución', file: 'Plantilla_Acta_Constitucion.docx', type: 'word', icon: '📝', color: 'bg-blue-500' },
    { id: 'conformidad', name: 'Acta de Conformidad', file: 'Plantilla_Acta_Conformidad.docx', type: 'word', icon: '📝', color: 'bg-blue-500' },
    { id: 'manual-sistema', name: 'Manual de Sistema', file: 'Plantilla_Manual_Sistema.docx', type: 'word', icon: '📖', color: 'bg-green-500' },
    { id: 'manual-usuario', name: 'Manual de Usuario', file: 'Plantilla_Manual_Usuario.docx', type: 'word', icon: '📖', color: 'bg-green-500' },
    { id: 'requerimientos', name: 'Requerimientos Funcionales', file: 'REQUERMIENTOS_CPV.docx', type: 'word', icon: '📋', color: 'bg-pink-500' },
    { id: 'lecciones', name: 'Lecciones Aprendidas', file: 'Lecciones_Aprendidas.xlsx', type: 'excel', icon: '💡', color: 'bg-orange-500' },
    { id: 'backlog', name: 'Product Backlog', file: 'Plantilla_Product_Backlog.xlsx', type: 'excel', icon: '📊', color: 'bg-teal-500' },
    { id: 'cronograma', name: 'Cronograma', file: 'cronograma.xlsx', type: 'excel', icon: '📅', color: 'bg-yellow-500' },
    { id: 'directiva', name: 'Directiva de Formatos', file: 'DIRECTIVA_DE_FORMATOS.pdf', type: 'pdf', icon: '📄', color: 'bg-red-500' },
];

export default function DocumentacionPage() {
    const firestore = useFirestore();
    const docsRef = useMemoFirebase(() => firestore ? collection(firestore, 'documentos') : null, [firestore]);
    const { data: allDocs, isLoading: isLoadingDocs, error: firestoreError } = useCollection(docsRef);
    const { canEditCategory } = usePermissions();

    const [docs, setDocs] = useState([]);
    const [view, setView] = useState('grid');
    const [activeCategory, setActiveCategory] = useState('segmentacion');
    const [activeType, setActiveType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [modalDoc, setModalDoc] = useState(null);
    const [uploadModalConfig, setUploadModalConfig] = useState({ isOpen: false, docToEdit: null });
    const [showFormatsModal, setShowFormatsModal] = useState(false);
    const [previewTemplate, setPreviewTemplate] = useState(null);

    const seedData = async () => {
        if (!firestore || !allDocs) return;

        try {
            // Get existing documents as a map
            const existingDocsMap = new Map(allDocs.map(doc => [doc.id, doc]));

            // Find missing and outdated documents
            const allInitialDocs = Object.values(initialDocs).flat();
            const missingDocs = [];
            const docsToUpdate = [];

            allInitialDocs.forEach(docData => {
                const existingDoc = existingDocsMap.get(docData.id);
                if (!existingDoc) {
                    missingDocs.push(docData);
                } else if (existingDoc.type !== docData.type) {
                    // Document exists but type is different - update it
                    docsToUpdate.push(docData);
                }
            });

            if (missingDocs.length === 0 && docsToUpdate.length === 0) {
                return;
            }

            const batch = writeBatch(firestore);

            // Add missing documents
            if (missingDocs.length > 0) {
                missingDocs.forEach(docData => {
                    const docRef = doc(firestore, "documentos", docData.id);
                    batch.set(docRef, { ...docData, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
                });
            }

            // Update documents with incorrect type
            if (docsToUpdate.length > 0) {
                docsToUpdate.forEach(docData => {
                    const docRef = doc(firestore, "documentos", docData.id);
                    batch.update(docRef, { type: docData.type, updatedAt: serverTimestamp() });
                });
            }

            await batch.commit();
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
        // For Figma links, open in new tab
        if (doc.figmaUrl || (doc.url && doc.url.includes('figma.com'))) {
            window.open(doc.figmaUrl || doc.url, '_blank');
            return;
        }

        // Check if there's a PDF to preview or if it's a prototype without a link
        if (!doc.pdfFilePath && (!doc.url || doc.url === '#')) {
            const isPrototipo = doc.type === 'prototipo';
            Swal.fire({
                icon: 'warning',
                title: isPrototipo ? 'Link no disponible' : 'Documento no disponible',
                text: isPrototipo
                    ? 'No se ha ingresado un enlace de Figma para este prototipo.'
                    : 'No hay un documento PDF disponible para previsualizar.',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#4A7BA7'
            });
            return;
        }

        let embedUrl = doc.url;

        // If document has a pdfFilePath (GCS file), generate a fresh signed URL via API
        if (doc.pdfFilePath) {
            try {
                const response = await fetch(`/api/storage/download?filePath=${encodeURIComponent(doc.pdfFilePath)}&expiresIn=60`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to get signed URL');
                }
                const result = await response.json();
                embedUrl = result.url;
            } catch (error) {
                console.error('Error getting signed URL:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al obtener la URL del archivo PDF.',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#4A7BA7'
                });
                return;
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

    const handleDownloadWord = async (doc) => {
        if (!doc.wordFilePath) {
            Swal.fire({
                icon: 'warning',
                title: 'Archivo no disponible',
                text: 'No hay un archivo Word disponible para este documento.',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#4A7BA7'
            });
            return;
        }

        try {
            const response = await fetch(`/api/storage/download?filePath=${encodeURIComponent(doc.wordFilePath)}&expiresIn=60`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get download URL');
            }
            const result = await response.json();
            window.open(result.url, '_blank');
        } catch (error) {
            console.error('Error getting download URL:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al obtener la URL de descarga. Verifica que las credenciales de Google Cloud Storage estén configuradas.',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#4A7BA7'
            });
        }
    }

    const handleDownloadExcel = async (doc) => {
        if (!doc.excelFilePath) {
            Swal.fire({
                icon: 'warning',
                title: 'Archivo no disponible',
                text: 'No hay un archivo Excel disponible para este documento.',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#4A7BA7'
            });
            return;
        }

        try {
            const response = await fetch(`/api/storage/download?filePath=${encodeURIComponent(doc.excelFilePath)}&expiresIn=60`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get download URL');
            }
            const result = await response.json();
            window.open(result.url, '_blank');
        } catch (error) {
            console.error('Error getting download URL:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al obtener la URL de descarga. Verifica que las credenciales de Google Cloud Storage estén configuradas.',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#4A7BA7'
            });
        }
    }


    return (
        <>
            <AppHeader />
            <div className="max-w-7xl mx-auto p-3 sm:p-5 md:p-10">
                <div className="text-center text-white mb-6 md:mb-10">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">CENTRO DE DOCUMENTACIÓN</h1>
                    <p className="text-sm sm:text-base md:text-lg opacity-90">Repositorio de documentos y recursos del CPV 2025</p>
                </div>

                <div className="bg-white/95 rounded-2xl p-4 md:p-7 mb-6 md:mb-8 shadow-lg">
                    <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-4 md:mb-5">
                        <input type="text" placeholder="Buscar documentos..." className="flex-grow p-3 md:p-4 border-2 border-gray-200 rounded-xl outline-none focus:border-[#004272] text-sm md:text-base" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        <button
                            onClick={() => setShowFormatsModal(true)}
                            className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 md:py-4 bg-[#004272] text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:-translate-y-0.5 whitespace-nowrap"
                        >
                            Formatos
                            <FileStack size={18} className="md:w-5 md:h-5" />
                        </button>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {['all', 'acta', 'cronograma', 'prototipo', 'manual', 'lecciones', 'requerimientos', 'backlog'].map(type => (
                            <button key={type} onClick={() => setActiveType(type)} className={`py-1.5 md:py-2 px-3 md:px-4 rounded-full text-xs md:text-sm font-medium border-2 transition-colors ${activeType === type ? 'bg-[#004272] text-white border-[#004272]' : 'bg-white border-gray-200 hover:bg-gray-100'}`}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-[280px_1fr] gap-4 md:gap-8">
                    <aside className="bg-white/95 rounded-2xl p-4 md:p-6 shadow-lg h-fit">
                        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4 md:mb-5">📂 Categorías</h3>
                        <ul className="space-y-1.5 md:space-y-2">
                            {categories.map(cat => (
                                <li key={cat.id}>
                                    <a href="#" onClick={(e) => { e.preventDefault(); setActiveCategory(cat.id); }} className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg transition-all text-sm md:text-base ${activeCategory === cat.id ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-gray-100'}`}>
                                        <span className="text-lg md:text-xl">{cat.icon}</span>
                                        <span>{cat.name}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    <main className="bg-white/95 rounded-2xl p-4 md:p-7 shadow-lg">
                        <header className="flex justify-between items-center mb-4 md:mb-6">
                            <h2 className="text-base md:text-xl font-semibold text-gray-800 truncate pr-2">
                                {categories.find(c => c.id === activeCategory)?.name}
                            </h2>
                            <div className="bg-gray-100 p-1 rounded-lg flex gap-1 flex-shrink-0">
                                <button onClick={() => setView('grid')} className={`p-1.5 md:p-2 rounded-md text-sm md:text-base ${view === 'grid' ? 'bg-white shadow' : ''}`}>⊞</button>
                                <button onClick={() => setView('list')} className={`p-1.5 md:p-2 rounded-md text-sm md:text-base ${view === 'list' ? 'bg-white shadow' : ''}`}>☰</button>
                            </div>
                        </header>

                        {isLoadingDocs ? <div className="text-center p-10"><Loader2 className="animate-spin inline-block mr-2" />Cargando documentos...</div> : (
                           firestoreError ? <div className="text-center p-10 text-red-500">Error: {firestoreError.message}</div> :
                           docs.length > 0 ? (
                                <>
                                    {view === 'grid' ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
                                            {docs.map(doc => <DocCard key={doc.id} doc={doc} onPreview={openPreviewModal} onEdit={openUploadModal} onDownloadWord={handleDownloadWord} onDownloadExcel={handleDownloadExcel} canEdit={canEditCategory(activeCategory)} />)}
                                        </div>
                                    ) : (
                                        <div className="space-y-2 md:space-y-3">
                                            {docs.map(doc => <DocListItem key={doc.id} doc={doc} onPreview={openPreviewModal} onEdit={openUploadModal} onDownloadWord={handleDownloadWord} onDownloadExcel={handleDownloadExcel} canEdit={canEditCategory(activeCategory)} />)}
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
            {showFormatsModal && <FormatsModal onClose={() => setShowFormatsModal(false)} onPreview={setPreviewTemplate} />}
            {previewTemplate && <TemplatePreviewModal template={previewTemplate} onClose={() => setPreviewTemplate(null)} />}
        </>
    );
}

const DocCard = ({ doc, onPreview, onEdit, onDownloadWord, onDownloadExcel, canEdit }) => {
    const needsExcel = ['lecciones', 'backlog', 'cronograma'].includes(doc.type);
    const needsWord = ['acta', 'manual', 'requerimientos'].includes(doc.type);

    return (
        <div className={`bg-white rounded-xl p-4 md:p-5 shadow-md border-l-4 ${getDocClass(doc.type)} flex flex-col justify-between`}>
            <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                     <div className="flex items-start gap-2 md:gap-3 min-w-0 flex-1">
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-white text-lg md:text-xl flex-shrink-0 ${getDocIconBg(doc.type)}`}>
                            {getDocumentIcon(doc.type)}
                        </div>
                        <h4 className="font-semibold text-sm md:text-base text-gray-800 leading-tight mt-0.5">{doc.title}</h4>
                     </div>
                     {canEdit && (
                         <div className="flex gap-1 flex-shrink-0">
                            <button onClick={(e) => { e.stopPropagation(); onEdit(doc); }} className="text-gray-400 hover:text-blue-600 p-1" title="Actualizar documento">
                                <Edit size={14} className="md:w-4 md:h-4" />
                            </button>
                         </div>
                     )}
                </div>
                <p className="text-xs md:text-sm text-gray-600 mb-4 line-clamp-2 md:line-clamp-3 min-h-[2.5rem] md:min-h-[3rem]">{doc.description}</p>
            </div>
            <div>
                <div className="text-xs text-gray-500 pt-3 border-t">
                    <p className="truncate">Actualizado: {doc.updatedAt?.seconds ? new Date(doc.updatedAt.seconds * 1000).toLocaleDateString() : doc.updatedAt}</p>
                    <p>Versión: {doc.version || '1.0'}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                     {needsExcel ? (
                        <>
                            <button onClick={() => onDownloadExcel(doc)} className="flex-1 text-xs md:text-sm bg-green-100 text-green-700 font-semibold py-2 px-2 md:px-3 rounded-lg hover:bg-green-200 flex items-center justify-center gap-1">
                                <FileSpreadsheet size={14}/> <span>Excel</span>
                            </button>
                            <button onClick={() => onPreview(doc)} className="flex-1 text-xs md:text-sm bg-blue-100 text-blue-700 font-semibold py-2 px-2 md:px-3 rounded-lg hover:bg-blue-200 flex items-center justify-center gap-1">
                                <Eye size={14}/> <span>Ver</span>
                            </button>
                        </>
                     ) : needsWord ? (
                        <>
                            <button onClick={() => onDownloadWord(doc)} className="flex-1 text-xs md:text-sm bg-indigo-100 text-indigo-700 font-semibold py-2 px-2 md:px-3 rounded-lg hover:bg-indigo-200 flex items-center justify-center gap-1">
                                <FileText size={14}/> <span>Word</span>
                            </button>
                            <button onClick={() => onPreview(doc)} className="flex-1 text-xs md:text-sm bg-blue-100 text-blue-700 font-semibold py-2 px-2 md:px-3 rounded-lg hover:bg-blue-200 flex items-center justify-center gap-1">
                                <Eye size={14}/> <span>Ver</span>
                            </button>
                        </>
                     ) : (
                        <button onClick={() => onPreview(doc)} className="w-full text-xs md:text-sm bg-blue-100 text-blue-700 font-semibold py-2 px-2 md:px-3 rounded-lg hover:bg-blue-200 flex items-center justify-center gap-1">
                            <Eye size={14}/> <span>Ver</span>
                        </button>
                     )}
                </div>
            </div>
        </div>
    );
};

const DocListItem = ({ doc, onPreview, onEdit, onDownloadWord, onDownloadExcel, canEdit }) => {
    const needsExcel = ['lecciones', 'backlog', 'cronograma'].includes(doc.type);
    const needsWord = ['acta', 'manual', 'requerimientos'].includes(doc.type);

    return (
        <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 md:p-4 rounded-lg transition-colors hover:bg-gray-50`}>
             <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl shrink-0 cursor-pointer ${getDocIconBg(doc.type)}`} onClick={() => onPreview(doc)}>
                {getDocumentIcon(doc.type)}
            </div>
            <div className="flex-1 cursor-pointer min-w-0" onClick={() => onPreview(doc)}>
                <h4 className="font-semibold text-sm md:text-base text-gray-800">{doc.title}</h4>
                <p className="text-xs text-gray-500 truncate">Actualizado: {doc.updatedAt?.seconds ? new Date(doc.updatedAt.seconds * 1000).toLocaleDateString() : doc.updatedAt} • Versión: {doc.version || '1.0'}</p>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {needsExcel ? (
                    <button onClick={() => onDownloadExcel(doc)} className="text-xs bg-green-100 text-green-700 font-semibold py-1 px-2 md:px-3 rounded-full hover:bg-green-200 flex items-center gap-1 whitespace-nowrap">
                        <FileSpreadsheet size={12}/> <span className="hidden sm:inline">Excel</span>
                    </button>
                ) : needsWord ? (
                    <button onClick={() => onDownloadWord(doc)} className="text-xs bg-indigo-100 text-indigo-700 font-semibold py-1 px-2 md:px-3 rounded-full hover:bg-indigo-200 flex items-center gap-1 whitespace-nowrap">
                        <FileText size={12}/> <span className="hidden sm:inline">Word</span>
                    </button>
                ) : null}
                <button onClick={() => onPreview(doc)} className="text-xs bg-blue-100 text-blue-700 font-semibold py-1 px-2 md:px-3 rounded-full hover:bg-blue-200 flex items-center gap-1 whitespace-nowrap"><Eye size={12}/> Ver</button>
                {canEdit && (
                    <button onClick={() => onEdit(doc)} className="text-xs bg-yellow-100 text-yellow-700 font-semibold py-1 px-2 md:px-3 rounded-full hover:bg-yellow-200 flex items-center gap-1 whitespace-nowrap">
                        <Edit size={12} /> <span className="hidden sm:inline">Actualizar</span>
                    </button>
                )}
            </div>
        </div>
    );
};


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
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [wordFile, setWordFile] = useState<File | null>(null);
    const [excelFile, setExcelFile] = useState<File | null>(null);
    const [figmaUrl, setFigmaUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    const isEditMode = Boolean(docToEdit);

    // Determine which file types are needed based on document type
    const needsExcel = ['lecciones', 'backlog', 'cronograma'].includes(type);
    const needsWord = ['acta', 'manual', 'requerimientos'].includes(type);
    const isPrototipo = type === 'prototipo';

    useEffect(() => {
        if (isEditMode) {
            setTitle(docToEdit.title);
            setCategory(docToEdit.category);
            setType(docToEdit.type);
            setVersion(docToEdit.version || '1.0');
            if (docToEdit.figmaUrl) setFigmaUrl(docToEdit.figmaUrl);
        } else {
            setCategory(activeCategory);
        }
    }, [docToEdit, isEditMode, activeCategory]);


    const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setPdfFile(e.target.files[0]);
        }
    };

    const handleWordFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setWordFile(e.target.files[0]);
        }
    };

    const handleExcelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setExcelFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!firestore) {
            setError('Error de conexión con la base de datos.');
            return;
        }
        if (!user) {
            setError('Debe iniciar sesión para subir archivos.');
            return;
        }

        // Validaciones según tipo de documento
        if (isPrototipo) {
            if (!figmaUrl || !figmaUrl.includes('figma.com')) {
                setError('Por favor, proporcione un enlace válido de Figma.');
                return;
            }
        } else if (!isEditMode) {
            // Para nuevos documentos, validar que ambos archivos estén presentes
            if (needsExcel) {
                if (!excelFile || !pdfFile) {
                    setError('Debe subir tanto el archivo Excel como el PDF.');
                    return;
                }
            } else if (needsWord) {
                if (!wordFile || !pdfFile) {
                    setError('Debe subir tanto el archivo Word como el PDF.');
                    return;
                }
            }
        }

        setIsUploading(true);
        setError('');

        try {
            const docData: any = {
                title,
                category,
                type,
                version,
                updatedAt: serverTimestamp(),
            };

            // Handle Prototipo (Figma URL only)
            if (isPrototipo) {
                docData.figmaUrl = figmaUrl;
                docData.url = figmaUrl; // Also store in url for compatibility
            } else {
                // Upload PDF file if provided
                if (pdfFile) {
                    const pdfFormData = new FormData();
                    pdfFormData.append('file', pdfFile);
                    pdfFormData.append('category', category);

                    const pdfUploadResponse = await fetch('/api/storage/upload', {
                        method: 'POST',
                        body: pdfFormData,
                    });

                    if (!pdfUploadResponse.ok) {
                        const errorData = await pdfUploadResponse.json();
                        throw new Error(errorData.error || 'PDF upload failed');
                    }

                    const pdfUploadResult = await pdfUploadResponse.json();
                    docData.pdfFilePath = pdfUploadResult.filePath;
                } else if (docToEdit?.pdfFilePath) {
                    // Keep existing PDF if not uploading new one
                    docData.pdfFilePath = docToEdit.pdfFilePath;
                }

                // Upload Word file if provided
                if (wordFile) {
                    const wordFormData = new FormData();
                    wordFormData.append('file', wordFile);
                    wordFormData.append('category', category);

                    const wordUploadResponse = await fetch('/api/storage/upload', {
                        method: 'POST',
                        body: wordFormData,
                    });

                    if (!wordUploadResponse.ok) {
                        const errorData = await wordUploadResponse.json();
                        throw new Error(errorData.error || 'Word upload failed');
                    }

                    const wordUploadResult = await wordUploadResponse.json();
                    docData.wordFilePath = wordUploadResult.filePath;
                } else if (docToEdit?.wordFilePath) {
                    // Keep existing Word if not uploading new one
                    docData.wordFilePath = docToEdit.wordFilePath;
                }

                // Upload Excel file if provided
                if (excelFile) {
                    const excelFormData = new FormData();
                    excelFormData.append('file', excelFile);
                    excelFormData.append('category', category);

                    const excelUploadResponse = await fetch('/api/storage/upload', {
                        method: 'POST',
                        body: excelFormData,
                    });

                    if (!excelUploadResponse.ok) {
                        const errorData = await excelUploadResponse.json();
                        throw new Error(errorData.error || 'Excel upload failed');
                    }

                    const excelUploadResult = await excelUploadResponse.json();
                    docData.excelFilePath = excelUploadResult.filePath;
                } else if (docToEdit?.excelFilePath) {
                    // Keep existing Excel if not uploading new one
                    docData.excelFilePath = docToEdit.excelFilePath;
                }

                // Keep url field for backward compatibility (use PDF as primary)
                if (docData.pdfFilePath) {
                    const downloadResponse = await fetch(`/api/storage/download?filePath=${encodeURIComponent(docData.pdfFilePath)}&expiresIn=60`);
                    if (downloadResponse.ok) {
                        const downloadResult = await downloadResponse.json();
                        docData.url = downloadResult.url;
                    }
                }
            }

            // Save to Firestore
            if (isEditMode) {
                const docRef = doc(firestore, 'documentos', docToEdit.id);
                await updateDoc(docRef, docData);
                onUploadSuccess();
            } else {
                const collectionRef = collection(firestore, 'documentos');
                const finalDocData = { ...docData, createdAt: serverTimestamp() };
                await addDoc(collectionRef, finalDocData);
                onUploadSuccess();
            }

            setIsUploading(false);
        } catch (err: any) {
            console.error('Error submitting document:', err);
            setError('Hubo un error al subir los archivos. ' + (err.message || ''));
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
                        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-[#004272]" />
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
                            <select id="type" value={type} onChange={(e) => setType(e.target.value)} className={`w-full p-3 border-2 border-gray-200 rounded-lg ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : 'outline-none focus:border-[#004272]'}`} disabled={isEditMode}>
                                {Object.keys(docTypes).filter(k => k !== 'default').map(key => <option key={key} value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</option>)}
                            </select>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="version" className="block text-sm font-medium text-gray-700 mb-1">Versión</label>
                        <input type="text" id="version" value={version} onChange={(e) => setVersion(e.target.value)} required className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-[#004272]" placeholder="Ej: 1.0"/>
                    </div>

                    {/* Prototipo: solo Figma URL */}
                    {isPrototipo && (
                        <div>
                            <label htmlFor="figmaUrl" className="block text-sm font-medium text-gray-700 mb-1">Enlace de Figma <span className="text-red-500">*</span></label>
                            <input
                                type="url"
                                id="figmaUrl"
                                value={figmaUrl}
                                onChange={(e) => setFigmaUrl(e.target.value)}
                                required
                                className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-[#004272]"
                                placeholder="https://figma.com/..."
                            />
                            <p className="text-xs text-gray-500 mt-1">Proporciona el enlace al prototipo en Figma.</p>
                        </div>
                    )}

                    {/* Documentos que requieren Excel + PDF */}
                    {needsExcel && !isPrototipo && (
                        <>
                            <div>
                                <label htmlFor="excelFile" className="block text-sm font-medium text-gray-700 mb-1">
                                    Archivo Excel <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="file"
                                    id="excelFile"
                                    onChange={handleExcelFileChange}
                                    accept=".xlsx,.xls"
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                />
                                <p className="text-xs text-gray-500 mt-1">Sube el archivo Excel (.xlsx o .xls)</p>
                            </div>
                            <div>
                                <label htmlFor="pdfFile" className="block text-sm font-medium text-gray-700 mb-1">
                                    Archivo PDF <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="file"
                                    id="pdfFile"
                                    onChange={handlePdfFileChange}
                                    accept=".pdf"
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                                />
                                <p className="text-xs text-gray-500 mt-1">Sube el archivo PDF</p>
                            </div>
                        </>
                    )}

                    {/* Documentos que requieren Word + PDF */}
                    {needsWord && !isPrototipo && (
                        <>
                            <div>
                                <label htmlFor="wordFile" className="block text-sm font-medium text-gray-700 mb-1">
                                    Archivo Word <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="file"
                                    id="wordFile"
                                    onChange={handleWordFileChange}
                                    accept=".doc,.docx"
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                <p className="text-xs text-gray-500 mt-1">Sube el archivo Word (.doc o .docx)</p>
                            </div>
                            <div>
                                <label htmlFor="pdfFile" className="block text-sm font-medium text-gray-700 mb-1">
                                    Archivo PDF <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="file"
                                    id="pdfFile"
                                    onChange={handlePdfFileChange}
                                    accept=".pdf"
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                                />
                                <p className="text-xs text-gray-500 mt-1">Sube el archivo PDF</p>
                            </div>
                        </>
                    )}
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300">Cancelar</button>
                        <button type="submit" disabled={isUploading} className="py-2 px-6 bg-[#004272] text-white rounded-lg font-semibold hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isUploading ? <><Loader2 className="animate-spin" /> Procesando...</> : (isEditMode ? 'Actualizar Documento' : 'Subir Documento')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Modal de Formatos/Plantillas
const FormatsModal = ({ onClose, onPreview }) => {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        }
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleDownload = (template) => {
        const link = document.createElement('a');
        link.href = `/formatos/${template.file}`;
        link.download = template.file;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-3 md:p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-4 md:p-6 border-b bg-[#004272] rounded-t-2xl">
                    <div className="flex items-center gap-2 md:gap-3">
                        <FileStack className="text-white" size={24} />
                        <h3 className="text-lg md:text-2xl font-bold text-white">Formatos y Plantillas</h3>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 text-white font-bold text-xl hover:bg-white/30 transition-colors flex-shrink-0">×</button>
                </header>
                <div className="flex-1 p-4 md:p-8 bg-gray-50 overflow-y-auto">
                    <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">Descarga las plantillas oficiales para cada tipo de documento del CPV 2025</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                        {formatTemplates.map(template => (
                            <div
                                key={template.id}
                                className="bg-white rounded-xl p-4 md:p-5 shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-[#004272]"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center text-white text-xl md:text-2xl ${template.color}`}>
                                        {template.icon}
                                    </div>
                                </div>
                                <h4 className="font-semibold text-sm md:text-base text-gray-800 mb-2">{template.name}</h4>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                                    {template.type === 'word' && <><FileText size={14} /> <span>Word (.docx)</span></>}
                                    {template.type === 'excel' && <><FileSpreadsheet size={14} /> <span>Excel (.xlsx)</span></>}
                                    {template.type === 'pdf' && <><Eye size={14} /> <span>PDF</span></>}
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    {template.type === 'pdf' && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onPreview(template); }}
                                            className="flex-1 text-xs md:text-sm bg-blue-100 text-blue-700 font-semibold py-2 px-3 rounded-lg hover:bg-blue-200 flex items-center justify-center gap-1"
                                        >
                                            <Eye size={14}/> <span>Ver</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDownload(template); }}
                                        className={`${template.type === 'pdf' ? 'flex-1' : 'w-full'} text-xs md:text-sm bg-green-100 text-green-700 font-semibold py-2 px-3 rounded-lg hover:bg-green-200 flex items-center justify-center gap-1`}
                                    >
                                        <Download size={14}/> <span>Descargar</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Modal de Previsualización de Plantilla
const TemplatePreviewModal = ({ template, onClose }) => {
    const [previewUrl, setPreviewUrl] = useState('');
    const [isLocalhost, setIsLocalhost] = useState(false);
    const [showOfficeWarning, setShowOfficeWarning] = useState(false);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        }
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    useEffect(() => {
        // Check if running on localhost
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        setIsLocalhost(isLocal);

        // Generate preview URL based on file type
        const filePath = `/formatos/${template.file}`;

        if (template.type === 'pdf') {
            setPreviewUrl(filePath);
            setShowOfficeWarning(false);
        } else if (template.type === 'word' || template.type === 'excel') {
            if (isLocal) {
                // En localhost no podemos previsualizar Word/Excel
                setShowOfficeWarning(true);
                setPreviewUrl('');
            } else {
                // En producción usar Office Online Viewer
                setPreviewUrl(`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(window.location.origin + filePath)}`);
                setShowOfficeWarning(false);
            }
        }
    }, [template]);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = `/formatos/${template.file}`;
        link.download = template.file;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-5 border-b bg-gray-50 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${template.color}`}>
                            {template.icon}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">{template.name}</h3>
                            <p className="text-xs text-gray-500">Plantilla oficial CPV 2025</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDownload}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center gap-2"
                        >
                            <Download size={16} />
                            Descargar
                        </button>
                        <button onClick={onClose} className="w-9 h-9 rounded-full bg-red-500 text-white font-bold text-xl hover:bg-red-600 transition-colors">×</button>
                    </div>
                </header>
                <div className="flex-1 p-2 md:p-4 bg-gray-100 overflow-hidden">
                    {showOfficeWarning ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl text-center">
                                <div className="mb-6">
                                    <div className={`w-20 h-20 rounded-full ${template.color} flex items-center justify-center text-5xl mx-auto mb-4`}>
                                        {template.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{template.name}</h3>
                                    <p className="text-gray-500">Archivo {template.type === 'word' ? 'Word (.docx)' : 'Excel (.xlsx)'}</p>
                                </div>

                                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 text-left">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-blue-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-blue-700 font-medium mb-1">
                                                Previsualización no disponible en localhost
                                            </p>
                                            <p className="text-sm text-blue-600">
                                                Los archivos Word y Excel no se pueden previsualizar en entorno de desarrollo local.
                                                Por favor, descarga el archivo para verlo en tu computadora, o despliega la aplicación en un servidor público.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleDownload}
                                    className="w-full px-6 py-4 bg-[#004272] text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center gap-3"
                                >
                                    <Download size={24} />
                                    Descargar Plantilla
                                </button>

                                <p className="text-xs text-gray-400 mt-4">
                                    Al descargar, el archivo se abrirá automáticamente con Microsoft Office o la aplicación predeterminada
                                </p>
                            </div>
                        </div>
                    ) : previewUrl ? (
                        <iframe
                            src={previewUrl}
                            className="w-full h-full border-0 rounded-lg bg-white"
                            title={template.name}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="animate-spin text-[#4A7BA7]" size={48} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
