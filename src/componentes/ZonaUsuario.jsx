// src/components/ZonaUsuario.jsx
import { useAuth } from "../context/AuthContext";

export default function ZonaUsuario({ onAbrirLogin }) {
    const { user, logout } = useAuth();

    // 🔹 Si el usuario está autenticado
    if (user) {
        return (
            <div className="flex items-center gap-3">
                <div className="flex flex-col items-end text-right leading-tight">
                    <span className="text-sm text-slate-700 font-medium">
                        {user.displayName || user.email}
                    </span>
                    <button
                        onClick={logout}
                        className="text-xs text-blue-600 hover:underline"
                    >
                        Cerrar sesión
                    </button>
                </div>

                {/* Avatar redondo (si tiene foto) */}
                {user.photoURL ? (
                    <img
                        src={user.photoURL}
                        alt="avatar"
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-full border border-slate-300 object-cover"
                    />
                ) : (
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                        {user.email?.charAt(0).toUpperCase() || "U"}
                    </div>
                )}
            </div>
        );
    }

    // 🔹 Si el usuario NO está autenticado
    return (
        <button
            onClick={onAbrirLogin}
            className="text-sm px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
            Iniciar sesión
        </button>
    );
}
