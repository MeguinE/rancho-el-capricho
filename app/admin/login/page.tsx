"use client";

import { useActionState } from "react";
import { loginAction, type EstadoLogin } from "@/app/admin/acciones";

export default function LoginPage() {
  const [estado, action, pending] = useActionState<EstadoLogin, FormData>(
    loginAction,
    {}
  );

  return (
    <main className="min-h-[100svh] flex items-center justify-center px-5 bg-rancho">
      <form
        action={action}
        className="w-full max-w-sm bg-[#1a1410]/80 border-2 border-cuero rounded-xl p-8 shadow-2xl"
      >
        <div className="text-center mb-6">
          <div className="text-atardecer text-3xl mb-1">★</div>
          <h1 className="font-slab font-bold uppercase tracking-[0.08em] text-crema text-xl">
            Panel del Rancho
          </h1>
          <p className="text-crema/50 text-sm mt-1">Acceso de administración</p>
        </div>

        <label className="block text-sm uppercase tracking-wider text-crema/70 mb-1">
          Contraseña
        </label>
        <input
          name="password"
          type="password"
          autoFocus
          required
          className="w-full bg-[#0f0b08]/70 border-2 border-cuero/60 focus:border-atardecer outline-none rounded px-4 py-3 text-crema transition-colors"
          placeholder="••••••••"
        />

        {estado.error && (
          <p className="text-red-300 bg-red-500/10 border border-red-500/40 rounded px-3 py-2 text-sm mt-4">
            {estado.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="btn-rancho w-full justify-center mt-6 disabled:opacity-60"
        >
          {pending ? "Entrando…" : "Entrar"}
        </button>

        <a
          href="/"
          className="block text-center text-crema/40 hover:text-crema/70 text-xs mt-5"
        >
          ← Volver al sitio
        </a>
      </form>
    </main>
  );
}
