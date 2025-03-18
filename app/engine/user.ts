import type { TSpell } from "@/types";

class User {
    moving: boolean;
    addtoUserPos: {
        x: number;
        y: number;
    };
    pos: {
        x: number;
        y: number;
    };
    id: number;
    items: Record<string, {
        idItem: number,
        nameItem: string,
        equipped: boolean,
        grhIndex: number,
        cant: number,
        gold: number,
        objType: number,
        validUser: number,
        info: string
    }>;
    spells: Record<string, TSpell>;
    clan: string;
    color: string;
    exp: number;
    expNextLevel: number;
    gold: number;
    heading: number;
    hp: number;
    idBody: number;
    idClase: number;
    idHead: number;
    idHelmet: number;
    idShield: number;
    idWeapon: number;
    inmovilizado: number;
    level: number;
    mana: number;
    maxHp: number;
    maxMana: number;
    nameCharacter: string;
    navegando: number;
    privileges: number;
    zonaSegura: number;
    attrFuerza: number;
    attrAgilidad: number;
    lvl: number;
    npcTrade: number | null;
    map: number;
    isNpc: boolean;
    moveOffsetX: number;
    moveOffsetY: number;
    fxId: number;
    frameFxCounter: number;
    scrollDirectionX: number;
    scrollDirectionY: number;
    frameCounter: number;
    scrollPixelsPerFrameX: number = 0;
    scrollPixelsPerFrameY: number = 0;
    posYDescClient: number = 0;
    sumPosY: number = 0;
    lifeDescClient: number = 0;
    timeMoveDescClient: number = 0;
    timeWalk: number = 0;
    canvas: HTMLCanvasElement | null = null;
    refCanvas: HTMLCanvasElement | null = null;
    keydown: Record<string, unknown> = {};
    keysTemp: string[] = [];
    feedBackButtonOpen: boolean = false;
    volume: number = 0;
    muerto: boolean = false;
    
    constructor() {
        this.addtoUserPos = {
            x: 0,
            y: 0
        };

        this.pos = {
            x: 0,
            y: 0
        };

        this.id = 0;

        this.items = {};
        this.spells = {};

        this.clan = "";
        this.color = "#3333ff";
        this.exp = 0;
        this.expNextLevel = 0;
        this.gold = 0;
        this.heading = 0;
        this.hp = 0;
        this.id = 0;
        this.idBody = 0;
        this.idClase = 0;
        this.idHead = 0;
        this.idHelmet = 0;
        this.idShield = 0;
        this.idWeapon = 0;
        this.inmovilizado = 0;
        this.level = 0;
        this.mana = 0;
        this.maxHp = 0;
        this.maxMana = 0;
        this.moving = false;
        this.nameCharacter = "";
        this.navegando = 0;
        this.privileges = 0;
        this.zonaSegura = 0;
        this.attrFuerza = 0;
        this.attrAgilidad = 0;
        this.lvl = 0;
        this.npcTrade = null;

        // TODO: ver si se puede separar en otra clase
        this.map = 0;
        this.isNpc = false;
        this.moveOffsetX = 0;
        this.moveOffsetY = 0;
        this.fxId = 0;
        this.frameFxCounter = 0;
        this.scrollDirectionX = 0;
        this.scrollDirectionY = 0;
        this.frameCounter = 0;
        this.muerto = false;
    }
}

export default User;
