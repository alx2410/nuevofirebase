// src/components/Login.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login({ onLoginExitoso, irARegistro }) {
  const { login, resetPassword, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    try {
      await login(email, password);
      // Avisamos al padre que el login fue exitoso (para cerrar modal, etc.)
      if (onLoginExitoso) onLoginExitoso();
    } catch (err) {
      console.error(err);
      setError(traducirError(err.code));
    }
  };

  const handleReset = async () => {
    setError("");
    setMensaje("");
    if (!email) {
      setError("Primero escribe tu correo para enviarte el enlace.");
      return;
    }
    try {
      await resetPassword(email);
      setMensaje("Te enviamos un correo para restablecer tu contraseña.");
    } catch (err) {
      console.error(err);
      setError(traducirError(err.code));
    }
  };

  const handleGoogle = async () => {
    setError("");
    setMensaje("");
    try {
      await loginWithGoogle();
      if (onLoginExitoso) onLoginExitoso();
    } catch (err) {
      console.error(err);
      setError(traducirError(err.code));
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-3 text-center">
        Iniciar sesión
      </h2>

      {error && (
        <p className="mb-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
          {error}
        </p>
      )}

      {mensaje && (
        <p className="mb-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded p-2">
          {mensaje}
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
            placeholder="Tu contraseña"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition text-sm"
        >
          Entrar
        </button>
      </form>

      <div className="mt-3 flex justify-between items-center text-xs">
        <button
          type="button"
          onClick={handleReset}
          className="text-blue-600 hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </button>

        <button
          type="button"
          onClick={handleGoogle}
          className="text-slate-700 border px-2 py-1 rounded-lg hover:bg-slate-50"
        >
          Google
        </button>
      </div>

      <div className="mt-4 text-center text-xs text-slate-600">
        ¿No tienes cuenta?{" "}
        <button
          type="button"
          onClick={irARegistro}
          className="text-blue-600 font-medium hover:underline"
        >
          Regístrate aquí
        </button>
      </div>
    </div>
  );
}

function traducirError(code) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "Correo o contraseña incorrectos.";
    case "auth/user-not-found":
      return "No existe una cuenta con este correo.";
    case "auth/invalid-email":
      return "El correo no es válido.";
    default:
      return "Ocurrió un error. Intenta nuevamente.";
  }
}
