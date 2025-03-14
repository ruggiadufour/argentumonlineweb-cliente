import { NextApiResponse } from 'next';
import { withAuth } from '../../../lib/middleware';
import { ApiResponse, ExtendedNextApiRequest, RegisterCredentials } from '../../../types/api';
import Account from '../../../models/Account';

async function handler(
    req: ExtendedNextApiRequest,
    res: NextApiResponse<ApiResponse>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Método no permitido' });
    }

    try {
        const { username, email, password } = req.body as RegisterCredentials;

        // Validar campos requeridos
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Todos los campos son requeridos'
            });
        }

        // Verificar si el usuario ya existe
        const existingUser = await Account.findOne({
            $or: [
                { username: username.toLowerCase() },
                { email: email.toLowerCase() }
            ]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'El usuario o email ya está registrado'
            });
        }

        // Crear nuevo usuario
        const newUser = new Account({
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            password
        });

        await newUser.save();

        // Iniciar sesión automáticamente
        req.logIn(newUser, (err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: 'Error al iniciar sesión después del registro'
                });
            }

            return res.status(201).json({
                success: true,
                data: {
                    user: {
                        id: newUser._id,
                        username: newUser.username,
                        email: newUser.email
                    }
                }
            });
        });
    } catch (error) {
        console.error('Error en registro:', error);
        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
}

export default withAuth(handler); 