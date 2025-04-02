import { defineStore } from 'pinia'
import { generateKeyCodeDefault, generateKeyMacro, generateListKeyMacro } from '@/utils/genereators'
import type { TUI } from '@/types'
import { User } from '@/engine'

export const useUIStore = defineStore('ui', ()=>{
    const ui = reactive<TUI>({
        screen: getScreenSize(),
        itemSelected: -1,
        hechizoSelected: false,
        timeRangeStart: 0,
        timeSpellStart: 0,
        showModalControlPanel: false,
    
        showInventary: true,
        showMacroConfig: false,
        loading: true,
        user: {} as User,
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
            goldItem: 0,
            itemsTrade: {},
            itemsUser: {}
        },
        cantTrade: 1,
        mapasToLoad: 0,
        mapasCargados: 0,
        keyMacro: generateKeyMacro(),
        valueKeyMacro: generateListKeyMacro(),
        keyCodeMacros: {},
        tmpKeyCodeDefault: {},
        keyCodeDefault: generateKeyCodeDefault(),
        keyCodeDefaultReset: generateKeyCodeDefault(),
        charKeyCodeDefault: {}
    })

    function getScreenSize() {
        const DEFAULT_SCREEN_SIZE = 544;
        let RIGHT_SIDE = 385;
        let BOTTOM_SIDE = 85;
        let width = DEFAULT_SCREEN_SIZE;
        let height = DEFAULT_SCREEN_SIZE;
        const PIXELS = 32;

        if(true && window) {
            const auxWidth = window.innerWidth - RIGHT_SIDE;
            const auxHeight = window.innerHeight - BOTTOM_SIDE;
            const remWidth = auxWidth % PIXELS;
            const remHeight = auxHeight % PIXELS;
            const wPixes = Math.trunc(auxWidth / PIXELS);
            const hPixes = Math.trunc(auxHeight / PIXELS);
            width = wPixes * PIXELS;
            height = hPixes * PIXELS;

            const extraWidth = width % (2 * PIXELS) ? PIXELS : 0;
            const extraHeight = height % (2 * PIXELS) ? PIXELS : 0;
            width += extraWidth;
            height += extraHeight;

            RIGHT_SIDE += remWidth;
            BOTTOM_SIDE += remHeight;
        }

        console.log({width, height, RIGHT_SIDE, BOTTOM_SIDE});
        return {
            width: width,
            height: height,
            rightSide: RIGHT_SIDE,
            bottomSide: BOTTOM_SIDE
        }
    }

    return {
        ui
    }
})