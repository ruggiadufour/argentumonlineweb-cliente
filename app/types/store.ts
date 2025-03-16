import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

export interface Account {
    logged?: boolean;
    err?: any;
    [key: string]: any;
}

export interface RootState {
    account: Account;
    initsLoaded: boolean;
}

export type AppDispatch = ThunkDispatch<RootState, unknown, Action>; 