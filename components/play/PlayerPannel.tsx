import { useSnapshot } from "valtio";
import _ from "lodash";
import { UIStore } from "@/store/ui.store";
import Inventary from "@/components/play/Inventary";
import Spells from "@/components/play/Spells";
import { Config } from "@/engine";
import style from "@/styles/Play.module.scss";

type TProps = {
    handleCharKeyCodeDefault: () => void;
    handleSelectSpell: (idSpell: number) => void;
    handleUseItem: (i: number) => void;
    config: React.RefObject<Config>;
    graphics: any;
}

export const PlayerPannel = ({
    handleCharKeyCodeDefault,
    handleSelectSpell,
    handleUseItem,
    config,
    graphics
}: TProps) => {
    const uiStore = useSnapshot(UIStore);

    const handleShowInventary = () => {
        UIStore.showInventary = true;
    };

    const handleShowSpells = () => {
        UIStore.showInventary = false;
    };

    const handleSelectItem = (i: number) => {
        UIStore.selectItem = i;
    };

    const handleShowConfiguration = () => {
        UIStore.showModalControlPanel = true;
        UIStore.tmpKeyCodeDefault = _.cloneDeep(UIStore.keyCodeDefault);
        handleCharKeyCodeDefault();
    };

    return (
        <div className={style.content_right}>
            <div className={style.header}>
                <div className={style.level}>
                    {uiStore.user.level}
                </div>
                <div
                    className={style.configuration}
                    onClick={handleShowConfiguration}
                />
                <div className={style.name}>
                    {uiStore.user.nameCharacter}
                </div>
                <div className={style.exp}>
                    <div
                        className={style.progress_bar}
                        style={{
                            width: `${(((uiStore.user.exp * 100) /
                                uiStore.user.expNextLevel) *
                                config.current.xpLength) /
                                100}px`
                        }}
                    />
                    <div className={style.porcentaje}>{`${(
                        (uiStore.user.exp * 100) /
                        uiStore.user.expNextLevel
                    ).toFixed(2)}%`}</div>
                    <div className={style.num}>{`${uiStore.user.exp
                        } / ${uiStore.user.expNextLevel}`}</div>
                </div>
                <div className={style.buttons}>
                    <div
                        className={`${style.button_inv} ${!uiStore.showInventary
                                ? style.buttonInvSelected
                                : ""
                            }`}
                        onClick={handleShowInventary}
                    />
                    <div
                        className={`${style.button_spell} ${uiStore.showInventary
                                ? style.buttonInvSelected
                                : ""
                            }`}
                        onClick={handleShowSpells}
                    />
                </div>
            </div>
            <div className={style.body}>
                <div
                    className={style.inventary}
                    style={{
                        display: uiStore.showInventary
                            ? "block"
                            : "none"
                    }}
                >
                    <Inventary
                        graphics={graphics}
                        handleSelectItem={handleSelectItem}
                        handleUseItem={handleUseItem}
                    />
                </div>
                <div
                    className={style.spell}
                    style={{
                        display: uiStore.showInventary
                            ? "none"
                            : "block"
                    }}
                >
                    <Spells handleSelectSpell={handleSelectSpell} />
                </div>
            </div>
            <div className={style.footer}>
                <div className={style.info_map}>
                    <div className={style.name_map}>
                        {uiStore.nameMap}
                    </div>
                    <div className={style.pos_map}>
                        {uiStore.user.pos
                            ? `Mapa: ${config.current.mapNumber
                            } X: ${uiStore.user.pos.x} Y: ${uiStore.user.pos.y
                            }`
                            : ""}
                    </div>
                </div>
                <div className={style.left_footer}>
                    <div className={style.hp}>
                        <div
                            className={style.progress_bar}
                            style={{
                                width: `${(uiStore.user.hp *
                                    config.current.hpLength) /
                                    uiStore.user.maxHp}px`
                            }}
                        />
                        <div className={style.num}>{`${uiStore.user.hp
                            } / ${uiStore.user.maxHp}`}</div>
                    </div>
                    <div className={style.mana}>
                        <div
                            className={style.progress_bar}
                            style={{
                                width: `${(uiStore.user.mana *
                                    config.current
                                        .manaLength) /
                                    uiStore.user.maxMana}px`
                            }}
                        />
                        <div className={style.num}>{`${uiStore.user.mana
                            } / ${uiStore.user.maxMana}`}</div>
                    </div>
                    <div className={style.gold}>
                        {uiStore.user.gold}
                    </div>
                    <div className={style.attr}>
                        <div className={style.agilidad}>
                            {uiStore.user.attrAgilidad}
                        </div>
                        <div className={style.fuerza}>
                            {uiStore.user.attrFuerza}
                        </div>
                    </div>
                </div>
                <div className={style.right_footer}>
                    <div
                        className={style.minimap}
                        style={{
                            backgroundImage: config.current
                                .mapNumber
                                ? `url('/static/imgs_mapas/${config.current.mapNumber
                                }.png')`
                                : "none"
                        }}
                    >
                        <div
                            className={style.point_minimap}
                            style={{
                                top: uiStore.user.pos
                                    ? `${uiStore.user.pos.y - 1}px`
                                    : 0,
                                left: uiStore.user.pos
                                    ? `${uiStore.user.pos.x - 1}px`
                                    : 0
                            }}
                        />
                    </div>

                    <div className={style.buttons_map}>
                        <div className={style.open_map} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlayerPannel;