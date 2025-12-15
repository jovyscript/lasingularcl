// lib/contentfulClient.js

const contentful = require('contentful');

const { CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN } = process.env;

if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
  throw new Error(
    "¡Faltan las variables de entorno de Contentful! Asegúrate de tener CONTENTFUL_SPACE_ID y CONTENTFUL_ACCESS_TOKEN en tu archivo .env.local"
  );
}

const client = contentful.createClient({
  space: CONTENTFUL_SPACE_ID,
  accessToken: CONTENTFUL_ACCESS_TOKEN,
});

// Helper para limpiar y formatear la entrada de Contentful
function formatProductEntry(item) {
    if (!item || !item.fields) return null;
    return {
        id: item.sys.id,
        nombre: item.fields.nombre,
        precio: item.fields.precio,
        slug: item.fields.slug,
        descripcion: item.fields.descripcion,
        // *** INICIO DE LA CORRECCIÓN ***
        // Usamos el encadenamiento opcional (?.) para asegurar que cada propiedad existe
        imageUrl: item.fields.imagenPrincipal?.fields?.file?.url 
            ? `https:${item.fields.imagenPrincipal.fields.file.url}` 
            : null,
    };
}

/**
 * Función para obtener todos los productos del catálogo.
 */
export async function fetchProducts() {
  try {
    const entries = await client.getEntries({
      content_type: 'producto',
      select: 'sys.id,fields.nombre,fields.precio,fields.slug,fields.imagenPrincipal,fields.descripcion',
      order: '-sys.createdAt'
    });

    return entries.items.map(formatProductEntry).filter(p => p !== null);

  } catch (error) {
    console.error("Error al obtener los productos de Contentful:", error);
    return [];
  }
}

/**
 * Función para obtener un solo producto por su slug.
 * @param {string} slug - El slug del producto a buscar.
 */
export async function fetchProductBySlug(slug) {
    try {
        const entries = await client.getEntries({
            content_type: 'producto',
            'fields.slug': slug, // ¡Filtra por el campo 'slug'!
            limit: 1 // Solo necesitamos un resultado
        });

        // Retorna el primer y único producto encontrado (si existe)
        return formatProductEntry(entries.items[0]);

    } catch (error) {
        console.error(`Error al obtener el producto con slug ${slug}:`, error);
        return null;
    }
}