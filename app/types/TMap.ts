export type TMap = Record<
    number,
    Record<
        number,
        Record<
            number,
            {
                o?: { oi: number } | undefined,
                g?: Record<number, number>,
                b?: number,
            }
        >
    >
>;
