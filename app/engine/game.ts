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

    useItem = (idPos: number) => {
        if (idPos) {
            const item = this.user.items[idPos];
            if(!item) return;

            const objItem = this.inits.objs[item.idItem];

            if (objItem.proyectil && item.equipped) {
                this.ui.setProperty("crosshair", true);

                this.config.itemSelected = item.idItem;
            } else {
                if (
                    +Date.now() - this.config.timeItemStart >
                    this.config.intervalItem
                ) {
                    this.config.timeItemStart = +Date.now();

                    this.pkg.setPackageID(this.pkg.serverPacketID.useItem);
                    this.pkg.writeInt(idPos);
                    this.config.ws?.send(this.pkg.dataSend());
                }
            }
        }
    };

    equiparItem = (idPos: number, idItem: number) => {
        this.pkg.setPackageID(this.pkg.serverPacketID.equiparItem);
        this.pkg.writeInt(idPos);
        this.config.ws?.send(this.pkg.dataSend());
    };

    connectCharacter = () => {
        const idAccount = localStorage.getItem("idAccount") || "";
        const idCharacter = localStorage.getItem("idCharacter") || "";
        const email = localStorage.getItem("email") || "";
        const typeGame = localStorage.getItem("typeGame") || "";
        const idChar = localStorage.getItem("idChar") || "";

        this.pkg.setPackageID(this.pkg.serverPacketID.connectCharacter);
        this.pkg.writeString(idAccount);
        this.pkg.writeString(idCharacter);
        this.pkg.writeString(email);
        this.pkg.writeByte(parseInt(typeGame));
        this.pkg.writeByte(parseInt(idChar));

        this.config.ws?.send(this.pkg.dataSend());
    };

    writeConsole = (msg: string, color: string = "white", isBold: boolean | false = false, isItalic: boolean | false = false) => {
        const messagesConsole = this.ui.state.messagesConsole;
        const bold = isBold ? "bold" : "normal";
        const italic = isItalic ? "italic" : "normal";

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
            this.config.ws?.send(this.pkg.dataSend());
        }
    };

    sellTrade = () => {
        if (this.ui.state.trade.idPosInv) {
            this.pkg.setPackageID(this.pkg.serverPacketID.sellItem);
            this.pkg.writeByte(this.ui.state.trade.idPosInv);
            this.pkg.writeShort(this.ui.state.cantTrade);
            this.config.ws?.send(this.pkg.dataSend());
        }
    };
}

export default Game;
