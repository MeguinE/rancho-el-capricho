"use client";

import { useState } from "react";
import { supabase, supabaseConfigurado } from "@/lib/supabase";
import { tiposDeEvento } from "@/lib/data";

type Estado = "idle" | "enviando" | "ok" | "error";

export default function FormReserva() {
  const [estado, setEstado] = useState<Estado>("idle");
  const [mensajeError, setMensajeError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEstado("enviando");
    setMensajeError("");

    const form = e.currentTarget;
    const datos = new FormData(form);

    const reserva = {
      nombre: String(datos.get("nombre") || "").trim(),
      email: String(datos.get("email") || "").trim(),
      telefono: String(datos.get("telefono") || "").trim(),
      tipo_evento: String(datos.get("tipo_evento") || ""),
      fecha_evento: String(datos.get("fecha_evento") || "") || null,
      num_caballos: Number(datos.get("num_caballos") || 1),
      mensaje: String(datos.get("mensaje") || "").trim(),
    };

    if (!reserva.nombre || (!reserva.email && !reserva.telefono)) {
      setEstado("error");
      setMensajeError("Escribe tu nombre y al menos un medio de contacto.");
      return;
    }

    try {
      // Modo demo: si aún no conectas Supabase, simula el envío.
      if (!supabaseConfigurado || !supabase) {
        await new Promise((r) => setTimeout(r, 700));
        console.info("[modo demo] reserva:", reserva);
        setEstado("ok");
        form.reset();
        return;
      }

      const { error } = await supabase.from("reservas").insert(reserva);
      if (error) throw error;

      setEstado("ok");
      form.reset();
    } catch (err) {
      console.error(err);
      setEstado("error");
      setMensajeError(
        "No pudimos enviar tu solicitud. Inténtalo de nuevo o escríbenos por WhatsApp."
      );
    }
  }

  if (estado === "ok") {
    return (
      <div className="text-center bg-[#0f0b08]/60 border-2 border-cuero rounded-lg p-10 aparecer">
        <div className="text-5xl mb-4">🤠</div>
        <h3 className="font-[family-name:var(--font-display)] text-2xl text-cuero-claro mb-2">
          ¡Solicitud recibida!
        </h3>
        <p className="text-crema/80">
          Gracias por tu interés. Nuestro equipo del rancho te contactará muy
          pronto para afinar los detalles de tu evento.
        </p>
        <button
          onClick={() => setEstado("idle")}
          className="btn-rancho btn-fantasma mt-6"
        >
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  const inputBase =
    "w-full bg-[#0f0b08]/70 border-2 border-cuero/60 focus:border-atardecer outline-none rounded px-4 py-3 text-crema placeholder:text-crema/40 transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm uppercase tracking-wider text-crema/70 mb-1">
            Nombre *
          </label>
          <input name="nombre" type="text" required className={inputBase} placeholder="Tu nombre" />
        </div>
        <div>
          <label className="block text-sm uppercase tracking-wider text-crema/70 mb-1">
            Teléfono / WhatsApp
          </label>
          <input name="telefono" type="tel" className={inputBase} placeholder="55 1234 5678" />
        </div>
      </div>

      <div>
        <label className="block text-sm uppercase tracking-wider text-crema/70 mb-1">
          Correo
        </label>
        <input name="email" type="email" className={inputBase} placeholder="tucorreo@ejemplo.com" />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm uppercase tracking-wider text-crema/70 mb-1">
            Tipo de evento
          </label>
          <select name="tipo_evento" className={inputBase} defaultValue={tiposDeEvento[0]}>
            {tiposDeEvento.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm uppercase tracking-wider text-crema/70 mb-1">
            Fecha
          </label>
          <input name="fecha_evento" type="date" className={inputBase} />
        </div>
        <div>
          <label className="block text-sm uppercase tracking-wider text-crema/70 mb-1">
            ¿Cuántos caballos?
          </label>
          <input
            name="num_caballos"
            type="number"
            min={1}
            defaultValue={1}
            className={inputBase}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm uppercase tracking-wider text-crema/70 mb-1">
          Cuéntanos de tu evento
        </label>
        <textarea
          name="mensaje"
          rows={4}
          className={inputBase}
          placeholder="Lugar, número de invitados, ideas que tengas..."
        />
      </div>

      {estado === "error" && (
        <p className="text-atardecer bg-sangre/20 border border-sangre rounded px-4 py-2 text-sm">
          {mensajeError}
        </p>
      )}

      {!supabaseConfigurado && (
        <p className="text-crema/50 text-xs">
          Modo demo: conecta Supabase (ver README) para guardar las reservas.
        </p>
      )}

      <button type="submit" className="btn-rancho w-full justify-center" disabled={estado === "enviando"}>
        {estado === "enviando" ? "Enviando..." : "Solicitar mi reserva"}
      </button>
    </form>
  );
}
