// app/api/checkout/route.ts

import { NextResponse } from 'next/server';
// Importamos las clases necesarias para la nueva sintaxis y tipado
import { MercadoPagoConfig, Preference } from 'mercadopago'; 

// 2. Definimos las credenciales y el cliente
const ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;

// Verificación de credenciales
if (!ACCESS_TOKEN) {
    console.error("MERCADO_PAGO_ACCESS_TOKEN no está definido en las variables de entorno.");
    throw new Error("MERCADO_PAGO_ACCESS_TOKEN no está definido.");
}

// 3. Inicializar la INSTANCIA del cliente
const client = new MercadoPagoConfig({ 
    accessToken: ACCESS_TOKEN, 
    options: { 
        timeout: 5000 
    } 
});

// 4. Inicializar el SERVICIO de Preferencia usando la instancia del cliente
const preferenceService = new Preference(client); 

// Definición de la estructura de los datos que esperamos del frontend
interface CheckoutBody {
    title: string;
    unit_price: number;
    quantity: number;
    product_slug: string; 
}

// Handler para la solicitud POST (cuando el usuario hace clic en Pagar)
export async function POST(request: Request) {
    try {
        const body: CheckoutBody = await request.json();

        // **INICIO DE LA CORRECCIÓN**
        
        // Creamos el objeto item con el ID requerido para el tipado (Property 'id' is missing)
        const item = {
            id: body.product_slug, // Usamos el slug como identificador único
            title: body.title, 
            unit_price: body.unit_price, 
            quantity: body.quantity,
        };
        
        // 5. Crear el objeto de preferencia de pago (ahora con el 'item' correcto)
        let preferenceBody = {
            items: [item], // Usamos el array que contiene el ítem con 'id'
            
            // URLs de Retorno. Asegúrate de que NEXT_PUBLIC_BASE_URL esté configurada.
            back_urls: {
                success: `${process.env.NEXT_PUBLIC_BASE_URL}/productos/${body.product_slug}?status=success`, 
                failure: `${process.env.NEXT_PUBLIC_BASE_URL}/productos/${body.product_slug}?status=failure`, 
                pending: `${process.env.NEXT_PUBLIC_BASE_URL}/productos/${body.product_slug}?status=pending`
            },
            auto_return: "approved", 
            
            // Configuración regional para Chile
            statement_descriptor: "La Singular tienda chilena",
            country: "CL"
        };
        
        // **FIN DE LA CORRECCIÓN**
        
        // 6. Llamar al método create en el servicio 'preferenceService'
        const response = await preferenceService.create({ body: preferenceBody });
        
        // 7. Retorna la URL de Checkout (init_point) al frontend
        return NextResponse.json({ 
            init_point: response.init_point 
        }, { status: 200 });
        
    } catch (error) {
        console.error('Error al crear la preferencia de pago:', error);
        return NextResponse.json({ 
            message: 'Error interno del servidor al procesar el pago' 
        }, { status: 500 });
    }
}