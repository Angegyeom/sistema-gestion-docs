"use client";

import React, { useState, useEffect } from 'react';
import AppHeader from "@/components/layout/app-header";
import { useFirestore, useCollection, useMemoFirebase, useAuth } from "@/firebase";
import { collection, updateDoc, doc, serverTimestamp, addDoc, deleteDoc, deleteField } from "firebase/firestore";
import { Loader2, Shield, Edit, UserX, UserCheck, Trash2, CheckCircle2, AlertCircle, XCircle, BarChart3, Search } from 'lucide-react';
import Swal from 'sweetalert2';
import { usePermissions } from '@/hooks/use-permissions';
import { useRouter } from 'next/navigation';

export default function AdministradorPage() {
    const firestore = useFirestore();
    const auth = useAuth();
    const router = useRouter();
    const { isAdmin, isUserLoading, isUserDataLoading, userData } = usePermissions();
    const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'report'>('users');
    const [showUserModal, setShowUserModal] = useState(false);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [editingRole, setEditingRole] = useState<any>(null);

    // Obtener usuarios, roles y documentos desde Firebase
    const usersRef = useMemoFirebase(() => firestore ? collection(firestore, 'users') : null, [firestore]);
    const rolesRef = useMemoFirebase(() => firestore ? collection(firestore, 'roles') : null, [firestore]);
    const docsRef = useMemoFirebase(() => firestore ? collection(firestore, 'documentos') : null, [firestore]);

    const { data: users, isLoading: isLoadingUsers } = useCollection(usersRef);
    const { data: roles, isLoading: isLoadingRoles } = useCollection(rolesRef);
    const { data: documents, isLoading: isLoadingDocs } = useCollection(docsRef);

    // Seed y actualización de roles
    useEffect(() => {
        const seedAndUpdateRoles = async () => {
            if (!firestore || !roles || isLoadingRoles) return;

            const initialRoles = [
                { name: 'ADMIN', description: 'Administrador del sistema con acceso completo' },
                { name: 'SEGMENTACION', description: 'Acceso al módulo de Segmentación y Ruteo' },
                { name: 'RECLUTAMIENTO', description: 'Acceso al módulo de Reclutamiento de personal' },
                { name: 'CAPACITACION', description: 'Acceso al módulo de Capacitación' },
                { name: 'LOGISTICA', description: 'Acceso al módulo de Logística' },
                { name: 'CAPDATOS-APK', description: 'Acceso al módulo de Captura de Datos APK' },
                { name: 'CENSO-LINEA', description: 'Acceso al módulo de Censo en Línea' },
                { name: 'CONSISTENCIA', description: 'Acceso al módulo de Consistencia de Datos' },
                { name: 'MONITOREO', description: 'Acceso al módulo de Monitoreo y Supervisión' },
                { name: 'YANAPAQ', description: 'Acceso al módulo Yanapaq' },
            ];

            // Roles obsoletos que deben eliminarse
            const obsoleteRoles = ['RRHH', 'OPERACION', 'PROCESAMIENTO', 'POSTCENSAL', 'GENERALES'];

            try {
                // Obtener roles existentes
                const existingRoleNames = roles.map(r => r.name?.toUpperCase());

                // 1. Eliminar roles obsoletos
                for (const role of roles) {
                    if (obsoleteRoles.includes(role.name?.toUpperCase())) {
                        await deleteDoc(doc(firestore, 'roles', role.id));
                        console.log(`🗑️ Rol obsoleto eliminado: ${role.name}`);
                    }
                }

                // 2. Agregar roles faltantes
                for (const role of initialRoles) {
                    if (!existingRoleNames.includes(role.name.toUpperCase())) {
                        await addDoc(collection(firestore, 'roles'), {
                            ...role,
                            createdAt: serverTimestamp(),
                            updatedAt: serverTimestamp()
                        });
                        console.log(`✅ Rol creado: ${role.name}`);
                    }
                }
            } catch (error) {
                console.error("Error actualizando roles:", error);
            }
        };

        seedAndUpdateRoles();
    }, [firestore, roles, isLoadingRoles]);

    // Proteger la página - solo accesible para admin
    useEffect(() => {
        // Esperar a que termine de cargar los datos del usuario desde Firestore
        if (isUserDataLoading) {
            return;
        }

        // Si no hay userData, esperar otro ciclo (puede estar cargando)
        if (!userData) {
            return;
        }

        // Verificar el rol directamente desde userData para evitar race conditions
        // Soportar tanto el campo legacy 'role' como el nuevo array 'roles'
        const userRole = userData.role?.toUpperCase();
        const userRoles = Array.isArray(userData.roles) ? userData.roles.map(r => r.toUpperCase()) : [];
        const hasAdminAccess = userRole === 'ADMIN' || userRoles.includes('ADMIN');

        // Solo denegar acceso si definitivamente NO es admin
        if (!hasAdminAccess) {
            Swal.fire({
                icon: 'error',
                title: 'Acceso Denegado',
                text: 'No tienes permisos para acceder a esta sección.',
                confirmButtonColor: '#004272'
            });
            router.push('/documentacion');
        }
    }, [isUserDataLoading, userData, router]);

    // Mostrar pantalla de carga mientras se verifica el acceso
    if (isUserDataLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center text-white">
                    <Loader2 className="animate-spin inline-block mb-4" size={48} />
                    <p className="text-lg">Verificando permisos...</p>
                </div>
            </div>
        );
    }

    // Verificar el rol directamente desde userData
    // Soportar tanto el campo legacy 'role' como el nuevo array 'roles'
    const userRole = userData?.role?.toUpperCase();
    const userRoles = Array.isArray(userData?.roles) ? userData.roles.map(r => r.toUpperCase()) : [];
    const hasAdminAccess = userRole === 'ADMIN' || userRoles.includes('ADMIN');

    // Si no es admin, no mostrar nada (el useEffect redirigirá)
    if (!userData || !hasAdminAccess) {
        return null;
    }

    return (
        <>
            <AppHeader />
            <div className="max-w-7xl mx-auto p-3 sm:p-5 md:p-10">
                <div className="text-center text-white mb-6 md:mb-10">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">PANEL DE ADMINISTRACIÓN</h1>
                    <p className="text-sm sm:text-base md:text-lg opacity-90">Gestión de usuarios y roles del sistema</p>
                </div>

                {/* Tabs */}
                <div className="bg-white/95 rounded-2xl shadow-lg mb-6 md:mb-8">
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`flex-1 py-4 px-4 md:px-6 text-sm md:text-lg font-semibold transition-colors ${
                                activeTab === 'users'
                                    ? 'text-[#4A7BA7] border-b-4 border-[#4A7BA7]'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <UserCheck size={20} />
                                <span className="hidden sm:inline">Gestión de Usuarios</span>
                                <span className="sm:hidden">Usuarios</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('roles')}
                            className={`flex-1 py-4 px-4 md:px-6 text-sm md:text-lg font-semibold transition-colors ${
                                activeTab === 'roles'
                                    ? 'text-[#4A7BA7] border-b-4 border-[#4A7BA7]'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Shield size={20} />
                                <span className="hidden sm:inline">Gestión de Roles</span>
                                <span className="sm:hidden">Roles</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('report')}
                            className={`flex-1 py-4 px-4 md:px-6 text-sm md:text-lg font-semibold transition-colors ${
                                activeTab === 'report'
                                    ? 'text-[#4A7BA7] border-b-4 border-[#4A7BA7]'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                📊
                                <span className="hidden sm:inline">Reporte General</span>
                                <span className="sm:hidden">Reporte</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Contenido de tabs */}
                {activeTab === 'users' ? (
                    <UsersSection
                        users={users || []}
                        isLoading={isLoadingUsers}
                        onEditUser={(user) => {
                            setEditingUser(user);
                            setShowUserModal(true);
                        }}
                        firestore={firestore}
                    />
                ) : activeTab === 'roles' ? (
                    <RolesSection
                        roles={roles || []}
                        isLoading={isLoadingRoles}
                        onEditRole={(role) => {
                            setEditingRole(role);
                            setShowRoleModal(true);
                        }}
                        firestore={firestore}
                    />
                ) : (
                    <ReportSection
                        documents={documents || []}
                        isLoading={isLoadingDocs}
                    />
                )}
            </div>

            {showUserModal && (
                <UserModal
                    user={editingUser}
                    roles={roles || []}
                    onClose={() => {
                        setShowUserModal(false);
                        setEditingUser(null);
                    }}
                    firestore={firestore}
                    auth={auth}
                    userData={userData}
                />
            )}

            {showRoleModal && (
                <RoleModal
                    role={editingRole}
                    onClose={() => {
                        setShowRoleModal(false);
                        setEditingRole(null);
                    }}
                    firestore={firestore}
                />
            )}
        </>
    );
}

// Componente de sección de usuarios
const UsersSection = ({ users, isLoading, onEditUser, firestore }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 10;

    // Filtrar usuarios por término de búsqueda
    const filteredUsers = users.filter(user => {
        const searchLower = searchTerm.toLowerCase();
        const emailMatch = user.email?.toLowerCase().includes(searchLower);
        const rolesMatch = user.roles?.some(role => role.toLowerCase().includes(searchLower));
        const roleMatch = user.role?.toLowerCase().includes(searchLower);
        return emailMatch || rolesMatch || roleMatch;
    });

    // Calcular índices de paginación
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUsers = filteredUsers.slice(startIndex, endIndex);

    // Reset a la primera página cuando cambian los usuarios o el término de búsqueda
    useEffect(() => {
        setCurrentPage(1);
    }, [users.length, searchTerm]);

    const handleToggleActive = async (user) => {
        // Prevenir desactivar al administrador principal
        if (user.email === 'admin@inei.gob.pe' && user.role?.toUpperCase() === 'ADMIN') {
            Swal.fire({
                icon: 'warning',
                title: 'Acción no permitida',
                text: 'No se puede desactivar al administrador principal del sistema.',
                confirmButtonColor: '#004272'
            });
            return;
        }

        const newStatus = !user.active;
        try {
            const userRef = doc(firestore, 'users', user.id);
            await updateDoc(userRef, {
                active: newStatus,
                updatedAt: serverTimestamp()
            });

            Swal.fire({
                icon: 'success',
                title: newStatus ? 'Usuario activado' : 'Usuario desactivado',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error actualizando estado del usuario:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el estado del usuario.',
                confirmButtonColor: '#004272'
            });
        }
    };

    const handleDeleteUser = async (user) => {
        // Prevenir eliminar al administrador principal
        const isMainAdmin = user.email === 'admin@inei.gob.pe' &&
            (user.roles?.map(r => r.toUpperCase()).includes('ADMIN') || user.role?.toUpperCase() === 'ADMIN');

        if (isMainAdmin) {
            Swal.fire({
                icon: 'warning',
                title: 'Acción no permitida',
                text: 'No se puede eliminar al administrador principal del sistema.',
                confirmButtonColor: '#004272'
            });
            return;
        }

        // Confirmación antes de eliminar
        const result = await Swal.fire({
            icon: 'warning',
            title: '¿Estás seguro?',
            html: `¿Deseas eliminar al usuario <strong>${user.email}</strong>?<br><br>Esta acción no se puede deshacer.`,
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        try {
            const response = await fetch('/api/auth/delete-user', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid: user.id
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al eliminar usuario');
            }

            Swal.fire({
                icon: 'success',
                title: 'Usuario eliminado',
                text: 'El usuario ha sido eliminado exitosamente.',
                timer: 3000,
                showConfirmButton: false
            });
        } catch (error: any) {
            console.error('Error eliminando usuario:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'No se pudo eliminar el usuario.',
                confirmButtonColor: '#004272'
            });
        }
    };


    return (
        <div className="bg-white/95 rounded-2xl p-4 md:p-7 shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Usuarios del Sistema</h2>
                <button
                    onClick={() => onEditUser(null)}
                    className="px-4 py-2 bg-[#004272] text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                >
                    <UserCheck size={18} />
                    <span className="hidden sm:inline">Crear Usuario</span>
                    <span className="sm:hidden">Crear</span>
                </button>
            </div>

            {/* Campo de búsqueda */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por email o rol..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-[#4A7BA7] transition-colors"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    )}
                </div>
                {searchTerm && (
                    <p className="text-sm text-gray-600 mt-2">
                        {filteredUsers.length} resultado{filteredUsers.length !== 1 ? 's' : ''} encontrado{filteredUsers.length !== 1 ? 's' : ''}
                    </p>
                )}
            </div>

            {isLoading ? (
                <div className="text-center p-10">
                    <Loader2 className="animate-spin inline-block mr-2" />
                    Cargando usuarios...
                </div>
            ) : users.length > 0 ? (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                    <th className="text-left p-3 text-sm md:text-base font-semibold text-gray-700">Email</th>
                                    <th className="text-left p-3 text-sm md:text-base font-semibold text-gray-700">Role</th>
                                    <th className="text-left p-3 text-sm md:text-base font-semibold text-gray-700">Estado</th>
                                    <th className="text-right p-3 text-sm md:text-base font-semibold text-gray-700">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map(user => (
                                <tr key={user.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 text-sm md:text-base">{user.email}</td>
                                    <td className="p-3">
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles && Array.isArray(user.roles) && user.roles.length > 0 ? (
                                                user.roles.map((r, idx) => (
                                                    <span key={idx} className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                                                        {r}
                                                    </span>
                                                ))
                                            ) : user.role ? (
                                                <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                                                    {user.role}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 text-xs">Sin roles</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        {user.active !== false ? (
                                            <span className="flex items-center gap-1 text-green-600 text-sm md:text-base">
                                                <UserCheck size={16} /> Activo
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-red-600 text-sm md:text-base">
                                                <UserX size={16} /> Inactivo
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-3 text-right">
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => onEditUser(user)}
                                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                title="Editar usuario"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            {user.email === 'admin@inei.gob.pe' && user.role?.toUpperCase() === 'ADMIN' ? (
                                                <button
                                                    disabled
                                                    className="p-2 rounded-lg text-gray-400 cursor-not-allowed opacity-50"
                                                    title="No se puede desactivar al administrador principal"
                                                >
                                                    <UserX size={18} />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleToggleActive(user)}
                                                    className={`p-2 rounded-lg transition-colors ${
                                                        user.active !== false
                                                            ? 'text-orange-600 hover:bg-orange-100'
                                                            : 'text-green-600 hover:bg-green-100'
                                                    }`}
                                                    title={user.active !== false ? 'Desactivar' : 'Activar'}
                                                >
                                                    {user.active !== false ? <UserX size={18} /> : <UserCheck size={18} />}
                                                </button>
                                            )}
                                            {user.email === 'admin@inei.gob.pe' && (user.roles?.map(r => r.toUpperCase()).includes('ADMIN') || user.role?.toUpperCase() === 'ADMIN') ? (
                                                <button
                                                    disabled
                                                    className="p-2 rounded-lg text-gray-400 cursor-not-allowed opacity-50"
                                                    title="No se puede eliminar al administrador principal"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleDeleteUser(user)}
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                    title="Eliminar usuario"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Controles de paginación */}
                {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                            Mostrando {startIndex + 1} - {Math.min(endIndex, filteredUsers.length)} de {filteredUsers.length} usuarios
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Anterior
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                            currentPage === page
                                                ? 'bg-[#004272] text-white'
                                                : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}
                </>
            ) : (
                <div className="text-center p-10 text-gray-500">
                    <p>No hay usuarios registrados.</p>
                </div>
            )}
        </div>
    );
};

// Componente de sección de roles
const RolesSection = ({ roles, isLoading, onEditRole, firestore }) => {

    return (
        <div className="bg-white/95 rounded-2xl p-4 md:p-7 shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Roles del Sistema</h2>
            </div>

            {isLoading ? (
                <div className="text-center p-10">
                    <Loader2 className="animate-spin inline-block mr-2" />
                    Cargando roles...
                </div>
            ) : roles.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {roles
                        .filter((r, index, self) =>
                            index === self.findIndex(t => t.name?.toUpperCase() === r.name?.toUpperCase())
                        )
                        .map(role => (
                        <div key={role.id} className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:shadow-md transition-all">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">{role.name}</h3>
                                    {role.description && (
                                        <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                                    )}
                                </div>
                                <Shield className="text-blue-500" size={24} />
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => onEditRole(role)}
                                    className="w-full flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition-colors"
                                >
                                    <Edit size={14} /> Editar
                                </button>
                            </div>
                        </div>
                    ))
                    }
                </div>
            ) : (
                <div className="text-center p-10 text-gray-500">
                    <p>No hay roles creados.</p>
                </div>
            )}
        </div>
    );
};

// Modal de usuario
const UserModal = ({ user, roles, onClose, firestore, auth, userData }) => {
    const isEditMode = Boolean(user);
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [showPasswordField, setShowPasswordField] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState<string[]>(
        user?.roles && Array.isArray(user.roles) ? user.roles : (user?.role ? [user.role] : [])
    );
    const [active, setActive] = useState(user?.active !== false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Verificar si es el administrador principal
    const isMainAdmin = user?.email === 'admin@inei.gob.pe' && (user?.role?.toUpperCase() === 'ADMIN' || user?.roles?.includes('ADMIN'));

    // Generar contraseña aleatoria
    const generatePassword = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$%&*';
        let newPassword = '';
        for (let i = 0; i < 12; i++) {
            newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setPassword(newPassword);
    };

    const toggleRole = (roleName: string) => {
        setSelectedRoles(prev => {
            if (prev.includes(roleName)) {
                return prev.filter(r => r !== roleName);
            } else {
                return [...prev, roleName];
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isEditMode && !email) {
            Swal.fire({
                icon: 'warning',
                title: 'Email requerido',
                text: 'Por favor ingrese un email.',
                confirmButtonColor: '#004272'
            });
            return;
        }

        if (!isEditMode && !password) {
            Swal.fire({
                icon: 'warning',
                title: 'Contraseña requerida',
                text: 'Por favor genere o ingrese una contraseña.',
                confirmButtonColor: '#004272'
            });
            return;
        }

        if (selectedRoles.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Roles requeridos',
                text: 'Por favor seleccione al menos un rol.',
                confirmButtonColor: '#004272'
            });
            return;
        }

        // Prevenir desactivar al administrador principal
        if (isMainAdmin && !active) {
            Swal.fire({
                icon: 'warning',
                title: 'Acción no permitida',
                text: 'No se puede desactivar al administrador principal del sistema.',
                confirmButtonColor: '#004272'
            });
            return;
        }

        setIsSubmitting(true);

        try {
            if (isEditMode) {
                // Actualizar usuario existente
                const userRef = doc(firestore, 'users', user.id);

                // Migrar de 'role' a 'roles' y actualizar
                await updateDoc(userRef, {
                    roles: selectedRoles,
                    role: deleteField(), // Eliminar completamente el campo antiguo 'role'
                    active,
                    updatedAt: serverTimestamp()
                });

                // Si se ingresó una nueva contraseña, actualizarla
                if (password && password.trim() !== '') {
                    const passwordResponse = await fetch('/api/auth/update-password', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            uid: user.id,
                            password: password
                        })
                    });

                    const passwordResult = await passwordResponse.json();

                    if (!passwordResponse.ok) {
                        throw new Error(passwordResult.error || 'Error al actualizar contraseña');
                    }

                    Swal.fire({
                        icon: 'success',
                        title: 'Usuario actualizado',
                        html: `<strong>Roles asignados:</strong><br>${selectedRoles.join(', ')}<br><br><strong>Nueva contraseña:</strong> ${password}<br><br><small>Guarde esta información, la contraseña no se mostrará nuevamente.</small>`,
                        confirmButtonColor: '#004272'
                    });
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: 'Usuario actualizado',
                        html: `<strong>Roles asignados:</strong><br>${selectedRoles.join(', ')}`,
                        timer: 3000,
                        showConfirmButton: false
                    });
                }
            } else {
                // Crear nuevo usuario
                const response = await fetch('/api/auth/create-user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        password,
                        roles: selectedRoles,
                        active
                    })
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Error al crear usuario');
                }

                Swal.fire({
                    icon: 'success',
                    title: 'Usuario creado',
                    html: `Usuario creado exitosamente.<br><br><strong>Email:</strong> ${email}<br><strong>Contraseña:</strong> ${password}<br><br><small>Guarde esta información, la contraseña no se mostrará nuevamente.</small>`,
                    confirmButtonColor: '#004272'
                });
            }

            onClose();
        } catch (error: any) {
            console.error('Error guardando usuario:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'No se pudo guardar el usuario.',
                confirmButtonColor: '#004272'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-5 border-b bg-gray-50 rounded-t-2xl sticky top-0 z-10">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {isEditMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                    </h3>
                    <button onClick={onClose} className="w-9 h-9 rounded-full bg-red-500 text-white font-bold text-xl hover:bg-red-600 transition-colors">×</button>
                </header>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Correo Electrónico <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isEditMode}
                            className={`w-full p-3 border-2 border-gray-200 rounded-lg outline-none ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-[#4A7BA7]'}`}
                            placeholder="usuario@inei.gob.pe"
                            required
                        />
                    </div>

                    {!isEditMode ? (
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Contraseña <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="flex-1 p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-[#4A7BA7]"
                                    placeholder="Contraseña"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={generatePassword}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors whitespace-nowrap"
                                >
                                    Generar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {!showPasswordField ? (
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordField(true)}
                                    className="w-full px-4 py-3 bg-amber-50 border-2 border-amber-200 text-amber-700 rounded-lg font-semibold hover:bg-amber-100 transition-colors"
                                >
                                    Cambiar Contraseña
                                </button>
                            ) : (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                            Nueva Contraseña
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowPasswordField(false);
                                                setPassword('');
                                            }}
                                            className="text-xs text-gray-500 hover:text-gray-700 underline"
                                        >
                                            Cancelar cambio
                                        </button>
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="flex-1 p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-[#4A7BA7]"
                                            placeholder="Nueva contraseña"
                                        />
                                        <button
                                            type="button"
                                            onClick={generatePassword}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors whitespace-nowrap"
                                        >
                                            Generar
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Deja este campo vacío si no deseas cambiar la contraseña
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Roles <span className="text-red-500">*</span>
                        </label>
                        <div className="border-2 border-gray-200 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                            {roles
                                .filter((r, index, self) =>
                                    index === self.findIndex(t => t.name?.toUpperCase() === r.name?.toUpperCase())
                                )
                                .map(r => (
                                    <label key={r.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedRoles.includes(r.name)}
                                            onChange={() => toggleRole(r.name)}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <div className="flex-1">
                                            <div className="font-medium text-sm">{r.name}</div>
                                            {r.description && (
                                                <div className="text-xs text-gray-500">{r.description}</div>
                                            )}
                                        </div>
                                    </label>
                                ))
                            }
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="active"
                            checked={active}
                            onChange={(e) => setActive(e.target.checked)}
                            disabled={isMainAdmin}
                            className={`w-5 h-5 text-blue-600 ${isMainAdmin ? 'cursor-not-allowed opacity-50' : ''}`}
                        />
                        <label htmlFor="active" className={`text-sm font-medium text-gray-700 ${isMainAdmin ? 'opacity-50' : ''}`}>
                            Usuario activo {isMainAdmin && '(No se puede desactivar al admin principal)'}
                        </label>
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
                            className="flex-1 py-2 px-4 bg-[#004272] text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="animate-spin" size={16} />
                                    {isEditMode ? 'Actualizando...' : 'Creando...'}
                                </span>
                            ) : (
                                isEditMode ? 'Actualizar' : 'Crear Usuario'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Modal de rol
const RoleModal = ({ role, onClose, firestore }) => {
    const [name, setName] = useState(role?.name || '');
    const [description, setDescription] = useState(role?.description || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEditMode = Boolean(role);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name) {
            Swal.fire({
                icon: 'warning',
                title: 'Nombre requerido',
                text: 'Por favor ingrese el nombre del rol.',
                confirmButtonColor: '#004272'
            });
            return;
        }

        setIsSubmitting(true);

        try {
            if (isEditMode) {
                const roleRef = doc(firestore, 'roles', role.id);
                await updateDoc(roleRef, {
                    name: name.toUpperCase(),
                    description,
                    updatedAt: serverTimestamp()
                });

                Swal.fire({
                    icon: 'success',
                    title: 'Rol actualizado',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                await addDoc(collection(firestore, 'roles'), {
                    name: name.toUpperCase(),
                    description,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });

                Swal.fire({
                    icon: 'success',
                    title: 'Rol creado',
                    timer: 2000,
                    showConfirmButton: false
                });
            }

            onClose();
        } catch (error) {
            console.error('Error guardando rol:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo guardar el rol.',
                confirmButtonColor: '#004272'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-5 border-b bg-gray-50 rounded-t-2xl">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {isEditMode ? 'Editar Rol' : 'Crear Rol'}
                    </h3>
                    <button onClick={onClose} className="w-9 h-9 rounded-full bg-red-500 text-white font-bold text-xl hover:bg-red-600 transition-colors">×</button>
                </header>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre del Rol <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value.toUpperCase())}
                            required
                            className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-[#4A7BA7] uppercase"
                            placeholder="NOMBRE_DEL_ROL"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-[#4A7BA7] resize-none"
                            placeholder="Descripción del rol (opcional)"
                        />
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
                            className="flex-1 py-2 px-4 bg-[#004272] text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="animate-spin" size={16} />
                                    Guardando...
                                </span>
                            ) : (
                                isEditMode ? 'Actualizar' : 'Crear Rol'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

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

    // Para lecciones, cronograma, backlog: Excel o MPP es suficiente
    if (doc.type === 'lecciones' || doc.type === 'cronograma' || doc.type === 'backlog') {
        return doc.excelFilePath ? 'Completado' : 'Pendiente';
    }

    // Para otros documentos: PDF o Word es suficiente
    const hasPdf = !!doc.pdfFilePath;
    const hasWord = !!doc.wordFilePath;
    return (hasPdf || hasWord) ? 'Completado' : 'Pendiente';
};

// Componente de Reporte General
const ReportSection = ({ documents, isLoading }) => {
    const firestore = useFirestore();

    // Función para migrar documentos existentes recalculando el campo 'estado' en español
    useEffect(() => {
        const migrateDocumentStatus = async () => {
            if (!firestore || !documents || documents.length === 0) return;

            try {
                const { writeBatch, doc: firestoreDoc, serverTimestamp } = await import('firebase/firestore');
                const batch = writeBatch(firestore);
                let needsUpdate = false;

                documents.forEach(docData => {
                    // Recalcular el estado en español para todos los documentos
                    const estadoActual = docData.estado;
                    const estadoNuevo = getDocumentStatus(docData);

                    // Actualizar TODOS los documentos donde el estado no coincida con el calculado
                    // Esto incluye documentos con estados viejos como 'Incompleto' que ya no existen
                    if (estadoActual !== estadoNuevo) {
                        const docRef = firestoreDoc(firestore, "documentos", docData.id);
                        batch.update(docRef, { estado: estadoNuevo, updatedAt: serverTimestamp() });
                        needsUpdate = true;
                    }
                });

                if (needsUpdate) {
                    await batch.commit();
                    console.log("Documentos migrados con estados en español en Reporte");
                }
            } catch (error) {
                console.error("Error migrando documentos en Reporte: ", error);
            }
        };

        if (!isLoading && documents) {
            migrateDocumentStatus();
        }
    }, [firestore, documents, isLoading]);

    // Definir las categorías/módulos estáticos
    const categories = [
        { id: 'segmentacion', name: 'Segmentación', icon: '🗺️' },
        { id: 'reclutamiento', name: 'Reclutamiento', icon: '👥' },
        { id: 'capacitacion', name: 'Capacitación', icon: '🎓' },
        { id: 'logistica', name: 'Logística', icon: '📦' },
        { id: 'capdatos-apk', name: 'Captura Datos APK', icon: '📱' },
        { id: 'censo-linea', name: 'Censo en Línea', icon: '💻' },
        { id: 'consistencia', name: 'Consistencia', icon: '⚙️' },
        { id: 'monitoreo', name: 'Monitoreo', icon: '📊' },
        { id: 'yanapaq', name: 'Yanapaq', icon: '🤝' },
    ];

    // Calcular estadísticas por módulo usando el campo 'estado' de Firestore
    const getModuleStats = (categoryId) => {
        const moduleDocs = documents.filter(doc => doc.category === categoryId);
        const total = moduleDocs.length;
        // Usar el campo 'estado' directamente desde Firestore (en español), con fallback a 'Pendiente' si no existe
        const complete = moduleDocs.filter(doc => (doc.estado || 'Pendiente') === 'Completado').length;
        const pending = moduleDocs.filter(doc => (doc.estado || 'Pendiente') === 'Pendiente').length;
        const percentage = total > 0 ? Math.round((complete / total) * 100) : 0;

        return { total, complete, pending, percentage, docs: moduleDocs };
    };

    // Calcular estadísticas generales
    const generalStats = categories.reduce((acc, cat) => {
        const stats = getModuleStats(cat.id);
        return {
            total: acc.total + stats.total,
            complete: acc.complete + stats.complete,
            pending: acc.pending + stats.pending,
        };
    }, { total: 0, complete: 0, pending: 0 });

    const generalPercentage = generalStats.total > 0
        ? Math.round((generalStats.complete / generalStats.total) * 100)
        : 0;

    return (
        <div className="space-y-6">
            {/* Resumen General */}
            <div className="bg-white/95 rounded-2xl p-6 md:p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                    <BarChart3 size={32} className="text-[#004272]" />
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Reporte General de Avance</h2>
                </div>

                {isLoading ? (
                    <div className="text-center p-10">
                        <Loader2 className="animate-spin inline-block mr-2" />
                        Cargando reporte...
                    </div>
                ) : (
                    <>
                        {/* Estadísticas Generales */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200">
                                <div className="text-3xl font-bold text-blue-700">{generalStats.total}</div>
                                <div className="text-sm text-blue-600 font-medium">Total Documentos</div>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200">
                                <div className="text-3xl font-bold text-green-700">{generalStats.complete}</div>
                                <div className="text-sm text-green-600 font-medium">Completados</div>
                            </div>
                            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 border-2 border-red-200">
                                <div className="text-3xl font-bold text-red-700">{generalStats.pending}</div>
                                <div className="text-sm text-red-600 font-medium">Pendientes</div>
                            </div>
                        </div>

                        {/* Barra de Progreso General */}
                        <div className="bg-gray-100 rounded-xl p-6 mb-8">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-lg font-semibold text-gray-700">Progreso General</span>
                                <span className="text-2xl font-bold text-[#004272]">{generalPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-300 rounded-full h-6 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-[#004272] to-[#4A7BA7] h-full rounded-full transition-all duration-500 flex items-center justify-center text-white text-xs font-bold"
                                    style={{ width: `${generalPercentage}%` }}
                                >
                                    {generalPercentage > 10 && `${generalPercentage}%`}
                                </div>
                            </div>
                        </div>

                        {/* Detalle por Módulo */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Avance por Módulo</h3>
                            <div className="space-y-4">
                                {categories.map(category => {
                                    const stats = getModuleStats(category.id);
                                    return (
                                        <ModuleReport key={category.id} category={category} stats={stats} />
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// Componente individual de reporte de módulo
const ModuleReport = ({ category, stats }) => {
    const [expanded, setExpanded] = useState(false);

    const getStatusColor = () => {
        if (stats.percentage === 100) return 'border-green-500 bg-green-50';
        if (stats.percentage >= 70) return 'border-yellow-500 bg-yellow-50';
        if (stats.percentage >= 40) return 'border-orange-500 bg-orange-50';
        return 'border-red-500 bg-red-50';
    };

    const getStatusIcon = (docStatus) => {
        switch (docStatus) {
            case 'Completado':
                return <CheckCircle2 size={16} className="text-green-600" />;
            case 'Pendiente':
                return <XCircle size={16} className="text-red-600" />;
            default:
                return <XCircle size={16} className="text-gray-400" />;
        }
    };

    const getStatusText = (docStatus) => {
        switch (docStatus) {
            case 'Completado':
                return <span className="text-green-700 font-medium">Completado</span>;
            case 'Pendiente':
                return <span className="text-red-700 font-medium">Pendiente</span>;
            default:
                return <span className="text-gray-500">Sin datos</span>;
        }
    };

    return (
        <div className={`border-l-4 rounded-lg ${getStatusColor()} transition-all`}>
            <div
                className="p-4 cursor-pointer hover:bg-white/50 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">{category.icon}</span>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 text-lg">{category.name}</h4>
                            <div className="flex items-center gap-4 mt-1">
                                <span className="text-sm text-gray-600">
                                    {stats.complete} de {stats.total} documentos completos
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-2xl font-bold text-[#004272]">{stats.percentage}%</div>
                            <div className="w-32 bg-gray-300 rounded-full h-2 mt-1">
                                <div
                                    className="bg-[#004272] h-full rounded-full transition-all"
                                    style={{ width: `${stats.percentage}%` }}
                                />
                            </div>
                        </div>
                        <button className="text-gray-500 hover:text-gray-700 transition-colors">
                            {expanded ? '▼' : '▶'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Detalle de documentos */}
            {expanded && stats.docs.length > 0 && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-200 bg-white">
                    <div className="space-y-2">
                        {stats.docs.map(doc => {
                            // Usar el campo 'estado' directamente desde Firestore
                            const docStatus = doc.estado || 'Pendiente';
                            return (
                                <div key={doc.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-3 flex-1">
                                        {getStatusIcon(docStatus)}
                                        <div>
                                            <div className="font-medium text-gray-800">{doc.title}</div>
                                            <div className="text-xs text-gray-500">
                                                Tipo: {doc.type} • Versión: {doc.version || '1.0'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm">
                                        {getStatusText(docStatus)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {expanded && stats.docs.length === 0 && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-200 bg-white">
                    <p className="text-center text-gray-500 py-4">No hay documentos en este módulo</p>
                </div>
            )}
        </div>
    );
};
