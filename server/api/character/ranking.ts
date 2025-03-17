import mongoose from 'mongoose';
import { getCharacterModel } from '../../models/Character';
import type { ICharacterDocument } from '../../models/Character';

interface PopulatedCharacter extends ICharacterDocument {
    accountId: {
        username: string;
    };
}

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
            .sort({ level: -1, experience: -1 })
            .limit(limit)
            .populate('accountId', 'username');

        const ranking = (characters as PopulatedCharacter[]).map((char, index) => ({
            rank: index + 1,
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
            items: char.items,
            spells: char.spells,
            owner: char.accountId?.username || 'Desconocido'
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