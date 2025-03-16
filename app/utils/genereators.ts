import type { TGraphic, TKeyMacro } from "@/types"
import { AMOUNT_SLOTS_MACROS } from "@/utils/constants";
import { TNameKeyCode } from "@/types/TNameKeyCode";
export const generateKeyMacro = (): TKeyMacro => {
    return {
        indexMacro: 0,
        idPosItem: -1,
        idSpell: 0,
        idPosSpell: 0,
        key: -1,
        keyChar: "",
        img: "",
    }
}

export const generateListKeyMacro = (): TKeyMacro[] => {
    return Array.from({ length: AMOUNT_SLOTS_MACROS }, () => generateKeyMacro());
}

export const generateKeyCodeDefault = (): Record<string, number> => {
    return {
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
    }
}

export const generateObject = (): TGraphic => ({
    numFrames: 0,
    numFile: "",
    sX: 0,
    sY: 0,
    width: 0,
    height: 0,
    frames: {},
    offset: { x: 0, y: 0 },
    grhIndex: 0,
    frameCounter: 0,
    speed: 0,
})