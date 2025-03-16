import { defineStore } from 'pinia'
import { generateKeyCodeDefault, generateKeyMacro, generateListKeyMacro } from '@/utils/genereators'
import type { TUI } from '@/types'
import { User } from '@/engine'

export const useUIStore = defineStore('ui', ()=>{
    const ui = reactive<TUI>({
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

    return {
        ui
    }
})