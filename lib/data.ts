/*
  Contenido editable del sitio.

  📸 CÓMO PONER TUS FOTOS
  ------------------------------------------------------------------
  Las imágenes que ves ahora son de demostración (Unsplash) para que el
  sitio se vea "terminado". Para usar las tuyas:

    1. Copia tu foto a la carpeta  /public/img   (ej: relampago.jpg)
    2. Cambia el valor de "img" por  "/img/relampago.jpg"

  Si dejas "img" vacío ("") se mostrará un marco placeholder elegante.
  ------------------------------------------------------------------
*/

const U = "https://images.unsplash.com";
// Helper para construir URLs de demostración optimizadas
const demo = (id: string, w = 1200) =>
  `${U}/${id}?auto=format&fit=crop&q=80&w=${w}`;

// Imágenes de fondo / hero (reemplázalas por las tuyas en /public/img)
export const fotos = {
  hero: demo("photo-1553284965-83fd3e82fa5a", 1920),
  historia: demo("photo-1444858291040-58f756a3bdd6", 1200),
  cita: demo("photo-1598974357801-cbca100e65d3", 1920),
};

// Cifras que se muestran en el hero y en la sección de historia
export const logros = [
  { valor: 10, etiqueta: "Años de experiencia" },
  { valor: 15, etiqueta: "Caballos entrenados" },
  { valor: 200, etiqueta: "Eventos realizados" },
];

// Frases de la cinta en movimiento
export const cintaItems = [
  "Bodas de ensueño",
  "XV Años inolvidables",
  "Cabalgatas al atardecer",
  "Sesiones fotográficas",
  "Eventos corporativos",
  "Caballos de exhibición",
];

export type Caballo = {
  nombre: string;
  raza: string;
  descripcion: string;
  temperamento: string;
  img?: string;
};

export const caballos: Caballo[] = [
  {
    nombre: "Relámpago",
    raza: "Azteca",
    descripcion:
      "Noble y elegante, perfecto para entradas de novia y fotografías de alto impacto.",
    temperamento: "Dócil",
    img: demo("photo-1450052590821-8bf91254a353", 800),
  },
  {
    nombre: "Lucero",
    raza: "Islandés",
    descripcion:
      "El consentido de los niños. Tranquilo, paciente y de melena espectacular.",
    temperamento: "Tierno",
    img: demo("photo-1566251037378-5e04e3bec343", 800),
  },
  {
    nombre: "Tornado",
    raza: "Pura Sangre",
    descripcion:
      "Mirada imponente y porte de campeón. El favorito para bodas y sesiones dramáticas.",
    temperamento: "Imponente",
    img: demo("photo-1598974357801-cbca100e65d3", 800),
  },
  {
    nombre: "Canela",
    raza: "Cuarto de Milla",
    descripcion:
      "Manto cálido y carácter dulce. Ideal para cabalgatas y eventos al atardecer.",
    temperamento: "Noble",
    img: demo("photo-1534773728080-33d31da27ae5", 800),
  },
];

export type Servicio = {
  titulo: string;
  descripcion: string;
  icono: "anillo" | "herradura" | "camara" | "sombrero";
};

export const servicios: Servicio[] = [
  {
    titulo: "Bodas & XV Años",
    descripcion:
      "Entradas espectaculares a caballo, carruajes y sesiones que tus invitados jamás olvidarán.",
    icono: "anillo",
  },
  {
    titulo: "Cabalgatas",
    descripcion:
      "Recorridos guiados por el rancho al amanecer o atardecer, para grupos y familias.",
    icono: "herradura",
  },
  {
    titulo: "Sesiones Fotográficas",
    descripcion:
      "Escenario vaquero auténtico con caballos amaestrados para fotógrafos y producciones.",
    icono: "camara",
  },
  {
    titulo: "Eventos Corporativos",
    descripcion:
      "Días de campo, team building y celebraciones de empresa con sabor ranchero.",
    icono: "sombrero",
  },
];

// Pasos de "Cómo funciona"
export const pasos = [
  {
    n: "01",
    titulo: "Cuéntanos tu evento",
    descripcion:
      "Llena el formulario o escríbenos por WhatsApp con la fecha, lugar y el tipo de celebración.",
  },
  {
    n: "02",
    titulo: "Diseñamos la experiencia",
    descripcion:
      "Elegimos juntos los caballos y el montaje ideal para tu evento y presupuesto.",
  },
  {
    n: "03",
    titulo: "Vive el momento",
    descripcion:
      "Llegamos puntuales con todo listo para que solo te dediques a disfrutar y crear recuerdos.",
  },
];

// Testimonios
export const testimonios = [
  {
    texto:
      "La entrada de mi hija a sus XV años en el caballo blanco fue el momento más mágico de la noche. ¡Todos quedaron impactados!",
    autor: "María Fernanda G.",
    evento: "XV Años",
  },
  {
    texto:
      "Súper profesionales y puntuales. Los caballos hermosos y muy tranquilos. Las fotos de la boda quedaron de revista.",
    autor: "Carlos y Ana",
    evento: "Boda",
  },
  {
    texto:
      "Contratamos la cabalgata para un día de empresa y fue un éxito total. El equipo nos cuidó en todo momento.",
    autor: "Roberto M.",
    evento: "Evento corporativo",
  },
];

// Galería de eventos (reemplaza por tus fotos en /public/img)
export const galeria = [
  { img: demo("photo-1553284965-83fd3e82fa5a", 1000), alt: "Caballo galopando", span: "ancho" },
  { img: demo("photo-1452378174528-3090a4bba7b2", 800), alt: "Caballos en el rancho" },
  { img: demo("photo-1500595046743-cd271d694d30", 800), alt: "Atardecer en el campo" },
  { img: demo("photo-1598974357801-cbca100e65d3", 1000), alt: "Retrato de caballo", span: "alto" },
  { img: demo("photo-1566251037378-5e04e3bec343", 800), alt: "Caballo de melena dorada" },
  { img: demo("photo-1444858291040-58f756a3bdd6", 800), alt: "Granero del rancho" },
  { img: demo("photo-1450052590821-8bf91254a353", 1000), alt: "Caballo en la pradera", span: "ancho" },
  { img: demo("photo-1534773728080-33d31da27ae5", 800), alt: "Caballo pastando" },
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
