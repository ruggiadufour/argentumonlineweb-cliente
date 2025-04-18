import mongoose, { Document, Model } from 'mongoose';
import type { ICharacter } from '@/types';
export interface ICharacterDocument extends ICharacter, Document {
    // Aquí puedes agregar métodos de documento si los necesitas
}

export interface ICharacterModel extends Model<ICharacterDocument> {
    // Aquí puedes agregar métodos estáticos si los necesitas
}

// Esquemas para los subdocumentos
const ItemSchema = new mongoose.Schema({
    _id: false,
    idPos: Number,
    idItem: Number,
    cant: Number,
    equipped: Boolean
});

const SpellSchema = new mongoose.Schema({
    _id: false,
    idPos: Number,
    idSpell: Number
});

// Esquema principal
const CharacterSchema = new mongoose.Schema({
    idAccount: String,
    name: String,
    idClase: Number,
    map: Number,
    posX: Number,
    posY: Number,
    gold: Number,
    idHead: Number,
    idLastHead: Number,
    idLastBody: Number,
    idLastHelmet: Number,
    idLastWeapon: Number,
    idLastShield: Number,
    idHelmet: Number,
    idWeapon: Number,
    idShield: Number,
    idBody: Number,
    idItemWeapon: Number,
    idItemBody: Number,
    idItemShield: Number,
    idItemHelmet: Number,
    spellsAcertados: Number,
    spellsErrados: Number,
    hp: Number,
    maxHp: Number,
    mana: Number,
    maxMana: Number,
    idRaza: Number,
    idGenero: Number,
    muerto: Boolean,
    minHit: Number,
    maxHit: Number,
    attrFuerza: Number,
    attrAgilidad: Number,
    attrInteligencia: Number,
    attrConstitucion: Number,
    privileges: Number,
    countKilled: Number,
    countDie: Number,
    exp: Number,
    expNextLevel: Number,
    level: Number,
    ip: String,
    banned: Date,
    dead: Boolean,
    criminal: Boolean,
    navegando: Boolean,
    npcMatados: Number,
    ciudadanosMatados: Number,
    criminalesMatados: Number,
    fianza: Number,
    connected: Boolean,
    items: [ItemSchema],
    spells: [SpellSchema]
}, {
    timestamps: true
});

let CharacterModel: ICharacterModel | null = null;

export function getCharacterModel(): ICharacterModel {
    if (CharacterModel) {
        return CharacterModel;
    }

    try {
        CharacterModel = mongoose.model<ICharacterDocument, ICharacterModel>('characters');
    } catch {
        CharacterModel = mongoose.model<ICharacterDocument, ICharacterModel>('characters', CharacterSchema);
    }

    return CharacterModel;
}

export default getCharacterModel; 