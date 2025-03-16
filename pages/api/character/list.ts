import { NextApiResponse } from 'next';
import { withAuth, requireAuth } from '../../../lib/middleware';
import { ApiResponse, ExtendedNextApiRequest } from '../../../app/types/api';
import Character from '../../../models/Character';

async function handler(
    req: ExtendedNextApiRequest,
    res: NextApiResponse<ApiResponse>
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, error: 'Método no permitido' });
    }

    try {
        const characters = await Character.find({ accountId: req.user._id })
            .select('-__v')
            .sort({ level: -1 });

        return res.status(200).json({
            success: true,
            data: { characters }
        });
    } catch (error) {
        console.error('Error al obtener personajes:', error);
        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
}

// Usamos requireAuth para asegurarnos que el usuario esté autenticado
export default withAuth(requireAuth(handler)); 