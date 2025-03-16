import { NextApiResponse } from 'next';
import { withAuth } from '../../../lib/middleware';
import passport from 'passport';
import { ApiResponse, LoginCredentials, ExtendedNextApiRequest } from '../../../app/types/api';

async function handler(
    req: ExtendedNextApiRequest,
    res: NextApiResponse<ApiResponse>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Método no permitido' });
    }

    try {
        const { name, password } = req.body as LoginCredentials;
        

        if (!name || !password) {
            return res.status(400).json({
                success: false,
                error: 'Usuario y contraseña son requeridos'
            });
        }

        return new Promise<void>((resolve, reject) => {
            passport.authenticate('local', (err: any, user: any, info: any) => {
                if (err) {
                    console.error('Error en autenticación:', err);
                    res.status(500).json({
                        success: false,
                        error: 'Error en la autenticación'
                    });
                    return resolve();
                }

                console.log({user, err, info});
                

                if (!user) {
                    res.status(401).json({
                        success: false,
                        error: info?.message || 'Credenciales inválidas'
                    });
                    return resolve();
                }

                req.logIn(user, (err) => {
                    if (err) {
                        console.error('Error en login:', err);
                        res.status(500).json({
                            success: false,
                            error: 'Error al iniciar sesión'
                        });
                        return resolve();
                    }

                    console.log('req.user', req.user);
                    
                    const bodyAccount = req.user;

                    res.status(200).json({
                        success: true,
                        data: { user: bodyAccount }
                    });
                    resolve();
                });
            })(req, res, (err: any) => {
                if (err) reject(err);
                else resolve();
            });
        });
    } catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
}

export default withAuth(handler); 