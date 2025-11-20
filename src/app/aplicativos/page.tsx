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
    const [modalSystem, setModalSystem] = useState(null);

    const handleSystemClick = (system) => {
        if (system.url && system.url !== '#') {
            setModalSystem(system);
        } else {
            alert('Sistema no disponible temporalmente');
        }
    };
    
    const closeModal = () => {
        setModalSystem(null);
    }
  
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
      {modalSystem && <SystemModal system={modalSystem} onClose={closeModal} />}
    </>
  );
}

const SystemModal = ({ system, onClose }) => {
    const [showCredentials, setShowCredentials] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        alert('Copiado al portapapeles');
    };

    const openInNewTab = () => {
        window.open(system.url, '_blank');
    };
    
    const refreshIframe = () => {
        const iframe = document.getElementById('system-iframe') as HTMLIFrameElement;
        if(iframe) iframe.src = system.url;
    }

    const toggleFullscreen = () => {
        const modal = document.getElementById('modal-content');
        if (modal) {
            if (!document.fullscreenElement) {
                modal.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        }
    }
    
    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-5" onClick={onClose}>
            <div id="modal-content" className="bg-white rounded-xl w-full h-full max-w-7xl flex flex-col overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                <header className="bg-[#004272] text-white p-4 flex justify-between items-center rounded-t-xl">
                    <h3 className="font-semibold text-lg">{system.title}</h3>
                    <div className="flex items-center gap-2">
                        {system.credentials && <button onClick={() => setShowCredentials(!showCredentials)} className="bg-white/20 hover:bg-white/30 p-2 rounded-md transition-colors" title="Credenciales">🔑</button>}
                        <button onClick={toggleFullscreen} className="bg-white/20 hover:bg-white/30 p-2 rounded-md transition-colors" title="Pantalla completa">⛶</button>
                        <button onClick={refreshIframe} className="bg-white/20 hover:bg-white/30 p-2 rounded-md transition-colors" title="Recargar">🔄</button>
                        <button onClick={openInNewTab} className="bg-white/20 hover:bg-white/30 p-2 rounded-md transition-colors" title="Abrir en nueva pestaña">↗</button>
                        <button onClick={onClose} className="bg-red-500/80 hover:bg-red-500 p-2 rounded-md transition-colors" title="Cerrar">✕</button>
                    </div>
                </header>
                {showCredentials && system.credentials && (
                    <div className="bg-gray-100 p-4 border-b border-gray-200">
                        <div className="flex gap-8 items-center">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Usuario</label>
                                <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md p-2">
                                    <input type="text" value={system.credentials.user} readOnly className="bg-transparent outline-none font-mono text-sm" />
                                    <button onClick={() => handleCopy(system.credentials.user)} className="text-gray-500 hover:text-gray-800">📋</button>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Contraseña</label>
                                <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md p-2">
                                    <input type={passwordVisible ? "text" : "password"} value={system.credentials.password} readOnly className="bg-transparent outline-none font-mono text-sm" />
                                    <button onClick={() => setPasswordVisible(!passwordVisible)} className="text-gray-500 hover:text-gray-800">{passwordVisible ? '🙈' : '👁️'}</button>
                                    <button onClick={() => handleCopy(system.credentials.password)} className="text-gray-500 hover:text-gray-800">📋</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex-1 bg-gray-200">
                    <iframe id="system-iframe" src={system.url} className="w-full h-full border-0" />
                </div>
            </div>
        </div>
    );
};
