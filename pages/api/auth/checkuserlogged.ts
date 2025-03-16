import { NextApiResponse } from 'next';
import { withAuth } from '../../../lib/middleware';
import { ApiResponse, ExtendedNextApiRequest } from '../../../app/types/api';

async function handler(
    req: ExtendedNextApiRequest,
    res: NextApiResponse<ApiResponse>
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, error: 'Método no permitido' });
    }

    try {
        if (req.isAuthenticated()) {
            const bodyAccount = {
                accountId: req.user._id,
                name: req.user.name,
                nameSanitized: req.user.nameSanitized,
                email: req.user.email
            };

            return res.status(200).json({
                success: true,
                data: {
                    logged: true,
                    user: bodyAccount
                }
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                logged: false
            }
        });
    } catch (error) {
        console.error('Error al verificar autenticación:', error);
        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
}

export default withAuth(handler); 