import React from 'react';
import { Store } from 'redux';
import { initializeStore } from '../store';
import { RootState } from '../types/store';

const isServer = typeof window === 'undefined';
let reduxStore: Store<RootState> | undefined;

function getOrCreateStore(initialState?: RootState): Store<RootState> {
    // Always make a new store if server, otherwise state is shared between requests
    if (isServer) {
        return initializeStore(initialState);
    }

    // Create store if unavailable on the client and set it on the window object
    if (!reduxStore) {
        reduxStore = initializeStore(initialState);
    }

    return reduxStore;
}

export default function withReduxStore<P extends { reduxStore: Store<RootState> }>(
    App: React.ComponentType<P>
) {
    return class AppWithRedux extends React.Component<Omit<P, 'reduxStore'>> {
        private reduxStore: Store<RootState>;

        static async getInitialProps(appContext: any) {
            // Get or Create the store with `undefined` as initialState
            // This allows you to set a custom default initialState
            const reduxStore = getOrCreateStore();

            // Provide the store to getInitialProps of pages
            appContext.ctx.reduxStore = reduxStore;

            let appProps = {};
            if (typeof App.getInitialProps === 'function') {
                appProps = await App.getInitialProps(appContext);
            }

            return {
                ...appProps,
                initialReduxState: reduxStore.getState()
            };
        }

        constructor(props: Omit<P, 'reduxStore'>) {
            super(props);
            // @ts-ignore
            this.reduxStore = getOrCreateStore(props.initialReduxState);
        }

        render() {
            // @ts-ignore
            return <App {...this.props} reduxStore={this.reduxStore} />;
        }
    };
} 