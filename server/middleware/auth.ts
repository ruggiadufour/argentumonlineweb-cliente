import mongoose from 'mongoose';
import { getAccountModel } from '../models/Account';

const dev = process.env.NODE_ENV !== 'production';
const MONGODB_URI = dev ? 'mongodb://localhost:27017/aoweb' : process.env.MONGODB_URI;

// Cookie configuration
const COOKIE_CONFIG = {
    name: 'userId',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7 // 1 semana
};

// Función para conectar a MongoDB
async function connectDB() {
    if (mongoose.connection.readyState === 1) {
        return;
    }
    
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as any);
        console.log('MongoDB conectado');
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
        throw error;
    }
}

export default defineEventHandler(async (event) => {
    try {
        // Conectamos a MongoDB
        await connectDB();

        // Inicializamos el contexto de autenticación
        event.context.auth = {
            user: null
        };

        try {
            // Obtenemos el userId de la cookie
            const userId = getCookie(event, COOKIE_CONFIG.name);
            
            // Si hay un ID de usuario, buscamos sus datos
            if (userId) {
                const Account = getAccountModel();
                const user = await Account.findById(userId).select('-password');
                
                if (user) {
                    // Si encontramos el usuario, lo agregamos al contexto
                    event.context.auth.user = {
                        accountId: user._id,
                        name: user.name,
                        nameSanitized: user.nameSanitized,
                        email: user.email
                    };
                } else {
                    // Si no encontramos el usuario, eliminamos la cookie
                    deleteCookie(event, COOKIE_CONFIG.name, COOKIE_CONFIG);
                }
            } else {
                console.log('No userId cookie found');
            }
        } catch (sessionError) {
            console.error('Error al obtener la sesión:', sessionError);
            // Si hay un error con la sesión, dejamos el usuario como no autenticado
            return;
        }

    } catch (error) {
        console.error('Error en middleware de autenticación:', error);
        // No lanzamos el error para que la aplicación siga funcionando
        // pero establecemos el usuario como no autenticado
        event.context.auth = {
            user: null
        };
    }
});