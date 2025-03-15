import { useSnapshot } from "valtio";
import { UI } from "@/engine";
import { UIStore } from "@/store/ui.store";
import { TItemTrade } from "@/types";
import style from "@/styles/Play.module.scss";

type TProps = {
    ui: React.RefObject<UI>;
    handleBuyTrade: () => void;
    handleSellTrade: () => void;
}

const ModalTrade = ({
    ui,
    handleBuyTrade,
    handleSellTrade
}: TProps) => {
    const uiStore = useSnapshot(UIStore);

    const handleCloseModalTrade = () => {
        UIStore.showModalTrade = false;
    };

    const renderBoxItemsTrade = () => {
        const trade = uiStore.trade;

        let html = [];

        for (let i = 1; i < 26; i++) {
            const item = trade.itemsTrade[i];

            html.push(
                <div
                    className={`${style.slotTrade} ${item && !item.validUser ? style.itemNotValid : ""
                        } ${trade.idPosTrade === i ? style.slotTradeSelected : ""}`}
                    key={i}
                    onClick={() => handleSelectItemTrade(i)}
                >
                    <div
                        className={style.imgItem}
                        style={{
                            backgroundImage: item
                                ? `url("${item.imgItem}")`
                                : "none"
                        }}
                    />
                </div>
            );
        }

        return html;
    };

    const renderBoxItemsUserTrade = () => {
        let html = [];

        for (let i = 1; i < 26; i++) {
            const item = uiStore.trade.itemsUser[i];

            html.push(
                <div
                    className={`${style.slotInventary} ${uiStore.trade.idPosInv === i ? style.slotInventarySelected : ""
                        }`}
                    key={i}
                    onClick={() => handleSelectItemUserTrade(i)}
                >
                    <div
                        className={`${style.imgItem} ${item && !item.validUser ? style.itemNotValid : ""
                            }`}
                        style={{
                            backgroundImage: item
                                ? `url("${item.imgItem}")`
                                : "none"
                        }}
                    />
                    <div className={style.cant}>{item && item.cant}</div>
                    {item && item.equipped ? (
                        <div className={style.equipped}>E</div>
                    ) : null}
                </div>
            );
        }

        return html;
    };

    const handleSelectItemUserTrade = i => {
        const item = uiStore.trade.itemsUser[i];
        UIStore.trade.idPosInv = i;
        handleSelectItem(item);
    };


    const handleSelectItemTrade = i => {
        const item = uiStore.trade.itemsTrade[i];
        UIStore.trade.idPosTrade = i;
        handleSelectItem(item);
    };

    const handleSelectItem = (item: TItemTrade | undefined) => {
        if (item) {
            UIStore.trade.titleItem = item.name;
            UIStore.trade.infoItem = item.info;
            UIStore.trade.imgItem = item.imgItem;
            UIStore.trade.goldItem = item.gold;
        } else {
            UIStore.trade.titleItem = "";
            UIStore.trade.infoItem = "";
            UIStore.trade.imgItem = "";
            UIStore.trade.goldItem = 0;
        }

        ui.current.setProperty("trade", UIStore.trade);
    }

    const handleChangeAmountTrade = (e) => {
        UIStore.cantTrade = e.target.value;
    };

    return (
        <div
            className={style.modalTrade}
            style={{ display: uiStore.showModalTrade ? "block" : "none" }}
        >
            <div className={style.headTrade}>
                <div className={style.imgItemTrade}>
                    <div
                        className={style.imgItem}
                        style={{
                            backgroundImage: uiStore.trade.imgItem
                                ? `url("${uiStore.trade.imgItem}")`
                                : "none"
                        }}
                    />
                </div>
                <div className={style.titleAndGold}>
                    <div className={style.titleItemTrade}>
                        {uiStore.trade.titleItem}
                    </div>
                    <div className={style.infoItem}>
                        {uiStore.trade.infoItem}
                    </div>
                    <div className={style.goldItemTrade}>
                        {uiStore.trade.goldItem}
                    </div>
                </div>
                <div
                    className={style.closeTrade}
                    onClick={handleCloseModalTrade}
                />
            </div>
            <div className={style.itemsTrade}>
                <div className={style.trade}>
                    {renderBoxItemsTrade()}
                </div>
                <div className={style.inventary}>
                    {renderBoxItemsUserTrade()}
                </div>
            </div>
            <div className={style.footerTrade}>
                <div
                    className={style.buttonBuy}
                    onClick={handleBuyTrade}
                />
                <div className={style.buttonLess} />
                <input
                    type="text"
                    className={style.cantTrade}
                    value={uiStore.cantTrade}
                    onChange={handleChangeAmountTrade}
                />
                <div className={style.buttonMore} />
                <div
                    className={style.buttonSell}
                    onClick={handleSellTrade}
                />
            </div>
        </div>
    )
}

export default ModalTrade;