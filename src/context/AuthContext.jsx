import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../lib/firebase";
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup } from "firebase/auth";

//Crear el contexto
const AuthContext = createContext();

// Hook para usar el contexto de autenticación
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
}

//Proveedor del contexto
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Estado de carga

    // Escuchar los cambios en el estado de autenticación
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser || null);
            setLoading(false); // Finalizar el estado de carga
        });
        // Limpiar el suscriptor al desmontar el componente
        return () => unsubscribe();
    }, []);

    // Funciones de autenticación
    //Registrar usuario con email y password
    const register = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };
    //Iniciar sesión con email y password
    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };
    //Iniciar sesión con Google
    const loginWithGoogle = () => {
        return signInWithPopup(auth, googleProvider);
    };
    //Enviar email para restablecer la contraseña
    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    };
    //Cerrar sesión
    const logout = () => {
        return signOut(auth);
    };

    //Valor del contexto
    const value = {
        user,
        register,
        login,
        loginWithGoogle,
        resetPassword,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {/*Mientras firebase verifica sesion, puedo mostrar un cargando*/}
            {loading ?
                (
                <div>
                    <p>Cargando...</p>
                </div>
                ) : (
                children)
            }
        </AuthContext.Provider>
    );
}

