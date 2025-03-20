import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import type { IAccount } from '../types';

export interface IAccountDocument extends IAccount, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IAccountModel extends Model<IAccountDocument> {
    // Aquí puedes agregar métodos estáticos si los necesitas
}

const AccountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Por favor ingrese un nombre de usuario'],
        unique: true,
        trim: true,
        minlength: [3, 'El nombre de usuario debe tener al menos 3 caracteres']
    },
    nameSanitized: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Por favor ingrese un email'],
        unique: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingrese un email válido']
    },
    password: {
        type: String,
        required: [true, 'Por favor ingrese una contraseña'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    }
}, {
    timestamps: true
});

// Hash password before saving
AccountSchema.pre('save', async function(this: IAccountDocument, next) {
    if (!this.isModified('password')) {
        return next();
    }

    // Generar nameSanitized
    if (this.isModified('name')) {
        this.nameSanitized = this.name.toLowerCase();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        // TODO: ver si se puede mejorar el tipado
        next(error as any);
    }
});

// Compare password method
AccountSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(candidatePassword, (this as IAccountDocument).password);
    } catch (error) {
        throw error;
    }
};

let AccountModel: IAccountModel | null = null;

export function getAccountModel(): IAccountModel {
    if (AccountModel) {
        return AccountModel;
    }

    try {
        AccountModel = mongoose.model<IAccountDocument, IAccountModel>('accounts');
    } catch {
        AccountModel = mongoose.model<IAccountDocument, IAccountModel>('accounts', AccountSchema);
    }

    return AccountModel;
}

export default getAccountModel; 