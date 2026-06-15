/* Íconos western en SVG (line-art) para los servicios. */

type Props = { name: string; className?: string };

export default function Icono({ name, className = "w-9 h-9" }: Props) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "anillo":
      return (
        <svg {...common}>
          <path d="M8 8.5 12 4l4 4.5" />
          <circle cx="12" cy="15" r="5.5" />
          <path d="m10 8.5 2 2 2-2" />
        </svg>
      );
    case "herradura":
      return (
        <svg {...common}>
          <path d="M7 21c-2-1.5-3-4-3-7a8 8 0 0 1 16 0c0 3-1 5.5-3 7" />
          <circle cx="7" cy="20" r="0.6" fill="currentColor" />
          <circle cx="17" cy="20" r="0.6" fill="currentColor" />
          <circle cx="5.2" cy="16" r="0.6" fill="currentColor" />
          <circle cx="18.8" cy="16" r="0.6" fill="currentColor" />
        </svg>
      );
    case "camara":
      return (
        <svg {...common}>
          <path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L19 6h0a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
          <circle cx="12" cy="12.5" r="3.5" />
        </svg>
      );
    case "sombrero":
      return (
        <svg {...common}>
          <path d="M8 14c-.5-5 .5-9 4-9s4.5 4 4 9" />
          <path d="M3 15c2.5 2 6 3 9 3s6.5-1 9-3" />
          <path d="M5.5 14.3C3.8 14.8 3 15.4 3 15c0-.4 2-1 2-1" />
          <path d="M18.5 14.3c1.7.5 2.5 1.1 2.5.7 0-.4-2-1-2-1" />
        </svg>
      );
    default:
      return null;
  }
}
