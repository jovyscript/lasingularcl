import { fetchProducts } from '../lib/contentfulClient';
import Link from 'next/link';
import React from 'react'; // Necesario para tipar los estilos

// TIP: Interfaz simple para los datos que usamos de Contentful
interface Product {
    id: string;
    nombre: string;
    precio: number;
    slug: string;
    imageUrl: string | null;
}

// Next.js llama a esta función para obtener y pre-renderizar la lista de productos
export default async function HomePage() {
  const products: Product[] = await fetchProducts();
  
  if (products.length === 0) {
    return (
      <div style={emptyContainerStyle}>
        <h2>¡Aún no hay productos publicados en Contentful!</h2>
        <p>Asegúrate de que tus productos estén creados y PUBLIICADOS en tu Contentful Space.</p>
      </div>
    );
  }
  
  return (
    <div style={mainContainerStyle}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
          ¡Bienvenido a La Singular Tienda Chilena! 🇨🇱
      </h1>
      <div style={gridStyle}>
        {products.map((product) => (
          <div key={product.id} style={cardStyle}>
            <img 
                src={product.imageUrl || '/placeholder.png'} 
                alt={product.nombre} 
                style={imageStyle} 
            />
            <h2>{product.nombre}</h2>
            <p style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#333' }}>
              ${product.precio.toLocaleString('es-CL')} CLP
            </p>
            {/* Link a la página de detalle del producto */}
            <Link href={`/productos/${product.slug}`} style={linkStyle}>
              Ver Detalle
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Estilos Básicos ---
const mainContainerStyle: React.CSSProperties = {
    padding: '40px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
};

const emptyContainerStyle: React.CSSProperties = {
    padding: '50px',
    textAlign: 'center',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '8px',
    border: '1px solid #f5c6cb'
};

const gridStyle: React.CSSProperties = {
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
    gap: '30px',
    justifyContent: 'center'
};

const cardStyle: React.CSSProperties = {
    border: '1px solid #ccc',
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '4px 4px 8px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s'
};

const imageStyle: React.CSSProperties = {
    width: '100%', 
    height: '220px', 
    objectFit: 'cover', 
    borderRadius: '4px',
    marginBottom: '10px'
};

const linkStyle: React.CSSProperties = {
    display: 'inline-block',
    marginTop: '15px',
    padding: '10px 20px',
    backgroundColor: '#0070f3',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    fontWeight: 'bold'
};