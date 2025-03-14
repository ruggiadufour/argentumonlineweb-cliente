import React, { useState, useEffect, useRef } from "react";
import { useSnapshot } from 'valtio';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import _ from "lodash";

import style from "../styles/Play.module.scss";
import UI from "../engine/UI";
import { UIStore } from "../store/ui.store";

import Config from "../engine/config";
import Inits from "../engine/inits";
import Engine from "../engine/engine";
import General from "../engine/general";
import Messages from "../engine/connection/messages";
import Connection from "../engine/connection/connection";
import Game from "../engine/game";
import User from "../engine/user";
import Package from "../engine/connection/package";
import Inventary from "../components/Inventary";

const nameKeyCode = {
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

const Play = (props) => {
    const uiStore = useSnapshot(UIStore);

    const macros = useRef([]);
    const modalMacro = useRef<Record<string, any>>({});
    const canvas = useRef({
        background: {},
        techos: {},
        foreground: {},
        items: {},
        textos: {}
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

    const charKeyCodeDefault = () => {
        const keyCodeDefault = UIStore.keyCodeDefault;
        const charKeyCodeDefault = UIStore.charKeyCodeDefault;
        

        Object.keys(keyCodeDefault).map(key => {
            const keyCode = keyCodeDefault[key];

            let fromChar = String.fromCharCode(keyCode);

            if (config.current.keyCodeMap[keyCode]) {
                fromChar = config.current.keyCodeMap[keyCode];
            }

            charKeyCodeDefault[key] = fromChar;
        });

        ui.current.setProperty("charKeyCodeDefault", charKeyCodeDefault);
    };

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
                    keyCodeMacros: tmpKeyCodeMacros
                });
            }

            const defaultKeys = window.localStorage.getItem("defaultKeys");

            if (defaultKeys) {
                const jsonDefaultKeys = JSON.parse(defaultKeys);

                // TODO: ver si este await tiene algun efecto con el cambio
                await ui.current.setProperties({
                    keyCodeDefault: _.cloneDeep(jsonDefaultKeys),
                    tmpKeyCodeDefault: _.cloneDeep(jsonDefaultKeys)
                });
            }

            config.current = new Config();
            pkg.current = new Package();
            user.current = new User();

            inits.current = new Inits(ui.current);    
            inits.current.setUI(props);

            general.current = new General(pkg.current, config.current);
            game.current = new Game(inits.current, ui.current, user.current, pkg.current, config.current);
            engine.current = new Engine(
                inits.current,
                ui.current,
                user.current,
                pkg.current,
                config.current,
                game.current,
                canvas.current,
            );
            messages.current = new Messages(
                ui.current,
                user.current,
                engine.current,
                inits.current,
                pkg.current,
                config.current,
                game.current,
            );
            connection.current = new Connection(
                ui.current,
                messages.current,
                pkg.current,
                game.current,
                engine.current,
                user.current,
                config.current,
            );

            charKeyCodeDefault();

            await engine.current.initCanvas();

            connection.current.startWebSocket();

            ui.current.setProperty("loading", false);

            document.oncontextmenu = e => {
                e.stopPropagation();
                return false;
            };

            document.onkeyup = e => {
                const keyCode = e.keyCode;

                if (showMacroConfig) return;

                if (!uiStore.showInputText && !isNaN(parseInt(uiStore.keyCodeMacros[keyCode]))) {
                    const macro = uiStore.valueKeyMacro[uiStore.keyCodeMacros[keyCode]];

                    if (macro.idPosItem !== "") {
                        game.current.useItem(macro.idPosItem);
                    } else if (macro.idSpell !== -1) {
                        selectSpell(macro.idPosSpell);
                    }

                    return;
                }

                //Usar
                if (
                    keyCode ==
                        uiStore.keyCodeDefault[config.current.nameKeyCode.usar] &&
                    !uiStore.showInputText
                ) {
                    if (uiStore.selectItem) game.current.useItem(uiStore.selectItem);
                }

                //Equipar
                if (
                    keyCode ==
                        uiStore.keyCodeDefault[
                            config.current.nameKeyCode.equipar
                        ] &&
                    !uiStore.showInputText
                ) {
                    const item = user.current.items[uiStore.selectItem];

                    if (uiStore.selectItem && item)
                        game.current.equiparItem(uiStore.selectItem, item.idItem);
                }

                //Agarrar
                if (
                    keyCode ==
                        uiStore.keyCodeDefault[
                            config.current.nameKeyCode.agarrar
                        ] &&
                    !uiStore.showInputText
                ) {
                    pkg.current.setPackageID(pkg.current.serverPacketID.agarrarItem);
                    config.current.ws.send(pkg.current.dataSend());
                }

                //Tirar
                if (
                    keyCode ==
                        uiStore.keyCodeDefault[config.current.nameKeyCode.tirar] &&
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
                    console.log({showInputText: uiStore.showInputText});
                    
                    ui.current.setProperty('showInputText', !uiStore.showInputText)
                    console.log({showInputText: uiStore.showInputText});
                    
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
                    keyCode ==
                    uiStore.keyCodeDefault[config.current.nameKeyCode.atacar]
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

    const closeModalTrade = () => {
        ui.current.setProperty("showModalTrade", false);
    };

    const openConsole = () => {
        ui.current.setProperty("showConsole", !uiStore.showConsole);
    };

    const selectSpell = i => {
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

    const clickCanvas = e => {
        let xCanvas = e.nativeEvent.offsetX;
        let yCanvas = e.nativeEvent.offsetY;

        const posX = Math.round(user.current.pos.x + xCanvas / 32 - 544 / 64);
        const posY = Math.round(user.current.pos.y + yCanvas / 32 - 544 / 64);

        engine.current.clickCanvas({
            x: posX,
            y: posY
        });
    };

    const renderBoxSpells = () => {
        const spells = uiStore.user.spells || {};

        let html = [];

        for (let i = 1; i < 29; i++) {
            const spell = spells[i];

            html.push(
                <div
                    className={style.slot_spell}
                    key={i}
                    onClick={() => selectSpell(i)}
                >
                    <div
                        className={style.img_spell}
                        style={{
                            backgroundImage: spell
                                ? `url("/static/spells/${spell.idSpell}.png")`
                                : "none"
                        }}
                    />
                </div>
            );
        }

        return html;
    };

    const renderBoxMacros = () => {
        const { valueKeyMacro } = uiStore;

        let html = [];

        for (let i = 0; i < 6; i++) {
            const macro = valueKeyMacro[i];

            html.push(
                <div
                    key={i}
                    className={style.macro}
                    onContextMenu={e => showMacroConfig(e, i)}
                    ref={ref => {
                        macros[i] = ref;
                    }}
                >
                    {macro.idPosItem !== "" && macro.img ? (
                        <div
                            className={style.item}
                            style={{
                                backgroundImage: `url("${macro.img}")`
                            }}
                        />
                    ) : null}

                    {macro.idSpell !== -1 && macro.img ? (
                        <div
                            className={style.spell}
                            style={{
                                backgroundImage: `url("${macro.img}")`
                            }}
                        />
                    ) : null}

                    {macro.keyChar !== "" ? (
                        <div className={style.key}>{macro.keyChar}</div>
                    ) : null}
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
                    className={`${style.slotInventary} ${
                        uiStore.trade.idPosInv === i ? style.slotInventarySelected : ""
                    }`}
                    key={i}
                    onClick={() => selectItemUserTrade(i)}
                >
                    <div
                        className={`${style.imgItem} ${
                            item && !item.validUser ? style.itemNotValid : ""
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

    const renderBoxItemsTrade = () => {
        const { trade } = uiStore;

        let html = [];

        for (let i = 1; i < 26; i++) {
            const item = trade.itemsTrade[i];

            html.push(
                <div
                    className={`${style.slotTrade} ${
                        item && !item.validUser ? style.itemNotValid : ""
                    } ${trade.idPosTrade === i ? style.slotTradeSelected : ""}`}
                    key={i}
                    onClick={() => selectItemTrade(i)}
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

    const selectItemUserTrade = i => {
        const item = uiStore.trade.itemsUser[i];

        UIStore.trade.idPosInv = i;

        if (item) {
            UIStore.trade.titleItem = item.name;
            UIStore.trade.infoItem = item.info;
            UIStore.trade.imgItem = item.imgItem;
            UIStore.trade.goldItem = item.gold;
        } else {
            UIStore.trade.titleItem = "";
            UIStore.trade.infoItem = "";
            UIStore.trade.imgItem = "";
            UIStore.trade.goldItem = "";
        }

        ui.current.setProperty("trade", UIStore.trade);
    };

    const selectItemTrade = i => {
        const item = UIStore.trade.itemsTrade[i];
        UIStore.trade.idPosTrade = i;

        if (item) {
            UIStore.trade.titleItem = item.name;
            UIStore.trade.infoItem = item.info;
            UIStore.trade.imgItem = item.imgItem;
            UIStore.trade.goldItem = item.gold;
        } else {
            UIStore.trade.titleItem = "";
            UIStore.trade.infoItem = "";
            UIStore.trade.imgItem = "";
            UIStore.trade.goldItem = "";
        }

        ui.current.setProperty("trade", UIStore.trade);
    };

    const buyTrade = () => {
        if (UIStore.trade.idPosTrade) {
            pkg.current.setPackageID(pkg.current.serverPacketID.buyItem);
            pkg.current.writeByte(UIStore.trade.idPosTrade);
            pkg.current.writeShort(UIStore.cantTrade);
            config.current.ws.send(pkg.current.dataSend());
        }
    };

    const sellTrade = () => {
        if (UIStore.trade.idPosInv) {
            pkg.current.setPackageID(pkg.current.serverPacketID.sellItem);
            pkg.current.writeByte(UIStore.trade.idPosInv);
            pkg.current.writeShort(UIStore.cantTrade);
            config.current.ws.send(pkg.current.dataSend());
        }
    };

    const showInventary = () => {
        ui.current.setProperty("showInventary", true);
    };

    const showSpells = () => {
        ui.current.setProperty("showInventary", false);
    };

    const showMacroConfig = (e, key: number) => {
        e.preventDefault();

        const refMacro = macros[key];

        modalMacro.current.style.left = `${refMacro.offsetLeft - 57}px`;
        modalMacro.current.style.top = `${refMacro.offsetTop - 210}px`;

        UIStore.keyMacro.indexMacro = key;
        UIStore.keyMacro.idPosItem = "";
        UIStore.keyMacro.idPosSpell = "";
        UIStore.keyMacro.idSpell = -1;
        UIStore.keyMacro.key = "";
        UIStore.keyMacro.keyChar = "";

        ui.current.setProperties({
            showMacroConfig: true,
            keyMacro: UIStore.keyMacro
        });
    };

    const handleKeyMacro = e => {
        const keyCode = e.keyCode;

        if (
            Object.values(uiStore.keyCodeDefault).indexOf(keyCode) > -1 ||
            !isNaN(parseInt(uiStore.keyCodeMacros[keyCode]))
        ) {
            UIStore.keyMacro.key = "";
            UIStore.keyMacro.keyChar = "";
            alert("La tecla ya está asignada");
        } else {
            let fromChar = String.fromCharCode(keyCode);

            if (config.current.keyCodeMap[keyCode]) {
                fromChar = config.current.keyCodeMap[keyCode];
            }

            UIStore.keyMacro.key = keyCode;
            UIStore.keyMacro.keyChar = fromChar;
        }

        ui.current.setProperty("keyMacro", UIStore.keyMacro);
    };

    const saveMacro = () => {
        UIStore.valueKeyMacro[UIStore.keyMacro.indexMacro] = {
            idPosItem: UIStore.keyMacro.idPosItem,
            idSpell: UIStore.keyMacro.idSpell,
            idPosSpell: UIStore.keyMacro.idPosSpell,
            img: UIStore.keyMacro.img,
            key: UIStore.keyMacro.key,
            keyChar: UIStore.keyMacro.keyChar
        };

        UIStore.keyCodeMacros[UIStore.keyMacro.key] = UIStore.keyMacro.indexMacro;

        ui.current.setProperties({
            valueKeyMacro: UIStore.valueKeyMacro,
            keyCodeMacros: UIStore.keyCodeMacros,
            showMacroConfig: false
        });

        window.localStorage.setItem("macros", JSON.stringify(UIStore.valueKeyMacro));
    };

    const handleKeyDefault = (e: React.KeyboardEvent<HTMLInputElement>, keyType: number) => {
        const keyCode = e.keyCode;

        if (
            Object.values(UIStore.tmpKeyCodeDefault).indexOf(keyCode) > -1 ||
            !isNaN(parseInt(UIStore.keyCodeMacros[keyCode]))
        ) {
            alert("La tecla ya está asignada");
        } else {
            let fromChar = String.fromCharCode(keyCode);

            if (config.current.keyCodeMap[keyCode]) {
                fromChar = config.current.keyCodeMap[keyCode];
            }

            UIStore.tmpKeyCodeDefault[keyType] = keyCode;
            uiStore.charKeyCodeDefault[keyType] = fromChar;
        }

        ui.current.setProperties({
            charKeyCodeDefault: uiStore.charKeyCodeDefault,
            tmpKeyCodeDefault: UIStore.tmpKeyCodeDefault
        });
    };

    const restoreDefaultKeys = async () => {
        const { keyCodeDefaultReset } = uiStore;

        window.localStorage.setItem(
            "defaultKeys",
            JSON.stringify(keyCodeDefaultReset)
        );

        ui.current.setProperties({
            keyCodeDefault: _.cloneDeep(keyCodeDefaultReset),
            tmpKeyCodeDefault: _.cloneDeep(keyCodeDefaultReset)
        });

        charKeyCodeDefault();
    };

    const saveChangesKeys = () => {
        const { tmpKeyCodeDefault } = uiStore;

        window.localStorage.setItem(
            "defaultKeys",
            JSON.stringify(tmpKeyCodeDefault)
        );

        ui.current.setProperty("keyCodeDefault", _.cloneDeep(tmpKeyCodeDefault));

        alert("Teclas guardadas.");
    };

    const restoreMacros = () => {
        window.localStorage.setItem("macros", "");

        ui.current.setProperties({
            keyCodeMacros: {},
            valueKeyMacro: [
                {
                    idPosItem: "",
                    idSpell: -1,
                    idPosSpell: "",
                    img: "",
                    key: "",
                    keyChar: ""
                },
                {
                    idPosItem: "",
                    idSpell: -1,
                    idPosSpell: "",
                    img: "",
                    key: "",
                    keyChar: ""
                },
                {
                    idPosItem: "",
                    idSpell: -1,
                    idPosSpell: "",
                    img: "",
                    key: "",
                    keyChar: ""
                },
                {
                    idPosItem: "",
                    idSpell: -1,
                    idPosSpell: "",
                    img: "",
                    key: "",
                    keyChar: ""
                },
                {
                    idPosItem: "",
                    idSpell: -1,
                    idPosSpell: "",
                    img: "",
                    key: "",
                    keyChar: ""
                },
                {
                    idPosItem: "",
                    idSpell: -1,
                    idPosSpell: "",
                    img: "",
                    key: "",
                    keyChar: ""
                }
            ]
        });

        alert("Macros reseteados.");
    };

    const handleSelectItem = (i: number) => {
        console.log("handleSelectItem", i);
        ui.current.setProperty("selectItem", i);
    };

    const handleUseItem = (i: number) => {
        console.log("handleUseItem", i);
        game.current.useItem(i);
    };

    return (
        <>
            <div
                className={style.progressBar}
                style={{ display: uiStore.loading ? "block" : "none" }}
            >
                <div className={style.logo_tmp} />
                <div className={style.text}>
                    <span id="porcentajeBarra">
                        {uiStore.mapasCargados} / {uiStore.mapasToLoad} Mapas
                    </span>
                </div>
                <div className={style.contentBar}>
                    <div className={style.carga} />
                    <div
                        className={style.barra}
                        style={{
                            width: `${(uiStore.mapasCargados * 578) /
                                uiStore.mapasToLoad}px`
                        }}
                    />
                </div>
                <div className={style.contBox}>
                    <div className={style.help}>
                        <p>Mover: Flechas</p>
                        <p>Atacar: Ctrl</p>
                        <p>Agarrar: A</p>
                        <p>Usar: U</p>
                        <p>Tirar: T</p>
                        <p>Seguro: S</p>
                        <p>Meditar: M</p>
                        <p>Hablar: Enter</p>
                    </div>
                    <div className={style.news}>
                        <div className={style.news_content}>
                            <div className={style.title}>
                                Actualización 03/06/2016
                            </div>
                            <p>- Volvimos!.</p>
                            <p>
                                - Síguemos en nuestra página de{" "}
                                <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href="https://www.facebook.com/ArgentumOnlineWeb"
                                >
                                    Facebook
                                </a>{" "}
                                para más novedades!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <ul className={style.modalInfo} />

            <div
                className={style.modalControlPanel}
                style={{
                    display: uiStore.showModalControlPanel ? "block" : "none"
                }}
            >
                <div
                    className={style.closeControlPanel}
                    onClick={() => {
                        ui.current.setProperty("showModalControlPanel", false);
                    }}
                />
                <div className={style.sound} />
                <div className={style.teclas}>
                    <input
                        type="text"
                        className={`${style.tecla} ${
                            style.margin_left_tecla
                        }`}
                        value={
                            uiStore.charKeyCodeDefault[
                                nameKeyCode.flechaArriba
                            ]
                        }
                        onKeyUp={e => {
                            handleKeyDefault(
                                e,
                                nameKeyCode.flechaArriba
                            );
                        }}
                        onChange={()=>{}}
                    />
                    <input
                        type="text"
                        className={style.tecla}
                        value={
                            uiStore.charKeyCodeDefault[nameKeyCode.flechaAbajo]
                        }
                        onKeyUp={e => {
                            handleKeyDefault(
                                e,
                                nameKeyCode.flechaAbajo
                            );
                        }}
                        onChange={()=>{}}
                    />
                    <input
                        type="text"
                        className={style.tecla}
                        value={
                            uiStore.charKeyCodeDefault[
                                nameKeyCode.flechaIzquierda
                            ]
                        }
                        onKeyUp={e => {
                            handleKeyDefault(
                                e,
                                nameKeyCode.flechaIzquierda
                            );
                        }}
                        onChange={()=>{}}
                    />
                    <input
                        type="text"
                        className={style.tecla}
                        value={
                            uiStore.charKeyCodeDefault[
                                nameKeyCode.flechaDerecha
                            ]
                        }
                        onKeyUp={e => {
                            handleKeyDefault(
                                e,
                                nameKeyCode.flechaDerecha
                            );
                        }}
                        onChange={()=>{}}
                    />

                    <input
                        type="text"
                        className={`${style.tecla} ${
                            style.margin_left_tecla
                        }`}
                        value={uiStore.charKeyCodeDefault[nameKeyCode.usar]}
                        onKeyUp={e => {
                            handleKeyDefault(e, nameKeyCode.usar);
                        }}
                        onChange={()=>{}}
                    />
                    <input
                        type="text"
                        className={style.tecla}
                        value={uiStore.charKeyCodeDefault[nameKeyCode.atacar]}
                        onKeyUp={e => {
                            handleKeyDefault(
                                e,
                                nameKeyCode.atacar
                            );
                        }}
                        onChange={()=>{}}
                    />
                    <input
                        type="text"
                        className={style.tecla}
                        value={uiStore.charKeyCodeDefault[nameKeyCode.agarrar]}
                        onKeyUp={e => {
                            handleKeyDefault(
                                e,
                                nameKeyCode.agarrar
                            );
                        }}
                        onChange={()=>{}}
                    />
                    <input
                        type="text"
                        className={style.tecla}
                        value={uiStore.charKeyCodeDefault[nameKeyCode.tirar]}
                        onKeyUp={e => {
                            handleKeyDefault(
                                e,
                                nameKeyCode.tirar
                            );
                        }}
                        onChange={()=>{}}
                    />

                    <input
                        type="text"
                        className={`${style.tecla} ${
                            style.margin_left_tecla
                        }`}
                        value={uiStore.charKeyCodeDefault[nameKeyCode.equipar]}
                        onKeyUp={e => {
                            handleKeyDefault(
                                e,
                                nameKeyCode.equipar
                            );
                        }}
                        onChange={()=>{}}
                    />
                    <input
                        type="text"
                        className={style.tecla}
                        value={uiStore.charKeyCodeDefault[nameKeyCode.domar]}
                        onKeyUp={e => {
                            handleKeyDefault(
                                e,
                                nameKeyCode.domar
                            );
                        }}
                        onChange={()=>{}}
                    />
                    <input
                        type="text"
                        className={style.tecla}
                        value={uiStore.charKeyCodeDefault[nameKeyCode.robar]}
                        onKeyUp={e => {
                            handleKeyDefault(
                                e,
                                nameKeyCode.robar
                            );
                        }}
                        onChange={()=>{}}
                    />
                    <input
                        type="text"
                        className={style.tecla}
                        value={uiStore.charKeyCodeDefault[nameKeyCode.seguro]}
                        onKeyUp={e => {
                            handleKeyDefault(
                                e,
                                nameKeyCode.seguro
                            );
                        }}
                        onChange={()=>{}}
                    />

                    <div
                        className={style.default_teclas}
                        onClick={restoreDefaultKeys}
                    />
                    <div
                        className={style.save_cambios}
                        onClick={saveChangesKeys}
                    />
                    <div
                        className={style.reset_macros}
                        onClick={restoreMacros}
                    />
                </div>
            </div>

            <div
                className={style.modalReconnect}
                style={{ top: "285px", left: "638.5px" }}
            />

            <div
                className={style.modalMacro}
                style={{ display: uiStore.showMacroConfig ? "block" : "none" }}
                ref={ref => {
                    modalMacro.current = ref;
                }}
            >
                <div
                    className={`${style.cruz} ${style.closeMacro}`}
                    onClick={() => {
                        ui.current.setProperty("showMacroConfig", false);
                    }}
                />
                <input
                    type="text"
                    onKeyUp={handleKeyMacro}
                    className={style.keyMacro}
                    value={uiStore.keyMacro.keyChar}
                    onChange={()=>{}}
                />
                <div className={style.img}>
                    {uiStore.keyMacro.idPosItem && uiStore.keyMacro.img ? (
                        <div
                            className={style.item}
                            style={{
                                backgroundImage: `url("${uiStore.keyMacro.img}")`
                            }}
                        />
                    ) : null}

                    {uiStore.keyMacro.idSpell && uiStore.keyMacro.img ? (
                        <div
                            className={style.spell}
                            style={{
                                backgroundImage: `url("${uiStore.keyMacro.img}")`
                            }}
                        />
                    ) : null}
                </div>
                <div
                    className={style.guardarMacro}
                    onClick={saveMacro}
                />
            </div>

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
                        onClick={closeModalTrade}
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
                        onClick={buyTrade}
                    />
                    <div className={style.buttonLess} />
                    <input
                        type="text"
                        className={style.cantTrade}
                        value={uiStore.cantTrade}
                        onChange={e => {
                            ui.current.setProperty("cantTrade", e.target.value);
                        }}
                    />
                    <div className={style.buttonMore} />
                    <div
                        className={style.buttonSell}
                        onClick={sellTrade}
                    />
                </div>
            </div>

            <div
                className={style.outer}
                style={{ display: uiStore.loading ? "none" : "table" }}
            >
                <div className={style.middle}>
                    <div className={style.content}>
                        <div className={style.content_left}>
                            <div className={style.render}>
                                {/* // ref={input => input && input.focus()} */}
                                <input
                                    type="text"
                                    name="text"
                                    autoFocus
                                    className={style.text}
                                    style={{
                                        display: uiStore.showInputText
                                            ? "block"
                                            : "none"
                                    }}
                                    value={uiStore.textDialog}
                                    onChange={e => {
                                        ui.current.setProperty("textDialog", e.target.value);
                                    }}
                                />
                                <canvas
                                    width="544"
                                    height="544"
                                    id="background"
                                    className={style.background}
                                    ref={ref => {
                                        canvas.current.background = ref;
                                    }}
                                />
                                <canvas
                                    width="544"
                                    height="544"
                                    id="foreground"
                                    className={style.foreground}
                                    ref={ref => {
                                        canvas.current.foreground = ref;
                                    }}
                                />
                                <canvas
                                    width="544"
                                    height="544"
                                    id="items"
                                    className={style.items}
                                    ref={ref => {
                                        canvas.current.items = ref;
                                    }}
                                />
                                <canvas
                                    width="544"
                                    height="544"
                                    id="techos"
                                    className={style.techos}
                                    ref={ref => {
                                        canvas.current.techos = ref;
                                    }}
                                />
                                <canvas
                                    width="544"
                                    height="544"
                                    id="textos"
                                    className={style.textos}
                                    ref={ref => {
                                        canvas.current.textos = ref;
                                    }}
                                />
                                <canvas
                                    width="544"
                                    height="544"
                                    id="mouseEvent"
                                    className={style.mouseEvent}
                                    onClick={clickCanvas}
                                    style={{
                                        cursor: uiStore.crosshair
                                            ? "crosshair"
                                            : "default"
                                    }}
                                />
                                <div
                                    id="console"
                                    className={style.console}
                                    style={{
                                        display: uiStore.showConsole
                                            ? "block"
                                            : "none"
                                    }}
                                >
                                    {
                                        uiStore.messagesConsole.map(message => (
                                            <span
                                                style={message.style}
                                                key={message.id}
                                                dangerouslySetInnerHTML={{ __html: message.message }}
                                            />
                                        ))
                                    }
                                </div>
                                <div
                                    className={style.openConsole}
                                    title="Abrir o cerrar consola"
                                    onClick={openConsole}
                                >
                                    <FontAwesomeIcon icon={faComment} />
                                </div>
                            </div>

                            <div className={style.macros}>
                                {renderBoxMacros()}
                            </div>
                        </div>
                        <div className={style.content_right}>
                            <div className={style.header}>
                                <div className={style.level}>
                                    {uiStore.user.level}
                                </div>
                                <div
                                    className={style.configuration}
                                    onClick={() => {
                                        ui.current.setProperties({
                                            showModalControlPanel: true,
                                            tmpKeyCodeDefault: _.cloneDeep(
                                                uiStore.keyCodeDefault
                                            )
                                        });
                                        charKeyCodeDefault();
                                    }}
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
                                    <div className={style.num}>{`${
                                        uiStore.user.exp
                                    } / ${uiStore.user.expNextLevel}`}</div>
                                </div>
                                <div className={style.buttons}>
                                    <div
                                        className={`${style.button_inv} ${
                                            !uiStore.showInventary
                                                ? style.buttonInvSelected
                                                : ""
                                        }`}
                                        onClick={showInventary}
                                    />
                                    <div
                                        className={`${style.button_spell} ${
                                            uiStore.showInventary
                                                ? style.buttonInvSelected
                                                : ""
                                        }`}
                                        onClick={showSpells}
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
                                    {/* {renderBoxItems()} */}
                                    <Inventary
                                        graphics={inits.current.graphics}
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
                                    {renderBoxSpells()}
                                </div>
                            </div>
                            <div className={style.footer}>
                                <div className={style.info_map}>
                                    <div className={style.name_map}>
                                        {uiStore.nameMap}
                                    </div>
                                    <div className={style.pos_map}>
                                        {uiStore.user.pos
                                            ? `Mapa: ${
                                                  config.current.mapNumber
                                              } X: ${uiStore.user.pos.x} Y: ${
                                                  uiStore.user.pos.y
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
                                        <div className={style.num}>{`${
                                            uiStore.user.hp
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
                                        <div className={style.num}>{`${
                                            uiStore.user.mana
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
                                                ? `url('/static/imgs_mapas/${
                                                      config.current.mapNumber
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
                    </div>
                </div>
            </div>
        </>
    );
};

export default connect()(Play);
