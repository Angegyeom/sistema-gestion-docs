// This component is a work in progress.
// You can make changes to this file and see them live.
// Feedback is welcome!

"use client";

import React, { useState, useEffect } from 'react';
import AppHeader from "@/components/layout/app-header";

const systems = {
    principales: [
        { id: 'segmentacion', name: 'SEGMENTACIÓN Y RUTEO', icon: '🗺️', url: 'https://multiproyectos.inei.gob.pe/cpv2025-segmentacion/home', credentials: { user: 'admin_seg', password: 'Seg2025!' } },
        { id: 'rrhh', name: 'CONSECUCIÓN DE RRHH', icon: '👥', url: 'https://unete.censos2025.com.pe/public/' },
        { id: 'capacitacion', name: 'CAPACITACIÓN', icon: '🎓', url: 'https://monitoreo.censos2025.com.pe/public/modulo-gerencial/capacitacion/censos-nacionales/informe-progreso?menu_id_est=374' },
        { id: 'logistica', name: 'LOGÍSTICA CENSAL', icon: '📦', url: 'https://campo.censos2025.com.pe/dashboard/menu_modulos', credentials: { user: 'log_admin', password: 'Log2025!' } },
        { id: 'operacion', name: 'OPERACIÓN DE CAMPO', icon: '📱', url: 'https://www.censos2025.com.pe/', credentials: { user: 'op_campo', password: 'Campo2025!' } },
        { id: 'procesamiento', name: 'PROCESAMIENTO DE DATOS', icon: '⚙️', url: 'https://development2.inei.gob.pe/autenticacion/dashboard', credentials: { user: 'proc_admin', password: 'Proc2025!' } },
        { id: 'resultados', name: 'PUBLICACIÓN Y RESULTADOS', icon: '📊', url: 'https://www.censos2025.pe/', credentials: { user: 'pub_admin', password: 'Pub2025!' } },
        { id: 'encuesta', name: 'ENCUESTA POST CENSAL', icon: '📋', url: '#', credentials: { user: 'enc_admin', password: 'Enc2025!' } },
    ],
};

const homeSystems = [
    { id: 'segmentacion', title: 'SEGMENTACIÓN Y RUTEO', description: 'División territorial y definición de rutas de empadronamiento.', icon: '🗺️', url: 'https://multiproyectos.inei.gob.pe/cpv2025-segmentacion/home', credentials: { user: 'admin_seg', password: 'Seg2025!' } },
    { id: 'informe-progreso', title: 'INFORME DE PROGRESO', description: 'Reportes estadísticos del avance general del operativo.', icon: '📈', url: 'reportes/progreso.html' },
    { id: 'seguimiento-avance', title: 'SEGUIMIENTO DE AVANCE', description: 'Monitoreo detallado del progreso por departamento y proceso.', icon: '📊', url: 'reportes/avance.html' },
    { id: 'reclutamiento', title: 'CONSECUCIÓN DE RRHH', description: 'Gestión de recursos humanos y selección de personal.', icon: '👥', url: 'https://unete.censos2025.com.pe/public/' },
    { id: 'capacitacion', title: 'CAPACITACIÓN', description: 'Plataforma de formación y entrenamiento del personal.', icon: '🎓', url: 'https://monitoreo.censos2025.com.pe/public/modulo-gerencial/capacitacion/censos-nacionales/informe-progreso?menu_id_est=374' },
    { id: 'seguimiento-calidad', title: 'SEGUIMIENTO DE CALIDAD', description: 'Indicadores de calidad y control del proceso censal.', icon: '✅', url: 'reportes/calidad.html' },
];

export default function MonitoreoPage() {
    const [activeSystem, setActiveSystem] = useState(null);
    const [sidebarExpanded, setSidebarExpanded] = useState(false);

    const loadSystem = (system) => {
        if (!system.url || system.url === '#') {
            alert(`El sistema "${system.name || system.title}" está en desarrollo y no está disponible aún.`);
            return;
        }
        setActiveSystem(system);
    };

    const showHome = () => {
        setActiveSystem(null);
        setSidebarExpanded(false);
    };
    
    const toggleSidebar = (expand) => {
        setSidebarExpanded(expand)
    }

    return (
        <div className="min-h-screen">
            <AppHeader />
            <div className="flex pt-[88px]">
              <Sidebar onSystemSelect={loadSystem} activeSystem={activeSystem} isExpanded={sidebarExpanded} setExpanded={setSidebarExpanded} />
              <MainContent activeSystem={activeSystem} showHome={showHome} sidebarExpanded={sidebarExpanded} toggleSidebar={toggleSidebar} />
            </div>
        </div>
    );
}

const Sidebar = ({ onSystemSelect, activeSystem, isExpanded, setExpanded }) => (
    <nav className={`fixed left-0 top-[88px] h-[calc(100vh-88px)] bg-[#1565C0] text-white overflow-y-auto z-20 transition-all duration-300 ${isExpanded ? 'w-96' : 'w-72'}`}>
        <div className="p-5 text-center border-b border-white/10">
            <div className="text-lg font-bold">📊 CENSOS 2025</div>
        </div>
        <div className="py-5">
            <div className="mb-4">
                <div className="px-6 py-2 text-xs font-semibold uppercase text-white/70">Sistemas Principales</div>
                {systems.principales.map(sys => (
                    <a key={sys.id} onClick={() => onSystemSelect(sys)} className={`flex items-center gap-3 px-6 py-3 text-sm cursor-pointer border-l-4 transition-colors ${activeSystem?.id === sys.id ? 'bg-white/10 border-white' : 'border-transparent hover:bg-white/10'}`}>
                        <span className="w-5 text-center text-base">{sys.icon}</span>
                        <span>{sys.name}</span>
                    </a>
                ))}
            </div>
        </div>
        {activeSystem?.credentials && isExpanded && <CredentialsPanel credentials={activeSystem.credentials} />}
    </nav>
);

