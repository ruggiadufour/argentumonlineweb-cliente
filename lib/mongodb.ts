import mongoose, { Connection, Mongoose } from 'mongoose';

declare global {
    var mongoose: {
        conn: Connection | null;
        promise: Promise<Mongoose> | null;
    };
}

const dev = process.env.NODE_ENV !== 'production';
const MONGODB_URI = dev ? 'mongodb://localhost:27017/aoweb' : process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB(): Promise<Connection> {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000, // Timeout después de 5 segundos
            socketTimeoutMS: 45000, // Timeout después de 45 segundos
            family: 4 // Usar IPv4, omitir para permitir tanto IPv6 como IPv4
        };

        mongoose.set('strictQuery', false);

        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
            console.log('MongoDB conectado exitosamente');
            return mongoose;
        }).catch((error) => {
            console.error('Error conectando a MongoDB:', error);
            cached.promise = null;
            throw error;
        });
    }

    try {
        const mongoose = await cached.promise;
        cached.conn = mongoose.connection;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectDB; 