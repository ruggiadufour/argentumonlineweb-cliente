export interface IAccount {
    name: string;
    nameSanitized: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}