import { Connection, Mongoose } from 'mongoose';

declare global {
    var mongoose: {
        conn: Connection | null;
        promise: Promise<Mongoose> | null;
    };
    namespace NodeJS {
        interface ProcessEnv {
            MONGODB_URI: string;
            NODE_ENV: 'development' | 'production' | 'ci';
        }
    }
} 