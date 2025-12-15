// app/productos/[slug]/page.tsx

import { fetchProductBySlug, fetchProducts } from '@/lib/contentfulClient';
import BotonMercadoPago from '@/components/BotonMercadoPago'; 
import PaymentStatus from '@/components/PaymentStatus'; // <-- Componente de Confirmación
import { notFound } from 'next/navigation';
import Image from 'next/image';
import React from 'react'; // Necesario para tipar los estilos React.CSSProperties

// TIP: Usamos el type de producto para la autocompletación
interface Product {
    id: string;
    nombre: string;
    precio: number;
    slug: string;
    descripcion: string;
    imageUrl: string | null; // Corregido: Permite ser null
}

// 1. FUNCIÓN PARA GENERAR RUTAS ESTÁTICAS (Performance)
export async function generateStaticParams() {
    const products = await fetchProducts();

    return products.map((product) => ({
        slug: product.slug,
    }));
}


// 2. EL COMPONENTE DE LA PÁGINA DE DETALLE
export default async function ProductPage({ params }: { params: { slug: string } }) {
    // Obtiene el producto usando el slug de la URL
    const product: Product | null = await fetchProductBySlug(params.slug);

    if (!product) {
        notFound();
    }

    return (
        <div style={containerStyle}>
            <div style={detailsStyle}>
                
                {/* *** INICIO DE LA INTEGRACIÓN DE CONFIRMACIÓN ***
                  Muestra el mensaje de Éxito, Fallido o Pendiente si hay un parámetro 'status' en la URL.
                */}
                <PaymentStatus productName={product.nombre} />
                
                <h1>{product.nombre}</h1>
                <p style={priceStyle}>
                    **Precio:** ${product.precio.toLocaleString('es-CL')} CLP
                </p>
                <p>{product.descripcion}</p>
                
                {/*
                  El Botón de Mercado Pago (Componente Cliente)
                */}
                <BotonMercadoPago product={product} />

            </div>
            <div style={imageWrapperStyle}>
                {/* Uso del componente Image de Next.js para optimización */}
                <Image 
                    src={product.imageUrl || '/placeholder.png'} 
                    alt={product.nombre} 
                    fill
                    style={{ objectFit: 'contain' }}
                />
            </div>
        </div>
    );
}

// --- Estilos Básicos (Tipados con React.CSSProperties) ---
const containerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '40px',
    padding: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
    flexDirection: 'row', // Asegura que los detalles y la imagen estén lado a lado
};

const imageWrapperStyle: React.CSSProperties = {
    position: 'relative', 
    flex: '1',
    minHeight: '400px', 
    border: '1px solid #eee',
    borderRadius: '8px'
};

const detailsStyle: React.CSSProperties = {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
};

const priceStyle: React.CSSProperties = {
    fontSize: '1.8em',
    fontWeight: 'bold',
    color: '#009ee3' 
}