import type { TDialog } from "@/types";

class Config {
    ws: WebSocket;
    canvasSize: {
        width: number;
        height: number;
    };
    canvas: unknown;
    direcciones: {
        up: number;
        down: number;
        right: number;
        left: number;
    };
    seguroActivado: boolean;
    engineStart: boolean;
    moving: boolean;
    varCloseForce: boolean;
    TileBufferSize: number;
    XMinMapSize: number;
    XMaxMapSize: number;
    YMinMapSize: number;
    YMaxMapSize: number;
    OffsetXHead: number;
    actTechos: boolean;
    mapNumber: number;
    timeWalkMS: number;
    requestAnimationFrame: (callback: FrameRequestCallback) => number;
    dialogs: Record<string, TDialog>;
    spells: Record<string, unknown>;
    items: Record<string, unknown>;
    textMaxLength: number;
    manaLength: number;
    hpLength: number;
    xpLength: number;
    pingStart: number;
    intervalSpell: number;
    rangeInterval: number;
    intervalHit: number;
    intervalItem: number;
    timeItemStart: number;
    timeSpellStart: number;
    timeHitStart: number;
    timeRangeStart: number;
    usersOnline: number;
    debug: boolean;
    descClient: string[];
    PROD_SERVER_ENDPOINT: string;
    LOCAL_SERVER_ENDPOINT: string;
    hechizoSelected: number;
    itemSelected: number;
    lastClickIdItem: number;
    clickUse: number;
    nameKeyCode: Record<string, number>;
    keyCodeMap: Record<string, string>;
    keysTemp: string[];
    feedBackButtonOpen: boolean;
    volume: number;
    opacity: number;
    selectedMacro: unknown;
    itemSelectedMacro: unknown;
    spellSelectedMacro: unknown;
    keySelectedMacro: unknown;
    fromCharSelectedMacro: unknown;
    teclasMacros: unknown[];
    arMacros: Record<string, unknown>;
    objType: Record<string, number>;

    constructor() {
        this.ws = null;

        this.canvasSize = {
            width: 544,
            height: 544
        };

        this.canvas = {};

        this.direcciones = {
            up: 1,
            down: 2,
            right: 3,
            left: 4
        };

        this.seguroActivado = true;

        this.engineStart = false;

        this.moving = false;

        this.varCloseForce = false;

        this.TileBufferSize = 9;

        this.XMinMapSize = 1;
        this.XMaxMapSize = 100;
        this.YMinMapSize = 1;
        this.YMaxMapSize = 100;

        this.OffsetXHead = 8;

        this.actTechos = true;

        this.mapNumber = 1;

        this.timeWalkMS = 230;

        this.requestAnimationFrame =
            window.requestAnimationFrame ||
            (window as any).mozRequestAnimationFrame ||
            (window as any).webkitRequestAnimationFrame ||
            (window as any).msRequestAnimationFrame;

        this.dialogs = {};

        this.spells = {};
        this.items = {};

        this.textMaxLength = 140;
        this.manaLength = 124;
        this.hpLength = 124;
        this.xpLength = 223;
        this.pingStart = 0;

        this.intervalSpell = 750;
        this.rangeInterval = this.intervalSpell;
        this.intervalHit = 1000;
        this.intervalItem = 200;

        this.timeItemStart = 0;
        this.timeSpellStart = 0;
        this.timeHitStart = 0;
        this.timeRangeStart = 0;
        this.usersOnline = 0;

        //Conections
        this.debug = true;

        this.descClient = [];

        this.PROD_SERVER_ENDPOINT = "";
        this.LOCAL_SERVER_ENDPOINT = "ws://127.0.0.1:7666";

        this.hechizoSelected = 0;
        this.itemSelected = 0;

        this.lastClickIdItem = 0;
        this.clickUse = 0;

        this.nameKeyCode = {
            flechaArriba: 0,
            flechaAbajo: 1,
            flechaIzquierda: 2,
            flechaDerecha: 3,
            usar: 4,
            atacar: 5,
            agarrar: 6,
            tirar: 7,
            equipar: 8,
            domar: 9,
            robar: 10,
            seguro: 11
        };

        this.keyCodeMap = {
            8: "Volver",
            9: "Tab",
            13: "Enter",
            16: "Shift",
            17: "Ctrl",
            18: "Alt",
            19: "PauseBreak",
            20: "Mayus",
            27: "Esc",
            32: "Barra",
            33: "Re Page",
            34: "Av Page",
            35: "End",
            36: "Home",
            37: "Flecha Izquierda",
            38: "Flecha Arriba",
            39: "Flecha Derecha",
            40: "Flecha Abajo",
            43: "+",
            44: "PrintScreen",
            45: "Insert",
            46: "Supr",
            112: "F1",
            113: "F2",
            114: "F3",
            115: "F4",
            116: "F5",
            117: "F6",
            118: "F7",
            119: "F8",
            120: "F9",
            121: "F10",
            122: "F11",
            123: "F12",
            144: "NumLock",
            145: "ScrollLock"
        };

        this.keysTemp = [];

        this.feedBackButtonOpen = false;

        this.volume = 0.5;

        this.opacity = 0;

        this.selectedMacro;
        this.itemSelectedMacro;
        this.spellSelectedMacro;
        this.keySelectedMacro;
        this.fromCharSelectedMacro;
        this.teclasMacros = [];
        this.arMacros = {};

        this.objType = {
            comida: 1,
            armas: 2,
            armaduras: 3,
            arboles: 4,
            dinero: 5,
            puerta: 6,
            objetoContenedor: 7,
            carteles: 8,
            llaves: 9,
            foros: 10,
            pociones: 11,
            libros: 12,
            bebidas: 13,
            lenia: 14,
            fogata: 15,
            escudos: 16,
            cascos: 17,
            anillos: 18,
            teleport: 19,
            muebles: 20,
            joyas: 21,
            yacimientos: 22,
            metales: 23,
            pergaminos: 24,
            aura: 25,
            instrumentosMusicales: 26,
            yunque: 27,
            fraguas: 28,
            gemas: 29,
            flores: 30,
            barcos: 31,
            flechas: 32,
            botellasVacias: 33,
            botellasLlenas: 34,
            manchas: 35
        };
    }
};


export default Config;
