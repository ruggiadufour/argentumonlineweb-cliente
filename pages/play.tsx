import React, { useEffect, useRef } from "react";
import { useSnapshot } from "valtio";
import { connect } from "react-redux";
import _ from "lodash";

import style from "../styles/Play.module.scss";
import { UI, Config, Inits, Engine, General, Messages, Connection, Game, User, Package } from "@/engine";
import { UIStore } from "@/store/ui.store";

import {
    LoadingInfo,
    Configuration,
    ConfigurationMacro,
    ModalTrade,
    Macros,
    Console,
    PlayerPannel,
    GameView,
} from "@/components";

const Play = (props) => {
    const uiStore = useSnapshot(UIStore);

    const modalMacro = useRef<HTMLDivElement>(null);
    const canvas = useRef({
        background: {},
        techos: {},
        foreground: {},
        items: {},
        textos: {},
    });

    const ui = useRef(new UI(UIStore));
    const pkg = useRef<Package | null>({});
    const inits = useRef<Inits | null>({});
    const user = useRef<User | null>({});
    const general = useRef<General | null>({});
    const game = useRef<Game | null>({});
    const engine = useRef<Engine | null>({});
    const messages = useRef<Messages | null>({});
    const connection = useRef<Connection | null>({});
    const config = useRef<Config | null>({});

    useEffect(() => {
        const asyncInit = async () => {
            const macros = window.localStorage.getItem("macros");

            if (macros) {
                let tmpKeyCodeMacros = {};
                const jsonMacros = JSON.parse(macros);

                jsonMacros.map((macro, index) => {
                    if (macro.key) {
                        tmpKeyCodeMacros[macro.key] = index;
                    }
                });

                ui.current.setProperties({
                    valueKeyMacro: jsonMacros,
                    keyCodeMacros: tmpKeyCodeMacros,
                });
            }

            const defaultKeys = window.localStorage.getItem("defaultKeys");

            if (defaultKeys) {
                const jsonDefaultKeys = JSON.parse(defaultKeys);

                // TODO: ver si este await tiene algun efecto con el cambio
                await ui.current.setProperties({
                    keyCodeDefault: _.cloneDeep(jsonDefaultKeys),
                    tmpKeyCodeDefault: _.cloneDeep(jsonDefaultKeys),
                });
            }

            config.current = new Config();
            pkg.current = new Package();
            user.current = new User();

            inits.current = new Inits(ui.current);
            inits.current.setUI(props);

            general.current = new General(pkg.current, config.current);
            game.current = new Game(
                inits.current,
                ui.current,
                user.current,
                pkg.current,
                config.current
            );
            engine.current = new Engine(
                inits.current,
                ui.current,
                user.current,
                pkg.current,
                config.current,
                game.current,
                canvas.current
            );
            messages.current = new Messages(
                ui.current,
                user.current,
                engine.current,
                inits.current,
                pkg.current,
                config.current,
                game.current
            );
            connection.current = new Connection(
                ui.current,
                messages.current,
                pkg.current,
                game.current,
                engine.current,
                user.current,
                config.current
            );

            handleCharKeyCodeDefault();

            await engine.current.initCanvas();

            connection.current.startWebSocket();

            ui.current.setProperty("loading", false);

            document.oncontextmenu = (e) => {
                e.stopPropagation();
                return false;
            };

            document.onkeyup = (e) => {
                const keyCode = e.keyCode;

                if (uiStore.showMacroConfig) return;

                if (
                    !uiStore.showInputText &&
                    !isNaN(parseInt(uiStore.keyCodeMacros[keyCode]))
                ) {
                    const macro = uiStore.valueKeyMacro[uiStore.keyCodeMacros[keyCode]];

                    if (macro.idPosItem !== "") {
                        game.current.useItem(macro.idPosItem);
                    } else if (macro.idSpell !== -1) {
                        handleSelectSpell(macro.idPosSpell);
                    }

                    return;
                }

                //Usar
                if (
                    keyCode == uiStore.keyCodeDefault[config.current.nameKeyCode.usar] &&
                    !uiStore.showInputText
                ) {
                    if (uiStore.selectItem) game.current.useItem(uiStore.selectItem);
                }

                //Equipar
                if (
                    keyCode ==
                    uiStore.keyCodeDefault[config.current.nameKeyCode.equipar] &&
                    !uiStore.showInputText
                ) {
                    const item = user.current.items[uiStore.selectItem];

                    if (uiStore.selectItem && item)
                        game.current.equiparItem(uiStore.selectItem, item.idItem);
                }

                //Agarrar
                if (
                    keyCode ==
                    uiStore.keyCodeDefault[config.current.nameKeyCode.agarrar] &&
                    !uiStore.showInputText
                ) {
                    pkg.current.setPackageID(pkg.current.serverPacketID.agarrarItem);
                    config.current.ws.send(pkg.current.dataSend());
                }

                //Tirar
                if (
                    keyCode == uiStore.keyCodeDefault[config.current.nameKeyCode.tirar] &&
                    !uiStore.showInputText
                ) {
                    let cantItem = 1;

                    if (uiStore.selectItem) {
                        const promptResult = prompt("¿Cuántos quieres tirar?", "1");
                        cantItem = parseInt(promptResult || "1");
                    }

                    if (cantItem > 0) {
                        pkg.current.setPackageID(pkg.current.serverPacketID.tirarItem);
                        pkg.current.writeInt(uiStore.selectItem);
                        pkg.current.writeShort(Math.trunc(cantItem));
                        config.current.ws.send(pkg.current.dataSend());
                    }
                }

                //Enter
                if (keyCode == 13) {
                    if (uiStore.showInputText) {
                        general.current.sendDialog(uiStore.textDialog);

                        ui.current.setProperty("textDialog", "");
                    }
                    console.log({ showInputText: uiStore.showInputText });

                    ui.current.setProperty("showInputText", !uiStore.showInputText);
                    console.log({ showInputText: uiStore.showInputText });
                }

                if (keyCode == 77 && !uiStore.showInputText) {
                    general.current.sendDialog("/meditar");
                }

                if (
                    keyCode ==
                    uiStore.keyCodeDefault[config.current.nameKeyCode.seguro] &&
                    !uiStore.showInputText
                ) {
                    if (config.current.seguroActivado) {
                        config.current.seguroActivado = false;
                    } else {
                        config.current.seguroActivado = true;
                    }

                    pkg.current.setPackageID(pkg.current.serverPacketID.changeSeguro);
                    config.current.ws.send(pkg.current.dataSend());
                }
                if (
                    keyCode == uiStore.keyCodeDefault[config.current.nameKeyCode.atacar]
                ) {
                    if (
                        +Date.now() - config.current.timeHitStart >
                        config.current.intervalHit
                    ) {
                        engine.current.hit();
                    }
                }

                const event_ = (event || window.event) as any;
                if (event_.ctrlKey) {
                    const c = event_.which || keyCode;
                    switch (c) {
                        case 83:
                        case 87:
                        case 68:
                            event_.preventDefault();
                            event_.stopPropagation();
                            break;
                    }
                }
            };
        };

        asyncInit();

        // Cleanup function
        return () => {
            document.oncontextmenu = null;
            document.onkeyup = null;
        };
    }, []); // Empty dependency array since we want this to run only once on mount

    const handleCharKeyCodeDefault = () => {
        const keyCodeDefault = UIStore.keyCodeDefault;
        const charKeyCodeDefault = UIStore.charKeyCodeDefault;

        Object.keys(keyCodeDefault).map((key) => {
            const keyCode = keyCodeDefault[key];

            let fromChar = String.fromCharCode(keyCode);

            if (config.current.keyCodeMap[keyCode]) {
                fromChar = config.current.keyCodeMap[keyCode];
            }

            charKeyCodeDefault[key] = fromChar;
        });

        ui.current.setProperty("charKeyCodeDefault", charKeyCodeDefault);
    };

    const handleSelectSpell = (i: number) => {
        const spell = user.current.spells[i];

        if (uiStore.showMacroConfig && spell) {
            UIStore.keyMacro.idSpell = spell.idSpell;
            UIStore.keyMacro.idPosSpell = i;
            UIStore.keyMacro.idPosItem = "";
            UIStore.keyMacro.img = `/static/spells/${spell.idSpell}.png`;

            // ui.current.setProperty("keyMacro", currentKeyMacro);

            return;
        }

        if (user.current.maxMana > 0) {
            config.current.hechizoSelected = i;
            ui.current.setProperty("crosshair", true);
            game.current.writeConsole("Haz click sobre el objetivo...", "gray");
        }
    };



    // if(!game.current) return <div>Loading...</div>

    return (
        <>
            <LoadingInfo />

            <ul className={style.modalInfo} />

            <Configuration
                handleCharKeyCodeDefault={handleCharKeyCodeDefault}
                ui={ui}
                config={config}
            />

            <div
                className={style.modalReconnect}
                style={{ top: "285px", left: "638.5px" }}
            />

            <ConfigurationMacro modalMacro={modalMacro} ui={ui} config={config} />

            <ModalTrade
                ui={ui}
                handleBuyTrade={game.current.buyTrade}
                handleSellTrade={game.current.sellTrade}
            />

            <div
                className={style.outer}
                style={{ display: uiStore.loading ? "none" : "table" }}
            >
                <div className={style.middle}>
                    <div className={style.content}>
                        <div className={style.content_left}>
                            <div className={style.render}>
                                <input
                                    type="text"
                                    name="text"
                                    autoFocus
                                    className={style.text}
                                    style={{
                                        display: uiStore.showInputText ? "block" : "none",
                                    }}
                                    value={uiStore.textDialog}
                                    onChange={(e) => {
                                        ui.current.setProperty("textDialog", e.target.value);
                                    }}
                                />
                                <GameView engine={engine} canvas={canvas} />
                                <Console />
                            </div>

                            <div className={style.macros}>
                                <Macros modalMacro={modalMacro} ui={ui} />
                            </div>
                        </div>
                        <PlayerPannel
                            handleCharKeyCodeDefault={handleCharKeyCodeDefault}
                            handleSelectSpell={handleSelectSpell}
                            handleUseItem={game.current.useItem}
                            config={config}
                            graphics={inits.current.graphics}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default connect()(Play);
