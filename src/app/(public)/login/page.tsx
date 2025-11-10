"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const VALID_USERS = {
  admin: "cpv2025",
  supervisor: "censo123",
  operador: "field2025",
  consulta: "view123",
};

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLogin = () => {
    setError("");
    if (!username || !password) {
      showError("⚠️ Por favor complete todos los campos");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (VALID_USERS[username] && VALID_USERS[username] === password) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setLoading(false);
        showError("❌ Usuario o contraseña incorrectos");
      }
    }, 800);
  };

  const showError = (message) => {
    setError(message);
    const errorDiv = document.getElementById("errorMessage");
    if (errorDiv) {
      errorDiv.style.animation = "shake 0.5s ease-in-out";
      setTimeout(() => {
        errorDiv.style.animation = "";
      }, 500);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };
  
  if (success) {
    return (
        <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] min-h-screen flex items-center justify-center">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-10 shadow-lg w-full max-w-md text-center">
                <div className="text-6xl mb-5">✅</div>
                <h2 className="text-green-500 text-2xl font-semibold mb-4">¡Acceso Autorizado!</h2>
                <p className="text-gray-600 mb-7">Redirigiendo al sistema...</p>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-400 to-green-600 w-0 animate-progressBar"></div>
                </div>
            </div>
             <style jsx>{`
                @keyframes progressBar {
                    from { width: 0%; }
                    to { width: 100%; }
                }
                .animate-progressBar {
                    animation: progressBar 2s ease-in-out forwards;
                }
            `}</style>
        </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-[#667eea] to-[#764ba2] min-h-screen flex items-center justify-center font-sans ${loading ? 'opacity-70 pointer-events-none' : ''}`}>
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-10 shadow-lg w-full max-w-md text-center">
        <div className="text-5xl mb-2.5">🏛️</div>
        <h1 className="text-3xl font-semibold text-gray-800 mb-2.5">CPV 2025</h1>
        <p className="text-gray-600 mb-7 text-lg">Sistema de Gestión Censal</p>

        {error && (
          <div id="errorMessage" className="bg-red-100 text-red-700 p-3 rounded-lg mb-5 border-l-4 border-red-700">
            {error}
          </div>
        )}

        <div className="mb-5 text-left">
          <label htmlFor="username" className="block mb-2 text-gray-800 font-medium">
            Usuario
          </label>
          <input
            type="text"
            id="username"
            className="w-full p-4 border-2 border-gray-200 rounded-xl text-base outline-none transition-colors focus:border-[#667eea]"
            placeholder="Ingrese su usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
          />
        </div>

        <div className="mb-5 text-left">
          <label htmlFor="password" className="block mb-2 text-gray-800 font-medium">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            className="w-full p-4 border-2 border-gray-200 rounded-xl text-base outline-none transition-colors focus:border-[#667eea]"
            placeholder="Ingrese su contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        <button
          className={`w-full bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white p-4 rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 mb-5 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 ${loading ? 'bg-gray-300' : ''}`}
          onClick={handleLogin}
          disabled={loading}
        >
          🔐 Ingresar al Sistema
        </button>
      </div>
      <style jsx>{`
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}
