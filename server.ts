import express, { Request, Response } from 'express';
import next from 'next';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import flash from 'express-flash';
import mongoose from 'mongoose';
import compression from 'compression';
import { ParsedUrlQuery } from 'querystring';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;
const urls = require("./config/urls.json");

// Importaciones que aún necesitan ser convertidas a ES modules
const passportConfig = require("./server/passport");
const cookieSession = require("cookie-session");
const routes = require("./server/routes");

// Configuración de MongoDB
if (dev) {
    const urlMongo = "mongodb://localhost:27017/aoweb";
    mongoose.connect(urlMongo, { useNewUrlParser: true, useUnifiedTopology: true });
} else {
    const urlMongo = "";
    mongoose.connect(urlMongo, { useNewUrlParser: true, useUnifiedTopology: true });
}

mongoose.connection.on('connecting', () => { 
    console.log('connecting')
    console.log(mongoose.connection.readyState);
});

mongoose.connection.on('connected', () => {
    console.log('connected');
    console.log(mongoose.connection.readyState);
});

mongoose.connection.on('disconnecting', () => {
    console.log('disconnecting');
    console.log(mongoose.connection.readyState);
});

mongoose.connection.on('disconnected', () => {
    console.log('disconnected');
    console.log(mongoose.connection.readyState);
});

const robotsOptions = {
    root: __dirname + "/static/",
    headers: {
        "Content-Type": "text/plain; charset=UTF-8"
    }
};

app.prepare().then(() => {
    const server = express();

    server.use(compression());
    server.use(cors());
    server.use(express.urlencoded({ extended: false }));
    server.use(express.json());
    server.use(flash());
    server.use(cookieParser());
    
    server.use(
        session({
            secret: 'your-secret-key',
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
                secure: !dev
            }
        })
    );

    server.use(passport.initialize());
    server.use(passport.session());

    server.get("/robots.txt", (req: Request, res: Response) =>
        res.status(200).sendFile("robots.txt", robotsOptions)
    );

    routes(server);

    Object.keys(urls).forEach((url: string) => {
        const href = urls[url];
        server.get(url, (req: Request, res: Response) => {
            const query = req.query as ParsedUrlQuery;
            return app.render(req, res, href, query);
        });
    });

    server.all('*', (req: Request, res: Response) => {
        return handle(req, res);
    });

    server.listen(port, (err?: Error) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});
