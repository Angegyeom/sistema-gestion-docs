"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';

// Mapeo de categorías de documentación con roles que pueden editar
export const CATEGORY_ROLE_MAP = {
  segmentacion: 'SEGMENTACION',
  reclutamiento: 'RECLUTAMIENTO',
  capacitacion: 'CAPACITACION',
  logistica: 'LOGISTICA',
  'capdatos-apk': 'CAPDATOS-APK',
  'censo-linea': 'CENSO-LINEA',
  consistencia: 'CONSISTENCIA',
  monitoreo: 'MONITOREO',
  yanapaq: 'YANAPAQ',
};

export function usePermissions() {
  const { user, userData, isUserLoading, isUserDataLoading } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (userData) {
      const role = userData.role?.toUpperCase() || '';
      setUserRole(role);
      setIsAdmin(role === 'ADMIN');
    } else {
      setUserRole(null);
      setIsAdmin(false);
    }
  }, [userData]);

  // Verifica si el usuario puede editar una categoría específica
  const canEditCategory = (category: string): boolean => {
    if (!userRole) return false;
    if (isAdmin) return true; // El admin puede editar todo

    const requiredRole = CATEGORY_ROLE_MAP[category as keyof typeof CATEGORY_ROLE_MAP];
    return userRole === requiredRole;
  };

  // Verifica si el usuario es administrador
  const isAdministrator = (): boolean => {
    return isAdmin;
  };

  // Verifica si el usuario tiene un rol específico
  const hasRole = (role: string): boolean => {
    if (!userRole) return false;
    return userRole === role.toUpperCase();
  };

  return {
    user,
    userData,
    userRole,
    isAdmin,
    isUserLoading,
    isUserDataLoading,
    canEditCategory,
    isAdministrator,
    hasRole,
  };
}
