# Sistema de Asistencia QR

Sistema de control de asistencias de alumnos utilizando códigos QR.

## Características

- Gestión de estudiantes por curso y división
- Generación de códigos QR para cada estudiante basados en su DNI
- Escaneo de códigos QR para registrar asistencia
- Visualización de estadísticas de asistencia
- Historial de asistencias por estudiante
- Almacenamiento de datos en Supabase

## Tecnologías utilizadas

- React
- TypeScript
- Tailwind CSS
- Supabase (base de datos)
- HTML5-QRCode (escaneo de códigos QR)
- React QR Code (generación de códigos QR)

## Configuración de Supabase

1. Crea una cuenta en [Supabase](https://supabase.com/)
2. Crea un nuevo proyecto
3. Ejecuta las migraciones SQL que se encuentran en la carpeta `supabase/migrations`
4. Copia las credenciales de tu proyecto (URL y Anon Key)
5. Crea un archivo `.env` basado en `.env.example` y añade tus credenciales

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

## Estructura del proyecto

- `/src/components`: Componentes reutilizables
- `/src/context`: Contexto de React para la gestión del estado
- `/src/lib`: Utilidades y configuración de Supabase
- `/src/pages`: Páginas de la aplicación
- `/src/types`: Definiciones de tipos TypeScript
- `/supabase/migrations`: Scripts SQL para la configuración de la base de datos