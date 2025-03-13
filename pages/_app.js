import React from "react";
import { Provider } from "react-redux";
import Head from "../components/Head";

import "@fortawesome/fontawesome-svg-core/styles.css";
import "../styles/style.scss";

import { config as configFA } from "@fortawesome/fontawesome-svg-core";
configFA.autoAddCss = false;

import { fetchUrl } from "../config/utils";
import { setAccount } from "../store";
import withReduxStore from "../lib/with-redux-store";

function MyApp({ Component, pageProps, reduxStore, account }) {
    React.useEffect(() => {
        if (account && !account.err) {
            reduxStore.dispatch(setAccount(account));
        }
    }, [account]);

    return (
        <React.Fragment>
            <Head />
            <Provider store={reduxStore}>
                <Component {...pageProps} />
            </Provider>
        </React.Fragment>
    );
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
    let pageProps = {};

    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
    }

    if (ctx.req) {
        const account = await fetchUrl("/checkuserlogged", {
            credentials: "include",
            headers: { cookie: ctx.req.headers.cookie }
        });

        if (ctx.req.url == "/createCharacter" && !account.logged) {
            if (ctx.res) {
                ctx.res.writeHead(302, {
                    Location: "/register"
                });
                ctx.res.end();
                return { pageProps, account: {} };
            }
        }

        return { pageProps, account };
    }

    return { pageProps, account: {} };
};

export default withReduxStore(MyApp);
