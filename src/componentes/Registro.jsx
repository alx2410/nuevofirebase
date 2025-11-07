// src/components/Registro.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Registro({ onRegistroExitoso, irALogin }) {
  const { register, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await register(email, password);
      // Después de registrarse, volvemos al login (no cerramos el modal)
      if (onRegistroExitoso) onRegistroExitoso();
    } catch (err) {
      console.error(err);
      setError(traducirError(err.code));
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await loginWithGoogle();
      // Si quisieras cerrar el modal al registrarse con Google, podrías llamar onRegistroExitoso y luego onLoginExitoso desde el padre
      if (onRegistroExitoso) onRegistroExitoso();
    } catch (err) {
      console.error(err);
      setError(traducirError(err.code));
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-3 text-center">
        Crear cuenta
      </h2>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@ejemplo.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Contraseña
          </label>
          <input
            type="password"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition text-sm"
        >
          Registrarse
        </button>
      </form>

      <div className="mt-4">
        <button
          type="button"
          onClick={handleGoogle}
          className="w-full border border-slate-300 hover:bg-slate-50 text-slate-800 font-medium py-2 rounded-lg transition text-xs"
        >
          Continuar con Google
        </button>
      </div>

      <div className="mt-3 text-center text-xs text-slate-600">
        ¿Ya tienes cuenta?{" "}
        <button
          type="button"
          onClick={irALogin}
          className="text-blue-600 font-medium hover:underline"
        >
          Inicia sesión
        </button>
      </div>
    </div>
  );
}

function traducirError(code) {
  switch (code) {
    case "auth/email-already-in-use":
      return "Este correo ya está registrado.";
    case "auth/invalid-email":
      return "El correo no es válido.";
    case "auth/weak-password":
      return "La contraseña es muy débil (mínimo 6 caracteres).";
    default:
      return "Ocurrió un error. Intenta nuevamente.";
  }
}