const MainContent = ({ activeSystem, showHome, sidebarExpanded, toggleSidebar }) => {
    if (!activeSystem) {
        return (
            <main className={`ml-72 transition-all duration-300 p-6 w-full`}>
                <div className="bg-white p-8 rounded-lg mb-6 shadow-sm text-center">
                    <h1 className="text-3xl font-bold text-[#0D47A1] mb-2">🏛️ Sistemas en apoyo de los censos 2025</h1>
                    <p className="text-gray-600 text-lg">Selecciona un sistema o reporte para acceder</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {homeSystems.map(sys => <SystemHomeCard key={sys.id} {...sys} />)}
                </div>
            </main>
        );
    }

    return (
        <main className={`transition-all duration-300 h-[calc(100vh-88px)] w-full ${sidebarExpanded ? 'ml-96' : 'ml-72'}`}>
            <div className="h-full w-full relative">
                <IframeView system={activeSystem} showHome={showHome} toggleSidebar={toggleSidebar} />
            </div>
        </main>
    );
};

const SystemHomeCard = ({ id, icon, title, description }) => (
    <div className={`bg-white p-6 rounded-lg shadow-sm border-l-4 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg border-blue-500`}>
         <div className="flex items-center gap-4 mb-4">
            <span className="text-2xl">{icon}</span>
            <h2 className="text-lg font-bold text-[#0D47A1]">{title}</h2>
        </div>
        <p className="text-gray-600 text-sm">{description}</p>
    </div>
);


const IframeView = ({ system, showHome, toggleSidebar }) => {
    const [showCredentials, setShowCredentials] = useState(false);

    useEffect(() => {
        // Automatically expand sidebar if there are credentials
        if (system.credentials) {
            toggleSidebar(true);
        } else {
            toggleSidebar(false);
        }
    }, [system, toggleSidebar]);

    return (
        <div className="h-full flex flex-col">
            <header className="bg-white p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-bold text-[#0D47A1]">{system.title || system.name}</h2>
                <div className="flex items-center gap-2">
                    {system.credentials && <button onClick={() => setShowCredentials(!showCredentials)} className="bg-[#1976D2] hover:bg-[#0D47A1] text-white text-sm py-1.5 px-3 rounded">🔑 Credenciales</button>}
                    <button onClick={() => window.open(system.url, '_blank')} className="bg-[#1976D2] hover:bg-[#0D47A1] text-white text-sm py-1.5 px-3 rounded">🔗 Nueva Ventana</button>
                    <button onClick={showHome} className="bg-red-500 hover:bg-red-600 text-white text-sm py-1.5 px-3 rounded">❌ Cerrar</button>
                </div>
            </header>
            <div className="flex-1">
                 {system.id === 'capacitacion' ? (
                     <div className="w-full h-full bg-no-repeat bg-contain bg-center cursor-pointer" style={{backgroundImage: "url('/images/Sistemas/capacitacion.png')"}} onClick={() => window.open(system.url, '_blank')}>
                         <div className="w-full h-full bg-[#004272]/90 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                             <div className="text-white text-center">
                                 <div className="text-4xl mb-2">🖱️</div>
                                 <div className="font-bold">Haz clic para abrir el sistema</div>
                             </div>
                         </div>
                     </div>
                 ) : (
                    <iframe src={system.url} className="w-full h-full border-none bg-white" title={system.title || system.name} />
                 )}
            </div>
        </div>
    );
};

const CredentialsPanel = ({ credentials }) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const handleCopy = (text, type) => {
        navigator.clipboard.writeText(text);
        alert(`${type} copiado al portapapeles!`);
    };

    return (
        <div className="absolute bottom-5 left-5 right-5 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <div className="font-bold text-sm mb-3 flex items-center gap-2">🔑 Credenciales de Acceso</div>
            <div className="space-y-3">
                <div>
                    <label className="text-xs text-white/80 uppercase font-semibold">Usuario</label>
                    <div className="flex items-center bg-white/90 rounded p-2">
                        <input type="text" value={credentials.user} readOnly className="font-mono text-sm text-gray-800 bg-transparent outline-none flex-1" />
                        <button onClick={() => handleCopy(credentials.user, 'Usuario')} className="text-xs p-1 rounded hover:bg-gray-200">📋</button>
                    </div>
                </div>
                 <div>
                    <label className="text-xs text-white/80 uppercase font-semibold">Contraseña</label>
                    <div className="flex items-center bg-white/90 rounded p-2">
                        <input type={passwordVisible ? 'text' : 'password'} value={credentials.password} readOnly className="font-mono text-sm text-gray-800 bg-transparent outline-none flex-1" />
                         <button onClick={() => setPasswordVisible(!passwordVisible)} className="text-xs p-1 rounded hover:bg-gray-200">{passwordVisible ? '🙈' : '👁️'}</button>
                        <button onClick={() => handleCopy(credentials.password, 'Contraseña')} className="text-xs p-1 rounded hover:bg-gray-200">📋</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
