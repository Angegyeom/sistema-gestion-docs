"use client";

import { useState } from "react";
import { updatePassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { Loader2, Eye, EyeOff } from "lucide-react";

interface PasswordResetModalProps {
  user: any;
  firestore: any;
  onSuccess: () => void;
}

export default function PasswordResetModal({ user, firestore, onSuccess }: PasswordResetModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordReset = async () => {
    setError("");

    // Validations
    if (!newPassword || !confirmPassword) {
      setError("Por favor complete ambos campos");
      return;
    }

    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);

    try {
      // Update password in Firebase Auth
      await updatePassword(user, newPassword);

      // Update requirePasswordReset flag in Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      await updateDoc(userDocRef, {
        requirePasswordReset: false,
        updatedAt: new Date(),
      });

      onSuccess();
    } catch (error: any) {
      console.error("Error updating password:", error);

      if (error.code === 'auth/requires-recent-login') {
        setError("Por seguridad, necesitas volver a iniciar sesión para cambiar tu contraseña");
      } else {
        setError("Error al actualizar la contraseña. Intenta de nuevo.");
      }

      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handlePasswordReset();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🔐</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Restablece tu Contraseña
          </h2>
          <p className="text-gray-600">
            Por seguridad, debes cambiar tu contraseña antes de continuar
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-5 border-l-4 border-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block mb-2 text-gray-800 font-medium text-sm">
              Nueva Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                className="w-full p-3 pr-10 border-2 border-gray-200 rounded-lg text-base outline-none transition-colors focus:border-[#004272]"
                placeholder="Mínimo 6 caracteres"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-2 text-gray-800 font-medium text-sm">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className="w-full p-3 pr-10 border-2 border-gray-200 rounded-lg text-base outline-none transition-colors focus:border-[#004272]"
                placeholder="Repite la contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </div>

        <button
          className={`w-full mt-6 bg-[#004272] text-white p-3 rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 ${
            isLoading ? "bg-gray-400 cursor-not-allowed" : ""
          }`}
          onClick={handlePasswordReset}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Actualizando...
            </span>
          ) : (
            "✓ Confirmar Nueva Contraseña"
          )}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Esta acción es obligatoria por razones de seguridad
        </p>
      </div>
    </div>
  );
}
