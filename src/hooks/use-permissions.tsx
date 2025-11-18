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
  const [userRoles, setUserRoles] = useState<string[]>([]);

  useEffect(() => {
    if (userData) {
      // Soportar tanto el campo 'roles' (array) como 'role' (string único) para retrocompatibilidad
      const roles = userData.roles && Array.isArray(userData.roles)
        ? userData.roles
        : userData.role
          ? [userData.role]
          : [];

      const upperRoles = roles.map((r: string) => r.toUpperCase());
      setUserRoles(upperRoles);
      setUserRole(upperRoles[0] || null); // Mantener userRole para retrocompatibilidad
      setIsAdmin(upperRoles.includes('ADMIN'));
    } else {
      setUserRoles([]);
      setUserRole(null);
      setIsAdmin(false);
    }
  }, [userData]);

  // Verifica si el usuario puede editar una categoría específica
  const canEditCategory = (category: string): boolean => {
    if (userRoles.length === 0) return false;
    if (isAdmin) return true; // El admin puede editar todo

    const requiredRole = CATEGORY_ROLE_MAP[category as keyof typeof CATEGORY_ROLE_MAP];

    // Si hay un rol específico requerido, verificar si el usuario lo tiene
    if (requiredRole) {
      return userRoles.includes(requiredRole);
    }

    // Si no hay rol específico (módulo personalizado), verificar si tiene el rol con el mismo nombre
    return userRoles.includes(category.toUpperCase());
  };

  // Verifica si el usuario es administrador
  const isAdministrator = (): boolean => {
    return isAdmin;
  };

  // Verifica si el usuario tiene un rol específico
  const hasRole = (role: string): boolean => {
    if (userRoles.length === 0) return false;
    return userRoles.includes(role.toUpperCase());
  };

  return {
    user,
    userData,
    userRole, // Mantener para retrocompatibilidad
    userRoles, // Nuevo: array de roles
    isAdmin,
    isUserLoading,
    isUserDataLoading,
    canEditCategory,
    isAdministrator,
    hasRole,
  };
}
