import type { TItem } from "@/types";

export type TItemPlay = TItem & {
    name: string,
    info: string,
    gold: number,
    imgItem: string,
    validUser: number,
}
