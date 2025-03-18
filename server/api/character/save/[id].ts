import { getCharacterModel } from '../../../models/Character';
import type { ICharacterDocument } from '../../../models/Character';

export default defineEventHandler(async (event) => {
    // Verificamos que sea método PUT
    if (event.method !== 'PUT') {
        throw createError({
            statusCode: 405,
            message: 'Método no permitido'
        });
    }

    try {
        // Obtener el ID de la cuenta del usuario autenticado
        const authUser = event.context.auth?.user;
        
        // if (!authUser?.accountId) {
        //     throw createError({
        //         statusCode: 401,
        //         message: 'No autorizado - Se requiere autenticación'
        //     });
        // }

        // Obtener el ID del personaje de la URL
        const idCharacter = event.context.params?.id;

        if (!idCharacter) {
            throw createError({
                statusCode: 400,
                message: 'ID de personaje requerido'
            });
        }

        // Obtener los datos a actualizar del body
        const updateData = await readBody(event);
        console.log('Datos a actualizar:', updateData);

        // Lista de campos que se pueden actualizar
        const allowedFields = [
            'hp', 'maxHp', 'mana', 'maxMana',
            'minHit', 'maxHit', 'exp', 'expNextLevel',
            'level', 'gold', 'map', 'posX', 'posY',
            'muerto', 'dead', 'criminal', 'navegando',
            'connected', 'items', 'spells'
        ];

        // Filtrar solo los campos permitidos
        const filteredUpdate = Object.keys(updateData)
            .filter(key => allowedFields.includes(key))
            .reduce((obj, key) => {
                obj[key] = updateData[key];
                return obj;
            }, {} as Record<string, any>);

        console.log('Campos filtrados a actualizar:', filteredUpdate);

        const Character = getCharacterModel();

        // Buscar el personaje y verificar que pertenece al usuario
        const character = await Character.findOne({
            _id: idCharacter,
            idAccount: authUser.accountId
        });

        if (!character) {
            throw createError({
                statusCode: 404,
                message: 'Personaje no encontrado o no tienes permiso para modificarlo'
            });
        }

        // Actualizar el personaje
        const updatedCharacter = await Character.findByIdAndUpdate(
            idCharacter,
            { $set: filteredUpdate },
            { 
                new: true,  // Devolver el documento actualizado
                runValidators: true  // Ejecutar validadores del esquema
            }
        ).lean();

        return {
            success: true,
            data: { character: updatedCharacter }
        };
    } catch (error: any) {
        console.error('Error al actualizar personaje:', error);
        
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