"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import Dialogo from "@/components/Dialogo";
import Icono from "@/components/Icono";
import CampoFormulario from "@/components/reserva/CampoFormulario";
import {
  enviarReservaAction,
  estadoInicial,
  iniciarSolicitudAction,
  type InicioSolicitud,
} from "@/app/acciones/reservas";
import {
  CAMPO_TRAMPA,
  datosVacios,
  hayErrores,
  MAX_CABALLOS,
  MAX_MENSAJE,
  PASOS,
  validarPaso,
  type CampoReserva,
  type DatosReserva,
  type Errores,
} from "@/lib/reservas/validacion";
import { contacto, tiposDeEvento } from "@/lib/data";

/**
 * Solicitud de reserva en cuatro pasos, dentro de una ventana modal.
 *
 * Por qué no está suelta en la página: un formulario largo y visible invita a
 * rellenarlo por curiosidad, y lo que llega al panel son solicitudes de broma.
 * Pedirlo paso a paso, detrás de un botón y con una confirmación al final hace
 * que solo lo termine quien de verdad quiere reservar.
 *
 * El formulario es uno solo, con los pasos como <fieldset> ocultos. Los campos
 * ocultos siguen enviándose, así que el servidor recibe la solicitud completa
 * de una vez y no hace falta guardar nada a medias.
 */
export default function DialogoReserva({
  abierto,
  onCerrar,
}: {
  abierto: boolean;
  onCerrar: () => void;
}) {
  // Nada del formulario se monta hasta que se abre por primera vez: así no
  // viaja en el HTML inicial y podemos calcular fechas sin desajustar la
  // hidratación.
  const [estrenado, setEstrenado] = useState(false);

  useEffect(() => {
    if (abierto) setEstrenado(true);
  }, [abierto]);

  return (
    <Dialogo
      abierto={abierto}
      onCerrar={onCerrar}
      titulo="Solicitud de reserva"
      className="dialogo--centro"
    >
      {estrenado && <Formulario onCerrar={onCerrar} />}
    </Dialogo>
  );
}

