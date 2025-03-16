import type { Package, Config } from "./index";

class General {
    pkg: Package;
    config: Config;

    constructor(pkg: Package, config: Config) {
        this.pkg = pkg;
        this.config = config;
    }

    sendDialog = (msg: string) => {
        msg = msg.trim();
        if (msg) {
            const msgsplit = msg.split(" ");

            if (msgsplit[0].charAt(0) == "/") {
                msgsplit[0] = msgsplit[0].toLowerCase();
            }
            if (msg.length > this.config.textMaxLength) {
                msg = msg.slice(0, this.config.textMaxLength);
            }

            this.pkg.setPackageID(this.pkg.serverPacketID.dialog);
            this.pkg.writeString(msg);
            this.config.ws.send(this.pkg.dataSend());
        }
    };
}

export default General;
