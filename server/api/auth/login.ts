// import { NextApiResponse } from 'next';
// import { withAuth } from '../../../lib/middleware';
// import passport from 'passport';
// import { ApiResponse, LoginCredentials, ExtendedNextApiRequest } from '../../../app/types/api';

// async function handler(
//     req: ExtendedNextApiRequest,
//     res: NextApiResponse<ApiResponse>
// ) {
//     if (req.method !== 'POST') {
//         return res.status(405).json({ success: false, error: 'Método no permitido' });
//     }

//     try {
//         const { name, password } = req.body as LoginCredentials;
        

//         if (!name || !password) {
//             return res.status(400).json({
//                 success: false,
//                 error: 'Usuario y contraseña son requeridos'
//             });
//         }

//         return new Promise<void>((resolve, reject) => {
//             passport.authenticate('local', (err: any, user: any, info: any) => {
//                 if (err) {
//                     console.error('Error en autenticación:', err);
//                     res.status(500).json({
//                         success: false,
//                         error: 'Error en la autenticación'
//                     });
//                     return resolve();
//                 }

//                 console.log({user, err, info});
                

//                 if (!user) {
//                     res.status(401).json({
//                         success: false,
//                         error: info?.message || 'Credenciales inválidas'
//                     });
//                     return resolve();
//                 }

//                 req.logIn(user, (err) => {
//                     if (err) {
//                         console.error('Error en login:', err);
//                         res.status(500).json({
//                             success: false,
//                             error: 'Error al iniciar sesión'
//                         });
//                         return resolve();
//                     }

//                     console.log('req.user', req.user);
                    
//                     const bodyAccount = req.user;

//                     res.status(200).json({
//                         success: true,
//                         data: { user: bodyAccount }
//                     });
//                     resolve();
//                 });
//             })(req, res, (err: any) => {
//                 if (err) reject(err);
//                 else resolve();
//             });
//         });
//     } catch (error) {
//         console.error('Error en login:', error);
//         return res.status(500).json({
//             success: false,
//             error: 'Error interno del servidor'
//         });
//     }
// }

// export default withAuth(handler); 

import { getAccountModel } from '../../models/Account';

interface LoginCredentials {
    name: string;
    password: string;
}

// Cookie configuration
const COOKIE_CONFIG = {
    name: 'userId',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7 // 1 semana
};

export default defineEventHandler(async (event) => {
    // Verificamos que sea método POST
    if (event.method !== 'POST') {
        throw createError({
            statusCode: 405,
            message: 'Método no permitido'
        });
    }

    try {
        const body = await readBody<LoginCredentials>(event);
        const { name, password } = body;

        if (!name || !password) {
            throw createError({
                statusCode: 400,
                message: 'Usuario y contraseña son requeridos'
            });
        }

        // Buscamos el usuario
        const Account = getAccountModel();
        const user = await Account.findOne({ nameSanitized: name.toLowerCase() });

        if (!user) {
            throw createError({
                statusCode: 401,
                message: 'Usuario no encontrado'
            });
        }

        // Verificamos la contraseña
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            throw createError({
                statusCode: 401,
                message: 'Contraseña incorrecta'
            });
        }

        // Guardamos el ID del usuario en una cookie
        setCookie(event, COOKIE_CONFIG.name, user._id.toString(), COOKIE_CONFIG);

        // Preparamos la respuesta con los datos del usuario
        const bodyAccount = {
            accountId: user._id,
            name: user.name,
            nameSanitized: user.nameSanitized,
            email: user.email
        };

        return {
            success: true,
            data: { user: bodyAccount }
        };

    } catch (error: any) {
        console.error('Error en login:', error);
        
        // Si es un error que nosotros lanzamos, lo devolvemos como está
        if (error.statusCode) {
            return {
                success: false,
                error: error.message
            };
        }

        // Si es un error interno, devolvemos un mensaje genérico
        return {
            success: false,
            error: 'Error interno del servidor'
        };
    }
}); 