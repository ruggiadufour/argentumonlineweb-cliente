import type { TSpell } from "@/types";

export type TSpellPlay = Omit<TSpell, "idPos"> & {
    name: string,
    manaRequired: number
}
