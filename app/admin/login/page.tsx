"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type EstadoLogin } from "@/app/admin/acciones";

export default function LoginPage() {
  const [estado, action, pendiente] = useActionState<EstadoLogin, FormData>(
    loginAction,
    {}
  );

  return (
    <main className="min-h-[100svh] grid place-items-center px-5 fondo-rancho">
      <form action={action} className="panel w-full max-w-sm p-8 aparecer">
        <div className="text-center">
          <p className="text-atardecer text-3xl" aria-hidden="true">
            ★
          </p>
          <h1 className="font-slab font-bold uppercase tracking-[0.07em] text-crema text-xl mt-1">
            Panel del Rancho
          </h1>
          <p className="text-crema/50 text-sm mt-1.5">
            Acceso de administración
          </p>
        </div>

        <div className="mt-7">
          <label htmlFor="password" className="etiqueta-campo">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            autoFocus
            required
            aria-invalid={Boolean(estado.error)}
            aria-describedby={estado.error ? "login-error" : undefined}
            className="campo"
            placeholder="••••••••"
          />
        </div>

        {estado.error && (
          <p
            id="login-error"
            role="alert"
            className="aparecer text-[#ffb3a3] bg-sangre/25 border border-sangre rounded-lg px-3 py-2.5 text-sm mt-4"
          >
            {estado.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pendiente}
          className="btn btn--fuego w-full mt-7"
        >
          {pendiente ? "Entrando…" : "Entrar"}
        </button>

        <Link
          href="/"
          className="block text-center text-crema/40 hover:text-crema/75 text-xs mt-6 transition-colors"
        >
          ← Volver al sitio
        </Link>
      </form>
    </main>
  );
}
