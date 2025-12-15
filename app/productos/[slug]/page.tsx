// app/productos/[slug]/page.tsx

import { fetchProductBySlug, fetchProducts } from '@/lib/contentfulClient';
import BotonMercadoPago from '@/components/BotonMercadoPago'; 
import PaymentStatus from '@/components/PaymentStatus'; 
import { notFound } from 'next/navigation';
import Image from 'next/image';
import React, { Suspense } from 'react'; // <-- IMPORTANTE: Importamos Suspense

// TIP: Usamos el type de producto para la autocompletación
interface Product {
    id: string;
    nombre: string;
    precio: number;
    slug: string;
    descripcion: string;
    imageUrl: string | null;
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
                
                {/* *** INICIO DE LA CORRECCIÓN CON SUSPENSE *** */}
                {/* Esto evita que Next.js intente ejecutar useSearchParams() en el servidor.
                  La lógica de estado de pago solo se ejecutará cuando el cliente se hidrate en el navegador.
                */}
                <Suspense fallback={
                    // El "fallback" es lo que se muestra mientras el componente cliente carga
                    <div style={{ padding: '15px', backgroundColor: '#e9ecef', borderRadius: '8px' }}>
                        Verificando estado de pago...
                    </div>
                }>
                    <PaymentStatus productName={product.nombre} />
                </Suspense>
                
                <h1>{product.nombre}</h1>
                <p style={priceStyle}>
                    **Precio:** ${product.precio.toLocaleString('es-CL')} CLP
                </p>
                <p>{product.descripcion}</p>
                
                <BotonMercadoPago product={product} />

            </div>
            <div style={imageWrapperStyle}>
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

// --- Estilos Básicos (sin cambios) ---
const containerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '40px',
    padding: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
    flexDirection: 'row', 
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