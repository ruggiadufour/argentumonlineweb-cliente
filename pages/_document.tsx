import { Html, Head, Main, NextScript } from 'next/document'
import { DocumentProps } from 'next/document'

export default function Document(props: DocumentProps) {
    return (
        <Html>
            <Head>
                <link
                    href="https://fonts.googleapis.com/css?family=Doppio+One&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
} 