function Formulario({ onCerrar }: { onCerrar: () => void }) {
  const [paso, setPaso] = useState(0);
  const [datos, setDatos] = useState<DatosReserva>(datosVacios);
  const [errores, setErrores] = useState<Errores>({});
  const [inicio, setInicio] = useState<InicioSolicitud | null>(null);
  const [respuesta, setRespuesta] = useState<number | null>(null);

  const [estado, enviar, pendiente] = useActionState(
    enviarReservaAction,
    estadoInicial
  );

  // Se calcula una sola vez, ya en el navegador.
  const hoy = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // Token y pregunta de verificación. El token lleva firmado el momento en que
  // se emitió, y de ahí sale el tiempo mínimo de relleno que exige el servidor.
  useEffect(() => {
    let vigente = true;
    iniciarSolicitudAction()
      .then((r) => {
        if (vigente) setInicio(r);
      })
      .catch(() => {
        /* Si falla, al enviar se avisa con un mensaje claro. */
      });
    return () => {
      vigente = false;
    };
  }, []);

  // Si el servidor devuelve errores de campo, llevamos al visitante al paso
  // donde están en vez de dejarlo mirando un mensaje sin contexto.
  useEffect(() => {
    if (estado.fase !== "error") return;
    setErrores(estado.errores);

    const fallidos = Object.keys(estado.errores) as CampoReserva[];
    if (fallidos.length === 0) return;

    const destino = PASOS.findIndex((p) =>
      p.campos.some((c) => fallidos.includes(c))
    );
    if (destino >= 0) setPaso(destino);
  }, [estado]);

  function actualizar<C extends CampoReserva>(campo: C, valor: DatosReserva[C]) {
    setDatos((d) => ({ ...d, [campo]: valor }));
    // Quitamos el error en cuanto se toca el campo: dejarlo puesto mientras la
    // persona lo está corrigiendo solo estorba.
    setErrores(({ [campo]: _, ...resto }) => resto);
  }

  function siguiente() {
    const fallos = validarPaso(paso, datos);
    setErrores(fallos);
    if (!hayErrores(fallos)) setPaso((p) => Math.min(p + 1, PASOS.length - 1));
  }

  if (estado.fase === "ok") {
    return <Enviado demo={estado.demo} onCerrar={onCerrar} />;
  }

  const ultimo = paso === PASOS.length - 1;
  const listoParaEnviar = respuesta !== null && inicio !== null;

  return (
    <form action={enviar} className="panel overflow-hidden">
      <Cabecera paso={paso} onCerrar={onCerrar} />

      <div className="px-6 sm:px-8 py-7 max-h-[min(70dvh,34rem)] overflow-y-auto">
        {/* ─── Paso 1: el evento ─── */}
        <Paso activo={paso === 0} titulo={PASOS[0].titulo}>
          <CampoFormulario
            id="tipoEvento"
            etiqueta="¿Qué celebras?"
            error={errores.tipoEvento}
          >
            <input type="hidden" name="tipoEvento" value={datos.tipoEvento} />
            <div
              id="tipoEvento"
              role="group"
              aria-label="Tipo de evento"
              className="grid grid-cols-2 sm:grid-cols-3 gap-2.5"
            >
              {tiposDeEvento.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={datos.tipoEvento === t}
                  onClick={() => actualizar("tipoEvento", t)}
                  className="opcion items-center text-center text-sm"
                >
                  {t}
                </button>
              ))}
            </div>
          </CampoFormulario>

          <div className="grid sm:grid-cols-2 gap-5 mt-6">
            <CampoFormulario
              id="fechaEvento"
              etiqueta="Fecha del evento"
              error={errores.fechaEvento}
            >
              <input
                id="fechaEvento"
                name="fechaEvento"
                type="date"
                min={hoy}
                value={datos.fechaEvento}
                onChange={(e) => actualizar("fechaEvento", e.target.value)}
                aria-invalid={Boolean(errores.fechaEvento)}
                aria-describedby={
                  errores.fechaEvento ? "fechaEvento-error" : undefined
                }
                className="campo"
              />
            </CampoFormulario>

            <CampoFormulario
              id="numCaballos"
              etiqueta="¿Cuántos caballos?"
              error={errores.numCaballos}
              ayuda={`Entre 1 y ${MAX_CABALLOS}`}
            >
              <Contador
                valor={datos.numCaballos}
                onCambio={(n) => actualizar("numCaballos", n)}
                invalido={Boolean(errores.numCaballos)}
              />
            </CampoFormulario>
          </div>
        </Paso>

        {/* ─── Paso 2: quién eres ─── */}
        <Paso activo={paso === 1} titulo={PASOS[1].titulo}>
          <CampoFormulario
            id="nombre"
            etiqueta="Nombre completo"
            error={errores.nombre}
          >
            <input
              id="nombre"
              name="nombre"
              type="text"
              autoComplete="name"
              placeholder="Como quieres que te llamemos"
              value={datos.nombre}
              onChange={(e) => actualizar("nombre", e.target.value)}
              aria-invalid={Boolean(errores.nombre)}
              aria-describedby={errores.nombre ? "nombre-error" : undefined}
              className="campo"
            />
          </CampoFormulario>

          <div className="grid sm:grid-cols-2 gap-5 mt-6">
            <CampoFormulario
              id="telefono"
              etiqueta="Teléfono / WhatsApp"
              error={errores.telefono}
              ayuda="10 dígitos. Es por donde te contestamos."
            >
              <input
                id="telefono"
                name="telefono"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="55 1234 5678"
                value={datos.telefono}
                onChange={(e) => actualizar("telefono", e.target.value)}
                aria-invalid={Boolean(errores.telefono)}
                aria-describedby={
                  errores.telefono ? "telefono-error" : "telefono-ayuda"
                }
                className="campo"
              />
            </CampoFormulario>

            <CampoFormulario
              id="email"
              etiqueta="Correo"
              error={errores.email}
              opcional
            >
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="tucorreo@ejemplo.com"
                value={datos.email}
                onChange={(e) => actualizar("email", e.target.value)}
                aria-invalid={Boolean(errores.email)}
                aria-describedby={errores.email ? "email-error" : undefined}
                className="campo"
              />
            </CampoFormulario>
          </div>
        </Paso>

        {/* ─── Paso 3: detalles ─── */}
        <Paso activo={paso === 2} titulo={PASOS[2].titulo}>
          <div className="grid sm:grid-cols-2 gap-5">
            <CampoFormulario
              id="lugar"
              etiqueta="Lugar del evento"
              error={errores.lugar}
              opcional
            >
              <input
                id="lugar"
                name="lugar"
                type="text"
                placeholder="Jardín, salón, rancho…"
                value={datos.lugar}
                onChange={(e) => actualizar("lugar", e.target.value)}
                aria-invalid={Boolean(errores.lugar)}
                aria-describedby={errores.lugar ? "lugar-error" : undefined}
                className="campo"
              />
            </CampoFormulario>

            <CampoFormulario
              id="invitados"
              etiqueta="Invitados aproximados"
              error={errores.invitados}
              opcional
            >
              <input
                id="invitados"
                name="invitados"
                type="text"
                inputMode="numeric"
                placeholder="150"
                value={datos.invitados}
                onChange={(e) => actualizar("invitados", e.target.value)}
                aria-invalid={Boolean(errores.invitados)}
                aria-describedby={
                  errores.invitados ? "invitados-error" : undefined
                }
                className="campo"
              />
            </CampoFormulario>
          </div>

          <CampoFormulario
            id="mensaje"
            etiqueta="Cuéntanos tu idea"
            error={errores.mensaje}
            ayuda={`${datos.mensaje.length} de ${MAX_MENSAJE} caracteres`}
            opcional
            className="mt-6"
          >
            <textarea
              id="mensaje"
              name="mensaje"
              rows={4}
              maxLength={MAX_MENSAJE}
              placeholder="Entrada de la novia, fotos al atardecer, cabalgata para los niños…"
              value={datos.mensaje}
              onChange={(e) => actualizar("mensaje", e.target.value)}
              aria-invalid={Boolean(errores.mensaje)}
              aria-describedby={
                errores.mensaje ? "mensaje-error" : "mensaje-ayuda"
              }
              className="campo resize-y"
            />
          </CampoFormulario>
        </Paso>

        {/* ─── Paso 4: confirmar ─── */}
        <Paso activo={paso === 3} titulo={PASOS[3].titulo}>
          <Resumen datos={datos} />
          <Verificacion
            inicio={inicio}
            respuesta={respuesta}
            onResponder={setRespuesta}
          />
        </Paso>

        {estado.fase === "error" && (
          <p
            role="alert"
            className="aparecer mt-6 text-[#ffb3a3] bg-sangre/25 border border-sangre rounded-lg px-4 py-3 text-sm"
          >
            {estado.mensaje}
          </p>
        )}
      </div>

      {/* Campo trampa: fuera de la pantalla y fuera del recorrido del teclado.
          Una persona no lo ve nunca; un robot que rellena todo cae. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-0 w-px h-px overflow-hidden">
        <label htmlFor={CAMPO_TRAMPA}>No rellenar este campo</label>
        <input
          id={CAMPO_TRAMPA}
          name={CAMPO_TRAMPA}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <input type="hidden" name="token" value={inicio?.token ?? ""} />
      {respuesta !== null && (
        <input type="hidden" name="respuesta" value={respuesta} />
      )}

      <Pie
        paso={paso}
        ultimo={ultimo}
        pendiente={pendiente}
        listoParaEnviar={listoParaEnviar}
        onAtras={() => setPaso((p) => Math.max(p - 1, 0))}
        onSiguiente={siguiente}
      />
    </form>
  );
}

/* ───────────────────────── Piezas del formulario ───────────────────────── */

function Cabecera({ paso, onCerrar }: { paso: number; onCerrar: () => void }) {
  const avance = ((paso + 1) / PASOS.length) * 100;

  return (
    <header className="border-b border-cuero/35 px-6 sm:px-8 pt-6 pb-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="antetitulo antetitulo--izq">Solicitud de reserva</p>
          <h2 className="titulo-display text-2xl sm:text-3xl mt-2">
            {PASOS[paso].titulo}
          </h2>
        </div>
        <button
          type="button"
          className="cerrar shrink-0"
          onClick={onCerrar}
          aria-label="Cerrar solicitud"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </button>
      </div>

      <div className="mt-5">
        <div
          className="h-1 rounded-full bg-cuero/30 overflow-hidden"
          role="progressbar"
          aria-valuenow={paso + 1}
          aria-valuemin={1}
          aria-valuemax={PASOS.length}
          aria-label={`Paso ${paso + 1} de ${PASOS.length}`}
        >
          <div
            className="h-full bg-gradient-to-r from-cuero-claro to-atardecer transition-[width] duration-500 ease-[var(--ease-salida)]"
            style={{ width: `${avance}%` }}
          />
        </div>
        <ol className="hidden sm:flex justify-between mt-2.5">
          {PASOS.map((p, i) => (
            <li
              key={p.titulo}
              aria-current={i === paso ? "step" : undefined}
              className={`text-[0.64rem] uppercase tracking-[0.16em] transition-colors ${
                i <= paso ? "text-atardecer" : "text-crema/35"
              }`}
            >
              {p.titulo}
            </li>
          ))}
        </ol>
      </div>
    </header>
  );
}

/** Un paso. Se oculta con `hidden` para que sus campos sigan enviándose. */
function Paso({
  activo,
  titulo,
  children,
}: {
  activo: boolean;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset hidden={!activo} className={activo ? "aparecer" : undefined}>
      <legend className="sr-only">{titulo}</legend>
      {children}
    </fieldset>
  );
}

function Contador({
  valor,
  onCambio,
  invalido,
}: {
  valor: number;
  onCambio: (n: number) => void;
  invalido: boolean;
}) {
  const ajustar = (delta: number) =>
    onCambio(Math.min(Math.max(valor + delta, 1), MAX_CABALLOS));

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => ajustar(-1)}
        disabled={valor <= 1}
        aria-label="Un caballo menos"
        className="cerrar cerrar--recto w-11 h-11 shrink-0 disabled:opacity-40"
      >
        −
      </button>
      <input
        id="numCaballos"
        name="numCaballos"
        type="number"
        min={1}
        max={MAX_CABALLOS}
        value={valor}
        onChange={(e) => onCambio(Number(e.target.value))}
        aria-invalid={invalido}
        aria-describedby={invalido ? "numCaballos-error" : "numCaballos-ayuda"}
        className="campo text-center tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:hidden"
      />
      <button
        type="button"
        onClick={() => ajustar(1)}
        disabled={valor >= MAX_CABALLOS}
        aria-label="Un caballo más"
        className="cerrar cerrar--recto w-11 h-11 shrink-0 disabled:opacity-40"
      >
        +
      </button>
    </div>
  );
}

