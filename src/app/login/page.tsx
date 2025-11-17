
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth, useFirestore } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@inei.gob.pe");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      showError("⚠️ Por favor complete todos los campos");
      return;
    }

    if (!auth || !firestore) {
      showError("❌ Error de autenticación. Intente de nuevo.");
      return;
    }
    
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(firestore, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        // El documento del usuario no existe, así que lo creamos.
        console.warn(`User document for ${user.uid} not found. Creating it.`);

        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          role: email === 'admin@inei.gob.pe' ? 'ADMIN' : 'CONSULTA', // Default role
          active: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }, { merge: true });

         toast({
            title: "Perfil creado",
            description: "Hemos creado tu perfil de usuario automáticamente."
        });
      } else {
        // Verificar si el usuario está activo
        const userData = userDocSnap.data();

        // Actualizar el rol a ADMIN si es admin@inei.gob.pe y no tiene el rol correcto
        if (email === 'admin@inei.gob.pe' && userData.role !== 'ADMIN') {
          console.log('Actualizando rol del administrador...');
          await setDoc(userDocRef, {
            role: 'ADMIN',
            active: true,
            updatedAt: serverTimestamp(),
          }, { merge: true });
        }

        if (userData.active === false) {
          showError("❌ Tu cuenta ha sido desactivada. Contacta al administrador.");
          setIsLoading(false);
          return;
        }
      }

      toast({
        title: "Inicio de sesión exitoso",
        description: `¡Bienvenido! Redirigiendo al panel de control...`,
      });

      router.push("/aplicativos");

    } catch (error: any) {
      console.error("Failed to sign in", error);
      let description = "Ocurrió un error inesperado.";
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        description = "Correo electrónico o contraseña incorrectos."
      }
       showError(`❌ ${description}`);
       setIsLoading(false);
    }
  };

  const showError = (message: string) => {
    setError(message);
    const errorDiv = document.getElementById("errorMessage");
    if (errorDiv) {
      errorDiv.style.animation = "shake 0.5s ease-in-out";
      setTimeout(() => {
        if (errorDiv) {
          errorDiv.style.animation = "";
        }
      }, 500);
    }
  };
  
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };


  return (
    <div
      className={`bg-[#004272] min-h-screen flex items-center justify-center font-sans ${
        isLoading ? "opacity-70 pointer-events-none" : ""
      }`}
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-10 shadow-lg w-full max-w-md text-center">
        <div className="text-5xl mb-2.5">🏛️</div>
        <h1 className="text-3xl font-semibold text-gray-800 mb-2.5">CPV 2025</h1>
        <p className="text-gray-600 mb-7 text-lg">Sistema de Gestión Censal</p>

        {error && (
          <div
            id="errorMessage"
            className="bg-red-100 text-red-700 p-3 rounded-lg mb-5 border-l-4 border-red-700"
          >
            {error}
          </div>
        )}

        <div className="mb-5 text-left">
          <label
            htmlFor="email"
            className="block mb-2 text-gray-800 font-medium"
          >
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-4 border-2 border-gray-200 rounded-xl text-base outline-none transition-colors focus:border-[#004272]"
            placeholder="Ingrese su correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
          />
        </div>

        <div className="mb-5 text-left">
          <label
            htmlFor="password"
            className="block mb-2 text-gray-800 font-medium"
          >
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            className="w-full p-4 border-2 border-gray-200 rounded-xl text-base outline-none transition-colors focus:border-[#004272]"
            placeholder="Ingrese su contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        <button
          className={`w-full bg-[#004272] text-white p-4 rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 mb-5 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 ${
            isLoading ? "bg-gray-300" : ""
          }`}
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Ingresando...
            </span>
          ) : (
            "🔐 Ingresar al Sistema"
          )}
        </button>
      </div>
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
      `}</style>
    </div>
  );
}
