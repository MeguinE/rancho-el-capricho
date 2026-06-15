"use client";

import { useEffect, useState } from "react";

type Particula = {
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
};

/* Partículas de polvo dorado flotando (ambiente del hero).
   Se generan SOLO en el cliente (tras montar) para evitar diferencias de
   hidratación entre el servidor y el navegador (Math.random). */
export default function Polvo({ cantidad = 26 }: { cantidad?: number }) {
  const [particulas, setParticulas] = useState<Particula[]>([]);

  useEffect(() => {
    setParticulas(
      Array.from({ length: cantidad }).map(() => ({
        left: Math.random() * 100,
        size: 2 + Math.random() * 4,
        duration: 8 + Math.random() * 12,
        delay: Math.random() * 12,
        drift: -20 + Math.random() * 40,
      }))
    );
  }, [cantidad]);

  return (
    <div className="polvo" aria-hidden="true">
      {particulas.map((p, i) => (
        <i
          key={i}
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            // @ts-expect-error variable CSS personalizada
            "--drift": `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
