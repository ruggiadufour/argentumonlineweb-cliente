"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const next_1 = __importDefault(require("next"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const express_flash_1 = __importDefault(require("express-flash"));
const mongoose_1 = __importDefault(require("mongoose"));
const compression_1 = __importDefault(require("compression"));
const dev = process.env.NODE_ENV !== 'production';
const app = (0, next_1.default)({ dev });
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
    mongoose_1.default.connect(urlMongo, { useNewUrlParser: true, useUnifiedTopology: true });
}
else {
    const urlMongo = "";
    mongoose_1.default.connect(urlMongo, { useNewUrlParser: true, useUnifiedTopology: true });
}
mongoose_1.default.connection.on('connecting', () => {
    console.log('connecting');
    console.log(mongoose_1.default.connection.readyState);
});
mongoose_1.default.connection.on('connected', () => {
    console.log('connected');
    console.log(mongoose_1.default.connection.readyState);
});
mongoose_1.default.connection.on('disconnecting', () => {
    console.log('disconnecting');
    console.log(mongoose_1.default.connection.readyState);
});
mongoose_1.default.connection.on('disconnected', () => {
    console.log('disconnected');
    console.log(mongoose_1.default.connection.readyState);
});
const robotsOptions = {
    root: __dirname + "/static/",
    headers: {
        "Content-Type": "text/plain; charset=UTF-8"
    }
};
app.prepare().then(() => {
    const server = (0, express_1.default)();
    server.use((0, compression_1.default)());
    server.use((0, cors_1.default)());
    server.use(express_1.default.urlencoded({ extended: false }));
    server.use(express_1.default.json());
    server.use((0, express_flash_1.default)());
    server.use((0, cookie_parser_1.default)());
    server.use((0, express_session_1.default)({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
            secure: !dev
        }
    }));
    server.use(passport_1.default.initialize());
    server.use(passport_1.default.session());
    server.get("/robots.txt", (req, res) => res.status(200).sendFile("robots.txt", robotsOptions));
    routes(server);
    Object.keys(urls).forEach((url) => {
        const href = urls[url];
        server.get(url, (req, res) => {
            const query = req.query;
            return app.render(req, res, href, query);
        });
    });
    server.all('*', (req, res) => {
        return handle(req, res);
    });
    server.listen(port, (err) => {
        if (err)
            throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});
