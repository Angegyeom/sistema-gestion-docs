"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function MainPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirección inmediata al cargar el componente.
    router.replace("/login");
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white">
        <div className="text-5xl mb-4">🏛️</div>
        <h1 className="text-3xl font-semibold mb-2">CPV 2025</h1>
        <p className="text-lg mb-8">Sistema de Gestión Censal</p>
        <div className="flex items-center gap-3 text-lg">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Cargando sistema...</span>
        </div>
    </div>
  );
}
