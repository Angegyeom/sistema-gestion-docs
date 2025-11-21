// This component is a work in progress.
// You can make changes to this file and see them live.
// Feedback is welcome!

"use client";

import { useState } from "react";
import AppHeader from "@/components/layout/app-header";

const systems = [
  { id: 'segmentacion', icon: '🗺️', title: 'SEGMENTACIÓN', description: 'Sistema para la división territorial y definición de rutas de empadronamiento', status: 'Activo', url: 'https://multiproyectos.inei.gob.pe/cpv2025-segmentacion/home', credentials: { user: 'admin_seg', password: 'Seg2025!' } },
  { id: 'reclutamiento', icon: '👥', title: 'RECLUTAMIENTO', description: 'Gestión de convocatoria y selección del personal censal', status: 'Activo', url: '#', credentials: { user: 'reclut_admin', password: 'Reclut2025!' } },
  { id: 'capacitacion', icon: '🎓', title: 'CAPACITACIÓN', description: 'Plataforma de formación y capacitación del personal operativo', status: 'Activo', url: 'https://monitoreo.censos2025.com.pe/public/modulo-gerencial/capacitacion/censos-nacionales/informe-progreso?menu_id_est=374' },
  { id: 'logistica', icon: '📦', title: 'LOGÍSTICA', description: 'Control de materiales, equipos y distribución logística del operativo', status: 'Activo', url: 'https://campo.censos2025.com.pe/dashboard/menu_modulos', credentials: { user: 'log_admin', password: 'Log2025!' } },
  { id: 'capdatos-apk', icon: '📱', title: 'CAPTURA DATOS APK', description: 'Aplicación móvil para captura de datos en campo', status: 'Activo', url: 'https://www.censos2025.com.pe/', credentials: { user: 'apk_admin', password: 'Apk2025!' } },
  { id: 'censo-linea', icon: '💻', title: 'CENSO EN LÍNEA', description: 'Plataforma web para empadronamiento en línea', status: 'Activo', url: 'https://www.censos2025.com.pe/', credentials: { user: 'online_admin', password: 'Online2025!' } },
  { id: 'consistencia', icon: '⚙️', title: 'CONSISTENCIA', description: 'Validación, consistencia y procesamiento de la información recolectada', status: 'Activo', url: 'https://development2.inei.gob.pe/autenticacion/dashboard', credentials: { user: 'cons_admin', password: 'Cons2025!' } },
  { id: 'monitoreo', icon: '📊', title: 'MONITOREO', description: 'Sistema de monitoreo y seguimiento del operativo censal', status: 'Activo', url: '#', credentials: { user: 'monit_admin', password: 'Monit2025!' } },
  { id: 'yanapaq', icon: '🤝', title: 'YANAPAQ', description: 'Sistema de apoyo y asistencia para el operativo censal', status: 'Activo', url: '#', credentials: { user: 'yan_admin', password: 'Yan2025!' } },
];

const SystemCard = ({ icon, title, description, status, onClick, id }) => {
    const borderColorClass = {
        segmentacion: 'border-purple-500',
        reclutamiento: 'border-pink-500',
        capacitacion: 'border-green-500',
        logistica: 'border-cyan-500',
        'capdatos-apk': 'border-blue-500',
        'censo-linea': 'border-indigo-500',
        consistencia: 'border-gray-500',
        monitoreo: 'border-orange-500',
        yanapaq: 'border-yellow-500'
    }[id];

    const iconBgClass = {
        segmentacion: 'bg-purple-500',
        reclutamiento: 'bg-pink-500',
        capacitacion: 'bg-green-500',
        logistica: 'bg-cyan-500',
        'capdatos-apk': 'bg-blue-500',
        'censo-linea': 'bg-indigo-500',
        consistencia: 'bg-gray-500',
        monitoreo: 'bg-orange-500',
        yanapaq: 'bg-yellow-500'
    }[id];

  return (
    <div
      className={`bg-white rounded-xl p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-l-4 ${borderColorClass} cursor-pointer relative overflow-hidden`}
      onClick={onClick}
    >
      <div className={`w-14 h-14 rounded-lg flex items-center justify-center mb-4 text-2xl text-white ${iconBgClass}`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4 h-16">{description}</p>
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className={`py-1 px-3 rounded-full text-xs font-medium ${status === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {status}
        </span>
        <button className="bg-[#004272] text-white py-2 px-4 rounded-full text-sm font-semibold transition-transform hover:scale-105">
          Acceder
        </button>
      </div>
    </div>
  );
};

export default function AplicativosPage() {
    const [showUnavailableModal, setShowUnavailableModal] = useState(false);

    const handleSystemClick = (system) => {
        if (system.url && system.url !== '#') {
            // Abrir directamente en nueva ventana
            window.open(system.url, '_blank');
        } else {
            // Mostrar modal de sistema no disponible
            setShowUnavailableModal(true);
        }
    };
  
    return (
    <>
      <AppHeader />
      <div className="max-w-7xl mx-auto p-5 md:p-8">
        <div className="text-center text-white mb-10">
          <h1 className="text-4xl font-bold mb-2 text-shadow-lg">APLICATIVOS DEL SISTEMA CENSAL</h1>
          <p className="text-lg opacity-90">Centro de Población y Vivienda - CPV 2025</p>
        </div>
        <div className="bg-white/95 rounded-2xl p-7 shadow-lg backdrop-blur-md">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {systems.map(system => (
              <SystemCard key={system.id} {...system} onClick={() => handleSystemClick(system)} />
            ))}
          </div>
        </div>
      </div>
      {showUnavailableModal && (
        <UnavailableModal onClose={() => setShowUnavailableModal(false)} />
      )}
    </>
  );
}

const UnavailableModal = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">⚠️</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Sistema No Disponible</h3>
          <p className="text-gray-600 mb-6">
            Este sistema se encuentra temporalmente no disponible. Por favor, intente más tarde.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-[#004272] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#003561] transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};