import type { UI, User, Package, Config, Inits } from "./index";

class Game {
    inits: Inits;
    ui: UI;
    user: User;
    pkg: Package;
    config: Config;

    constructor(inits: Inits, ui: UI, user: User, pkg: Package, config: Config) {
        this.inits = inits;
        this.ui = ui;
        this.user = user;
        this.pkg = pkg;
        this.config = config;
    }

    useItem = idPos => {
        if (idPos) {
            const items = this.user.items;
            const objItem = this.inits.objs[items[idPos].idItem];

            if (objItem.proyectil && items[idPos].equipped) {
                this.ui.setProperty("crosshair", true);

                this.config.itemSelected = items[idPos].idItem;
            } else {
                if (
                    +Date.now() - this.config.timeItemStart >
                    this.config.intervalItem
                ) {
                    this.config.timeItemStart = +Date.now();

                    this.pkg.setPackageID(this.pkg.serverPacketID.useItem);
                    this.pkg.writeInt(idPos);
                    this.config.ws.send(this.pkg.dataSend());
                }
            }
        }
    };

    equiparItem = (idPos, id) => {
        this.pkg.setPackageID(this.pkg.serverPacketID.equiparItem);
        this.pkg.writeInt(idPos);
        this.config.ws.send(this.pkg.dataSend());
    };

    connectCharacter = () => {
        this.pkg.setPackageID(this.pkg.serverPacketID.connectCharacter);
        this.pkg.writeString(localStorage.getItem("idAccount"));
        this.pkg.writeString(localStorage.getItem("idCharacter") || "");
        this.pkg.writeString(localStorage.getItem("email"));
        this.pkg.writeByte(parseInt(localStorage.getItem("typeGame")));
        this.pkg.writeByte(parseInt(localStorage.getItem("idChar")));

        this.config.ws.send(this.pkg.dataSend());
    };

    writeConsole = (msg, color, bold = null, italic = null) => {
        const messagesConsole = this.ui.state.messagesConsole;

        if (!color) {
            color = "white";
        }

        if (bold) {
            bold = "bold";
        } else {
            bold = "normal";
        }

        if (italic) {
            italic = "italic";
        } else {
            italic = "normal";
        }

        messagesConsole.push(
            {
                style: {
                    color: color,
                    fontWeight: bold,
                    fontStyle: italic
                },
                id: +new Date(),
                message: msg
            }
        );

        if (messagesConsole.length > 8) {
            messagesConsole.shift();
        }

        this.ui.setProperty("messagesConsole", messagesConsole);

        // TODO: Implementar scroll de consola
        // const consoleElem = this.ui.refs.console;
        // if (consoleElem) {
        //     const scrollHeight = consoleElem.scrollHeight;
        //     const height = consoleElem.clientHeight;

        //     const maxScrollTop = scrollHeight - height;
        //     consoleElem.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
        // }
    };

    buyTrade = () => {
        if (this.ui.state.trade.idPosTrade) {
            this.pkg.setPackageID(this.pkg.serverPacketID.buyItem);
            this.pkg.writeByte(this.ui.state.trade.idPosTrade);
            this.pkg.writeShort(this.ui.state.cantTrade);
            this.config.ws.send(this.pkg.dataSend());
        }
    };

    sellTrade = () => {
        if (this.ui.state.trade.idPosInv) {
            this.pkg.setPackageID(this.pkg.serverPacketID.sellItem);
            this.pkg.writeByte(this.ui.state.trade.idPosInv);
            this.pkg.writeShort(this.ui.state.cantTrade);
            this.config.ws.send(this.pkg.dataSend());
        }
    };
}

export default Game;
