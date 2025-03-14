import { User } from "@/engine";

export type TUI = {
    mapasToLoad: number;
    mapasCargados: number;
    nameMap: string;
    keyCodeDefault: Record<string, number>;
    keyCodeDefaultReset: Record<string, number>;
    crosshair: boolean;
    itemSelected: boolean;
    hechizoSelected: boolean;
    timeRangeStart: number;
    timeSpellStart: number;
    showInputText: boolean;
    showModalReconnect: boolean;
    showModalTrade: boolean;
    messagesConsole: {
        style: {
            color: string;
            fontWeight: string;
            fontStyle: string;
        };
        id: number;
        message: string;
    }[];

    showModalControlPanel: boolean,
    showInventary: boolean,
    showMacroConfig: boolean,
    loading: boolean,
    user: User,
    selectItem: number,
    showConsole: boolean,
    textDialog: string,
    trade: {
        idPosTrade: number,
        idPosInv: number,
        titleItem: string,
        infoItem: string,
        imgItem: string,
        goldItem: string,
        itemsTrade: unknown,
        itemsUser: unknown
    },
    cantTrade: number,
    keyMacro: {
        indexMacro: number,
        idPosItem: string,
        idSpell: number,
        idPosSpell: string,
        key: string,
        keyChar: string,
        img: string,
    },
    valueKeyMacro: {
        idPosItem: string,
        idSpell: number,
        idPosSpell: string,
        img: string,
        key: string,
        keyChar: string
    }[],
    keyCodeMacros: unknown,
    tmpKeyCodeDefault: unknown,
    // keyCodeDefault: {
    //     [nameKeyCode.flechaArriba]: 38,
    //     [nameKeyCode.flechaAbajo]: 40,
    //     [nameKeyCode.flechaIzquierda]: 37,
    //     [nameKeyCode.flechaDerecha]: 39,
    //     [nameKeyCode.usar]: 85,
    //     [nameKeyCode.atacar]: 17,
    //     [nameKeyCode.agarrar]: 65,
    //     [nameKeyCode.tirar]: 84,
    //     [nameKeyCode.equipar]: 69,
    //     [nameKeyCode.domar]: 68,
    //     [nameKeyCode.robar]: 82,
    //     [nameKeyCode.seguro]: 83
    // },
    // keyCodeDefaultReset: {
    //     [nameKeyCode.flechaArriba]: 38,
    //     [nameKeyCode.flechaAbajo]: 40,
    //     [nameKeyCode.flechaIzquierda]: 37,
    //     [nameKeyCode.flechaDerecha]: 39,
    //     [nameKeyCode.usar]: 85,
    //     [nameKeyCode.atacar]: 17,
    //     [nameKeyCode.agarrar]: 65,
    //     [nameKeyCode.tirar]: 84,
    //     [nameKeyCode.equipar]: 69,
    //     [nameKeyCode.domar]: 68,
    //     [nameKeyCode.robar]: 82,
    //     [nameKeyCode.seguro]: 83
    // },
    charKeyCodeDefault: unknown
}