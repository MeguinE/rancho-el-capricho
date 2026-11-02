"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import Revelar from "@/components/anim/Revelar";
import Icono from "@/components/Icono";
import DialogoReserva from "@/components/reserva/DialogoReserva";
import { contacto } from "@/lib/data";

const promesas = [
  {
    icono: "herradura" as const,
    titulo: "Cuatro pasos, dos minutos",
    texto: "Solo lo necesario: tu evento, tus datos y los detalles.",
  },
  {
    icono: "anillo" as const,
    titulo: "Te contestamos el mismo día",
    texto: "Un humano del rancho revisa cada solicitud, una por una.",
  },
  {
    icono: "sombrero" as const,
    titulo: "Sin compromiso",
    texto: "Pedir presupuesto no te obliga a nada ni se paga por adelantado.",
  },
];

/**
 * Tarjeta de invitación a reservar.
 *
 * En lugar de un formulario abierto en medio de la página, se explica qué
 * pasa al pulsar y la solicitud se abre en una ventana aparte. Quien quiere
 * reservar tiene el botón grande y claro; quien solo está mirando no se topa
 * con veinte campos que rellenar por curiosidad.
 */
export default function InvitacionReserva() {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      <Revelar umbral={0.1}>
        <div
          data-anim="difuminar"
          className="panel luz-atardecer overflow-hidden p-7 sm:p-10"
        >
          <ul className="grid sm:grid-cols-3 gap-6">
            {promesas.map((p, i) => (
              <li
                key={p.titulo}
                data-anim="subir"
                style={{ "--retardo": `${220 + i * 110}ms` } as CSSProperties}
              >
                <span className="grid place-items-center w-11 h-11 rounded-full border border-cuero-claro/45 bg-madera/70 text-atardecer">
                  <Icono name={p.icono} className="w-5 h-5" />
                </span>
                <h3 className="font-slab font-semibold text-crema mt-3.5">
                  {p.titulo}
                </h3>
                <p className="text-crema/65 text-sm leading-relaxed mt-1.5">
                  {p.texto}
                </p>
              </li>
            ))}
          </ul>

          <div
            data-anim="subir"
            style={{ "--retardo": "560ms" } as CSSProperties}
            className="mt-9 pt-8 border-t border-cuero/30 flex flex-col items-center gap-5"
          >
            <button
              type="button"
              onClick={() => setAbierto(true)}
              className="btn btn--fuego text-base px-9 py-4"
            >
              <Icono name="herradura" className="w-5 h-5" />
              Iniciar mi solicitud
            </button>

            <p className="text-crema/55 text-sm text-center">
              ¿Prefieres hablar?{" "}
              <a
                href={`https://wa.me/${contacto.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-atardecer underline decoration-atardecer/40 underline-offset-4 hover:decoration-atardecer"
              >
                Escríbenos por WhatsApp
              </a>{" "}
              o llama al{" "}
              <a
                href={`tel:${contacto.telefono.replace(/\s/g, "")}`}
                className="text-atardecer underline decoration-atardecer/40 underline-offset-4 hover:decoration-atardecer whitespace-nowrap"
              >
                {contacto.telefono}
              </a>
              .
            </p>
          </div>
        </div>
      </Revelar>

      <DialogoReserva abierto={abierto} onCerrar={() => setAbierto(false)} />
    </>
  );
}
