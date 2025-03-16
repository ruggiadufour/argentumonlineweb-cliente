// import { NextApiResponse } from 'next';
// import { withAuth } from '../../../lib/middleware';
// import { ApiResponse, ExtendedNextApiRequest } from '../../../app/types/api';
// import Character from '../../../models/Character';

// async function handler(
//     req: ExtendedNextApiRequest,
//     res: NextApiResponse<ApiResponse>
// ) {
//     if (req.method !== 'GET') {
//         return res.status(405).json({ success: false, error: 'Método no permitido' });
//     }

//     try {
//         // Obtener el límite de la query o usar 100 por defecto
//         const limit = Math.min(parseInt(req.query.limit as string) || 100, 100);
        
//         const characters = await Character.find()
//             .select('name level experience race class')
//             .sort({ level: -1, experience: -1 })
//             .limit(limit)
//             .populate('accountId', 'username'); // Incluir el nombre del usuario

//         const ranking = characters.map((char, index) => ({
//             rank: index + 1,
//             name: char.name,
//             level: char.level,
//             experience: char.experience,
//             race: char.race,
//             class: char.class,
//             owner: (char.accountId as any).username
//         }));

//         return res.status(200).json({
//             success: true,
//             data: { ranking }
//         });
//     } catch (error) {
//         console.error('Error al obtener ranking:', error);
//         return res.status(500).json({
//             success: false,
//             error: 'Error interno del servidor'
//         });
//     }
// }

// export default withAuth(handler); 