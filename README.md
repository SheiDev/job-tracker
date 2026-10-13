# Slate

Slate es una aplicación web para organizar y dar seguimiento a postulaciones de empleo. Permite registrar ofertas, revisar su avance y guardar notas de cada contacto.

## Funciones

- Crear, editar y eliminar postulaciones.
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

## Tecnologías

- React
- Vite
- CSS
