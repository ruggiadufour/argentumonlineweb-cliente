import type { ICharacter, TSimpleAccount } from '../../types';
import { getCharacterModel } from '../../models/Character';

// Mapeos de nombres a IDs según config.js
const CLASS_MAP = {
    'Mago': 1,
    'Clérigo': 2,
    'Guerrero': 3,
    'Asesino': 4,
    'Ladrón': 5,
    'Bardo': 6,
    'Druida': 7,
    'Paladín': 8,
    'Cazador': 9,
    'Trabajador': 10,
    'Pirata': 11
} as const;

const RACE_MAP = {
    'Humano': 1,
    'Elfo': 2,
    'Elfo Drow': 3,
    'Enano': 4,
    'Gnomo': 5
} as const;

export default defineEventHandler(async (event) => {
    // Verificamos que sea método POST
    if (event.method !== 'POST') {
        throw createError({
            statusCode: 405,
            message: 'Método no permitido'
        });
    }

    try {
        // Obtener el ID de la cuenta del usuario autenticado primero
        const authUser: TSimpleAccount = event.context.auth?.user;
        console.log("Auth user:", authUser);
        
        if (!authUser?.accountId) {
            throw createError({
                statusCode: 401,
                message: 'No autorizado - Se requiere autenticación'
            });
        }

        const requestBody = await readBody(event);
        console.log("Request body:", requestBody);
        
        // Asegurarnos de que tenemos un objeto parseado
        const data = JSON.parse(typeof requestBody === 'string' ? requestBody : JSON.stringify(requestBody));
        console.log("Parsed data:", data);

        // Extraer los datos
        const name: string = data.name;
        const characterClass = data.class;
        const race = data.race;
        const idGenero = data.idGenero;
        const idHead = data.idHead;
        const idBody = data.idBody;
        const idWeapon = data.idWeapon ?? 48;
        const idShield = data.idShield ?? 0;
        const idHelmet = data.idHelmet ?? 0;

        console.log("Received class:", characterClass);
        console.log("Received race:", race);

        // Convertir clase y raza a sus IDs correspondientes
        const idClase = CLASS_MAP[characterClass];
        const idRaza = RACE_MAP[race];

        console.log("Mapped class ID:", idClase);
        console.log("Mapped race ID:", idRaza);

        if (!idClase) {
            throw createError({
                statusCode: 400,
                message: `Clase no válida: ${characterClass}. Clases válidas: ${Object.keys(CLASS_MAP).join(', ')}`
            });
        }

        if (!idRaza) {
            throw createError({
                statusCode: 400,
                message: `Raza no válida: ${race}. Razas válidas: ${Object.keys(RACE_MAP).join(', ')}`
            });
        }

        // Validar campos requeridos
        if (!name || !characterClass || !race || 
            idGenero === undefined || idGenero === null ||
            idHead === undefined || idHead === null ||
            idBody === undefined || idBody === null) {
            throw createError({
                statusCode: 400,
                message: 'Todos los campos son requeridos'
            });
        }

        // Verificar si ya existe un personaje con ese nombre
        const Character = getCharacterModel();
        const existingCharacter = await Character.findOne({ name: name.toLowerCase() });
        if (existingCharacter) {
            throw createError({
                statusCode: 400,
                message: 'Ya existe un personaje con ese nombre'
            });
        }

        // Crear nuevo personaje con los campos según el modelo
        const character: ICharacter = {
            name: name.toLowerCase(),
            idAccount: authUser.accountId,
            idClase,
            idRaza,
            idGenero,
            idHead,
            idBody,
            idWeapon,
            idShield,
            idHelmet,
            level: 1,
            experience: 0,
            exp: 0,
            expNextLevel: 300,  // Valor inicial para nivel 1
            hp: 100,           // Valores por defecto
            maxHp: 100,
            mana: 100,
            maxMana: 100,
            minHit: 1,
            maxHit: 2,
            map: 1,            
            posX: 50,          // Posición inicial X
            posY: 50,  
            gold: 0,
            muerto: false,
            dead: false,
            criminal: false,
            navegando: false,
            connected: false,
            items: [],
            spells: [],
            isNpc: false
        };

        const newCharacter = new Character(character);

        await newCharacter.save();

        return {
            success: true,
            data: { character: newCharacter }
        };
    } catch (error: any) {
        console.error('Error al crear personaje:', error);
        
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