import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'express-session';

// Extender la interfaz NextApiRequest para incluir la sesión y autenticación
export interface ExtendedNextApiRequest extends NextApiRequest {
    session: Session & {
        passport?: {
            user?: any;
        };
    };
    logIn: (user: any, callback: (err: any) => void) => void;
    logOut: () => void;
    isAuthenticated: () => boolean;
    user?: any;
}

// Tipos para las respuestas de la API
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}

// Tipos para la autenticación
export interface LoginCredentials {
    name: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    email: string;
}

// Tipos para los personajes
export interface Character {
    id: string;
    name: string;
    // Añade aquí más propiedades según tu modelo de personaje
}

export interface CharacterSaveData {
    // Añade aquí las propiedades que se pueden guardar de un personaje
}

// Tipos para el ranking
export interface RankingEntry {
    character: Character;
    score: number;
} 