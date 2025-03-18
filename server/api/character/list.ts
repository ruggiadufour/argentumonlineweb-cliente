// import { NextApiResponse } from 'next';
// import { withAuth, requireAuth } from '../../../lib/middleware';
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
//         const characters = await Character.find({ accountId: req.user._id })
//             .select('-__v')
//             .sort({ level: -1 });

//         return res.status(200).json({
//             success: true,
//             data: { characters }
//         });
//     } catch (error) {
//         console.error('Error al obtener personajes:', error);
//         return res.status(500).json({
//             success: false,
//             error: 'Error interno del servidor'
//         });
//     }
// }

// // Usamos requireAuth para asegurarnos que el usuario esté autenticado
// export default withAuth(requireAuth(handler)); 

import { getCharacterModel } from '../../models/Character';
import type { ICharacterDocument } from '../../models/Character';

export default defineEventHandler(async (event) => {
    // Verificamos que sea método GET
    if (event.method !== 'GET') {
        throw createError({
            statusCode: 405,
            message: 'Método no permitido'
        });
    }

    try {
        // Obtener el ID de la cuenta del usuario autenticado
        const authUser = event.context.auth?.user;
        
        if (!authUser?.accountId) {
            throw createError({
                statusCode: 401,
                message: 'No autorizado - Se requiere autenticación'
            });
        }

        const Character = getCharacterModel();
        
        const characters = await Character.find({ idAccount: authUser.accountId })
            .sort({ level: -1, experience: -1 })
            .lean();

        // Mapear los personajes para asegurar que devolvemos todos los campos necesarios
        const characterList = characters.map(char => ({
            _id: char._id,
            name: char.name,
            level: char.level,
            experience: char.experience,
            exp: char.exp,
            expNextLevel: char.expNextLevel,
            idClase: char.idClase,
            idRaza: char.idRaza,
            idGenero: char.idGenero,
            idHead: char.idHead,
            idBody: char.idBody,
            idWeapon: char.idWeapon,
            idShield: char.idShield,
            idHelmet: char.idHelmet,
            hp: char.hp,
            maxHp: char.maxHp,
            mana: char.mana,
            maxMana: char.maxMana,
            minHit: char.minHit,
            maxHit: char.maxHit,
            map: char.map,
            posX: char.posX,
            posY: char.posY,
            gold: char.gold,
            muerto: char.muerto,
            dead: char.dead,
            criminal: char.criminal,
            navegando: char.navegando,
            connected: char.connected,
            items: char.items || [],
            spells: char.spells || []
        }));

        return {
            success: true,
            data: { characters: characterList }
        };
    } catch (error: any) {
        console.error('Error al obtener personajes:', error);
        
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