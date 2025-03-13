import { createStore, applyMiddleware, compose, Store, Action } from 'redux';
import { thunk, ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState, Account, AppDispatch } from './types/store';

const InitialState: RootState = {
    account: {},
    initsLoaded: false
};

export const SET_ACCOUNT = 'SET_ACCOUNT';
export const SET_INITS_LOADED = 'SET_INITS_LOADED';

interface SetAccountAction extends Action<typeof SET_ACCOUNT> {
    payload: any;
}

interface SetInitsLoadedAction extends Action<typeof SET_INITS_LOADED> {
    payload: boolean;
}

type AppAction = SetAccountAction | SetInitsLoadedAction;

// REDUCERS
export const reducer = (state: RootState = InitialState, action: AppAction): RootState => {
    switch (action.type) {
        case SET_ACCOUNT:
            return {
                ...state,
                account: action.payload
            };
        case SET_INITS_LOADED:
            return {
                ...state,
                initsLoaded: action.payload
            };
        default:
            return state;
    }
};

// ACTIONS
export const setAccount = (account: any): ThunkAction<void, RootState, unknown, AppAction> => {
    return (dispatch: ThunkDispatch<RootState, unknown, AppAction>) => {
        dispatch({
            type: SET_ACCOUNT,
            payload: account
        });
    };
};

export const setInitsLoaded = (loaded: boolean): ThunkAction<void, RootState, unknown, AppAction> => {
    return (dispatch: ThunkDispatch<RootState, unknown, AppAction>) => {
        dispatch({
            type: SET_INITS_LOADED,
            payload: loaded
        });
    };
};

export function initializeStore(initialState: RootState = InitialState): Store<RootState, AppAction> {
    const composeEnhancers =
        (typeof window !== 'undefined' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

    return createStore(
        reducer,
        initialState,
        composeEnhancers(applyMiddleware(thunk))
    );
}

export default initializeStore; 