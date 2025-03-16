// import { NextApiResponse } from 'next';
// import { withAuth, requireAuth } from '../../../lib/middleware';
// import { ApiResponse, ExtendedNextApiRequest } from '../../../app/types/api';
// import Character from '../../../models/Character';

// async function handler(
//     req: ExtendedNextApiRequest,
//     res: NextApiResponse<ApiResponse>
// ) {
//     if (req.method !== 'POST') {
//         return res.status(405).json({ success: false, error: 'Método no permitido' });
//     }

//     try {
//         const { name, class: characterClass, race, gender, head, body } = req.body;

//         // Validar campos requeridos
//         if (!name || !characterClass || !race || !gender || head === undefined || body === undefined) {
//             return res.status(400).json({
//                 success: false,
//                 error: 'Todos los campos son requeridos'
//             });
//         }

//         // Verificar si ya existe un personaje con ese nombre
//         const existingCharacter = await Character.findOne({ name: name.toLowerCase() });
//         if (existingCharacter) {
//             return res.status(400).json({
//                 success: false,
//                 error: 'Ya existe un personaje con ese nombre'
//             });
//         }

//         // Crear nuevo personaje
//         const newCharacter = new Character({
//             name: name.toLowerCase(),
//             accountId: req.user._id,
//             class: characterClass,
//             race,
//             gender,
//             head,
//             body,
//             level: 1,
//             experience: 0
//         });

//         await newCharacter.save();

//         return res.status(201).json({
//             success: true,
//             data: { character: newCharacter }
//         });
//     } catch (error) {
//         console.error('Error al crear personaje:', error);
//         return res.status(500).json({
//             success: false,
//             error: 'Error interno del servidor'
//         });
//     }
// }

// export default withAuth(requireAuth(handler)); 