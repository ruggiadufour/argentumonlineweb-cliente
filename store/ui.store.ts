import { proxy } from 'valtio';
import { TUI, TNameKeyCode } from '../types';

export const UIStore = proxy<TUI>({
    itemSelected: false,
    hechizoSelected: false,
    timeRangeStart: 0,
    timeSpellStart: 0,
    showModalControlPanel: false,

    showInventary: true,
    showMacroConfig: false,
    loading: true,
    user: {},
    selectItem: 0,
    showConsole: true,
    messagesConsole: [],
    crosshair: false,
    nameMap: "",
    showModalReconnect: false,
    showInputText: false,
    textDialog: "",
    showModalTrade: false,
    trade: {
        idPosTrade: 0,
        idPosInv: 0,
        titleItem: "",
        infoItem: "",
        imgItem: "",
        goldItem: "",
        itemsTrade: {},
        itemsUser: {}
    },
    cantTrade: 1,
    mapasToLoad: 0,
    mapasCargados: 0,
    keyMacro: {
        indexMacro: "",
        idPosItem: "",
        idSpell: "",
        idPosSpell: "",
        key: "",
        keyChar: ""
    },
    valueKeyMacro: [
        {
            idPosItem: "",
            idSpell: "",
            idPosSpell: "",
            img: "",
            key: "",
            keyChar: ""
        },
        {
            idPosItem: "",
            idSpell: "",
            idPosSpell: "",
            img: "",
            key: "",
            keyChar: ""
        },
        {
            idPosItem: "",
            idSpell: "",
            idPosSpell: "",
            img: "",
            key: "",
            keyChar: ""
        },
        {
            idPosItem: "",
            idSpell: "",
            idPosSpell: "",
            img: "",
            key: "",
            keyChar: ""
        },
        {
            idPosItem: "",
            idSpell: "",
            idPosSpell: "",
            img: "",
            key: "",
            keyChar: ""
        },
        {
            idPosItem: "",
            idSpell: "",
            idPosSpell: "",
            img: "",
            key: "",
            keyChar: ""
        }
    ],
    keyCodeMacros: {},
    tmpKeyCodeDefault: {},
    keyCodeDefault: {
        [TNameKeyCode.flechaArriba]: 38,
        [TNameKeyCode.flechaAbajo]: 40,
        [TNameKeyCode.flechaIzquierda]: 37,
        [TNameKeyCode.flechaDerecha]: 39,
        [TNameKeyCode.usar]: 85,
        [TNameKeyCode.atacar]: 17,
        [TNameKeyCode.agarrar]: 65,
        [TNameKeyCode.tirar]: 84,
        [TNameKeyCode.equipar]: 69,
        [TNameKeyCode.domar]: 68,
        [TNameKeyCode.robar]: 82,
        [TNameKeyCode.seguro]: 83
    },
    keyCodeDefaultReset: {
        [TNameKeyCode.flechaArriba]: 38,
        [TNameKeyCode.flechaAbajo]: 40,
        [TNameKeyCode.flechaIzquierda]: 37,
        [TNameKeyCode.flechaDerecha]: 39,
        [TNameKeyCode.usar]: 85,
        [TNameKeyCode.atacar]: 17,
        [TNameKeyCode.agarrar]: 65,
        [TNameKeyCode.tirar]: 84,
        [TNameKeyCode.equipar]: 69,
        [TNameKeyCode.domar]: 68,
        [TNameKeyCode.robar]: 82,
        [TNameKeyCode.seguro]: 83
    },
    charKeyCodeDefault: {}
})