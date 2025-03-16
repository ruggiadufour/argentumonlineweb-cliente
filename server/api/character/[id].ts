// import { NextApiResponse } from 'next';
// import { withAuth, requireAuth } from '../../../lib/middleware';
// import { ApiResponse, ExtendedNextApiRequest } from '../../../app/types/api';
// import Character from '../../../models/Character';
// import mongoose from 'mongoose';

// async function handler(
//     req: ExtendedNextApiRequest,
//     res: NextApiResponse<ApiResponse>
// ) {
//     const { id } = req.query;

//     // TODO: refactorizar codigo
//     // Validar que el ID sea válido
//     // if (!mongoose.Types.ObjectId.isValid(id as string)) {
//     //     return res.status(400).json({
//     //         success: false,
//     //         error: 'ID de personaje inválido'
//     //     });
//     // }

//     try {
//         const character = await Character().findOne({
//             _id: id,
//             accountId: req.user._id
//         }).select('-__v');

//         if (!character) {
//             return res.status(404).json({
//                 success: false,
//                 error: 'Personaje no encontrado'
//             });
//         }

//         switch (req.method) {
//             case 'GET':
//                 return res.status(200).json({
//                     success: true,
//                     data: { character }
//                 });

//             case 'PUT':
//                 const { level, experience } = req.body;

//                 // Solo permitimos actualizar nivel y experiencia por ahora
//                 if (level !== undefined) {
//                     character.level = level;
//                 }
//                 if (experience !== undefined) {
//                     character.experience = experience;
//                 }

//                 await character.save();

//                 return res.status(200).json({
//                     success: true,
//                     data: { character }
//                 });

//             case 'DELETE':
//                 await character.delete();
//                 return res.status(200).json({
//                     success: true,
//                     data: { message: 'Personaje eliminado correctamente' }
//                 });

//             default:
//                 return res.status(405).json({
//                     success: false,
//                     error: 'Método no permitido'
//                 });
//         }
//     } catch (error) {
//         console.error('Error al procesar personaje:', error);
//         return res.status(500).json({
//             success: false,
//             error: 'Error interno del servidor'
//         });
//     }
// }

// export default withAuth(requireAuth(handler)); 