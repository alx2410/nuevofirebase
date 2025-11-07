/* eslint-disable react-refresh/only-export-components */
// src/context/authContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider, db, storage } from "../lib/firebase"; // 🔹 CAMBIO: añadir storage
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  ref,              // 🔹 CAMBIO
  uploadBytes,      // 🔹 CAMBIO
  getDownloadURL,   // 🔹 CAMBIO
} from "firebase/storage";

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
  const [user, setUser] = useState(null);      // Usuario actual (Auth)
  const [loading, setLoading] = useState(true); // Para saber si Firebase está verificando la sesión

  // Escuchamos cambios de sesión (login, logout, recarga de página, etc.)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🟢 REGISTRO con email/password + avatar en Storage + perfil en Firestore
  const register = async (
    email,
    password,
    {
      username,      // 🔹 CAMBIO: viene desde el formulario
      avatarFile,    // 🔹 CAMBIO: File de la imagen seleccionada
    }
  ) => {
    // 1. Crear usuario en Auth
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    // 2. Subir avatar a Storage (si el usuario eligió archivo)
    let avatarUrl = ""; // 🔹 CAMBIO: URL que guardaremos en Firestore

    if (avatarFile) { // 🔹 CAMBIO
      // referencia: carpeta "usuario" en el bucket
      const avatarRef = ref(
        storage,
        `usuario/${uid}-${avatarFile.name}` // ej: usuario/asdf1234-miFoto.png
      );
      await uploadBytes(avatarRef, avatarFile);       // subir archivo
      avatarUrl = await getDownloadURL(avatarRef);    // obtener URL pública
    }

    // 3. Crear documento de perfil en Firestore
    const userRef = doc(db, "usuarios", uid);
    await setDoc(userRef, {
      uid,
      email,
      username,
      avatar: avatarUrl,       // 🔹 CAMBIO: guardamos la URL del Storage
      createdAt: serverTimestamp(),
      provider: "password",
    });

    // 4. Actualizar estado local (opcional, igual lo hará onAuthStateChanged)
    setUser(cred.user);

    return cred.user;
  };

  // 🟢 LOGIN con email/password
  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    setUser(cred.user);
    return cred.user;
  };

  // 🟢 LOGIN con Google (y creación de perfil si no existe)
  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const gUser = result.user;

    const userRef = doc(db, "usuarios", gUser.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: gUser.uid,
        email: gUser.email,
        username: gUser.displayName || "",
        avatar: gUser.photoURL || "",
        createdAt: serverTimestamp(),
        provider: "google",
      });
    }

    setUser(gUser);
    return gUser;
  };

  // 🟢 LOGOUT
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // 🟢 RESET PASSWORD
  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  const value = {
    user,
    loading,
    register,       // 🔹 ya incluye username + avatarFile
    login,
    logout,
    resetPassword,
    loginWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}