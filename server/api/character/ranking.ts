import mongoose from 'mongoose';
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
        // Obtener el límite de la query o usar 100 por defecto
        const query = getQuery(event);
        const limit = Math.min(parseInt(query.limit as string) || 100, 100);
        
        const Character = getCharacterModel();
        const characters = await Character.find()
            .select('name level experience race class')
            .sort({ level: -1, experience: -1 })
            .limit(limit)
            .populate('accountId', 'username');

        const ranking = characters.map((char: ICharacterDocument & { accountId: { username: string } }, index) => ({
            rank: index + 1,
            name: char.name,
            level: char.level,
            experience: char.experience,
            race: (char as any).race,
            class: (char as any).class,
            owner: char.accountId.username
        }));

        return {
            success: true,
            data: { ranking }
        };
    } catch (error: any) {
        console.error('Error al obtener ranking:', error);
        
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