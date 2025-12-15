// components/BotonMercadoPago.tsx
'use client'; // ¡IMPORTANTE! Marca este componente como interactivo del lado del cliente

import React, { useState } from 'react';

// Definición de las propiedades que recibe del componente de página
interface Product {
    nombre: string;
    precio: number;
    slug: string;
}

const BotonMercadoPago: React.FC<{ product: Product }> = ({ product }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckout = async () => {
        setIsLoading(true);

        try {
            // 1. Llamar a nuestra API Route: /api/checkout
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Enviamos los datos mínimos necesarios para crear el pago
                body: JSON.stringify({
                    title: product.nombre,
                    unit_price: product.precio,
                    quantity: 1, // Asumimos 1 por simplicidad; podrías integrar un carrito.
                    product_slug: product.slug,
                }),
            });

            const data = await response.json();

            if (response.ok && data.init_point) {
                // 2. Redirigir al usuario al Checkout de Mercado Pago
                window.location.href = data.init_point;
            } else {
                alert(`Error al generar el pago: ${data.message || 'Error desconocido'}`);
            }

        } catch (error) {
            console.error('Error al iniciar el proceso de pago:', error);
            alert('Hubo un problema de conexión con el servicio de pago. Intenta más tarde.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button 
            onClick={handleCheckout} 
            disabled={isLoading}
            style={buttonStyle}
        >
            {isLoading 
                ? 'Procesando pago...' 
                : `Pagar $${product.precio.toLocaleString('es-CL')} con Mercado Pago`
            }
        </button>
    );
};

export default BotonMercadoPago;

// --- Estilos Básicos para el Ejemplo ---
const buttonStyle: React.CSSProperties = {
    padding: '12px 25px',
    backgroundColor: '#009ee3', // Color primario de Mercado Pago
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1.1em',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
};