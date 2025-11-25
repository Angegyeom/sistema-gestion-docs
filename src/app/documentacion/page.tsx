"use client";

import React, { useState, useEffect } from 'react';
import AppHeader from "@/components/layout/app-header";
import { useFirestore, useCollection, useMemoFirebase, useUser, errorEmitter, FirestorePermissionError } from "@/firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc, writeBatch, deleteDoc, getDocs, deleteField } from "firebase/firestore";
import { Loader2, Upload, Edit, Eye, Download, Plus, FileText, FileSpreadsheet, FileStack, CheckCircle2, AlertCircle, XCircle, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { usePermissions } from '@/hooks/use-permissions';

const categories = [
  { id: 'segmentacion', name: 'Segmentación', icon: '🗺️', border: 'border-blue-500', bg: 'bg-blue-500' },
  { id: 'reclutamiento', name: 'Reclutamiento', icon: '👥', border: 'border-green-500', bg: 'bg-green-500' },
  { id: 'capacitacion', name: 'Capacitación', icon: '🎓', border: 'border-purple-500', bg: 'bg-purple-500' },
  { id: 'logistica', name: 'Logística', icon: '📦', border: 'border-orange-500', bg: 'bg-orange-500' },
  { id: 'capdatos-apk', name: 'Captura Datos APK', icon: '📱', border: 'border-pink-500', bg: 'bg-pink-500' },
  { id: 'censo-linea', name: 'Censo en Línea', icon: '💻', border: 'border-teal-500', bg: 'bg-teal-500' },
  { id: 'consistencia', name: 'Consistencia', icon: '⚙️', border: 'border-indigo-500', bg: 'bg-indigo-500' },
  { id: 'monitoreo', name: 'Monitoreo', icon: '📊', border: 'border-yellow-500', bg: 'bg-yellow-500' },
  { id: 'yanapaq', name: 'Yanapaq', icon: '🤝', border: 'border-cyan-500', bg: 'bg-cyan-500' },
];

const initialDocs = {
    segmentacion: [
        { id: 'seg-1', title: 'Acta de Constitución', description: 'Acta de constitución del proyecto de Segmentación', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'segmentacion' },
        { id: 'seg-2', title: 'Cronograma', description: 'Cronograma detallado de actividades de Segmentación', type: 'cronograma', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'segmentacion' },
        { id: 'seg-3', title: 'Prototipo', description: 'Prototipo y diseño del sistema de Segmentación', type: 'prototipo', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'segmentacion' },
        { id: 'seg-4', title: 'Manual de Usuario', description: 'Manual de usuario del sistema de Segmentación', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'segmentacion' },
        { id: 'seg-5', title: 'Manual de Sistema', description: 'Manual técnico del sistema de Segmentación', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'segmentacion' },
        { id: 'seg-6', title: 'Lecciones Aprendidas', description: 'Lecciones aprendidas del desarrollo de Segmentación', type: 'lecciones', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'segmentacion' },
        { id: 'seg-7', title: 'Requerimientos Funcionales', description: 'Requerimientos funcionales de Segmentación', type: 'requerimientos', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'segmentacion' },
        { id: 'seg-8', title: 'Product Backlog', description: 'Product Backlog de Segmentación', type: 'backlog', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'segmentacion' },
        { id: 'seg-9', title: 'Acta de Conformidad', description: 'Acta de conformidad de Segmentación', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'segmentacion' },
        { id: 'seg-10', title: 'Arquitectura de Software', description: 'Arquitectura de software del sistema de Segmentación', type: 'arquitectura', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'segmentacion' },
        { id: 'seg-11', title: 'Diagrama de Flujo', description: 'Diagrama de flujo del sistema de Segmentación', type: 'diagrama', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'segmentacion' },
        { id: 'seg-12', title: 'Diagrama de Proceso', description: 'Diagrama de proceso del sistema de Segmentación', type: 'diagrama', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'segmentacion' },
        { id: 'seg-13', title: 'Repositorios', description: 'Repositorios de código del sistema de Segmentación', type: 'repositorios', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'segmentacion' },
        { id: 'seg-14', title: 'Manual de Base de Datos', description: 'Manual de base de datos del sistema de Segmentación', type: 'manual-bd', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'segmentacion' },
        { id: 'seg-15', title: 'Documentación de API', description: 'Documentación de API del sistema de Segmentación', type: 'doc-api', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'segmentacion' },
        { id: 'seg-16', title: 'Acta de Reunión', description: 'Actas de las reuniones del proyecto de Segmentación', type: 'acta', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'segmentacion' },
        { id: 'seg-17', title: 'Solicitud de Cambio', description: 'Solicitudes de cambio del proyecto de Segmentación', type: 'solicitud-cambio', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'segmentacion' },
    ],
    reclutamiento: [
        { id: 'rec-1', title: 'Acta de Constitución', description: 'Acta de constitución del proyecto de Reclutamiento', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'reclutamiento' },
        { id: 'rec-2', title: 'Cronograma', description: 'Cronograma detallado de actividades de Reclutamiento', type: 'cronograma', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'reclutamiento' },
        { id: 'rec-3', title: 'Prototipo', description: 'Prototipo y diseño del sistema de Reclutamiento', type: 'prototipo', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'reclutamiento' },
        { id: 'rec-4', title: 'Manual de Usuario', description: 'Manual de usuario del sistema de Reclutamiento', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'reclutamiento' },
        { id: 'rec-5', title: 'Manual de Sistema', description: 'Manual técnico del sistema de Reclutamiento', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'reclutamiento' },
        { id: 'rec-6', title: 'Lecciones Aprendidas', description: 'Lecciones aprendidas del desarrollo de Reclutamiento', type: 'lecciones', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'reclutamiento' },
        { id: 'rec-7', title: 'Requerimientos Funcionales', description: 'Requerimientos funcionales de Reclutamiento', type: 'requerimientos', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'reclutamiento' },
        { id: 'rec-8', title: 'Product Backlog', description: 'Product Backlog de Reclutamiento', type: 'backlog', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'reclutamiento' },
        { id: 'rec-9', title: 'Acta de Conformidad', description: 'Acta de conformidad de Reclutamiento', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'reclutamiento' },
        { id: 'rec-10', title: 'Arquitectura de Software', description: 'Arquitectura de software del sistema de Reclutamiento', type: 'arquitectura', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'reclutamiento' },
        { id: 'rec-11', title: 'Diagrama de Flujo', description: 'Diagrama de flujo del sistema de Reclutamiento', type: 'diagrama', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'reclutamiento' },
        { id: 'rec-12', title: 'Diagrama de Proceso', description: 'Diagrama de proceso del sistema de Reclutamiento', type: 'diagrama', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'reclutamiento' },
        { id: 'rec-13', title: 'Repositorios', description: 'Repositorios de código del sistema de Reclutamiento', type: 'repositorios', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'reclutamiento' },
        { id: 'rec-14', title: 'Manual de Base de Datos', description: 'Manual de base de datos del sistema de Reclutamiento', type: 'manual-bd', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'reclutamiento' },
        { id: 'rec-15', title: 'Documentación de API', description: 'Documentación de API del sistema de Reclutamiento', type: 'doc-api', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'reclutamiento' },
        { id: 'rec-16', title: 'Acta de Reunión', description: 'Actas de las reuniones del proyecto de Reclutamiento', type: 'acta', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'reclutamiento' },
        { id: 'rec-17', title: 'Solicitud de Cambio', description: 'Solicitudes de cambio del proyecto de Reclutamiento', type: 'solicitud-cambio', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'reclutamiento' },
    ],
    capacitacion: [
        { id: 'cap-1', title: 'Acta de Constitución', description: 'Acta de constitución del proyecto de Capacitación', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capacitacion' },
        { id: 'cap-2', title: 'Cronograma', description: 'Cronograma detallado de actividades de Capacitación', type: 'cronograma', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capacitacion' },
        { id: 'cap-3', title: 'Prototipo', description: 'Prototipo y diseño del sistema de Capacitación', type: 'prototipo', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capacitacion' },
        { id: 'cap-4', title: 'Manual de Usuario', description: 'Manual de usuario del sistema de Capacitación', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capacitacion' },
        { id: 'cap-5', title: 'Manual de Sistema', description: 'Manual técnico del sistema de Capacitación', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capacitacion' },
        { id: 'cap-6', title: 'Lecciones Aprendidas', description: 'Lecciones aprendidas del desarrollo de Capacitación', type: 'lecciones', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capacitacion' },
        { id: 'cap-7', title: 'Requerimientos Funcionales', description: 'Requerimientos funcionales de Capacitación', type: 'requerimientos', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capacitacion' },
        { id: 'cap-8', title: 'Product Backlog', description: 'Product Backlog de Capacitación', type: 'backlog', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capacitacion' },
        { id: 'cap-9', title: 'Acta de Conformidad', description: 'Acta de conformidad de Capacitación', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capacitacion' },
        { id: 'cap-10', title: 'Arquitectura de Software', description: 'Arquitectura de software del sistema de Capacitación', type: 'arquitectura', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capacitacion' },
        { id: 'cap-11', title: 'Diagrama de Flujo', description: 'Diagrama de flujo del sistema de Capacitación', type: 'diagrama', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capacitacion' },
        { id: 'cap-12', title: 'Diagrama de Proceso', description: 'Diagrama de proceso del sistema de Capacitación', type: 'diagrama', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capacitacion' },
        { id: 'cap-13', title: 'Repositorios', description: 'Repositorios de código del sistema de Capacitación', type: 'repositorios', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capacitacion' },
        { id: 'cap-14', title: 'Manual de Base de Datos', description: 'Manual de base de datos del sistema de Capacitación', type: 'manual-bd', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'capacitacion' },
        { id: 'cap-15', title: 'Documentación de API', description: 'Documentación de API del sistema de Capacitación', type: 'doc-api', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'capacitacion' },
        { id: 'cap-16', title: 'Acta de Reunión', description: 'Actas de las reuniones del proyecto de Capacitación', type: 'acta', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'capacitacion' },
        { id: 'cap-17', title: 'Solicitud de Cambio', description: 'Solicitudes de cambio del proyecto de Capacitación', type: 'solicitud-cambio', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'capacitacion' },
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
        { id: 'log-10', title: 'Arquitectura de Software', description: 'Arquitectura de software del sistema de logística', type: 'arquitectura', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'logistica' },
        { id: 'log-11', title: 'Diagrama de Flujo', description: 'Diagrama de flujo del sistema de logística', type: 'diagrama', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'logistica' },
        { id: 'log-12', title: 'Diagrama de Proceso', description: 'Diagrama de proceso del sistema de logística', type: 'diagrama', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'logistica' },
        { id: 'log-13', title: 'Repositorios', description: 'Repositorios de código del sistema de logística', type: 'repositorios', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'logistica' },
        { id: 'log-14', title: 'Manual de Base de Datos', description: 'Manual de base de datos del sistema de logística', type: 'manual-bd', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'logistica' },
        { id: 'log-15', title: 'Documentación de API', description: 'Documentación de API del sistema de logística', type: 'doc-api', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'logistica' },
        { id: 'log-16', title: 'Acta de Reunión', description: 'Actas de las reuniones del proyecto de Logística', type: 'acta', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'logistica' },
        { id: 'log-17', title: 'Solicitud de Cambio', description: 'Solicitudes de cambio del proyecto de Logística', type: 'solicitud-cambio', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'logistica' },
    ],
    'capdatos-apk': [
        { id: 'apk-1', title: 'Acta de Constitución', description: 'Acta de constitución del proyecto de Captura Datos APK', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capdatos-apk' },
        { id: 'apk-2', title: 'Cronograma', description: 'Cronograma detallado de actividades de Captura Datos APK', type: 'cronograma', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capdatos-apk' },
        { id: 'apk-3', title: 'Prototipo', description: 'Prototipo y diseño del sistema de Captura Datos APK', type: 'prototipo', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capdatos-apk' },
        { id: 'apk-4', title: 'Manual de Usuario', description: 'Manual de usuario del sistema de Captura Datos APK', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capdatos-apk' },
        { id: 'apk-5', title: 'Manual de Sistema', description: 'Manual técnico del sistema de Captura Datos APK', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capdatos-apk' },
        { id: 'apk-6', title: 'Lecciones Aprendidas', description: 'Lecciones aprendidas del desarrollo de Captura Datos APK', type: 'lecciones', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capdatos-apk' },
        { id: 'apk-7', title: 'Requerimientos Funcionales', description: 'Requerimientos funcionales de Captura Datos APK', type: 'requerimientos', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capdatos-apk' },
        { id: 'apk-8', title: 'Product Backlog', description: 'Product Backlog de Captura Datos APK', type: 'backlog', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capdatos-apk' },
        { id: 'apk-9', title: 'Acta de Conformidad', description: 'Acta de conformidad de Captura Datos APK', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capdatos-apk' },
        { id: 'apk-10', title: 'Arquitectura de Software', description: 'Arquitectura de software del sistema de Captura Datos APK', type: 'arquitectura', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capdatos-apk' },
        { id: 'apk-11', title: 'Diagrama de Flujo', description: 'Diagrama de flujo del sistema de Captura Datos APK', type: 'diagrama', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capdatos-apk' },
        { id: 'apk-12', title: 'Diagrama de Proceso', description: 'Diagrama de proceso del sistema de Captura Datos APK', type: 'diagrama', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capdatos-apk' },
        { id: 'apk-13', title: 'Repositorios', description: 'Repositorios de código del sistema de Captura Datos APK', type: 'repositorios', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'capdatos-apk' },
        { id: 'apk-14', title: 'Manual de Base de Datos', description: 'Manual de base de datos del sistema de Captura Datos APK', type: 'manual-bd', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'capdatos-apk' },
        { id: 'apk-15', title: 'Documentación de API', description: 'Documentación de API del sistema de Captura Datos APK', type: 'doc-api', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'capdatos-apk' },
        { id: 'apk-16', title: 'Acta de Reunión', description: 'Actas de las reuniones del proyecto de Captura Datos APK', type: 'acta', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'capdatos-apk' },
        { id: 'apk-17', title: 'Solicitud de Cambio', description: 'Solicitudes de cambio del proyecto de Captura Datos APK', type: 'solicitud-cambio', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'capdatos-apk' },
    ],
    'censo-linea': [
        { id: 'cen-1', title: 'Acta de Constitución', description: 'Acta de constitución del proyecto de Censo en Línea', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'censo-linea' },
        { id: 'cen-2', title: 'Cronograma', description: 'Cronograma detallado de actividades de Censo en Línea', type: 'cronograma', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'censo-linea' },
        { id: 'cen-3', title: 'Prototipo', description: 'Prototipo y diseño del sistema de Censo en Línea', type: 'prototipo', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'censo-linea' },
        { id: 'cen-4', title: 'Manual de Usuario', description: 'Manual de usuario del sistema de Censo en Línea', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'censo-linea' },
        { id: 'cen-5', title: 'Manual de Sistema', description: 'Manual técnico del sistema de Censo en Línea', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'censo-linea' },
        { id: 'cen-6', title: 'Lecciones Aprendidas', description: 'Lecciones aprendidas del desarrollo de Censo en Línea', type: 'lecciones', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'censo-linea' },
        { id: 'cen-7', title: 'Requerimientos Funcionales', description: 'Requerimientos funcionales de Censo en Línea', type: 'requerimientos', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'censo-linea' },
        { id: 'cen-8', title: 'Product Backlog', description: 'Product Backlog de Censo en Línea', type: 'backlog', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'censo-linea' },
        { id: 'cen-9', title: 'Acta de Conformidad', description: 'Acta de conformidad de Censo en Línea', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'censo-linea' },
        { id: 'cen-10', title: 'Arquitectura de Software', description: 'Arquitectura de software del sistema de Censo en Línea', type: 'arquitectura', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'censo-linea' },
        { id: 'cen-11', title: 'Diagrama de Flujo', description: 'Diagrama de flujo del sistema de Censo en Línea', type: 'diagrama', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'censo-linea' },
        { id: 'cen-12', title: 'Diagrama de Proceso', description: 'Diagrama de proceso del sistema de Censo en Línea', type: 'diagrama', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'censo-linea' },
        { id: 'cen-13', title: 'Repositorios', description: 'Repositorios de código del sistema de Censo en Línea', type: 'repositorios', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'censo-linea' },
        { id: 'cen-14', title: 'Manual de Base de Datos', description: 'Manual de base de datos del sistema de Censo en Línea', type: 'manual-bd', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'censo-linea' },
        { id: 'cen-15', title: 'Documentación de API', description: 'Documentación de API del sistema de Censo en Línea', type: 'doc-api', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'censo-linea' },
        { id: 'cen-16', title: 'Acta de Reunión', description: 'Actas de las reuniones del proyecto de Censo en Línea', type: 'acta', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'censo-linea' },
        { id: 'cen-17', title: 'Solicitud de Cambio', description: 'Solicitudes de cambio del proyecto de Censo en Línea', type: 'solicitud-cambio', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'censo-linea' },
    ],
    consistencia: [
        { id: 'con-1', title: 'Acta de Constitución', description: 'Acta de constitución del proyecto de Consistencia', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'consistencia' },
        { id: 'con-2', title: 'Cronograma', description: 'Cronograma detallado de actividades de Consistencia', type: 'cronograma', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'consistencia' },
        { id: 'con-3', title: 'Prototipo', description: 'Prototipo y diseño del sistema de Consistencia', type: 'prototipo', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'consistencia' },
        { id: 'con-4', title: 'Manual de Usuario', description: 'Manual de usuario del sistema de Consistencia', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'consistencia' },
        { id: 'con-5', title: 'Manual de Sistema', description: 'Manual técnico del sistema de Consistencia', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'consistencia' },
        { id: 'con-6', title: 'Lecciones Aprendidas', description: 'Lecciones aprendidas del desarrollo de Consistencia', type: 'lecciones', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'consistencia' },
        { id: 'con-7', title: 'Requerimientos Funcionales', description: 'Requerimientos funcionales de Consistencia', type: 'requerimientos', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'consistencia' },
        { id: 'con-8', title: 'Product Backlog', description: 'Product Backlog de Consistencia', type: 'backlog', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'consistencia' },
        { id: 'con-9', title: 'Acta de Conformidad', description: 'Acta de conformidad de Consistencia', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'consistencia' },
        { id: 'con-10', title: 'Arquitectura de Software', description: 'Arquitectura de software del sistema de Consistencia', type: 'arquitectura', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'consistencia' },
        { id: 'con-11', title: 'Diagrama de Flujo', description: 'Diagrama de flujo del sistema de Consistencia', type: 'diagrama', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'consistencia' },
        { id: 'con-12', title: 'Diagrama de Proceso', description: 'Diagrama de proceso del sistema de Consistencia', type: 'diagrama', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'consistencia' },
        { id: 'con-13', title: 'Repositorios', description: 'Repositorios de código del sistema de Consistencia', type: 'repositorios', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'consistencia' },
        { id: 'con-14', title: 'Manual de Base de Datos', description: 'Manual de base de datos del sistema de Consistencia', type: 'manual-bd', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'consistencia' },
        { id: 'con-15', title: 'Documentación de API', description: 'Documentación de API del sistema de Consistencia', type: 'doc-api', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'consistencia' },
        { id: 'con-16', title: 'Acta de Reunión', description: 'Actas de las reuniones del proyecto de Consistencia', type: 'acta', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'consistencia' },
        { id: 'con-17', title: 'Solicitud de Cambio', description: 'Solicitudes de cambio del proyecto de Consistencia', type: 'solicitud-cambio', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'consistencia' },
    ],
    monitoreo: [
        { id: 'mon-1', title: 'Acta de Constitución', description: 'Acta de constitución del proyecto de Monitoreo', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'monitoreo' },
        { id: 'mon-2', title: 'Cronograma', description: 'Cronograma detallado de actividades de Monitoreo', type: 'cronograma', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'monitoreo' },
        { id: 'mon-3', title: 'Prototipo', description: 'Prototipo y diseño del sistema de Monitoreo', type: 'prototipo', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'monitoreo' },
        { id: 'mon-4', title: 'Manual de Usuario', description: 'Manual de usuario del sistema de Monitoreo', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'monitoreo' },
        { id: 'mon-5', title: 'Manual de Sistema', description: 'Manual técnico del sistema de Monitoreo', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'monitoreo' },
        { id: 'mon-6', title: 'Lecciones Aprendidas', description: 'Lecciones aprendidas del desarrollo de Monitoreo', type: 'lecciones', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'monitoreo' },
        { id: 'mon-7', title: 'Requerimientos Funcionales', description: 'Requerimientos funcionales de Monitoreo', type: 'requerimientos', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'monitoreo' },
        { id: 'mon-8', title: 'Product Backlog', description: 'Product Backlog de Monitoreo', type: 'backlog', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'monitoreo' },
        { id: 'mon-9', title: 'Acta de Conformidad', description: 'Acta de conformidad de Monitoreo', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'monitoreo' },
        { id: 'mon-10', title: 'Arquitectura de Software', description: 'Arquitectura de software del sistema de Monitoreo', type: 'arquitectura', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'monitoreo' },
        { id: 'mon-11', title: 'Diagrama de Flujo', description: 'Diagrama de flujo del sistema de Monitoreo', type: 'diagrama', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'monitoreo' },
        { id: 'mon-12', title: 'Diagrama de Proceso', description: 'Diagrama de proceso del sistema de Monitoreo', type: 'diagrama', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'monitoreo' },
        { id: 'mon-13', title: 'Repositorios', description: 'Repositorios de código del sistema de Monitoreo', type: 'repositorios', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'monitoreo' },
        { id: 'mon-14', title: 'Manual de Base de Datos', description: 'Manual de base de datos del sistema de Monitoreo', type: 'manual-bd', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'monitoreo' },
        { id: 'mon-15', title: 'Documentación de API', description: 'Documentación de API del sistema de Monitoreo', type: 'doc-api', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'monitoreo' },
        { id: 'mon-16', title: 'Acta de Reunión', description: 'Actas de las reuniones del proyecto de Monitoreo', type: 'acta', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'monitoreo' },
        { id: 'mon-17', title: 'Solicitud de Cambio', description: 'Solicitudes de cambio del proyecto de Monitoreo', type: 'solicitud-cambio', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'monitoreo' },
    ],
    yanapaq: [
        { id: 'yan-1', title: 'Acta de Constitución', description: 'Acta de constitución del proyecto Yanapaq', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'yanapaq' },
        { id: 'yan-2', title: 'Cronograma', description: 'Cronograma detallado de actividades de Yanapaq', type: 'cronograma', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'yanapaq' },
        { id: 'yan-3', title: 'Prototipo', description: 'Prototipo y diseño del sistema Yanapaq', type: 'prototipo', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'yanapaq' },
        { id: 'yan-4', title: 'Manual de Usuario', description: 'Manual de usuario del sistema Yanapaq', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'yanapaq' },
        { id: 'yan-5', title: 'Manual de Sistema', description: 'Manual técnico del sistema Yanapaq', type: 'manual', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'yanapaq' },
        { id: 'yan-6', title: 'Lecciones Aprendidas', description: 'Lecciones aprendidas del desarrollo de Yanapaq', type: 'lecciones', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'yanapaq' },
        { id: 'yan-7', title: 'Requerimientos Funcionales', description: 'Requerimientos funcionales de Yanapaq', type: 'requerimientos', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'yanapaq' },
        { id: 'yan-8', title: 'Product Backlog', description: 'Product Backlog de Yanapaq', type: 'backlog', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'yanapaq' },
        { id: 'yan-9', title: 'Acta de Conformidad', description: 'Acta de conformidad de Yanapaq', type: 'acta', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'yanapaq' },
        { id: 'yan-10', title: 'Arquitectura de Software', description: 'Arquitectura de software del sistema Yanapaq', type: 'arquitectura', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'yanapaq' },
        { id: 'yan-11', title: 'Diagrama de Flujo', description: 'Diagrama de flujo del sistema Yanapaq', type: 'diagrama', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'yanapaq' },
        { id: 'yan-12', title: 'Diagrama de Proceso', description: 'Diagrama de proceso del sistema Yanapaq', type: 'diagrama', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'yanapaq' },
        { id: 'yan-13', title: 'Repositorios', description: 'Repositorios de código del sistema Yanapaq', type: 'repositorios', version: '2.1', updatedAt: '15 Sep 2025', url: '#', category: 'yanapaq' },
        { id: 'yan-14', title: 'Manual de Base de Datos', description: 'Manual de base de datos del sistema Yanapaq', type: 'manual-bd', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'yanapaq' },
        { id: 'yan-15', title: 'Documentación de API', description: 'Documentación de API del sistema Yanapaq', type: 'doc-api', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'yanapaq' },
        { id: 'yan-16', title: 'Acta de Reunión', description: 'Actas de las reuniones del proyecto Yanapaq', type: 'acta', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'yanapaq' },
        { id: 'yan-17', title: 'Solicitud de Cambio', description: 'Solicitudes de cambio del proyecto Yanapaq', type: 'solicitud-cambio', version: '1.0', updatedAt: '15 Sep 2025', url: '#', category: 'yanapaq' },
    ]
};


const docTypes = {
  acta: '📝',
  cronograma: '📅',
  'solicitud-cambio': '🔄',
  prototipo: '🎨',
  manual: '📖',
  lecciones: '💡',
  requerimientos: '📋',
  backlog: '📊',
  conformidad: '✅',
  arquitectura: '🏛️',
  diagrama: '🔀',
  repositorios: '📁',
  'manual-bd': '🗄️',
  'doc-api': '🔌',
  default: '📄',
};

// Colores por categoría - todos los cards de una categoría tendrán el mismo color
// Generar categoryColors dinámicamente desde el array categories
const categoryColors = categories.reduce((acc, cat) => {
    acc[cat.id] = { border: cat.border, bg: cat.bg };
    return acc;
}, { default: { border: 'border-gray-500', bg: 'bg-gray-500' } });

const getDocumentIcon = () => '📄'; // Ícono genérico para todos los documentos
const getDocClass = (category) => categoryColors[category]?.border || categoryColors.default.border;
const getDocIconBg = (category) => categoryColors[category]?.bg || categoryColors.default.bg;

// Estructura de divisiones para organizar los documentos
const documentDivisions = [
    {
        id: 'actas',
        name: 'Actas',
        icon: '📋',
        types: ['acta', 'conformidad', 'acta-reunion']
    },
    {
        id: 'gestion-proyecto',
        name: 'Gestión del Proyecto',
        icon: '📊',
        types: ['solicitud-cambio', 'cronograma', 'backlog', 'lecciones']
    },
    {
        id: 'requerimientos-analisis',
        name: 'Requerimientos y Análisis',
        icon: '📋',
        types: ['requerimientos', 'diagrama']
    },
    {
        id: 'diseno-arquitectura',
        name: 'Diseño y Arquitectura del Sistema',
        icon: '🏗️',
        types: ['arquitectura', 'manual-bd', 'doc-api']
    },
    {
        id: 'desarrollo-entregables',
        name: 'Desarrollo y Entregables Técnicos',
        icon: '💻',
        types: ['prototipo', 'repositorios']
    },
    {
        id: 'manuales',
        name: 'Manuales',
        icon: '📖',
        types: ['manual']
    }
];

// Función para determinar el estado del documento basado en archivos subidos
const getDocumentStatus = (doc) => {
    // Verificar si es un manual por tipo (manual o manual-bd)
    const isManualType = doc.type === 'manual' || doc.type === 'manual-bd';

    // Si es un manual (tiene array de files o tipo manual)
    if (isManualType || (doc.files && Array.isArray(doc.files))) {
        // Para manuales, verificar si tiene archivos en el array
        if (doc.files && Array.isArray(doc.files)) {
            return doc.files.length > 0 ? 'Completado' : 'Pendiente';
        }
        // Si no tiene array files pero tiene pdfFilePath (legacy), también es válido
        return doc.pdfFilePath ? 'Completado' : 'Pendiente';
    }

    // Si tiene URLs de repositorio, verificar que tenga ambos (obligatorios)
    if (doc.type === 'repositorios' || doc.frontendUrl !== undefined || doc.backendUrl !== undefined) {
        const hasFrontend = !!doc.frontendUrl;
        const hasBackend = !!doc.backendUrl;
        return (hasFrontend && hasBackend) ? 'Completado' : 'Pendiente';
    }

    // Para prototipos: al menos uno de los dos (Figma o PDF)
    if (doc.type === 'prototipo') {
        return (doc.figmaUrl || doc.pdfFilePath) ? 'Completado' : 'Pendiente';
    }

    // Para lecciones, cronograma, backlog, solicitud-cambio: Excel o MPP es suficiente
    if (doc.type === 'lecciones' || doc.type === 'cronograma' || doc.type === 'backlog' || doc.type === 'solicitud-cambio') {
        return doc.excelFilePath ? 'Completado' : 'Pendiente';
    }

    // Para otros documentos (incluye acta-reunion): PDF o Word es suficiente
    const hasPdf = !!doc.pdfFilePath;
    const hasWord = !!doc.wordFilePath;
    return (hasPdf || hasWord) ? 'Completado' : 'Pendiente';
};

// Componente para mostrar archivo seleccionado con opción de eliminar
const FilePreview = ({ file, onRemove, label, existingFile = null }) => {
    if (!file && !existingFile) return null;

    const fileName = file ? file.name : (existingFile || 'Archivo existente');
    const fileSize = file ? `${(file.size / 1024).toFixed(2)} KB` : '';

    return (
        <div className="mt-2 flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
            <FileText size={16} className="text-gray-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 truncate font-medium">{fileName}</p>
                {fileSize && <p className="text-xs text-gray-500">{fileSize}</p>}
            </div>
            <button
                type="button"
                onClick={onRemove}
                className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center"
                title="Eliminar archivo"
            >
                ×
            </button>
        </div>
    );
};

// Componente de badge de estado
const StatusBadge = ({ status, compact = false, doc = null }) => {
    // Función para generar el tooltip personalizado
    const getTooltipMessage = () => {
        if (!doc) return null;

        const hasPdf = !!doc.pdfFilePath;
        const hasWord = !!doc.wordFilePath;
        const hasExcel = !!doc.excelFilePath;
        const hasFrontend = !!doc.frontendUrl;
        const hasBackend = !!doc.backendUrl;
        const hasFigmaUrl = !!doc.figmaUrl;

        // Si tiene URLs de repositorio
        if (hasFrontend !== undefined || hasBackend !== undefined) {
            if (hasFrontend && hasBackend) return 'Completado (Frontend + Backend)';
            if (hasFrontend && !hasBackend) return 'Pendiente (Falta Backend URL)';
            if (!hasFrontend && hasBackend) return 'Pendiente (Falta Frontend URL)';
            return 'Pendiente (Falta Frontend y Backend)';
        }

        // Si tiene Figma URL, es prototipo
        if (hasFigmaUrl) {
            if (hasPdf) return 'Completado (Figma + PDF)';
            return 'Completado (Figma)';
        }

        // Para documentos regulares
        if (hasPdf) {
            const extras = [];
            if (hasWord) extras.push('Word');
            if (hasExcel) extras.push('Excel');
            return extras.length > 0 ? `Completado (PDF + ${extras.join(', ')})` : 'Completado (PDF)';
        }

        return 'Pendiente (Sin archivos)';
    };

    const getStatusConfig = () => {
        switch (status) {
            case 'Completado':
                return {
                    icon: <CheckCircle2 size={14} />,
                    color: 'bg-green-500',
                    text: 'Completado',
                    textColor: 'text-green-700'
                };
            case 'Pendiente':
            default:
                return {
                    icon: <XCircle size={14} />,
                    color: 'bg-red-500',
                    text: 'Pendiente',
                    textColor: 'text-red-700'
                };
        }
    };

    const config = getStatusConfig();
    const tooltipMessage = getTooltipMessage() || config.text;

    if (compact) {
        // Versión compacta - solo ícono para las tarjetas
        return (
            <div className={`flex items-center justify-center w-6 h-6 rounded-full ${config.color} bg-opacity-15 border border-current ${config.textColor}`} title={tooltipMessage}>
                {config.icon}
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${config.color} bg-opacity-10 border border-current ${config.textColor}`} title={tooltipMessage}>
            {config.icon}
            <span className="text-xs font-semibold hidden sm:inline">{config.text}</span>
        </div>
    );
};

// Plantillas de formatos
const formatTemplates = [
    { id: 'acta', name: 'Acta de Constitución', file: 'Plantilla_Acta_Constitucion.docx', type: 'word', icon: '📝', color: 'bg-blue-500' },
    { id: 'conformidad', name: 'Acta de Conformidad', file: 'Plantilla_Acta_Conformidad.docx', type: 'word', icon: '📝', color: 'bg-blue-500' },
    { id: 'manual-sistema', name: 'Manual de Sistema', file: 'Plantilla_Manual_Sistema.docx', type: 'word', icon: '📖', color: 'bg-green-500' },
    { id: 'manual-usuario', name: 'Manual de Usuario', file: 'Plantilla_Manual_Usuario.docx', type: 'word', icon: '📖', color: 'bg-green-500' },
    { id: 'requerimientos', name: 'Requerimientos Funcionales', file: 'REQUERMIENTOS_CPV.docx', type: 'word', icon: '📋', color: 'bg-pink-500' },
    { id: 'lecciones', name: 'Lecciones Aprendidas', file: 'Lecciones_Aprendidas.xlsx', type: 'excel', icon: '💡', color: 'bg-orange-500' },
    { id: 'backlog', name: 'Product Backlog', file: 'Plantilla_Product_Backlog.xlsx', type: 'excel', icon: '📊', color: 'bg-teal-500' },
    { id: 'directiva', name: 'Directiva de Formatos', file: 'DIRECTIVA_DE_FORMATOS.pdf', type: 'pdf', icon: '📄', color: 'bg-red-500' },
    { id: 'manual-db', name: 'Manual de Base de Datos', file: 'Manual_BD.docx', type: 'word', icon: '🗄️', color: 'bg-purple-500' },
    { id: 'doc-api', name: 'Documentación de API', file: 'Plantilla_Documentacion_API.docx', type: 'word', icon: '🔌', color: 'bg-indigo-500' },
];

export default function DocumentacionPage() {
    const firestore = useFirestore();
    const docsRef = useMemoFirebase(() => firestore ? collection(firestore, 'documentos') : null, [firestore]);
    const customModulesRef = useMemoFirebase(() => firestore ? collection(firestore, 'custom-modules') : null, [firestore]);
    const customDivisionsRef = useMemoFirebase(() => firestore ? collection(firestore, 'custom-divisions') : null, [firestore]);
    const { data: allDocs, isLoading: isLoadingDocs, error: firestoreError } = useCollection(docsRef);
    const { data: customModules, isLoading: isLoadingModules } = useCollection(customModulesRef);
    const { data: customDivisions, isLoading: isLoadingDivisions } = useCollection(customDivisionsRef);
    const { canEditCategory, isAdmin } = usePermissions();

    const [docs, setDocs] = useState([]);
    const [view, setView] = useState('grid');
    const [activeCategory, setActiveCategory] = useState('segmentacion');
    const [activeType, setActiveType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showPriorityOnly, setShowPriorityOnly] = useState(false);
    const [modalDoc, setModalDoc] = useState(null);
    const [manualFilesModalDoc, setManualFilesModalDoc] = useState(null);
    const [uploadModalConfig, setUploadModalConfig] = useState({ isOpen: false, docToEdit: null });
    const [showFormatsModal, setShowFormatsModal] = useState(false);
    const [previewTemplate, setPreviewTemplate] = useState(null);
    const [showModuleModal, setShowModuleModal] = useState(false);
    const [showDivisionModal, setShowDivisionModal] = useState(false);
    const [divisionToEdit, setDivisionToEdit] = useState(null);

    // Combinar categorías estáticas con módulos personalizados
    const allCategories = [
        ...categories,
        ...(customModules || []).map(mod => ({
            id: mod.folderId || mod.id, // Use folderId for GCS folder name
            name: mod.name,
            icon: mod.icon || '📁',
            isCustom: true,
            firestoreId: mod.id // Keep original ID for Firestore operations
        }))
    ];

    // Migrar módulos antiguos que no tienen folderId (solo una vez)
    const [hasModulesMigrated, setHasModulesMigrated] = useState(false);

    useEffect(() => {
        const migrateModules = async () => {
            if (!firestore || !customModules || !allDocs || hasModulesMigrated) return;

            // Verificar si hay módulos que necesitan migración
            const modulesToMigrate = customModules.filter(mod => !mod.folderId && mod.name);
            if (modulesToMigrate.length === 0) {
                setHasModulesMigrated(true);
                return;
            }

            setHasModulesMigrated(true);

            for (const mod of modulesToMigrate) {
                const folderId = mod.name.trim()
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-');

                try {
                    // Actualizar el módulo
                    const moduleRef = doc(firestore, 'custom-modules', mod.id);
                    await updateDoc(moduleRef, {
                        folderId: folderId,
                        updatedAt: serverTimestamp()
                    });
                    console.log(`Migrated module "${mod.name}" with folderId: "${folderId}"`);

                    // Actualizar todos los documentos que pertenecen a este módulo usando batch
                    const docsToUpdate = allDocs.filter(d => d.category === mod.id);
                    if (docsToUpdate.length > 0) {
                        const batch = writeBatch(firestore);
                        docsToUpdate.forEach(document => {
                            const docRef = doc(firestore, 'documentos', document.id);
                            batch.update(docRef, {
                                category: folderId,
                                updatedAt: serverTimestamp()
                            });
                        });
                        await batch.commit();
                        console.log(`Updated ${docsToUpdate.length} documents category to: "${folderId}"`);
                    }
                } catch (error) {
                    console.error(`Error migrating module ${mod.name}:`, error);
                }
            }
        };

        migrateModules();
    }, [firestore, customModules, allDocs, hasModulesMigrated]);

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
                    const estado = getDocumentStatus(docData);
                    batch.set(docRef, { ...docData, estado, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
                });
            }

            // Update documents with incorrect type
            if (docsToUpdate.length > 0) {
                docsToUpdate.forEach(docData => {
                    const docRef = doc(firestore, "documentos", docData.id);
                    const estado = getDocumentStatus(docData);
                    batch.update(docRef, { type: docData.type, estado, updatedAt: serverTimestamp() });
                });
            }

            await batch.commit();
        } catch (error) {
            console.error("Error seeding data: ", error);
        }
    };

    // Función para migrar documentos existentes recalculando el campo 'estado' en español
    const migrateDocumentStatus = async () => {
        if (!firestore || !allDocs) return;

        try {
            const batch = writeBatch(firestore);
            let needsUpdate = false;

            allDocs.forEach(docData => {
                // Recalcular el estado en español para todos los documentos
                // Esto actualizará documentos sin estado Y documentos con estados en inglés
                const estadoActual = docData.estado;
                const estadoNuevo = getDocumentStatus(docData);

                // Actualizar si no tiene estado O si el estado está en inglés
                const estadosIngles = ['complete', 'incomplete', 'pending'];
                if (!estadoActual || estadosIngles.includes(estadoActual)) {
                    const docRef = doc(firestore, "documentos", docData.id);
                    batch.update(docRef, { estado: estadoNuevo, updatedAt: serverTimestamp() });
                    needsUpdate = true;
                }
            });

            if (needsUpdate) {
                await batch.commit();
                console.log("Documentos migrados con estados en español exitosamente");
            }
        } catch (error) {
            console.error("Error migrando documentos: ", error);
        }
    };

    // Flag para ejecutar seed/migración solo una vez por sesión
    const [hasInitialized, setHasInitialized] = useState(false);

    useEffect(() => {
        if (!isLoadingDocs && allDocs && !hasInitialized) {
            setHasInitialized(true);
            // Solo ejecutar si hay documentos faltantes o con estados incorrectos
            const allInitialDocs = Object.values(initialDocs).flat();
            const existingIds = new Set(allDocs.map(d => d.id));
            const hasMissing = allInitialDocs.some(d => !existingIds.has(d.id));
            const hasIncorrectStatus = allDocs.some(d => {
                const estadosIngles = ['complete', 'incomplete', 'pending'];
                return !d.estado || estadosIngles.includes(d.estado);
            });

            if (hasMissing) seedData();
            if (hasIncorrectStatus) migrateDocumentStatus();
        }
    }, [isLoadingDocs, allDocs, firestore, hasInitialized]);

    useEffect(() => {
        if (allDocs) {
            const priorityTypes = ['acta', 'cronograma', 'manual', 'prototipo', 'lecciones'];
            const filteredDocs = allDocs.filter(doc => {
                const categoryMatch = doc.category === activeCategory;
                const searchMatch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
                // Excluir "Acta de Reunión" de los prioritarios
                const isActaReunion = doc.type === 'acta' && doc.title.toLowerCase().includes('reunión');
                const priorityMatch = !showPriorityOnly || (priorityTypes.includes(doc.type) && !isActaReunion);
                return categoryMatch && searchMatch && priorityMatch;
            });
            setDocs(filteredDocs);
        }
    }, [allDocs, activeCategory, searchTerm, showPriorityOnly]);
    
    const openPreviewModal = async (doc) => {
        // Detectar si es un tipo multi-archivo (cronograma, backlog, lecciones)
        const isMultiFileType = ['lecciones', 'backlog', 'cronograma'].includes(doc.type);

        // Detectar si es un manual (tiene array de files y no es multi-file-type)
        const isManual = !isMultiFileType && Array.isArray(doc.files) && doc.files.length > 0;

        // Si es un manual, abrir el ManualFilesModal
        if (isManual) {
            setManualFilesModalDoc(doc);
            return;
        }

        const isPrototipo = doc.type === 'prototipo';
        const isRepositorios = doc.type === 'repositorios';
        const hasFigmaUrl = doc.figmaUrl || (doc.url && doc.url.includes('figma.com'));

        // Para tipos multi-archivo, buscar el PDF en el array files
        let hasPdf = !!doc.pdfFilePath;
        let pdfFilePath = doc.pdfFilePath;

        if (isMultiFileType && doc.files && Array.isArray(doc.files)) {
            const pdfFile = doc.files.find(f => f.type === 'pdf');
            if (pdfFile) {
                hasPdf = true;
                pdfFilePath = pdfFile.path;
            } else {
                hasPdf = false;
            }
        }

        // For repositories: show options to open frontend or backend
        if (isRepositorios) {
            const hasFrontend = !!doc.frontendUrl;
            const hasBackend = !!doc.backendUrl;

            if (!hasFrontend && !hasBackend) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Repositorios no disponibles',
                    text: 'No se han ingresado los enlaces de los repositorios.',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#4A7BA7'
                });
                return;
            }

            // Show options for frontend and backend repositories
            Swal.fire({
                title: 'Selecciona el repositorio',
                html: `
                    <div class="space-y-3">
                        ${hasFrontend ? `
                            <button id="frontend-btn" class="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold">
                                🌐 Frontend
                            </button>
                        ` : ''}
                        ${hasBackend ? `
                            <button id="backend-btn" class="w-full py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold">
                                🔧 Backend
                            </button>
                        ` : ''}
                    </div>
                `,
                showConfirmButton: false,
                showCancelButton: true,
                cancelButtonText: 'Cerrar',
                cancelButtonColor: '#6c757d',
                didOpen: () => {
                    const frontendBtn = document.getElementById('frontend-btn');
                    const backendBtn = document.getElementById('backend-btn');

                    if (frontendBtn) {
                        frontendBtn.addEventListener('click', () => {
                            window.open(doc.frontendUrl, '_blank');
                            Swal.close();
                        });
                    }

                    if (backendBtn) {
                        backendBtn.addEventListener('click', () => {
                            window.open(doc.backendUrl, '_blank');
                            Swal.close();
                        });
                    }
                }
            });
            return;
        }

        // For prototypes: if has PDF, show PDF preview; otherwise open Figma link
        if (isPrototipo) {
            if (hasPdf) {
                // Show PDF preview (continues below)
            } else if (hasFigmaUrl) {
                // Open Figma in new tab (Figma is mandatory for prototypes)
                window.open(doc.figmaUrl || doc.url, '_blank');
                return;
            } else {
                // No Figma URL (should not happen as it's mandatory)
                Swal.fire({
                    icon: 'warning',
                    title: 'Link no disponible',
                    text: 'No se ha ingresado un enlace de Figma para este prototipo.',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#4A7BA7'
                });
                return;
            }
        } else {
            // For non-prototype Figma links, open in new tab
            if (hasFigmaUrl && !hasPdf) {
                window.open(doc.figmaUrl || doc.url, '_blank');
                return;
            }
        }

        // Check if there's a PDF to preview
        // For regular documents (not prototypes/repos), pdfFilePath is required
        if (!doc.pdfFilePath) {
            Swal.fire({
                icon: 'warning',
                title: 'Documento no disponible',
                text: 'No hay un documento PDF disponible para previsualizar. El archivo ha sido eliminado o no se ha subido.',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#4A7BA7'
            });
            return;
        }

        let embedUrl = doc.url;

        // If document has a pdfFilePath (GCS file), generate a fresh signed URL via API
        if (pdfFilePath) {
            try {
                const response = await fetch(`/api/storage/download?filePath=${encodeURIComponent(pdfFilePath)}&expiresIn=60`);
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
        // Para tipos multi-archivo, buscar el archivo Word en el array files
        const isMultiFileType = ['lecciones', 'backlog', 'cronograma'].includes(doc.type);
        let filePath = doc.wordFilePath;

        if (isMultiFileType && doc.files && Array.isArray(doc.files)) {
            const wordFile = doc.files.find(f => f.type === 'word');
            if (wordFile) {
                filePath = wordFile.path;
            }
        }

        if (!filePath) {
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
            const response = await fetch(`/api/storage/download?filePath=${encodeURIComponent(filePath)}&expiresIn=60`);
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
        // Para tipos multi-archivo, buscar el archivo Excel o MPP en el array files
        const isMultiFileType = ['lecciones', 'backlog', 'cronograma'].includes(doc.type);
        let filePath = doc.excelFilePath;

        if (isMultiFileType && doc.files && Array.isArray(doc.files)) {
            const excelFile = doc.files.find(f => f.type === 'excel' || f.type === 'mpp');
            if (excelFile) {
                filePath = excelFile.path;
            }
        }

        if (!filePath) {
            Swal.fire({
                icon: 'warning',
                title: 'Archivo no disponible',
                text: 'No hay un archivo Excel o MPP disponible para este documento.',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#4A7BA7'
            });
            return;
        }

        try {
            const response = await fetch(`/api/storage/download?filePath=${encodeURIComponent(filePath)}&expiresIn=60`);
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

    const handleDeleteModule = async (firestoreId: string, folderId: string, moduleName: string) => {
        if (!firestore || !allDocs) return;

        // Contar documentos en este módulo (buscar por ambos IDs para capturar documentos antiguos)
        const docsInModule = allDocs.filter(d => d.category === folderId || d.category === firestoreId);
        const docCount = docsInModule.length;

        const result = await Swal.fire({
            icon: 'warning',
            title: '¿Eliminar módulo?',
            html: `¿Estás seguro de que deseas eliminar el módulo <strong>"${moduleName}"</strong>?<br><br>${docCount > 0 ? `<span class="text-sm text-red-600">Se eliminarán ${docCount} documento(s) y todos sus archivos del servidor.</span><br>` : ''}<span class="text-sm text-gray-600">Esta acción no se puede deshacer.</span>`,
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar todo',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280'
        });

        if (!result.isConfirmed) return;

        try {
            // Mostrar indicador de carga
            Swal.fire({
                title: 'Eliminando...',
                html: 'Eliminando módulo y archivos del servidor',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // 1. Eliminar todos los documentos de Firestore
            for (const document of docsInModule) {
                await deleteDoc(doc(firestore, 'documentos', document.id));
            }

            // 2. Eliminar la carpeta completa del servidor GCS (incluyendo todos los archivos)
            // Intentar eliminar ambas carpetas (la vieja con firestoreId y la nueva con folderId)
            const foldersToDelete = [folderId];
            if (firestoreId !== folderId) {
                foldersToDelete.push(firestoreId);
            }

            for (const folder of foldersToDelete) {
                try {
                    await fetch(`/api/storage/delete-folder?folderName=${encodeURIComponent(folder)}`, {
                        method: 'DELETE'
                    });
                    console.log(`Deleted folder: ${folder}/`);
                } catch (err) {
                    console.error(`Error deleting folder ${folder}:`, err);
                }
            }

            // 3. Eliminar el rol correspondiente de Firestore
            try {
                const rolesSnapshot = await getDocs(collection(firestore, 'roles'));
                const roleToDelete = rolesSnapshot.docs.find(
                    doc => doc.data().name?.toUpperCase() === folderId.toUpperCase()
                );

                if (roleToDelete) {
                    await deleteDoc(doc(firestore, 'roles', roleToDelete.id));
                    console.log(`Deleted role: ${roleToDelete.data().name}`);
                }
            } catch (roleErr) {
                console.error('Error deleting role:', roleErr);
            }

            // 4. Eliminar el módulo de Firestore
            await deleteDoc(doc(firestore, 'custom-modules', firestoreId));

            // Si el módulo eliminado era el activo, cambiar a segmentacion
            if (activeCategory === folderId) {
                setActiveCategory('segmentacion');
            }

            Swal.fire({
                icon: 'success',
                title: 'Módulo eliminado',
                text: `El módulo "${moduleName}" y todos sus archivos han sido eliminados exitosamente.`,
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error deleting module:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar el módulo completamente. Inténtalo de nuevo.',
                confirmButtonColor: '#004272'
            });
        }
    };

    const handleDeleteDocument = async (document: any) => {
        if (!firestore) return;

        const result = await Swal.fire({
            icon: 'warning',
            title: '¿Eliminar documento?',
            html: `¿Estás seguro de que deseas eliminar <strong>"${document.title}"</strong>?<br><br><span class="text-sm text-gray-600">Esta acción no se puede deshacer.</span>`,
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280'
        });

        if (!result.isConfirmed) return;

        try {
            // Primero, eliminar los archivos físicos de Google Cloud Storage
            const filesToDelete = [];

            if (document.pdfFilePath) {
                filesToDelete.push(
                    fetch(`/api/storage/delete?filePath=${encodeURIComponent(document.pdfFilePath)}`, {
                        method: 'DELETE'
                    })
                );
            }
            if (document.wordFilePath) {
                filesToDelete.push(
                    fetch(`/api/storage/delete?filePath=${encodeURIComponent(document.wordFilePath)}`, {
                        method: 'DELETE'
                    })
                );
            }
            if (document.excelFilePath) {
                filesToDelete.push(
                    fetch(`/api/storage/delete?filePath=${encodeURIComponent(document.excelFilePath)}`, {
                        method: 'DELETE'
                    })
                );
            }

            // Eliminar archivos en paralelo
            if (filesToDelete.length > 0) {
                await Promise.allSettled(filesToDelete);
            }

            // Luego, eliminar el documento de Firestore
            await deleteDoc(doc(firestore, 'documentos', document.id));

            Swal.fire({
                icon: 'success',
                title: 'Documento eliminado',
                text: `El documento "${document.title}" y sus archivos han sido eliminados exitosamente.`,
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error deleting document:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar el documento completamente. Inténtalo de nuevo.',
                confirmButtonColor: '#004272'
            });
        }
    };

    const handleDeleteDivision = async (division: any) => {
        if (!firestore) return;

        // Verificar si la división tiene documentos
        const divisionDocs = docs.filter(doc => doc.divisionId === division.id);

        if (divisionDocs.length > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'No se puede eliminar',
                html: `El bloque <strong>"${division.name}"</strong> contiene ${divisionDocs.length} documento(s).<br><br>Debes eliminar primero todos los documentos del bloque.`,
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#004272'
            });
            return;
        }

        const result = await Swal.fire({
            icon: 'warning',
            title: '¿Eliminar bloque/división?',
            html: `¿Estás seguro de que deseas eliminar el bloque <strong>"${division.name}"</strong>?<br><br><span class="text-sm text-gray-600">Esta acción no se puede deshacer.</span>`,
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280'
        });

        if (!result.isConfirmed) return;

        try {
            // Eliminar la división de Firestore (colección custom-divisions)
            await deleteDoc(doc(firestore, 'custom-divisions', division.id));

            Swal.fire({
                icon: 'success',
                title: 'Bloque eliminado',
                text: `El bloque "${division.name}" ha sido eliminado exitosamente.`,
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error deleting division:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar el bloque. Inténtalo de nuevo.',
                confirmButtonColor: '#004272'
            });
        }
    };

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
                </div>

                <div className="grid md:grid-cols-[280px_1fr] gap-4 md:gap-8">
                    <aside className="bg-white/95 rounded-2xl p-4 md:p-6 shadow-lg h-fit">
                        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4 md:mb-5">📂 Módulos</h3>
                        <ul className="space-y-1.5 md:space-y-2">
                            {allCategories.map(cat => (
                                <li key={cat.id} className="relative group">
                                    <div className="flex items-center gap-1">
                                        <a href="#" onClick={(e) => { e.preventDefault(); setActiveCategory(cat.id); }} className={`flex-1 flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg transition-all text-sm md:text-base ${activeCategory === cat.id ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-gray-100'}`}>
                                            <span className="text-lg md:text-xl">{cat.icon}</span>
                                            <span className="truncate">{cat.name}</span>
                                        </a>
                                        {isAdmin && cat.isCustom && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteModule(cat.firestoreId, cat.id, cat.name);
                                                }}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                title="Eliminar módulo"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {isAdmin && (
                            <button
                                onClick={() => setShowModuleModal(true)}
                                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#004272] text-white rounded-lg font-semibold hover:shadow-lg transition-all text-sm"
                            >
                                <Plus size={16} />
                                Agregar Módulo
                            </button>
                        )}
                    </aside>

                    <main className="bg-white/95 rounded-2xl p-4 md:p-7 shadow-lg">
                        <header className="flex justify-between items-center mb-4 md:mb-6">
                            <h2 className="text-base md:text-xl font-semibold text-gray-800 truncate pr-2">
                                {allCategories.find(c => c.id === activeCategory)?.name}
                            </h2>
                            <div className="flex items-center gap-2 md:gap-3">
                                {!(allCategories.find(c => c.id === activeCategory)?.isCustom || false) && (
                                    <button
                                        onClick={() => setShowPriorityOnly(!showPriorityOnly)}
                                        className={`flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 rounded-lg font-semibold transition-all text-xs md:text-sm border-2 ${showPriorityOnly ? 'bg-amber-500 text-white border-amber-500 shadow-md' : 'bg-white border-amber-400 text-amber-600 hover:bg-amber-50'}`}
                                    >
                                         <span className="hidden sm:inline">Prioridad</span>
                                    </button>
                                )}
                                {canEditCategory(activeCategory) && (allCategories.find(c => c.id === activeCategory)?.isCustom || false) && (
                                    <>
                                        <button
                                            onClick={() => setShowDivisionModal(true)}
                                            className="flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-xs md:text-sm"
                                        >
                                            <Plus size={16} />
                                            <span className="hidden sm:inline">Crear Bloque</span>
                                            <span className="sm:hidden">Bloque</span>
                                        </button>
                                        {(() => {
                                            const moduleDivisions = (customDivisions || []).filter(d => d.moduleId === activeCategory);
                                            return moduleDivisions.length > 0 ? (
                                                <button
                                                    onClick={() => setUploadModalConfig({ isOpen: true, docToEdit: null })}
                                                    className="flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 bg-[#004272] text-white rounded-lg font-semibold hover:shadow-lg transition-all text-xs md:text-sm"
                                                >
                                                    <Upload size={16} />
                                                    <span className="hidden sm:inline">Subir Documento</span>
                                                    <span className="sm:hidden">Subir</span>
                                                </button>
                                            ) : null;
                                        })()}
                                    </>
                                )}
                                <div className="bg-gray-100 p-1 rounded-lg flex gap-1 flex-shrink-0">
                                    <button onClick={() => setView('grid')} className={`p-1.5 md:p-2 rounded-md text-sm md:text-base ${view === 'grid' ? 'bg-white shadow' : ''}`}>⊞</button>
                                    <button onClick={() => setView('list')} className={`p-1.5 md:p-2 rounded-md text-sm md:text-base ${view === 'list' ? 'bg-white shadow' : ''}`}>☰</button>
                                </div>
                            </div>
                        </header>

                        {isLoadingDocs ? <div className="text-center p-10"><Loader2 className="animate-spin inline-block mr-2" />Cargando documentos...</div> : (
                           firestoreError ? <div className="text-center p-10 text-red-500">Error: {firestoreError.message}</div> :
                           (() => {
                               const isCustom = allCategories.find(c => c.id === activeCategory)?.isCustom || false;
                               const moduleDivisions = isCustom ? (customDivisions || []).filter(d => d.moduleId === activeCategory) : null;

                               // Para módulos personalizados sin divisiones, mostrar mensaje
                               if (isCustom && (!moduleDivisions || moduleDivisions.length === 0)) {
                                   return (
                                       <div className="text-center p-10 text-gray-500">
                                           <div className="text-6xl mb-4">📋</div>
                                           <p className="text-lg font-semibold mb-2">No hay bloques/divisiones creados</p>
                                           <p className="text-sm">Se podrá subir documento, cuando al menos haya creado una división</p>
                                           <p className="text-xs text-gray-400 mt-2">Usa el botón "Crear Bloque" en la parte superior</p>
                                       </div>
                                   );
                               }

                               // Determinar qué divisiones usar (custom o estáticas)
                               const divisionsToUse = isCustom ? moduleDivisions : documentDivisions;

                               // Si hay documentos o divisiones, mostrarlos
                               if (docs.length > 0 || (divisionsToUse && divisionsToUse.length > 0)) {
                                   return (
                                       <div className="space-y-3">
                                           {divisionsToUse.map(division => (
                                               <DivisionAccordion
                                                   key={division.id}
                                                   division={division}
                                                   docs={docs}
                                                   view={view}
                                                   onPreview={openPreviewModal}
                                                   onEdit={openUploadModal}
                                                   onDownloadWord={handleDownloadWord}
                                                   onDownloadExcel={handleDownloadExcel}
                                                   canEdit={canEditCategory(activeCategory)}
                                                   isCustomModule={isCustom}
                                                   isAdmin={isAdmin}
                                                   onDelete={handleDeleteDocument}
                                                   onEditDivision={(div) => {
                                                       setDivisionToEdit(div);
                                                       setShowDivisionModal(true);
                                                   }}
                                                   onDeleteDivision={handleDeleteDivision}
                                               />
                                           ))}
                                       </div>
                                   );
                               }

                               // No hay documentos ni divisiones
                               return (
                                   <div className="text-center p-10 text-gray-500">
                                       <p className="mb-4">No hay documentos en este módulo.</p>
                                   </div>
                               );
                           })()
                        )}

                    </main>
                </div>
            </div>
            {modalDoc && <DocModal doc={modalDoc} onClose={closePreviewModal} />}
            {manualFilesModalDoc && <ManualFilesModal doc={manualFilesModalDoc} onClose={() => setManualFilesModalDoc(null)} onDeleteFile={handleUploadSuccess} firestore={firestore} />}
            {uploadModalConfig.isOpen && <UploadDocModal onClose={closeUploadModal} onUploadSuccess={handleUploadSuccess} docToEdit={uploadModalConfig.docToEdit} activeCategory={activeCategory} allDocs={allDocs} allCategories={allCategories} customDivisions={customDivisions} />}
            {showFormatsModal && <FormatsModal onClose={() => setShowFormatsModal(false)} onPreview={setPreviewTemplate} />}
            {previewTemplate && <TemplatePreviewModal template={previewTemplate} onClose={() => setPreviewTemplate(null)} />}
            {showModuleModal && <ModuleModal onClose={() => setShowModuleModal(false)} firestore={firestore} />}
            {showDivisionModal && <DivisionModal onClose={() => { setShowDivisionModal(false); setDivisionToEdit(null); }} firestore={firestore} activeModuleId={activeCategory} divisionToEdit={divisionToEdit} />}
        </>
    );
}

// Componente de Acordeón de Divisiones
const DivisionAccordion = ({ division, docs, view, onPreview, onEdit, onDownloadWord, onDownloadExcel, canEdit, isCustomModule, isAdmin, onDelete, onEditDivision, onDeleteDivision }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Filtrar documentos que pertenecen a esta división
    const divisionDocs = isCustomModule
        ? docs.filter(doc => doc.divisionId === division.id)
        : docs.filter(doc => division.types.includes(doc.type));

    // Para módulos estáticos, no mostrar divisiones vacías
    // Para módulos personalizados, mostrar todas las divisiones (incluso vacías)
    if (!isCustomModule && divisionDocs.length === 0) return null;

    return (
        <div className="mb-4">
            <div className="w-full flex items-center gap-2 p-4 bg-white/80 hover:bg-white rounded-lg shadow-sm transition-all">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex-1 flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">{division.icon}</span>
                        <div className="text-left">
                            <h3 className="text-lg font-semibold text-gray-800">{division.name}</h3>
                            <p className="text-sm text-gray-500">{divisionDocs.length} documento{divisionDocs.length !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                    <div className="text-gray-400">
                        {isExpanded ? '▼' : '▶'}
                    </div>
                </button>
                {isCustomModule && canEdit && onEditDivision && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEditDivision(division);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar bloque"
                    >
                        <Edit size={18} />
                    </button>
                )}
                {isCustomModule && canEdit && onDeleteDivision && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteDivision(division);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar bloque"
                    >
                        <Trash2 size={18} />
                    </button>
                )}
            </div>

            {isExpanded && (
                <div className="mt-3 pl-4">
                    {divisionDocs.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            <p className="text-sm">No hay documentos en este bloque</p>
                        </div>
                    ) : view === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
                            {divisionDocs.map(doc => (
                                <DocCard
                                    key={doc.id}
                                    doc={doc}
                                    onPreview={onPreview}
                                    onEdit={onEdit}
                                    onDownloadWord={onDownloadWord}
                                    onDownloadExcel={onDownloadExcel}
                                    canEdit={canEdit}
                                    isCustomModule={isCustomModule}
                                    isAdmin={isAdmin}
                                    onDelete={onDelete}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-2 md:space-y-3">
                            {divisionDocs.map(doc => (
                                <DocListItem
                                    key={doc.id}
                                    doc={doc}
                                    onPreview={onPreview}
                                    onEdit={onEdit}
                                    onDownloadWord={onDownloadWord}
                                    onDownloadExcel={onDownloadExcel}
                                    canEdit={canEdit}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const DocCard = ({ doc, onPreview, onEdit, onDownloadWord, onDownloadExcel, canEdit, isCustomModule = false, isAdmin = false, onDelete }) => {
    const status = getDocumentStatus(doc);

    // Verificar si es un tipo multi-archivo (cronograma, backlog, lecciones)
    const isMultiFileType = ['lecciones', 'backlog', 'cronograma'].includes(doc.type);

    // Para tipos multi-archivo, verificar qué archivos tiene en el array files
    let hasWord = !!doc.wordFilePath;
    let hasExcel = !!doc.excelFilePath;
    let hasPdf = !!doc.pdfFilePath;
    let hasMpp = false;

    if (isMultiFileType && doc.files && Array.isArray(doc.files)) {
        // Resetear flags y verificar archivos en el array
        hasWord = false;
        hasExcel = false;
        hasPdf = false;
        hasMpp = false;

        doc.files.forEach(file => {
            if (file.type === 'pdf') hasPdf = true;
            else if (file.type === 'excel') hasExcel = true;
            else if (file.type === 'mpp') hasMpp = true;
            else if (file.type === 'word') hasWord = true;
        });
    }

    return (
        <div className={`bg-white rounded-xl p-4 md:p-5 shadow-md border-l-4 ${getDocClass(doc.category)} flex flex-col justify-between`}>
            <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                     <div className="flex items-start gap-2 md:gap-3 min-w-0 flex-1">
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-white text-lg md:text-xl flex-shrink-0 ${getDocIconBg(doc.category)}`}>
                            {getDocumentIcon()}
                        </div>
                        <h4 className="font-semibold text-sm md:text-base text-gray-800 leading-tight mt-0.5">{doc.title}</h4>
                     </div>
                     <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Badge de estado compacto */}
                        <StatusBadge status={status} compact={true} doc={doc} />
                        {/* Botón editar */}
                        {canEdit && (
                            <button onClick={(e) => { e.stopPropagation(); onEdit(doc); }} className="text-gray-400 hover:text-blue-600 p-1" title="Actualizar documento">
                                <Edit size={16} />
                            </button>
                        )}
                        {/* Botón eliminar (para módulos personalizados: admin o usuario con rol correspondiente) */}
                        {isCustomModule && (isAdmin || canEdit) && (
                            <button onClick={(e) => { e.stopPropagation(); onDelete(doc); }} className="text-gray-400 hover:text-red-600 p-1" title="Eliminar documento">
                                <Trash2 size={16} />
                            </button>
                        )}
                     </div>
                </div>
                <p className="text-xs md:text-sm text-gray-600 mb-4 line-clamp-2 md:line-clamp-3 min-h-[2.5rem] md:min-h-[3rem]">{doc.description}</p>
            </div>
            <div>
                <div className="text-xs text-gray-500 pt-3 border-t">
                    <p className="truncate">Actualizado: {doc.updatedAt?.seconds ? new Date(doc.updatedAt.seconds * 1000).toLocaleDateString() : doc.updatedAt}</p>
                    <p>Versión: {doc.version || '1.0'}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    {/* Mostrar botones según archivos disponibles */}
                    <>
                        {/* Para tipos multi-archivo: mostrar botones según reglas específicas */}
                        {isMultiFileType ? (
                            <>
                                {/* Si tiene Excel: botón Excel para descargar */}
                                {hasExcel && (
                                    <button onClick={() => onDownloadExcel(doc)} className="flex-1 text-xs md:text-sm bg-green-100 text-green-700 font-semibold py-2 px-2 md:px-3 rounded-lg hover:bg-green-200 flex items-center justify-center gap-1">
                                        <FileSpreadsheet size={14}/> <span>Excel</span>
                                    </button>
                                )}
                                {/* Si tiene MPP: botón Descargar */}
                                {hasMpp && (
                                    <button onClick={() => onDownloadExcel(doc)} className="flex-1 text-xs md:text-sm bg-purple-100 text-purple-700 font-semibold py-2 px-2 md:px-3 rounded-lg hover:bg-purple-200 flex items-center justify-center gap-1">
                                        <Download size={14}/> <span>Descargar</span>
                                    </button>
                                )}
                                {/* Si tiene PDF: botón Ver */}
                                {hasPdf && (
                                    <button onClick={() => onPreview(doc)} className={`${hasExcel || hasMpp ? 'flex-1' : 'w-full'} text-xs md:text-sm bg-blue-100 text-blue-700 font-semibold py-2 px-2 md:px-3 rounded-lg hover:bg-blue-200 flex items-center justify-center gap-1`}>
                                        <Eye size={14}/> <span>Ver</span>
                                    </button>
                                )}
                            </>
                        ) : (
                            <>
                                {/* Para documentos regulares: mostrar botones como antes */}
                                {hasWord && (
                                    <button onClick={() => onDownloadWord(doc)} className="flex-1 text-xs md:text-sm bg-indigo-100 text-indigo-700 font-semibold py-2 px-2 md:px-3 rounded-lg hover:bg-indigo-200 flex items-center justify-center gap-1">
                                        <FileText size={14}/> <span>Word</span>
                                    </button>
                                )}
                                {hasExcel && (
                                    <button onClick={() => onDownloadExcel(doc)} className="flex-1 text-xs md:text-sm bg-green-100 text-green-700 font-semibold py-2 px-2 md:px-3 rounded-lg hover:bg-green-200 flex items-center justify-center gap-1">
                                        <FileSpreadsheet size={14}/> <span>Excel</span>
                                    </button>
                                )}
                                <button onClick={() => onPreview(doc)} className={`${hasWord || hasExcel ? 'flex-1' : 'w-full'} text-xs md:text-sm bg-blue-100 text-blue-700 font-semibold py-2 px-2 md:px-3 rounded-lg hover:bg-blue-200 flex items-center justify-center gap-1`}>
                                    <Eye size={14}/> <span>Ver</span>
                                </button>
                            </>
                        )}
                    </>
                </div>
            </div>
        </div>
    );
};

const DocListItem = ({ doc, onPreview, onEdit, onDownloadWord, onDownloadExcel, canEdit }) => {
    const status = getDocumentStatus(doc);

    // Verificar si es un tipo multi-archivo (cronograma, backlog, lecciones)
    const isMultiFileType = ['lecciones', 'backlog', 'cronograma'].includes(doc.type);

    // Para tipos multi-archivo, verificar qué archivos tiene en el array files
    let hasWord = !!doc.wordFilePath;
    let hasExcel = !!doc.excelFilePath;
    let hasPdf = !!doc.pdfFilePath;
    let hasMpp = false;

    if (isMultiFileType && doc.files && Array.isArray(doc.files)) {
        // Resetear flags y verificar archivos en el array
        hasWord = false;
        hasExcel = false;
        hasPdf = false;
        hasMpp = false;

        doc.files.forEach(file => {
            if (file.type === 'pdf') hasPdf = true;
            else if (file.type === 'excel') hasExcel = true;
            else if (file.type === 'mpp') hasMpp = true;
            else if (file.type === 'word') hasWord = true;
        });
    }

    return (
        <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 md:p-4 rounded-lg transition-colors hover:bg-gray-50`}>
             <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl shrink-0 cursor-pointer ${getDocIconBg(doc.category)}`} onClick={() => onPreview(doc)}>
                {getDocumentIcon()}
            </div>
            <div className="flex-1 cursor-pointer min-w-0" onClick={() => onPreview(doc)}>
                <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm md:text-base text-gray-800">{doc.title}</h4>
                    <StatusBadge status={status} doc={doc} />
                </div>
                <p className="text-xs text-gray-500 truncate">Actualizado: {doc.updatedAt?.seconds ? new Date(doc.updatedAt.seconds * 1000).toLocaleDateString() : doc.updatedAt} • Versión: {doc.version || '1.0'}</p>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {/* Para tipos multi-archivo: mostrar botones según reglas específicas */}
                {isMultiFileType ? (
                    <>
                        {hasExcel && (
                            <button onClick={() => onDownloadExcel(doc)} className="text-xs bg-green-100 text-green-700 font-semibold py-1 px-2 md:px-3 rounded-full hover:bg-green-200 flex items-center gap-1 whitespace-nowrap">
                                <FileSpreadsheet size={12}/> <span className="hidden sm:inline">Excel</span>
                            </button>
                        )}
                        {hasMpp && (
                            <button onClick={() => onDownloadExcel(doc)} className="text-xs bg-purple-100 text-purple-700 font-semibold py-1 px-2 md:px-3 rounded-full hover:bg-purple-200 flex items-center gap-1 whitespace-nowrap">
                                <Download size={12}/> <span className="hidden sm:inline">Descargar</span>
                            </button>
                        )}
                        {hasPdf && (
                            <button onClick={() => onPreview(doc)} className="text-xs bg-blue-100 text-blue-700 font-semibold py-1 px-2 md:px-3 rounded-full hover:bg-blue-200 flex items-center gap-1 whitespace-nowrap">
                                <Eye size={12}/> Ver
                            </button>
                        )}
                    </>
                ) : (
                    <>
                        {hasWord && (
                            <button onClick={() => onDownloadWord(doc)} className="text-xs bg-indigo-100 text-indigo-700 font-semibold py-1 px-2 md:px-3 rounded-full hover:bg-indigo-200 flex items-center gap-1 whitespace-nowrap">
                                <FileText size={12}/> <span className="hidden sm:inline">Word</span>
                            </button>
                        )}
                        {hasExcel && (
                            <button onClick={() => onDownloadExcel(doc)} className="text-xs bg-green-100 text-green-700 font-semibold py-1 px-2 md:px-3 rounded-full hover:bg-green-200 flex items-center gap-1 whitespace-nowrap">
                                <FileSpreadsheet size={12}/> <span className="hidden sm:inline">Excel</span>
                            </button>
                        )}
                        <button onClick={() => onPreview(doc)} className="text-xs bg-blue-100 text-blue-700 font-semibold py-1 px-2 md:px-3 rounded-full hover:bg-blue-200 flex items-center gap-1 whitespace-nowrap"><Eye size={12}/> Ver</button>
                    </>
                )}
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
    const isPrototipo = doc.type === 'prototipo';
    const hasFigmaUrl = !!(doc.figmaUrl || (doc.url && doc.url.includes('figma.com')));

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        }
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const openFigma = () => {
        if (hasFigmaUrl) {
            window.open(doc.figmaUrl || doc.url, '_blank');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-5 border-b bg-gray-50 rounded-t-2xl">
                    <h3 className="text-lg font-semibold text-gray-800">{doc.title}</h3>
                    <div className="flex items-center gap-2">
                        {isPrototipo && hasFigmaUrl && (
                            <button
                                onClick={openFigma}
                                className="px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors text-sm flex items-center gap-2"
                                title="Abrir prototipo en Figma"
                            >
                                🎨 Abrir en Figma
                            </button>
                        )}
                        <button onClick={onClose} className="w-9 h-9 rounded-full bg-red-500 text-white font-bold text-xl hover:bg-red-600 transition-colors">×</button>
                    </div>
                </header>
                <div className="flex-1 p-2 md:p-8 bg-gray-100">
                    <iframe src={doc.embedUrl} className="w-full h-full border-0 rounded-lg bg-white" title={doc.title}></iframe>
                </div>
            </div>
        </div>
    );
};

// Modal para visualizar archivos de manuales
const ManualFilesModal = ({ doc, onClose, onDeleteFile, firestore }) => {
    const [deletingFile, setDeletingFile] = useState<string | null>(null);
    const [previewFile, setPreviewFile] = useState<{ url: string; name: string; type: string } | null>(null);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                if (previewFile) {
                    setPreviewFile(null);
                } else {
                    onClose();
                }
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose, previewFile]);

    const handleViewFile = async (file) => {
        try {
            const downloadResponse = await fetch(`/api/storage/download?filePath=${encodeURIComponent(file.path)}&expiresIn=60`);
            if (downloadResponse.ok) {
                const downloadResult = await downloadResponse.json();
                setPreviewFile({
                    url: downloadResult.url,
                    name: file.name,
                    type: file.type
                });
            }
        } catch (error) {
            console.error('Error al obtener URL del archivo:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo abrir el archivo',
                confirmButtonColor: '#004272'
            });
        }
    };

    const handleDownloadFile = async (file) => {
        try {
            const downloadResponse = await fetch(`/api/storage/download?filePath=${encodeURIComponent(file.path)}&expiresIn=60`);
            if (downloadResponse.ok) {
                const downloadResult = await downloadResponse.json();
                const link = document.createElement('a');
                link.href = downloadResult.url;
                link.download = file.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error('Error al descargar archivo:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo descargar el archivo',
                confirmButtonColor: '#004272'
            });
        }
    };

    const handleDeleteFile = async (fileIndex) => {
        const result = await Swal.fire({
            icon: 'warning',
            title: '¿Eliminar archivo?',
            text: '¿Estás seguro de que deseas eliminar este archivo?',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280'
        });

        if (!result.isConfirmed) return;

        setDeletingFile(`file-${fileIndex}`);

        try {
            const filesArray = Array.isArray(doc.files) ? [...doc.files] : [];
            const fileToDelete = filesArray[fileIndex];

            if (!fileToDelete) {
                throw new Error('Archivo no encontrado');
            }

            // Eliminar archivo de Google Cloud Storage
            await fetch(`/api/storage/delete?filePath=${encodeURIComponent(fileToDelete.path)}`, {
                method: 'DELETE'
            });

            // Actualizar Firestore - eliminar del array
            filesArray.splice(fileIndex, 1);
            const { doc: firestoreDoc, updateDoc: firestoreUpdateDoc } = await import('firebase/firestore');
            const docRef = firestoreDoc(firestore, 'documentos', doc.id);
            await firestoreUpdateDoc(docRef, { files: filesArray });

            Swal.fire({
                icon: 'success',
                title: 'Archivo eliminado',
                timer: 1500,
                showConfirmButton: false
            });

            if (onDeleteFile) onDeleteFile();
        } catch (error) {
            console.error('Error al eliminar archivo:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar el archivo',
                confirmButtonColor: '#004272'
            });
        } finally {
            setDeletingFile(null);
        }
    };

    const files = doc.files || [];

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-5 border-b bg-gray-50 rounded-t-2xl">
                    <h3 className="text-lg font-semibold text-gray-800">{doc.title} - Archivos</h3>
                    <button onClick={onClose} className="w-9 h-9 rounded-full bg-red-500 text-white font-bold text-xl hover:bg-red-600 transition-colors">×</button>
                </header>
                <div className="flex-1 p-6 overflow-y-auto">
                    {files.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {files.map((file, index) => {
                                const isPdf = file.type === 'pdf';
                                return (
                                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0 ${isPdf ? 'bg-red-500' : 'bg-blue-500'}`}>
                                                {isPdf ? '📄' : '📝'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                                                <p className="text-xs text-gray-500">{isPdf ? 'PDF' : 'Word'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                            <button
                                                onClick={() => handleViewFile(file)}
                                                className="w-8 h-8 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                                                title="Vista previa"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDownloadFile(file)}
                                                className="w-8 h-8 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                                                title="Descargar archivo"
                                            >
                                                <Download size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteFile(index)}
                                                disabled={deletingFile === `file-${index}`}
                                                className="w-8 h-8 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center disabled:opacity-50"
                                                title="Eliminar archivo"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No hay archivos disponibles
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de previsualización */}
            {previewFile && (
                <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4" onClick={() => setPreviewFile(null)}>
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                        <header className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-lg flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded flex items-center justify-center text-white ${previewFile.type === 'pdf' ? 'bg-red-500' : 'bg-blue-500'}`}>
                                    {previewFile.type === 'pdf' ? '📄' : '📝'}
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-gray-800">{previewFile.name}</h3>
                                    <p className="text-xs text-gray-500">{previewFile.type === 'pdf' ? 'PDF' : 'Word Document'}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setPreviewFile(null)}
                                className="w-9 h-9 rounded-full bg-red-500 text-white font-bold text-xl hover:bg-red-600 transition-colors flex-shrink-0"
                            >
                                ×
                            </button>
                        </header>
                        <div className="flex-1 overflow-hidden bg-gray-100">
                            {previewFile.type === 'pdf' ? (
                                <iframe
                                    src={previewFile.url}
                                    className="w-full h-full border-0"
                                    title={previewFile.name}
                                />
                            ) : (
                                // Para archivos Word, usar Google Docs Viewer
                                <iframe
                                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(previewFile.url)}&embedded=true`}
                                    className="w-full h-full border-0"
                                    title={previewFile.name}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const UploadDocModal = ({ onClose, onUploadSuccess, docToEdit, activeCategory, allDocs, allCategories, customDivisions }) => {
    const firestore = useFirestore();
    const { user } = useUser();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(activeCategory);
    const [type, setType] = useState('default'); // Tipo por defecto para nuevos documentos
    const [version, setVersion] = useState('1.0');
    const [divisionId, setDivisionId] = useState(''); // Para módulos personalizados
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [wordFile, setWordFile] = useState<File | null>(null);
    const [excelFile, setExcelFile] = useState<File | null>(null);
    const [figmaUrl, setFigmaUrl] = useState('');
    const [frontendUrl, setFrontendUrl] = useState('');
    const [backendUrl, setBackendUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    // Para manuales: soporte de múltiples archivos (PDF y Word en el mismo campo)
    const [manualFiles, setManualFiles] = useState<File[]>([]);

    // Estado para rastrear archivos existentes de manuales que se marcarán para eliminación
    const [deleteExistingManualFiles, setDeleteExistingManualFiles] = useState<number[]>([]);

    // Estados para rastrear archivos existentes que se marcarán para eliminación
    const [deleteExistingPdf, setDeleteExistingPdf] = useState(false);
    const [deleteExistingWord, setDeleteExistingWord] = useState(false);
    const [deleteExistingExcel, setDeleteExistingExcel] = useState(false);

    const isEditMode = Boolean(docToEdit);

    // Verificar si es un módulo personalizado
    const isCustomModule = allCategories.find(cat => cat.id === category)?.isCustom || false;

    // Determine which file types are needed based on document type
    const isMultiFileType = ['lecciones', 'backlog', 'cronograma'].includes(type); // Tipos que permiten múltiples archivos (Excel/MPP/PDF)
    const needsExcelOnly = false; // Ya no se usa
    const isPrototipo = type === 'prototipo';
    const isRepositorios = type === 'repositorios';

    // Detectar si es un manual (Manual de Usuario, Manual de Sistema, o Manual de Base de Datos)
    const isManual = title.toLowerCase().includes('manual de usuario')
        || title.toLowerCase().includes('manual de sistema')
        || title.toLowerCase().includes('manual de base de datos')
        || type === 'manual'
        || type === 'manual-bd';

    useEffect(() => {
        if (isEditMode) {
            setTitle(docToEdit.title);
            setCategory(docToEdit.category);
            // Si el documento no tiene tipo, intentar detectarlo por el título
            const detectedType = docToEdit.type || (
                docToEdit.title?.toLowerCase().includes('manual de usuario') ||
                docToEdit.title?.toLowerCase().includes('manual de sistema') ? 'manual' :
                docToEdit.title?.toLowerCase().includes('manual de base de datos') ? 'manual-bd' :
                docToEdit.title?.toLowerCase().includes('prototipo') ? 'prototipo' :
                'default'
            );
            setType(detectedType);
            setVersion(docToEdit.version || '1.0');
            if (docToEdit.figmaUrl) setFigmaUrl(docToEdit.figmaUrl);
            if (docToEdit.frontendUrl) setFrontendUrl(docToEdit.frontendUrl);
            if (docToEdit.backendUrl) setBackendUrl(docToEdit.backendUrl);
            if (docToEdit.divisionId) setDivisionId(docToEdit.divisionId);

            // Reset deletion flags when opening modal
            setDeleteExistingPdf(false);
            setDeleteExistingWord(false);
            setDeleteExistingExcel(false);
            setDeleteExistingManualFiles([]);
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

    // Handler para archivos de manuales (PDF y Word en el mismo campo)
    const handleManualFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files as FileList);
            setManualFiles(prev => [...prev, ...newFiles]);
            e.target.value = ''; // Resetear input para permitir seleccionar más archivos
        }
    };

    const removeManualFile = (index: number) => {
        setManualFiles(prev => prev.filter((_, i) => i !== index));
    };

    const toggleDeleteExistingManualFile = (index: number) => {
        setDeleteExistingManualFiles(prev => {
            if (prev.includes(index)) {
                // Si ya está marcado, desmarcarlo
                return prev.filter(i => i !== index);
            } else {
                // Si no está marcado, marcarlo
                return [...prev, index];
            }
        });
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
        if (isManual) {
            // Para manuales: al menos un archivo es obligatorio solo en modo creación
            const hasNewFiles = manualFiles.length > 0;

            if (!isEditMode && !hasNewFiles) {
                setError('Debe subir al menos un archivo (PDF o Word).');
                return;
            }

            // En modo edición se permite guardar sin archivos (para eliminar todos)
        } else if (isMultiFileType) {
            // Para cronograma, backlog, lecciones: al menos un archivo es obligatorio solo en modo creación
            const hasNewFiles = manualFiles.length > 0;

            if (!isEditMode && !hasNewFiles) {
                setError('Debe subir al menos un archivo (Excel, MPP o PDF).');
                return;
            }

            // En modo edición se permite guardar sin archivos (para eliminar todos)
        } else if (isPrototipo) {
            // Para prototipos: validar solo en modo creación
            if (!isEditMode) {
                const hasFigma = figmaUrl && figmaUrl.includes('figma.com');
                const hasPdf = !!pdfFile;

                if (!hasFigma && !hasPdf) {
                    setError('Debe proporcionar al menos un enlace de Figma o un archivo PDF.');
                    return;
                }
            }

            // Si proporcionó Figma URL, validar que sea válida
            if (figmaUrl && !figmaUrl.includes('figma.com')) {
                setError('El enlace de Figma no es válido. Debe contener "figma.com".');
                return;
            }

            // En modo edición se permite guardar sin archivos (para eliminar todos)
        } else if (isRepositorios) {
            // Para repositorios: validar solo en modo creación
            if (!isEditMode) {
                if (!frontendUrl || !backendUrl) {
                    setError('Debe proporcionar ambos enlaces: Frontend y Backend.');
                    return;
                }
            }

            // Validar que sean URLs válidas si se proporcionan
            if (frontendUrl || backendUrl) {
                try {
                    if (frontendUrl) new URL(frontendUrl);
                    if (backendUrl) new URL(backendUrl);
                } catch {
                    setError('Los enlaces deben ser URLs válidas (incluir http:// o https://).');
                    return;
                }
            }

            // En modo edición se permite guardar sin enlaces (para eliminar todos)
        } else {
            // Para documentos regulares: validar solo en modo creación
            if (!isEditMode) {
                const hasNewPdf = !!pdfFile;
                const hasNewWord = !!wordFile;

                if (!hasNewPdf && !hasNewWord) {
                    setError('Debe subir al menos un archivo PDF o Word.');
                    return;
                }
            }

            // En modo edición se permite guardar sin archivos (para eliminar todos)
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

            // Agregar divisionId para módulos personalizados
            if (isCustomModule && divisionId) {
                docData.divisionId = divisionId;
            }

            // Handle file deletions in edit mode
            if (isEditMode && docToEdit) {
                // Delete PDF if marked for deletion
                if (deleteExistingPdf && docToEdit.pdfFilePath) {
                    try {
                        const deleteResponse = await fetch(`/api/storage/delete?filePath=${encodeURIComponent(docToEdit.pdfFilePath)}`, {
                            method: 'DELETE',
                        });
                        if (!deleteResponse.ok) {
                            console.warn('Failed to delete PDF file from storage:', docToEdit.pdfFilePath);
                        }
                    } catch (error) {
                        console.error('Error deleting PDF file:', error);
                    }
                    // Mark field for deletion in Firestore
                    docData.pdfFilePath = deleteField();
                }

                // Delete Word if marked for deletion
                if (deleteExistingWord && docToEdit.wordFilePath) {
                    try {
                        const deleteResponse = await fetch(`/api/storage/delete?filePath=${encodeURIComponent(docToEdit.wordFilePath)}`, {
                            method: 'DELETE',
                        });
                        if (!deleteResponse.ok) {
                            console.warn('Failed to delete Word file from storage:', docToEdit.wordFilePath);
                        }
                    } catch (error) {
                        console.error('Error deleting Word file:', error);
                    }
                    // Mark field for deletion in Firestore
                    docData.wordFilePath = deleteField();
                }

                // Delete Excel if marked for deletion
                if (deleteExistingExcel && docToEdit.excelFilePath) {
                    try {
                        const deleteResponse = await fetch(`/api/storage/delete?filePath=${encodeURIComponent(docToEdit.excelFilePath)}`, {
                            method: 'DELETE',
                        });
                        if (!deleteResponse.ok) {
                            console.warn('Failed to delete Excel file from storage:', docToEdit.excelFilePath);
                        }
                    } catch (error) {
                        console.error('Error deleting Excel file:', error);
                    }
                    // Mark field for deletion in Firestore
                    docData.excelFilePath = deleteField();
                }
            }

            // Handle Manuales (múltiples archivos PDF y Word en el mismo campo)
            if (isManual || isMultiFileType) {
                // Inicializar estructura de archivos (copiar para no mutar el original)
                let filesData = Array.isArray(docToEdit?.files) ? [...docToEdit.files] : [];

                // En modo edición, eliminar archivos marcados para eliminación
                if (isEditMode && deleteExistingManualFiles.length > 0) {
                    // Ordenar índices en orden descendente para eliminar de atrás hacia adelante
                    const sortedIndices = [...deleteExistingManualFiles].sort((a, b) => b - a);

                    for (const index of sortedIndices) {
                        const fileToDelete = filesData[index];
                        if (fileToDelete) {
                            try {
                                // Eliminar archivo de Google Cloud Storage
                                await fetch(`/api/storage/delete?filePath=${encodeURIComponent(fileToDelete.path)}`, {
                                    method: 'DELETE',
                                });
                            } catch (error) {
                                console.error('Error deleting file from storage:', error);
                            }
                            // Eliminar del array
                            filesData.splice(index, 1);
                        }
                    }
                }

                // Subir archivos nuevos (PDF, Word, Excel, MPP)
                for (const file of manualFiles) {
                    const fileFormData = new FormData();
                    fileFormData.append('file', file);
                    fileFormData.append('category', category);

                    const uploadResponse = await fetch('/api/storage/upload', {
                        method: 'POST',
                        body: fileFormData,
                    });

                    if (!uploadResponse.ok) {
                        let errorMessage = 'Error al subir el archivo';
                        try {
                            const errorData = await uploadResponse.json();
                            errorMessage = errorData.error || errorMessage;
                        } catch (e) {
                            // Si no es JSON, probablemente es un error del servidor
                            if (uploadResponse.status === 413) {
                                errorMessage = `El archivo "${file.name}" es demasiado grande. Tamaño máximo: 1GB`;
                            } else {
                                errorMessage = `Error ${uploadResponse.status}: ${uploadResponse.statusText}`;
                            }
                        }
                        throw new Error(errorMessage);
                    }

                    const uploadResult = await uploadResponse.json();

                    // Determinar el tipo de archivo
                    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
                    let fileType = 'other';
                    if (['pdf'].includes(fileExtension)) {
                        fileType = 'pdf';
                    } else if (['doc', 'docx'].includes(fileExtension)) {
                        fileType = 'word';
                    } else if (['xls', 'xlsx'].includes(fileExtension)) {
                        fileType = 'excel';
                    } else if (['mpp'].includes(fileExtension)) {
                        fileType = 'mpp';
                    }

                    filesData.push({
                        name: file.name,
                        path: uploadResult.filePath,
                        type: fileType,
                        uploadedAt: new Date().toISOString()
                    });
                }

                // Guardar estructura de archivos
                docData.files = filesData;

                // Generar URL de vista previa del primer archivo para compatibilidad
                if (filesData.length > 0) {
                    const firstFile = filesData[0];
                    const downloadResponse = await fetch(`/api/storage/download?filePath=${encodeURIComponent(firstFile.path)}&expiresIn=60`);
                    if (downloadResponse.ok) {
                        const downloadResult = await downloadResponse.json();
                        docData.url = downloadResult.url;
                        docData.embedUrl = downloadResult.url;
                    }
                }
            } else if (isPrototipo) {
                // Store Figma URL if provided
                if (figmaUrl) {
                    docData.figmaUrl = figmaUrl;
                    docData.url = figmaUrl; // Also store in url for compatibility
                } else if (docToEdit?.figmaUrl) {
                    // Keep existing Figma URL if not updating
                    docData.figmaUrl = docToEdit.figmaUrl;
                    docData.url = docToEdit.figmaUrl;
                }

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
                        let errorMessage = 'Error al subir el PDF';
                        try {
                            const errorData = await pdfUploadResponse.json();
                            errorMessage = errorData.error || errorMessage;
                        } catch (e) {
                            if (pdfUploadResponse.status === 413) {
                                errorMessage = `El archivo PDF es demasiado grande. Tamaño máximo: 1GB`;
                            } else {
                                errorMessage = `Error ${pdfUploadResponse.status}: ${pdfUploadResponse.statusText}`;
                            }
                        }
                        throw new Error(errorMessage);
                    }

                    const pdfUploadResult = await pdfUploadResponse.json();
                    docData.pdfFilePath = pdfUploadResult.filePath;
                } else if (docToEdit?.pdfFilePath && !deleteExistingPdf) {
                    // Keep existing PDF if not uploading new one and not marked for deletion
                    docData.pdfFilePath = docToEdit.pdfFilePath;
                }
            } else if (isRepositorios) {
                // Handle Repositorios (Frontend and Backend URLs)
                docData.frontendUrl = frontendUrl;
                docData.backendUrl = backendUrl;
                docData.url = frontendUrl; // Store frontend as primary URL for compatibility
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
                        let errorMessage = 'Error al subir el PDF';
                        try {
                            const errorData = await pdfUploadResponse.json();
                            errorMessage = errorData.error || errorMessage;
                        } catch (e) {
                            if (pdfUploadResponse.status === 413) {
                                errorMessage = `El archivo PDF es demasiado grande. Tamaño máximo: 1GB`;
                            } else {
                                errorMessage = `Error ${pdfUploadResponse.status}: ${pdfUploadResponse.statusText}`;
                            }
                        }
                        throw new Error(errorMessage);
                    }

                    const pdfUploadResult = await pdfUploadResponse.json();
                    docData.pdfFilePath = pdfUploadResult.filePath;
                } else if (docToEdit?.pdfFilePath && !deleteExistingPdf) {
                    // Keep existing PDF if not uploading new one and not marked for deletion
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
                        let errorMessage = 'Error al subir el archivo Word';
                        try {
                            const errorData = await wordUploadResponse.json();
                            errorMessage = errorData.error || errorMessage;
                        } catch (e) {
                            if (wordUploadResponse.status === 413) {
                                errorMessage = `El archivo Word es demasiado grande. Tamaño máximo: 1GB`;
                            } else {
                                errorMessage = `Error ${wordUploadResponse.status}: ${wordUploadResponse.statusText}`;
                            }
                        }
                        throw new Error(errorMessage);
                    }

                    const wordUploadResult = await wordUploadResponse.json();
                    docData.wordFilePath = wordUploadResult.filePath;
                } else if (docToEdit?.wordFilePath && !deleteExistingWord) {
                    // Keep existing Word if not uploading new one and not marked for deletion
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
                        let errorMessage = 'Error al subir el archivo Excel';
                        try {
                            const errorData = await excelUploadResponse.json();
                            errorMessage = errorData.error || errorMessage;
                        } catch (e) {
                            if (excelUploadResponse.status === 413) {
                                errorMessage = `El archivo Excel es demasiado grande. Tamaño máximo: 1GB`;
                            } else {
                                errorMessage = `Error ${excelUploadResponse.status}: ${excelUploadResponse.statusText}`;
                            }
                        }
                        throw new Error(errorMessage);
                    }

                    const excelUploadResult = await excelUploadResponse.json();
                    docData.excelFilePath = excelUploadResult.filePath;
                } else if (docToEdit?.excelFilePath && !deleteExistingExcel) {
                    // Keep existing Excel if not uploading new one and not marked for deletion
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

            // Calcular y agregar el estado del documento
            const calculatedStatus = getDocumentStatus(docData);
            docData.estado = calculatedStatus;

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
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-2 sm:p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-4 sm:p-5 border-b bg-gray-50 rounded-t-2xl flex-shrink-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">{isEditMode ? 'Actualizar Documento' : 'Subir Nuevo Documento'}</h3>
                    <button onClick={onClose} className="w-9 h-9 rounded-full bg-red-500 text-white font-bold text-xl hover:bg-red-600 transition-colors flex-shrink-0">×</button>
                </header>
                <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 overflow-y-auto">
                    {error && <p className="text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título del Documento</label>
                        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-2.5 sm:p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-[#004272] text-sm sm:text-base" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Módulo</label>
                             <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2.5 sm:p-3 bg-gray-100 border-2 border-gray-200 rounded-lg text-sm sm:text-base" disabled={isEditMode}>
                                {allCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                        </div>
                        <div className="hidden">
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Documento</label>
                            <select id="type" value={type} onChange={(e) => setType(e.target.value)} className="w-full p-2.5 sm:p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-[#004272] text-sm sm:text-base">
                                <option value="default">Documento General</option>
                                <option value="manual">Manual de Usuario/Sistema</option>
                                <option value="manual-bd">Manual de Base de Datos</option>
                                <option value="prototipo">Prototipo</option>
                                <option value="repositorios">Repositorios</option>
                                <option value="acta">Acta</option>
                                <option value="cronograma">Cronograma</option>
                                <option value="requerimientos">Requerimientos</option>
                                <option value="backlog">Product Backlog</option>
                                <option value="lecciones">Lecciones Aprendidas</option>
                                <option value="arquitectura">Arquitectura</option>
                                <option value="diagrama">Diagrama</option>
                                <option value="doc-api">Documentación de API</option>
                            </select>
                        </div>
                    </div>
                     <div className="hidden">
                        <label htmlFor="version" className="block text-sm font-medium text-gray-700 mb-1">Versión</label>
                        <input type="text" id="version" value={version} onChange={(e) => setVersion(e.target.value)} className="w-full p-2.5 sm:p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-[#004272] text-sm sm:text-base" placeholder="Ej: 1.0"/>
                    </div>

                    {/* Campo de División para módulos personalizados */}
                    {isCustomModule && (() => {
                        const moduleDivisions = (customDivisions || []).filter(d => d.moduleId === category);
                        return moduleDivisions.length > 0 ? (
                            <div>
                                <label htmlFor="division" className="block text-sm font-medium text-gray-700 mb-1">
                                    Bloque/División <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="division"
                                    value={divisionId}
                                    onChange={(e) => setDivisionId(e.target.value)}
                                    required
                                    className="w-full p-2.5 sm:p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-[#004272] text-sm sm:text-base"
                                >
                                    <option value="">Seleccione un bloque</option>
                                    {moduleDivisions.map(div => (
                                        <option key={div.id} value={div.id}>
                                            {div.icon} {div.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">Seleccione el bloque donde se guardará este documento</p>
                            </div>
                        ) : null;
                    })()}

                    {/* Prototipo: Figma URL o PDF (al menos uno obligatorio) */}
                    {isPrototipo && (
                        <>
                            <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded">
                                <p className="text-xs text-purple-700">
                                    <strong>Nota:</strong> Debes proporcionar al menos un enlace de Figma o un archivo PDF (o ambos).
                                </p>
                            </div>
                            <div>
                                <label htmlFor="figmaUrl" className="block text-sm font-medium text-gray-700 mb-1">
                                    Enlace de Figma
                                </label>
                                <input
                                    type="url"
                                    id="figmaUrl"
                                    value={figmaUrl}
                                    onChange={(e) => setFigmaUrl(e.target.value)}
                                    className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-[#004272]"
                                    placeholder="https://figma.com/..."
                                />
                                <p className="text-xs text-gray-500 mt-1">Proporciona el enlace al prototipo en Figma.</p>
                            </div>
                            <div>
                                <label htmlFor="pdfFile" className="block text-sm font-medium text-gray-700 mb-1">
                                    Archivo PDF del Prototipo
                                </label>
                                <input
                                    type="file"
                                    id="pdfFile"
                                    onChange={handlePdfFileChange}
                                    accept=".pdf"
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                <p className="text-xs text-gray-500 mt-1">Sube un archivo PDF del prototipo.</p>
                                {pdfFile && <FilePreview file={pdfFile} onRemove={() => setPdfFile(null)} label="PDF" />}
                                {!pdfFile && isEditMode && docToEdit?.pdfFilePath && (
                                    <FilePreview
                                        existingFile={docToEdit.pdfFilePath.split('/').pop()}
                                        onRemove={() => setPdfFile(null)}
                                        label="PDF existente"
                                    />
                                )}
                            </div>
                        </>
                    )}

                    {/* Repositorios: Frontend y Backend URLs obligatorios */}
                    {isRepositorios && (
                        <>
                            <div>
                                <label htmlFor="frontendUrl" className="block text-sm font-medium text-gray-700 mb-1">
                                    Repositorio Frontend <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="url"
                                    id="frontendUrl"
                                    value={frontendUrl}
                                    onChange={(e) => setFrontendUrl(e.target.value)}
                                    required
                                    className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-[#004272]"
                                    placeholder="https://github.com/usuario/repositorio-frontend"
                                />
                                <p className="text-xs text-gray-500 mt-1">URL del repositorio de código del Frontend.</p>
                            </div>
                            <div>
                                <label htmlFor="backendUrl" className="block text-sm font-medium text-gray-700 mb-1">
                                    Repositorio Backend <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="url"
                                    id="backendUrl"
                                    value={backendUrl}
                                    onChange={(e) => setBackendUrl(e.target.value)}
                                    required
                                    className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-[#004272]"
                                    placeholder="https://github.com/usuario/repositorio-backend"
                                />
                                <p className="text-xs text-gray-500 mt-1">URL del repositorio de código del Backend.</p>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                                <p className="text-xs text-slate-700">
                                    <strong>Nota:</strong> Ambos enlaces son obligatorios. Deben ser URLs válidas de repositorios (GitHub, GitLab, etc.).
                                </p>
                            </div>
                        </>
                    )}

                    {/* Manuales: Múltiples archivos PDF y Word en el mismo campo */}
                    {isManual && (
                        <>
                            <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded">
                                <p className="text-xs text-amber-700">
                                    <strong>Nota:</strong> Para manuales puedes subir múltiples archivos (PDF o Word). Al menos un archivo es obligatorio.
                                </p>
                            </div>

                            {/* Campo único para archivos PDF y Word */}
                            <div>
                                <label htmlFor="manualFiles" className="block text-sm font-medium text-gray-700 mb-1">
                                    Archivos del Manual <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="file"
                                    id="manualFiles"
                                    onChange={handleManualFilesChange}
                                    accept=".pdf,.doc,.docx"
                                    multiple
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                />
                                <p className="text-xs text-gray-500 mt-1">Puedes seleccionar múltiples archivos PDF y/o Word a la vez</p>

                                {/* Preview de archivos seleccionados */}
                                {manualFiles.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        <p className="text-sm font-medium text-gray-700">Archivos seleccionados ({manualFiles.length}):</p>
                                        {manualFiles.map((file, index) => (
                                            <FilePreview
                                                key={index}
                                                file={file}
                                                onRemove={() => removeManualFile(index)}
                                                label={file.name.endsWith('.pdf') ? 'PDF' : 'Word'}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Mostrar archivos existentes en modo edición */}
                                {isEditMode && docToEdit?.files && docToEdit.files.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        <p className="text-sm font-medium text-gray-700">Archivos existentes:</p>
                                        {docToEdit.files.map((file, index) => {
                                            const isMarkedForDeletion = deleteExistingManualFiles.includes(index);
                                            if (isMarkedForDeletion) {
                                                // Mostrar mensaje de advertencia en lugar del archivo
                                                return (
                                                    <div key={`existing-${index}`} className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-red-700 text-sm">⚠️ <strong>{file.name}</strong> será eliminado al guardar</span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleDeleteExistingManualFile(index)}
                                                                className="text-xs text-red-600 hover:text-red-800 underline"
                                                            >
                                                                Deshacer
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return (
                                                <FilePreview
                                                    key={`existing-${index}`}
                                                    existingFile={file.name}
                                                    onRemove={() => toggleDeleteExistingManualFile(index)}
                                                    label={file.type === 'pdf' ? 'PDF existente' : 'Word existente'}
                                                />
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Cronograma, Product Backlog, Lecciones Aprendidas (múltiples archivos: Excel/MPP/PDF) */}
                    {isMultiFileType && (
                        <>
                            <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded">
                                <p className="text-xs text-amber-700">
                                    <strong>Nota:</strong> Puedes subir múltiples archivos (Excel, MPP o PDF). Se requiere al menos un archivo.
                                </p>
                            </div>

                            {/* Campo único para archivos Excel, MPP y PDF */}
                            <div>
                                <label htmlFor="multiFiles" className="block text-sm font-medium text-gray-700 mb-1">
                                    Archivos del Documento <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="file"
                                    id="multiFiles"
                                    onChange={handleManualFilesChange}
                                    accept=".pdf,.xlsx,.xls,.mpp"
                                    multiple
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Puedes seleccionar múltiples archivos Excel, MPP y/o PDF a la vez
                                </p>

                                {/* Preview de archivos seleccionados */}
                                {manualFiles.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        <p className="text-sm font-medium text-gray-700">Archivos seleccionados ({manualFiles.length}):</p>
                                        {manualFiles.map((file, index) => {
                                            const ext = file.name.split('.').pop()?.toLowerCase();
                                            let label = 'Archivo';
                                            if (ext === 'pdf') label = 'PDF';
                                            else if (['xlsx', 'xls'].includes(ext)) label = 'Excel';
                                            else if (ext === 'mpp') label = 'MPP';

                                            return (
                                                <FilePreview
                                                    key={index}
                                                    file={file}
                                                    onRemove={() => removeManualFile(index)}
                                                    label={label}
                                                />
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Mostrar archivos existentes en modo edición */}
                                {isEditMode && docToEdit?.files && docToEdit.files.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        <p className="text-sm font-medium text-gray-700">Archivos existentes:</p>
                                        {docToEdit.files.map((file, index) => {
                                            const isMarkedForDeletion = deleteExistingManualFiles.includes(index);
                                            if (isMarkedForDeletion) {
                                                return (
                                                    <div key={`existing-${index}`} className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-red-700 text-sm">⚠️ <strong>{file.name}</strong> será eliminado al guardar</span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleDeleteExistingManualFile(index)}
                                                                className="text-xs text-red-600 hover:text-red-800 underline"
                                                            >
                                                                Deshacer
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            let labelText = 'Archivo existente';
                                            if (file.type === 'pdf') labelText = 'PDF existente';
                                            else if (file.type === 'excel') labelText = 'Excel existente';
                                            else if (file.type === 'mpp') labelText = 'MPP existente';

                                            return (
                                                <FilePreview
                                                    key={`existing-${index}`}
                                                    existingFile={file.name}
                                                    onRemove={() => toggleDeleteExistingManualFile(index)}
                                                    label={labelText}
                                                />
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Documentos que solo necesitan Excel/MPP (solicitud-cambio) */}
                    {needsExcelOnly && (
                        <>
                            <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                                <p className="text-xs text-green-700">
                                    <strong>Nota:</strong> Este tipo de documento requiere un archivo Excel (.xlsx, .xls) o Microsoft Project (.mpp).
                                </p>
                            </div>
                            <div>
                                <label htmlFor="excelFile" className="block text-sm font-medium text-gray-700 mb-1">
                                    Archivo Excel/MPP <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="file"
                                    id="excelFile"
                                    onChange={handleExcelFileChange}
                                    accept=".xlsx,.xls,.mpp"
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                />
                                <p className="text-xs text-gray-500 mt-1">Sube el archivo Excel (.xlsx, .xls) o Microsoft Project (.mpp)</p>
                                {excelFile && <FilePreview file={excelFile} onRemove={() => setExcelFile(null)} label="Excel/MPP" />}
                                {!excelFile && isEditMode && docToEdit?.excelFilePath && !deleteExistingExcel && (
                                    <FilePreview
                                        existingFile={docToEdit.excelFilePath.split('/').pop()}
                                        onRemove={() => setDeleteExistingExcel(true)}
                                        label="Excel/MPP existente"
                                    />
                                )}
                                {deleteExistingExcel && !excelFile && (
                                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                        ⚠️ El archivo será eliminado al guardar. Sube uno nuevo para mantener el estado Completado.
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Documentos regulares: PDF o Word (al menos uno obligatorio) */}
                    {!isPrototipo && !isRepositorios && !isManual && !needsExcelOnly && !isMultiFileType && (
                        <>
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                                <p className="text-xs text-blue-700">
                                    <strong>Nota:</strong> Debes subir al menos un archivo PDF o Word. Ambos son opcionales pero se requiere mínimo uno.
                                </p>
                            </div>
                            <div>
                                <label htmlFor="customPdfFile" className="block text-sm font-medium text-gray-700 mb-1">
                                    Archivo PDF
                                </label>
                                <input
                                    type="file"
                                    id="customPdfFile"
                                    onChange={handlePdfFileChange}
                                    accept=".pdf"
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                                />
                                <p className="text-xs text-gray-500 mt-1">Sube el archivo PDF</p>
                                {pdfFile && <FilePreview file={pdfFile} onRemove={() => setPdfFile(null)} label="PDF" />}
                                {!pdfFile && isEditMode && docToEdit?.pdfFilePath && !deleteExistingPdf && (
                                    <FilePreview
                                        existingFile={docToEdit.pdfFilePath.split('/').pop()}
                                        onRemove={() => setDeleteExistingPdf(true)}
                                        label="PDF existente"
                                    />
                                )}
                                {deleteExistingPdf && !pdfFile && (
                                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
                                        ⚠️ El archivo PDF será eliminado al guardar.
                                    </div>
                                )}
                            </div>
                            <div>
                                <label htmlFor="customWordFile" className="block text-sm font-medium text-gray-700 mb-1">
                                    Archivo Word
                                </label>
                                <input
                                    type="file"
                                    id="customWordFile"
                                    onChange={handleWordFileChange}
                                    accept=".doc,.docx"
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                <p className="text-xs text-gray-500 mt-1">Sube el archivo Word (.doc o .docx)</p>
                                {wordFile && <FilePreview file={wordFile} onRemove={() => setWordFile(null)} label="Word" />}
                                {!wordFile && isEditMode && docToEdit?.wordFilePath && !deleteExistingWord && (
                                    <FilePreview
                                        existingFile={docToEdit.wordFilePath.split('/').pop()}
                                        onRemove={() => setDeleteExistingWord(true)}
                                        label="Word existente"
                                    />
                                )}
                                {deleteExistingWord && !wordFile && (
                                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
                                        ⚠️ El archivo Word será eliminado al guardar.
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                    <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4 border-t mt-4">
                        <button type="button" onClick={onClose} className="py-2.5 px-6 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" disabled={isUploading} className="py-2.5 px-6 bg-[#004272] text-white rounded-lg font-semibold hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isUploading ? <><Loader2 className="animate-spin" size={18} /> <span className="hidden sm:inline">Procesando...</span><span className="sm:hidden">Espere...</span></> : (isEditMode ? 'Actualizar Documento' : 'Subir Documento')}
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

// Modal para crear bloques/divisiones personalizadas
const DivisionModal = ({ onClose, firestore, activeModuleId, divisionToEdit }) => {
    const isEditMode = Boolean(divisionToEdit);
    const [divisionName, setDivisionName] = useState(divisionToEdit?.name || '');
    const [divisionIcon, setDivisionIcon] = useState(divisionToEdit?.icon || '📋');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!divisionName.trim()) {
            setError('El nombre de la división es requerido.');
            return;
        }

        if (!firestore) {
            setError('Error de conexión con la base de datos.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            if (isEditMode) {
                // Actualizar división existente
                const divisionData = {
                    name: divisionName.trim(),
                    icon: divisionIcon,
                    updatedAt: serverTimestamp()
                };

                await updateDoc(doc(firestore, 'custom-divisions', divisionToEdit.id), divisionData);

                Swal.fire({
                    icon: 'success',
                    title: 'Bloque actualizado',
                    text: `El bloque "${divisionName}" ha sido actualizado exitosamente.`,
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                // Crear nueva división
                const divisionData = {
                    name: divisionName.trim(),
                    icon: divisionIcon,
                    moduleId: activeModuleId,
                    types: [], // Array vacío, los documentos se asociarán directamente con la división
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                };

                await addDoc(collection(firestore, 'custom-divisions'), divisionData);

                Swal.fire({
                    icon: 'success',
                    title: 'Bloque creado',
                    text: `El bloque "${divisionName}" ha sido creado exitosamente.`,
                    timer: 2000,
                    showConfirmButton: false
                });
            }

            onClose();
        } catch (err: any) {
            console.error(`Error ${isEditMode ? 'updating' : 'creating'} division:`, err);
            setError(`No se pudo ${isEditMode ? 'actualizar' : 'crear'} el bloque. ` + (err.message || ''));
        } finally {
            setIsSubmitting(false);
        }
    };

    const commonIcons = ['📋', '📊', '📁', '📂', '📈', '🔧', '⚙️', '🎯', '💼', '🗂️', '📌', '🔔', '⭐', '🌟', '💡', '🎓', '📚', '📝'];

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-5 border-b bg-gray-50 rounded-t-2xl">
                    <h3 className="text-lg font-semibold text-gray-800">{isEditMode ? 'Editar Bloque/División' : 'Crear Bloque/División'}</h3>
                    <button onClick={onClose} className="w-9 h-9 rounded-full bg-red-500 text-white font-bold text-xl hover:bg-red-600 transition-colors">×</button>
                </header>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                            {error}
                        </div>
                    )}
                    <div>
                        <label htmlFor="divisionName" className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre del Bloque <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="divisionName"
                            value={divisionName}
                            onChange={(e) => setDivisionName(e.target.value)}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-green-500"
                            placeholder="Ej: Documentos Técnicos, Informes, etc."
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ícono del Bloque
                        </label>
                        <div className="grid grid-cols-9 gap-2">
                            {commonIcons.map((icon) => (
                                <button
                                    key={icon}
                                    type="button"
                                    onClick={() => setDivisionIcon(icon)}
                                    className={`w-10 h-10 flex items-center justify-center text-2xl rounded-lg transition-all ${
                                        divisionIcon === icon
                                            ? 'bg-green-500 scale-110 shadow-lg'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} />
                                    {isEditMode ? 'Actualizando...' : 'Creando...'}
                                </>
                            ) : (
                                <>
                                    {isEditMode ? <Edit size={16} /> : <Plus size={16} />}
                                    {isEditMode ? 'Actualizar Bloque' : 'Crear Bloque'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Modal para agregar nuevos módulos personalizados
const ModuleModal = ({ onClose, firestore }) => {
    const [moduleName, setModuleName] = useState('');
    const [moduleIcon, setModuleIcon] = useState('📁');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!moduleName.trim()) {
            setError('El nombre del módulo es requerido.');
            return;
        }

        if (!firestore) {
            setError('Error de conexión con la base de datos.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // Sanitize module name for use as folder name (remove accents, special chars, convert to lowercase)
            const folderId = moduleName.trim()
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-');

            const moduleData = {
                name: moduleName.trim(),
                icon: moduleIcon,
                folderId: folderId, // Store the sanitized name for GCS folder
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            // Create module in Firestore
            await addDoc(collection(firestore, 'custom-modules'), moduleData);

            // Create corresponding role in Firestore
            try {
                const roleName = folderId.toUpperCase();
                const roleDescription = `Acceso al módulo de ${moduleName}`;

                await addDoc(collection(firestore, 'roles'), {
                    name: roleName,
                    description: roleDescription,
                    isCustom: true,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
                console.log(`Created role: ${roleName}`);
            } catch (roleErr) {
                console.error('Error creating role:', roleErr);
                // Don't fail the entire operation if role creation fails
            }

            // Create folder in GCS immediately
            try {
                await fetch('/api/storage/create-folder', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        folderName: folderId
                    })
                });
                console.log(`Created folder in GCS: ${folderId}/`);
            } catch (folderErr) {
                console.error('Error creating folder in GCS:', folderErr);
                // Don't fail the entire operation if folder creation fails
            }

            Swal.fire({
                icon: 'success',
                title: 'Módulo creado',
                text: `El módulo "${moduleName}" ha sido creado exitosamente.`,
                timer: 2000,
                showConfirmButton: false
            });

            onClose();
        } catch (err: any) {
            console.error('Error creating module:', err);
            setError('No se pudo crear el módulo. ' + (err.message || ''));
        } finally {
            setIsSubmitting(false);
        }
    };

    const commonIcons = ['📁', '📂', '📊', '📈', '🔧', '⚙️', '🎯', '💼', '📋', '🗂️', '📌', '🔔', '⭐', '🌟', '💡', '🎓', '📚', '📝'];

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-5 border-b bg-gray-50 rounded-t-2xl">
                    <h3 className="text-lg font-semibold text-gray-800">Agregar Nuevo Módulo</h3>
                    <button onClick={onClose} className="w-9 h-9 rounded-full bg-red-500 text-white font-bold text-xl hover:bg-red-600 transition-colors">×</button>
                </header>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <p className="text-red-600 bg-red-100 p-3 rounded-md text-sm">{error}</p>}

                    <div>
                        <label htmlFor="moduleName" className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre del Módulo <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="moduleName"
                            value={moduleName}
                            onChange={(e) => setModuleName(e.target.value)}
                            required
                            className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-[#004272]"
                            placeholder="Ej: Control de Calidad"
                            maxLength={50}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Icono del Módulo
                        </label>
                        <div className="grid grid-cols-9 gap-2">
                            {commonIcons.map(icon => (
                                <button
                                    key={icon}
                                    type="button"
                                    onClick={() => setModuleIcon(icon)}
                                    className={`w-10 h-10 text-2xl flex items-center justify-center rounded-lg border-2 transition-all hover:scale-110 ${
                                        moduleIcon === icon
                                            ? 'border-[#004272] bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Selecciona un icono para tu módulo</p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-2 px-4 bg-[#004272] text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} />
                                    Creando...
                                </>
                            ) : (
                                <>
                                    <Plus size={16} />
                                    Crear Módulo
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
