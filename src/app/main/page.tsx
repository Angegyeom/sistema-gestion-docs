"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MainPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 1000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] min-h-screen flex items-center justify-center text-white font-sans">
      <div className="text-center">
        <div className="text-6xl mb-5 animate-pulse">🏛️</div>
        <h1 className="text-5xl mb-2.5">CPV 2025</h1>
        <p className="text-xl opacity-80 mb-7">Sistema de Gestión Censal</p>
        <div className="w-[300px] h-1.5 bg-white/30 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gradient-to-r from-[#4CAF50] to-[#45a049] w-0 animate-progress"></div>
        </div>
        <p className="mt-5 opacity-70">Iniciando sistema...</p>
      </div>
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        .animate-progress {
          animation: progress 1s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
