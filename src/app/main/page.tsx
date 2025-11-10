"use client";

export default function MainPage() {
  return (
    <>
      <head>
        {/* Redirige a /login inmediatamente */}
        <meta http-equiv="refresh" content="0; url=/login" />
      </head>
      <body className="bg-gradient-to-br from-[#667eea] to-[#764ba2] min-h-screen flex items-center justify-center text-white font-sans">
        <div className="text-center">
          <div className="text-6xl mb-5 animate-pulse">🏛️</div>
          <h1 className="text-5xl mb-2.5">CPV 2025</h1>
          <p className="text-xl opacity-80 mb-7">Sistema de Gestión Censal</p>
          <div className="w-[300px] h-1.5 bg-white/30 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-[#4CAF50] to-[#45a049] w-full"></div>
          </div>
          <p className="mt-5 opacity-70">Redirigiendo al inicio de sesión...</p>
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
          .animate-pulse {
            animation: pulse 2s infinite;
          }
        `}</style>
      </body>
    </>
  );
}
