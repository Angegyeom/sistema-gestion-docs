"use client";
import { useState, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePermissions } from '@/hooks/use-permissions';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';

const baseNavItems = [
    { href: '/aplicativos', label: '📱 Aplicativos' },
    { href: '/documentacion', label: '📄 Documentación' },
    { href: '/presentaciones', label: '📊 Presentaciones' },
];

export default function AppHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAdmin, userData } = usePermissions();
    const auth = useAuth();

    // Construir navItems dinámicamente basado en permisos
    const navItems = useMemo(() => {
        if (isAdmin) {
            return [...baseNavItems, { href: '/administrador', label: '⚙️ Administrador' }];
        }
        return baseNavItems;
    }, [isAdmin]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <header className="bg-white py-4 border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-5 flex justify-between items-center">
                {/* Logo Censo - Oculto en pantallas < 1024px (~965px) */}
                <div className="hidden lg:block relative w-40 h-14">
                   <Image src="/images/censo-logo.png" alt="Censo 2025 Logo" fill style={{objectFit: 'contain'}} />
                </div>

                {/* Espaciador para balancear el layout */}
                <div className="lg:hidden"></div>

                {/* Desktop Menu */}
                <nav className="hidden md:flex md:gap-1 lg:gap-2">
                    {navItems.map(item => (
                        <Link key={item.href} href={item.href}
                           className={`text-gray-700 no-underline py-2.5 md:px-2 md:text-sm lg:px-5 lg:text-base rounded-full transition-all duration-300 font-medium ${pathname === item.href ? 'bg-[#004272] text-white' : 'bg-gray-100 hover:bg-gray-200 hover:-translate-y-0.5'}`}>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Right Section - Logo INEI + Botón Salir */}
                <div className="hidden md:flex items-center md:gap-2 lg:gap-4">
                    {/* Logo INEI - visible solo en pantallas >1150px (xl: 1280px+) */}
                    <div className="hidden xl:block relative w-40 h-14">
                        <Image src="/images/inei-logo.png" alt="INEI Logo" fill style={{objectFit: 'contain'}} />
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 md:px-2.5 md:py-1.5 lg:px-4 lg:py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all"
                        title="Cerrar sesión"
                    >
                        <LogOut size={18} />
                        <span className="text-sm font-medium">Salir</span>
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-2">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all text-sm"
                        title="Cerrar sesión"
                    >
                        <LogOut size={16} />
                        <span className="font-medium">Salir</span>
                    </button>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 p-2 rounded-md hover:bg-gray-100 transition-colors">
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

             {/* Mobile Menu Panel */}
            <div className={cn(
                "md:hidden absolute top-full left-0 w-full bg-white transition-all duration-300 ease-in-out overflow-hidden shadow-lg",
                isMenuOpen ? "max-h-screen py-5 border-t border-gray-200" : "max-h-0"
            )}>
                <nav className="flex flex-col items-center gap-4">
                     {navItems.map(item => (
                        <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}
                           className={`text-gray-700 text-lg w-full text-center no-underline py-3 px-5 transition-all duration-300 font-medium ${pathname === item.href ? 'bg-[#004272] text-white' : 'hover:bg-gray-100'}`}>
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
