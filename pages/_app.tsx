import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { AppProps } from 'next/app';
import Head from "../components/Head";

import "@fortawesome/fontawesome-svg-core/styles.css";
import "../styles/style.scss";

import { config as configFA } from "@fortawesome/fontawesome-svg-core";
configFA.autoAddCss = false;

import { setAccount } from "../store";
import withReduxStore from "../lib/with-redux-store";
import { Store } from 'redux';
import { initializeApp } from '../lib/init';

interface MyAppProps extends AppProps {
    reduxStore: Store;
    account: any;
}

function MyApp({ Component, pageProps, reduxStore, account }: MyAppProps) {
    useEffect(() => {
        if (account?.data && !account.error) {
            reduxStore.dispatch({
                type: 'SET_ACCOUNT',
                payload: account.data.user
            });
        }
    }, [account, reduxStore]);

    return (
        <React.Fragment>
            <Head {...pageProps} />
            <Provider store={reduxStore}>
                <Component {...pageProps} />
            </Provider>
        </React.Fragment>
    );
}

MyApp.getInitialProps = async ({ Component, ctx }: any) => {
    try {
        // Inicializar la aplicación (MongoDB y Passport)
        await initializeApp();
        
        let pageProps = {};

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }

        if (ctx.req) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/auth/checkuserlogged`, {
                    credentials: "include",
                    headers: { 
                        cookie: ctx.req.headers.cookie || '',
                        'Content-Type': 'application/json'
                    }
                });
                
                const account = await response.json();

                if (ctx.req.url === "/createCharacter" && !account.data?.logged) {
                    if (ctx.res) {
                        ctx.res.writeHead(302, {
                            Location: "/register"
                        });
                        ctx.res.end();
                        return { pageProps, account: {} };
                    }
                }

                return { pageProps, account };
            } catch (error) {
                console.error('Error checking user logged:', error);
                return { pageProps, account: {} };
            }
        }

        return { pageProps, account: {} };
    } catch (error) {
        console.error('Error in getInitialProps:', error);
        return { pageProps: {}, account: {} };
    }
};

export default withReduxStore(MyApp); 