function Resumen({ datos }: { datos: DatosReserva }) {
  const filas = [
    { etiqueta: "Evento", valor: datos.tipoEvento },
    {
      etiqueta: "Fecha",
      valor: datos.fechaEvento
        ? new Date(`${datos.fechaEvento}T12:00:00`).toLocaleDateString("es-MX", {
            dateStyle: "long",
          })
        : "—",
    },
    { etiqueta: "Caballos", valor: String(datos.numCaballos) },
    { etiqueta: "Nombre", valor: datos.nombre || "—" },
    { etiqueta: "Teléfono", valor: datos.telefono || "—" },
    { etiqueta: "Correo", valor: datos.email || "—" },
    { etiqueta: "Lugar", valor: datos.lugar || "—" },
    { etiqueta: "Invitados", valor: datos.invitados || "—" },
  ];

  return (
    <>
      <p className="text-crema/70 text-sm leading-relaxed">
        Revisa que todo esté bien. Al enviar, el equipo del rancho te escribe
        para afinar los detalles.
      </p>

      <dl className="mt-5 grid sm:grid-cols-2 gap-x-6 gap-y-3.5 rounded-xl border border-cuero/35 bg-carbon/45 p-5">
        {filas.map((f) => (
          <div key={f.etiqueta} className="flex justify-between gap-3">
            <dt className="text-crema/45 text-[0.68rem] uppercase tracking-[0.14em] pt-0.5">
              {f.etiqueta}
            </dt>
            <dd className="text-crema/90 text-sm text-right">{f.valor}</dd>
          </div>
        ))}
      </dl>

      {datos.mensaje && (
        <p className="mt-4 text-crema/70 text-sm italic border-l-2 border-cuero pl-4">
          {datos.mensaje}
        </p>
      )}
    </>
  );
}

