import { proxy } from 'valtio';
import { TUI, TNameKeyCode } from '../types';
import { User } from '@/engine';

export const UIStore = proxy<TUI>({
    itemSelected: false,
    hechizoSelected: false,
    timeRangeStart: 0,
    timeSpellStart: 0,
    showModalControlPanel: false,

    showInventary: true,
    showMacroConfig: false,
    loading: true,
    user: new User(),
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
        indexMacro: 0,
        idPosItem: "",
        idSpell: -1,
        idPosSpell: "",
        key: "",
        keyChar: "",
        img: ""
    },
    valueKeyMacro: [
        {
            idPosItem: "",
            idSpell: -1,
            idPosSpell: "",
            img: "",
            key: "",
            keyChar: ""
        },
        {
            idPosItem: "",
            idSpell: -1,
            idPosSpell: "",
            img: "",
            key: "",
            keyChar: ""
        },
        {
            idPosItem: "",
            idSpell: -1,
            idPosSpell: "",
            img: "",
            key: "",
            keyChar: ""
        },
        {
            idPosItem: "",
            idSpell: -1,
            idPosSpell: "",
            img: "",
            key: "",
            keyChar: ""
        },
        {
            idPosItem: "",
            idSpell: -1,
            idPosSpell: "",
            img: "",
            key: "",
            keyChar: ""
        },
        {
            idPosItem: "",
            idSpell: -1,
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