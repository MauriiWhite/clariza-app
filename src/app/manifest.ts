// PWA manifest dinamico. Permite instalar Clariza como app en celular.

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Clariza — Tu reclamo financiero, sin abogados",
    short_name: "Clariza",
    description:
      "Asistente IA para reclamos financieros chilenos. Encuentra al regulador correcto, calcula plazos y genera el reclamo formal.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF7F2",
    theme_color: "#CC785C",
    lang: "es-CL",
    orientation: "portrait",
    icons: [
      {
        src: "/icon",
        sizes: "64x64",
        type: "image/png",
      },
    ],
  };
}
