'use client'; 

import React from 'react';
import { useSearchParams } from 'next/navigation';

interface PaymentStatusProps {
    productName: string;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ productName }) => {
    // Lee los parámetros de la URL
    const searchParams = useSearchParams();
    const status = searchParams.get('status');

    if (!status) {
        // No hay estado de pago en la URL, no mostrar nada.
        return null;
    }

    // Definimos el contenido y estilo según el estado
    let message: string;
    let style: React.CSSProperties;

    switch (status) {
        case 'success':
            message = `¡🎉 Pago Exitoso! Tu orden del producto "${productName}" ha sido confirmada. Pronto recibirás los detalles por correo.`;
            style = { backgroundColor: '#d4edda', color: '#155724', padding: '15px', borderRadius: '8px', border: '1px solid #c3e6cb' };
            break;
            
        case 'pending':
            message = `⏳ Pago Pendiente. Estamos esperando la confirmación de tu pago para el producto "${productName}". Esto puede tardar unos minutos. Te avisaremos cuando se confirme.`;
            style = { backgroundColor: '#fff3cd', color: '#856404', padding: '15px', borderRadius: '8px', border: '1px solid #ffeeba' };
            break;

        case 'failure':
        default:
            message = `❌ Pago Fallido. No pudimos procesar tu pago para el producto "${productName}". Por favor, revisa tus datos o intenta con otro método.`;
            style = { backgroundColor: '#f8d7da', color: '#721c24', padding: '15px', borderRadius: '8px', border: '1px solid #f5c6cb' };
            break;
    }

    return (
        <div style={style}>
            <p style={{ fontWeight: 'bold' }}>{message}</p>
        </div>
    );
};

export default PaymentStatus;