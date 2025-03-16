import { NextApiRequest, NextApiResponse } from 'next';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import './passport';  // Importamos la configuración de Passport
import passport from 'passport';

const dev = process.env.NODE_ENV !== 'production';
const MONGODB_URI = dev ? 'mongodb://localhost:27017/aoweb' : process.env.MONGODB_URI;

// Configuración de la sesión
export const sessionConfig = {
    secret: 'your-secret-key', // Cambia esto por una clave secreta real
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
        mongoUrl: MONGODB_URI,
        collectionName: 'sessions'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 semana
        secure: !dev,
        httpOnly: true,
        sameSite: 'lax' as const
    }
};

// Middleware para manejar sesiones y autenticación
export function withAuth(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            await new Promise<void>((resolve, reject) => {
                session(sessionConfig)(req as any, res as any, (err: any) => {
                    if (err) return reject(err);
                    passport.initialize()(req as any, res as any, (err: any) => {
                        if (err) return reject(err);
                        passport.session()(req as any, res as any, (err: any) => {
                            if (err) return reject(err);
                            resolve();
                        });
                    });
                });
            });

            return handler(req, res);
        } catch (error) {
            console.error('Error en middleware de autenticación:', error);
            return res.status(500).json({ success: false, error: 'Error interno del servidor' });
        }
    };
}

// Middleware para verificar si el usuario está autenticado
export function requireAuth(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        if (!(req as any).isAuthenticated()) {
            return res.status(401).json({ success: false, error: 'No autorizado' });
        }
        return handler(req, res);
    };
} 