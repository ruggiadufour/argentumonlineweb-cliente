// import { NextApiResponse } from 'next';
// import { withAuth } from '../../../lib/middleware';
// import { ApiResponse, ExtendedNextApiRequest } from '../../../app/types/api';

// async function handler(
//     req: ExtendedNextApiRequest,
//     res: NextApiResponse<ApiResponse>
// ) {
//     if (req.method !== 'POST') {
//         return res.status(405).json({ success: false, error: 'Método no permitido' });
//     }

//     try {
//         req.logOut();
//         req.session.destroy((err) => {
//             if (err) {
//                 return res.status(500).json({
//                     success: false,
//                     error: 'Error al cerrar sesión'
//                 });
//             }

//             res.status(200).json({
//                 success: true,
//                 data: { message: 'Sesión cerrada correctamente' }
//             });
//         });
//     } catch (error) {
//         console.error('Error en logout:', error);
//         return res.status(500).json({
//             success: false,
//             error: 'Error interno del servidor'
//         });
//     }
// }

// export default withAuth(handler); 