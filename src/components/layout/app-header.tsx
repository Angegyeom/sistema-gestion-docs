"use client";
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/aplicativos', label: '📱 Aplicativos' },
    { href: '/documentacion', label: '📄 Documentación' },
    { href: '/presentaciones', label: '📊 Presentaciones' },
    { href: '/monitoreo', label: '📈 Monitoreo' },
];

export default function AppHeader() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-white/10 backdrop-blur-md py-4 border-b border-white/20 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-5 flex justify-between items-center">
                <div className="relative w-40 h-14">
                   <Image src="/images/censo-logo.png" alt="Censo 2025 Logo" fill style={{objectFit: 'contain'}} />
                </div>

                {/* Desktop Menu */}
                <nav className="hidden md:flex gap-2">
                    {navItems.map(item => (
                        <Link key={item.href} href={item.href}
                           className={`text-white no-underline py-2.5 px-5 rounded-full transition-all duration-300 ${pathname === item.href ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20 hover:-translate-y-0.5'}`}>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden md:block relative w-40 h-14">
                    <Image src="/images/inei-logo.png" alt="INEI Logo" fill style={{objectFit: 'contain'}} />
                </div>
                
                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2 rounded-md hover:bg-white/20 transition-colors">
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

             {/* Mobile Menu Panel */}
            <div className={cn(
                "md:hidden absolute top-full left-0 w-full bg-gradient-to-br from-[#7AADCF] to-[#4A7BA7] transition-all duration-300 ease-in-out overflow-hidden",
                isMenuOpen ? "max-h-screen py-5 border-t border-white/20" : "max-h-0"
            )}>
                <nav className="flex flex-col items-center gap-4">
                     {navItems.map(item => (
                        <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}
                           className={`text-white text-lg w-full text-center no-underline py-3 px-5 transition-all duration-300 ${pathname === item.href ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