/**
 * Verificación de vaquero.
 *
 * Una pregunta de sentido común en lugar de un captcha de terceros: no manda
 * datos de quien rellena a ningún servicio externo, no necesita cookies y se
 * contesta con un clic. La respuesta correcta vive solo en el servidor.
 */
function Verificacion({
  inicio,
  respuesta,
  onResponder,
}: {
  inicio: InicioSolicitud | null;
  respuesta: number | null;
  onResponder: (i: number) => void;
}) {
  if (!inicio) {
    return (
      <p className="mt-6 text-crema/50 text-sm flex items-center gap-2">
        <span className="girar inline-block" aria-hidden="true">
          ✳
        </span>
        Preparando la verificación…
      </p>
    );
  }

  return (
    <div className="mt-6 rounded-xl border border-cuero/35 bg-carbon/45 p-5">
      <p className="antetitulo antetitulo--izq">Verificación de vaquero</p>
      <p className="text-crema/85 mt-2.5" id="pregunta-verificacion">
        {inicio.pregunta.texto}
      </p>

      <div
        role="group"
        aria-labelledby="pregunta-verificacion"
        className="flex flex-wrap gap-2.5 mt-4"
      >
        {inicio.pregunta.opciones.map((opcion, i) => (
          <button
            key={opcion}
            type="button"
            aria-pressed={respuesta === i}
            onClick={() => onResponder(i)}
            className="opcion items-center text-sm px-5"
          >
            {opcion}
          </button>
        ))}
      </div>

      {inicio.demo && (
        <p className="text-crema/40 text-xs mt-4">
          Modo demostración: Supabase no está conectado, así que la solicitud no
          se guarda en ningún sitio.
        </p>
      )}
    </div>
  );
}

