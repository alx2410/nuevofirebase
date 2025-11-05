
import { createContext, useContext, useEffect, useState } from "react"
import { auth, googleProvider } from "../lib/firebase";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
} from "firebase/auth";

// 1. Creamos el contexto
const AuthContext = createContext();

// 2. Hook personalizado para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}

// 3. Componente proveedor
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);     // Usuario actual
  const [loading, setLoading] = useState(true); // Para saber si Firebase está verificando la sesión

  // Escuchamos cambios de sesión (login, logout, recarga de página, etc.)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      setLoading(false);
    });

    // Importante: limpiar el listener
    return () => unsubscribe();
  }, []);

  // --- Funciones de ayuda (para usar en los componentes) ---

  // Registro con email/contraseña
  const register = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  // Login con email/contraseña
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // Login con Google
  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);

  // Enviar correo de reset de contraseña
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  // Cerrar sesión
  const logout = () => signOut(auth);

  //Empaquetar todas las funciones
  const value = {
    user,
    loading,
    register,
    login,
    loginWithGoogle,
    resetPassword,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Mientras Firebase verifica sesión, puedes mostrar un loader */}
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <p className="text-gray-600 font-medium">Cargando sesión...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}








