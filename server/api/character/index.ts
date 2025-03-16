// import { NextApiResponse } from 'next';
// import { withAuth } from '../../../lib/middleware';
// import { ApiResponse, ExtendedNextApiRequest } from '../../../app/types/api';
// import { getAccountModel } from '../../../models/Account';
// import { getCharacterModel } from '../../../models/Character';

// async function handler(
//     req: ExtendedNextApiRequest,
//     res: NextApiResponse<ApiResponse>
// ) {
//     if (req.method !== 'GET') {
//         return res.status(405).json({
//             success: false,
//             error: 'Método no permitido'
//         });
//     }

//     const { idAccount, idCharacter, email } = req.query;

//     if (!idAccount || typeof idAccount !== 'string') {
//         return res.status(400).json({
//             success: false,
//             error: 'ID de cuenta requerido'
//         });
//     }

//     try {
//         const Account = getAccountModel();
//         const Character = getCharacterModel();

//         const account = await Account.findOne({
//             _id: idAccount,
//             email: email as string
//         }).select('-password');

//         if (!account) {
//             return res.status(404).json({
//                 success: false,
//                 error: 'Cuenta no encontrada'
//             });
//         }

//         let characterData = null;

//         if (idCharacter && typeof idCharacter === 'string') {
//             characterData = await Character.findOne({
//                 _id: idCharacter,
//                 idAccount
//             });

//             if (!characterData) {
//                 return res.status(404).json({
//                     success: false,
//                     error: 'Personaje no encontrado'
//                 });
//             }
//         }

//         return res.status(200).json({
//             success: true,
//             data: {
//                 account: account.toObject(),
//                 character: characterData ? characterData.toObject() : null
//             }
//         });
//     } catch (error) {
//         console.error('Error al obtener datos:', error);
//         return res.status(500).json({
//             success: false,
//             error: 'Error interno del servidor'
//         });
//     }
// }

// export default withAuth(handler); 