function Pie({
  paso,
  ultimo,
  pendiente,
  listoParaEnviar,
  onAtras,
  onSiguiente,
}: {
  paso: number;
  ultimo: boolean;
  pendiente: boolean;
  listoParaEnviar: boolean;
  onAtras: () => void;
  onSiguiente: () => void;
}) {
  return (
    <footer className="flex items-center justify-between gap-4 border-t border-cuero/35 px-6 sm:px-8 py-5">
      {paso > 0 ? (
        <button type="button" onClick={onAtras} className="btn btn--texto">
          ← Atrás
        </button>
      ) : (
        <p className="text-crema/40 text-xs">
          Paso {paso + 1} de {PASOS.length}
        </p>
      )}

      {ultimo ? (
        <button
          type="submit"
          disabled={pendiente || !listoParaEnviar}
          className="btn btn--fuego"
        >
          {pendiente ? (
            <>
              <span className="girar inline-block" aria-hidden="true">
                ✳
              </span>
              Enviando…
            </>
          ) : (
            <>
              <Icono name="herradura" className="w-5 h-5" />
              Enviar solicitud
            </>
          )}
        </button>
      ) : (
        <button type="button" onClick={onSiguiente} className="btn btn--fuego">
          Continuar →
        </button>
      )}
    </footer>
  );
}

function Enviado({
  demo,
  onCerrar,
}: {
  demo: boolean;
  onCerrar: () => void;
}) {
  return (
    <div className="panel p-9 text-center aparecer">
      <p className="text-5xl" aria-hidden="true">
        🤠
      </p>
      <h2 className="titulo-display text-3xl mt-4">¡Solicitud recibida!</h2>
      <p className="text-crema/80 mt-3 leading-relaxed">
        Gracias por tu interés. El equipo del rancho te contacta muy pronto para
        afinar los detalles de tu evento.
      </p>

      {demo && (
        <p className="text-crema/40 text-xs mt-4">
          (Modo demostración: no se guardó nada. Conecta Supabase para recibir
          las solicitudes de verdad.)
        </p>
      )}

      <div className="flex flex-wrap gap-3 justify-center mt-7">
        <a
          href={`https://wa.me/${contacto.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--fuego"
        >
          Escribir por WhatsApp
        </a>
        <button type="button" onClick={onCerrar} className="btn btn--fantasma">
          Cerrar
        </button>
      </div>
    </div>
  );
}
