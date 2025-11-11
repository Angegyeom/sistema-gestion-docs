"use client";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const navItems = [
    { href: '/aplicativos', label: '📱 Aplicativos' },
    { href: '/documentacion', label: '📄 Documentación' },
    { href: '/presentaciones', label: '📊 Presentaciones' },
    { href: '/monitoreo', label: '📈 Monitoreo' },
];

export default function AppHeader() {
    const pathname = usePathname();

    return (
        <header className="bg-white/10 backdrop-blur-md py-4 border-b border-white/20 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-5 flex justify-between items-center">
                <div className="relative w-36 h-12">
                   <Image src="/images/censo-logo.png" alt="Censo 2025 Logo" fill style={{objectFit: 'contain'}} />
                </div>

                <nav className="hidden md:flex gap-2">
                    {navItems.map(item => (
                        <Link key={item.href} href={item.href}
                           className={`text-white no-underline py-2.5 px-5 rounded-full transition-all duration-300 ${pathname === item.href ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20 hover:-translate-y-0.5'}`}>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="relative w-36 h-12">
                    <Image src="/images/inei-logo.png" alt="INEI Logo" fill style={{objectFit: 'contain'}} />
                </div>
            </div>
        </header>
    );
}
