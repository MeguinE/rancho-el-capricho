type Props = {
  nombre: string;
  etiqueta: string;
  valor?: string;
  /**
   * Distingue este campo de otro con el mismo `nombre` en la misma página.
   * Hace falta cuando se repite un formulario en bucle: los `id` tienen que
   * ser únicos en todo el documento o la etiqueta apunta al campo equivocado.
   */
  sufijo?: string;
  /** Un valor mayor que 1 renderiza un área de texto. */
  filas?: number;
  placeholder?: string;
  className?: string;
};

/**
 * Campo de texto del panel, con su etiqueta enlazada.
 *
 * Los formularios del panel se envían con Server Actions, así que los campos
 * no necesitan estado: van sin controlar y con `defaultValue`.
 */
export default function CampoAdmin({
  nombre,
  etiqueta,
  valor = "",
  sufijo,
  filas = 1,
  placeholder,
  className = "",
}: Props) {
  const id = sufijo ? `${nombre}-${sufijo}` : nombre;

  const comun = {
    id,
    name: nombre,
    defaultValue: valor,
    placeholder,
  };

  return (
    <div className={className}>
      <label htmlFor={id} className="etiqueta-campo text-[0.68rem]">
        {etiqueta}
      </label>
      {filas > 1 ? (
        <textarea
          {...comun}
          rows={filas}
          className="campo campo--compacto resize-y"
        />
      ) : (
        <input {...comun} type="text" className="campo campo--compacto" />
      )}
    </div>
  );
}
