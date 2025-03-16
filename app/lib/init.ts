import connectDB from './mongodb';
import mongoose from 'mongoose';
import '../models/Account'; // Solo importamos el archivo para que se registre el modelo
import './passport';

let isInitialized = false;

export async function initializeApp() {
    if (isInitialized) {
        return;
    }

    try {
        // Conectar a MongoDB si no está conectado
        if (mongoose.connection.readyState !== 1) {
            await connectDB();
            console.log('✓ MongoDB conectado');
        }

        // Passport ya está configurado a través de la importación
        console.log('✓ Passport configurado');

        isInitialized = true;
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        throw error;
    }
} 