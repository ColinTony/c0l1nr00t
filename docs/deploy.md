# Despliegue

## Netlify (Recomendado)

Este proyecto está optimizado para Netlify.

1.  Conecta tu repositorio a Netlify.
2.  Configuración de Build:
    - **Build command**: `npm run build`
    - **Publish directory**: `dist`
3.  Netlify detectará automáticamente el archivo `astro.config.mjs`.

### Netlify Forms

El formulario de contacto usa Netlify Forms. No necesitas backend.
Asegúrate de que el atributo `data-netlify="true"` esté presente en el `<form>` (ya configurado en `src/pages/es/contact.astro`).

Los envíos aparecerán en el panel de Netlify bajo "Forms".

## Variables de Entorno

Configura estas variables en Netlify (Site settings > Build & deploy > Environment):

- `PUBLIC_ANALYTICS_ID`: (Opcional) ID para tu script de analytics.

## Vercel / Otros

Para desplegar en Vercel, instala el adaptador:

```bash
npx astro add vercel
```

Y sigue las instrucciones de Astro.
