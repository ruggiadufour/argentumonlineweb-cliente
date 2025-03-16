// import { NextApiResponse } from 'next';
// import { withAuth } from '../../../lib/middleware';
// import { ApiResponse, ExtendedNextApiRequest, RegisterCredentials } from '../../../app/types/api';
// import getAccount from '../../../models/Account';

// const Account = getAccount();

// async function handler(
//     req: ExtendedNextApiRequest,
//     res: NextApiResponse<ApiResponse>
// ) {
//     if (req.method !== 'POST') {
//         return res.status(405).json({ success: false, error: 'Método no permitido' });
//     }

//     try {
//         const { name, email, password } = req.body as RegisterCredentials;

//         // Validar campos requeridos
//         if (!name || !email || !password) {
//             return res.status(400).json({
//                 success: false,
//                 error: 'Todos los campos son requeridos'
//             });
//         }

//         // Verificar si el usuario ya existe
//         const existingUser = await Account.findOne({
//             $or: [
//                 { username: name.toLowerCase() },
//                 { email: email.toLowerCase() }
//             ]
//         });

//         if (existingUser) {
//             return res.status(400).json({
//                 success: false,
//                 error: 'El usuario o email ya está registrado'
//             });
//         }

//         // Crear nuevo usuario
//         const newUser = new Account({
//             name: name.toLowerCase(),
//             email: email.toLowerCase(),
//             password
//         });

//         await newUser.save();

//         // Iniciar sesión automáticamente
//         req.logIn(newUser, (err) => {
//             if (err) {
//                 return res.status(500).json({
//                     success: false,
//                     error: 'Error al iniciar sesión después del registro'
//                 });
//             }

//             return res.status(201).json({
//                 success: true,
//                 data: {
//                     user: {
//                         id: newUser._id,
//                         username: newUser.name,
//                         email: newUser.email
//                     }
//                 }
//             });
//         });
//     } catch (error) {
//         console.error('Error en registro:', error);
//         return res.status(500).json({
//             success: false,
//             error: 'Error interno del servidor'
//         });
//     }
// }

// export default withAuth(handler); 

import { getAccountModel } from '../../models/Account';

interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
}

// Cookie configuration - mantener consistente con login
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
        const body = await readBody<RegisterCredentials>(event);
        const { name, email, password } = body;

        // Validar campos requeridos
        if (!name || !email || !password) {
            throw createError({
                statusCode: 400,
                message: 'Todos los campos son requeridos'
            });
        }

        const Account = getAccountModel();

        // Verificar si el usuario ya existe
        const existingUser = await Account.findOne({
            $or: [
                { nameSanitized: name.toLowerCase() },
                { email: email.toLowerCase() }
            ]
        });

        if (existingUser) {
            throw createError({
                statusCode: 400,
                message: 'El usuario o email ya está registrado'
            });
        }

        // Crear nuevo usuario
        const newUser = new Account({
            name,
            nameSanitized: name.toLowerCase(),
            email: email.toLowerCase(),
            password
        });

        await newUser.save();

        // Guardamos el ID del usuario en una cookie
        const userId = newUser._id.toString();
        setCookie(event, COOKIE_CONFIG.name, userId, COOKIE_CONFIG);

        // Preparamos la respuesta con los datos del usuario
        const bodyAccount = {
            accountId: newUser._id,
            name: newUser.name,
            nameSanitized: newUser.nameSanitized,
            email: newUser.email
        };

        return {
            success: true,
            data: { user: bodyAccount }
        };

    } catch (error: any) {
        console.error('Error en registro:', error);
        
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