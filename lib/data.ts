/*
  Contenido editable del sitio.
  Cambia estos textos a tu gusto. Cuando agregues fotos, pon el archivo en
  /public/img y escribe la ruta en "img" (por ejemplo: "/img/relampago.jpg").
  Si dejas "img" vacío, se muestra un marco placeholder con un ícono.
*/

export type Caballo = {
  nombre: string;
  raza: string;
  descripcion: string;
  img?: string;
};

export const caballos: Caballo[] = [
  {
    nombre: "Relámpago",
    raza: "Azteca",
    descripcion:
      "Noble y elegante, perfecto para fotografías y entradas de novia. Dócil con jinetes principiantes.",
    img: "",
  },
  {
    nombre: "Lucero",
    raza: "Cuarto de Milla",
    descripcion:
      "El consentido de los niños. Tranquilo, paciente y siempre listo para una buena foto.",
    img: "",
  },
  {
    nombre: "Tornado",
    raza: "Frisón",
    descripcion:
      "Imponente melena negra. El favorito para bodas y sesiones de alto impacto visual.",
    img: "",
  },
  {
    nombre: "Canela",
    raza: "Appaloosa",
    descripcion:
      "Manto único y carácter dulce. Ideal para cabalgatas y eventos al atardecer.",
    img: "",
  },
];

export type Servicio = {
  titulo: string;
  descripcion: string;
  icono: string; // emoji o símbolo
};

export const servicios: Servicio[] = [
  {
    titulo: "Bodas & XV Años",
    descripcion:
      "Entradas espectaculares a caballo, carruajes y sesiones de fotos que tus invitados nunca olvidarán.",
    icono: "💍",
  },
  {
    titulo: "Cabalgatas",
    descripcion:
      "Recorridos guiados por el rancho al amanecer o atardecer, para grupos y familias.",
    icono: "🐎",
  },
  {
    titulo: "Sesiones Fotográficas",
    descripcion:
      "Escenario vaquero auténtico con caballos amaestrados para fotógrafos y producciones.",
    icono: "📸",
  },
  {
    titulo: "Eventos Corporativos",
    descripcion:
      "Días de campo, team building y celebraciones de empresa con sabor ranchero.",
    icono: "🤠",
  },
];

// Tipos de evento que aparecen en el formulario de reserva
export const tiposDeEvento = [
  "Boda",
  "XV Años",
  "Cabalgata",
  "Sesión fotográfica",
  "Evento corporativo",
  "Cumpleaños",
  "Otro",
];

export const contacto = {
  telefono: "+52 000 000 0000",
  whatsapp: "5210000000000", // sin signos, para el enlace de WhatsApp
  email: "hola@ranchoelcapricho.mx",
  ubicacion: "Camino al Rancho s/n, tu ciudad, México",
  instagram: "https://instagram.com/",
  facebook: "https://facebook.com/",
};
