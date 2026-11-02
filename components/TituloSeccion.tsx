import type { CSSProperties } from "react";
import Revelar from "@/components/anim/Revelar";
import TextoRevelado from "@/components/anim/TextoRevelado";

type Props = {
  antetitulo: string;
  /** Un salto de línea (`\n`) corta el renglón. */
  titulo: string;
  descripcion?: string;
  alineado?: "centro" | "izquierda";
  className?: string;
};

/**
 * Cabecera de sección: antetítulo, título que se revela palabra por palabra y
 * una descripción opcional.
 *
 * Trae su propio <Revelar>, así que basta colocarlo donde haga falta.
 */
export default function TituloSeccion({
  antetitulo,
  titulo,
  descripcion,
  alineado = "centro",
  className = "",
}: Props) {
  const centrado = alineado === "centro";

  return (
    <Revelar
      className={`${centrado ? "text-center mx-auto max-w-2xl" : ""} ${className}`}
    >
      <p
        data-anim="fundido"
        className={`antetitulo ${centrado ? "" : "antetitulo--izq"}`}
      >
        {antetitulo}
      </p>

      <TextoRevelado
        como="h2"
        texto={titulo}
        retardoBase={120}
        paso={60}
        className="titulo-display text-[clamp(2.1rem,5.2vw,3.4rem)] leading-[1.05] mt-4"
      />

      {descripcion && (
        <p
          data-anim="subir"
          style={{ "--retardo": "320ms" } as CSSProperties}
          className="text-crema/70 mt-5 text-lg leading-relaxed"
        >
          {descripcion}
        </p>
      )}
    </Revelar>
  );
}
