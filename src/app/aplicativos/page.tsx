// This component is a work in progress.
// You can make changes to this file and see them live.
// Feedback is welcome!

"use client";

import { useState } from "react";
import AppHeader from "@/components/layout/app-header";

const systems = {
  preparacion: [
    { id: 'segmentacion', icon: '🗺️', title: 'SEGMENTACIÓN Y RUTEO', description: 'Sistema para la división territorial y definición de rutas de empadronamiento', status: 'Activo', url: 'https://multiproyectos.inei.gob.pe/cpv2025-segmentacion/home', credentials: { user: 'admin_seg', password: 'Seg2025!' } },
    { id: 'rrhh', icon: '👥', title: 'CONSECUCIÓN DE RRHH', description: 'Gestión de recursos humanos, selección y asignación de personal censal', status: 'Activo', url: 'https://unete.censos2025.com.pe/public/' },
    { id: 'logistica', icon: '📦', title: 'LOGÍSTICA CENSAL', description: 'Control de materiales, equipos y distribución logística del operativo', status: 'Activo', url: 'https://campo.censos2025.com.pe/dashboard/menu_modulos', credentials: { user: 'log_admin', password: 'Log2025!' } },
    { id: 'capacitacion', icon: '🎓', title: 'CAPACITACIÓN', description: 'Plataforma de formación y capacitación del personal operativo', status: 'Activo', url: 'https://monitoreo.censos2025.com.pe/public/modulo-gerencial/capacitacion/censos-nacionales/informe-progreso?menu_id_est=374' },
  ],
  ejecucion: [
    { id: 'operacion', icon: '📱', title: 'OPERACIÓN DE CAMPO', description: 'Captura de datos - APK móvil y censo en línea para empadronamiento', status: 'Activo', url: 'https://www.censos2025.com.pe/', credentials: { user: 'op_campo', password: 'Campo2025!' } },
    { id: 'procesamiento', icon: '⚙️', title: 'PROCESAMIENTO DE DATOS', description: 'Validación, consistencia y procesamiento de la información recolectada', status: 'Activo', url: 'https://development2.inei.gob.pe/autenticacion/dashboard', credentials: { user: 'proc_admin', password: 'Proc2025!' } },
  ],
  postcenso: [
    { id: 'encuesta', icon: '📊', title: 'ENCUESTA POST CENSAL', description: 'Aplicativo móvil para la evaluación de cobertura y calidad censal', status: 'En Desarrollo', url: '#', credentials: { user: 'enc_admin', password: 'Enc2025!' } },
  ]
};

const Phase = ({ title, number, systems, onSystemClick, color }) => (
  <div className="bg-white/95 rounded-2xl p-7 shadow-lg backdrop-blur-md">
    <div className={`flex items-center mb-6 pb-4 border-b-4`} style={{borderColor: color}}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mr-5`} style={{backgroundColor: color}}>
        {number}
      </div>
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-5">
      {systems.map(system => (
        <SystemCard key={system.id} {...system} onClick={() => onSystemClick(system)} />
      ))}
    </div>
  </div>
);

const SystemCard = ({ icon, title, description, status, onClick, id }) => {
    const borderColorClass = {
        segmentacion: 'border-purple-500',
        rrhh: 'border-indigo-500',
        logistica: 'border-cyan-500',
        capacitacion: 'border-green-500',
        operacion: 'border-blue-500',
        procesamiento: 'border-gray-500',
        encuesta: 'border-orange-500'
    }[id];

    const iconBgClass = {
        segmentacion: 'bg-purple-500',
        rrhh: 'bg-indigo-500',
        logistica: 'bg-cyan-500',
        capacitacion: 'bg-green-500',
        operacion: 'bg-blue-500',
        procesamiento: 'bg-gray-500',
        encuesta: 'bg-orange-500'
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
        <button className="bg-gradient-to-r from-[#7AADCF] to-[#4A7BA7] text-white py-2 px-4 rounded-full text-sm font-semibold transition-transform hover:scale-105">
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
        <div className="space-y-10">
          <Phase title="ETAPA DE PREPARACIÓN" number="1" systems={systems.preparacion} onSystemClick={handleSystemClick} color="#4CAF50" />
          <Phase title="ETAPA DE EJECUCIÓN" number="2" systems={systems.ejecucion} onSystemClick={handleSystemClick} color="#2196F3" />
          <Phase title="ETAPA POST-CENSO" number="3" systems={systems.postcenso} onSystemClick={handleSystemClick} color="#FF9800" />
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
                <header className="bg-gradient-to-r from-[#7AADCF] to-[#4A7BA7] text-white p-4 flex justify-between items-center rounded-t-xl">
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
