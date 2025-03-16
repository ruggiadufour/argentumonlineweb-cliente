import mongoose from 'mongoose';
import { getAccountModel } from '../../models/Account';
import { getCharacterModel } from '../../models/Character';

export default defineEventHandler(async (event) => {
    // Verificamos que sea método GET
    if (event.method !== 'GET') {
        throw createError({
            statusCode: 405,
            message: 'Método no permitido'
        });
    }

    try {
        // Obtenemos los query params
        const query = getQuery(event);
        const { idAccount, idCharacter, email } = query;

        // if (!idAccount || typeof idAccount !== 'string') {
        //     console.log('Invalid idAccount:', idAccount);
        //     throw createError({
        //         statusCode: 400,
        //         message: 'ID de cuenta requerido'
        //     });
        // }

        // Verificamos que el usuario esté autenticado
        // if (!event.context.auth?.user) {
        //     throw createError({
        //         statusCode: 401,
        //         message: 'No autorizado'
        //     });
        // }

        // Validamos que los IDs sean ObjectId válidos
        const isAccountIdValid = mongoose.Types.ObjectId.isValid(idAccount);
        if (!isAccountIdValid) {
            throw createError({
                statusCode: 400,
                message: 'ID de cuenta inválido'
            });
        }

        const Account = getAccountModel();
        const Character = getCharacterModel();

        const account = await Account.findOne({
            _id: idAccount,
            email: email as string
        }).select('-password');

        if (!account) {
            throw createError({
                statusCode: 404,
                message: 'Cuenta no encontrada'
            });
        }

        let characterData = null;

        if (idCharacter && typeof idCharacter === 'string') {
            try {
                characterData = await Character.findOne({
                    idAccount: idAccount,
                    _id: idCharacter
                });
            } catch (error) {
                console.log('No se ha encontrado el personaje');
            }
            if (!characterData) {
                // throw createError({
                //     statusCode: 404,
                //     message: 'Personaje no encontrado'
                // });
            }
        }

        return {
            success: true,
            data: {
                account: account.toObject(),
                character: characterData ? characterData.toObject() : null
            }
        };
    } catch (error: any) {
        console.error('Error al obtener datos:', error);
        
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

// export default withAuth(handler); 