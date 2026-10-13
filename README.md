# Slate

Slate es una aplicación web para organizar y dar seguimiento a postulaciones de empleo. Permite registrar ofertas, revisar su avance y guardar notas de cada contacto.

Proyecto final (TPF) del curso de Ada.

## Demo

Versión publicada en Vercel: [job-tracker-opal-nine.vercel.app](https://job-tracker-opal-nine.vercel.app/)

## Funciones

- Crear, editar y eliminar postulaciones, con confirmación antes de borrar.
- Seguir seis etapas del proceso y registrar el resultado.
- Añadir y editar actividades, fechas, notas y seguimientos.
- Filtrar postulaciones activas y cerradas.
- Cambiar el idioma entre español e inglés y alternar el modo claro y oscuro.
- Adaptar los formularios y la vista a pantallas móviles y de escritorio.
- Guardar los datos en el almacenamiento local del navegador.
- Descargar las postulaciones y sus actividades como archivo CSV compatible con hojas de cálculo.

## Requisitos

- Node.js
- pnpm

## Ejecutar el proyecto

Instala las dependencias:

```bash
pnpm install
```

Inicia el servidor de desarrollo:

```bash
pnpm dev
```

Abre en el navegador la dirección local que muestra la terminal.

## Comandos disponibles

```bash
pnpm dev      # Inicia el servidor de desarrollo
pnpm build    # Genera la versión de producción en dist/
pnpm preview  # Sirve localmente la versión de producción
pnpm lint     # Revisa el código con ESLint
```

## Almacenamiento

Las postulaciones se guardan en el navegador y dispositivo donde se usa Slate. No se sincronizan automáticamente con otros dispositivos. Para conservar una copia externa, descarga el archivo CSV desde la aplicación.

## Estructura

```text
src/
├── main.jsx                    # Punto de entrada de React
├── App.jsx                     # Estado principal, tema e idioma
├── i18n.js                     # Textos en inglés y español
├── index.css                   # Colores de cada tema y fondo cuadriculado
├── App.css                     # Estilos de la aplicación
└── components/
    ├── ApplicationForm.jsx     # Formulario para agregar postulaciones
    ├── ApplicationList.jsx     # Lista, filtro y descarga CSV
    ├── Application.jsx         # Tarjeta de cada postulación
    ├── ActivityForm.jsx        # Formulario para agregar o editar actividades
    └── Icons.jsx               # Iconos SVG
```

## Diseño

- Estilo de papelería: tarjetas sin bordes redondeados, sombras sólidas y fondo de hoja cuadriculada.
- Paleta ciruela y rosa empolvado, con versión clara y oscura.
- Tipografías: Cormorant Garamond para títulos y cifras, IBM Plex Mono para el resto del texto.

## Tecnologías

- React
- Vite
- CSS
