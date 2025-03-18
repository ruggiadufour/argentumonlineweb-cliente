// import { NextApiResponse } from 'next';
// import { withAuth } from '../../../lib/middleware';
// import { ApiResponse, ExtendedNextApiRequest } from '../../../app/types/api';

// async function handler(
//     req: ExtendedNextApiRequest,
//     res: NextApiResponse<ApiResponse>
// ) {
//     if (req.method !== 'POST') {
//         return res.status(405).json({ success: false, error: 'Método no permitido' });
//     }

//     try {
//         req.logOut();
//         req.session.destroy((err) => {
//             if (err) {
//                 return res.status(500).json({
//                     success: false,
//                     error: 'Error al cerrar sesión'
//                 });
//             }

//             res.status(200).json({
//                 success: true,
//                 data: { message: 'Sesión cerrada correctamente' }
//             });
//         });
//     } catch (error) {
//         console.error('Error en logout:', error);
//         return res.status(500).json({
//             success: false,
//             error: 'Error interno del servidor'
//         });
//     }
// }

// export default withAuth(handler); 

export default defineEventHandler(async (event) => {
    // Verificamos que sea método POST
    if (event.method !== 'POST') {
        throw createError({
            statusCode: 405,
            message: 'Método no permitido'
        });
    }

    try {
        // Configuración de la cookie igual que en el middleware de auth
        const COOKIE_CONFIG = {
            name: 'userId',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            maxAge: 60 * 60 * 24 * 7 // 1 semana
        };

        // Eliminar la cookie de autenticación
        deleteCookie(event, COOKIE_CONFIG.name, COOKIE_CONFIG);

        // Limpiar el contexto de autenticación
        event.context.auth = {
            user: null
        };

        return {
            success: true,
            data: { message: 'Sesión cerrada correctamente' }
        };
    } catch (error: any) {
        console.error('Error en logout:', error);
        
        return {
            success: false,
            error: 'Error interno del servidor'
        };
    }
}); 