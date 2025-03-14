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
    const modalMacro = useRef({});
    const canvas = useRef({
        background: {},
        techos: {},
        foreground: {},
        items: {},
        textos: {}
    });

    const clickUse = useRef(0);
    const lastClickIdItem = useRef(0);

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
                // TODO: ver si la destructuracion no tiene efectos de reactividad
                const {
                    selectItem,
                    showInputText,
                    textDialog,
                    showMacroConfig,
                    valueKeyMacro,
                    keyCodeMacros
                } = uiStore;

                const keyCode = e.keyCode;

                if (showMacroConfig) return;

                if (!showInputText && !isNaN(parseInt(keyCodeMacros[keyCode]))) {
                    const macro = valueKeyMacro[keyCodeMacros[keyCode]];

                    if (macro.idPosItem !== "") {
                        game.current.useItem(macro.idPosItem);
                    } else if (macro.idSpell !== "") {
                        selectSpell(macro.idPosSpell);
                    }

                    return;
                }

                //Usar
                if (
                    keyCode ==
                        uiStore.keyCodeDefault[config.current.nameKeyCode.usar] &&
                    !showInputText
                ) {
                    if (selectItem) game.current.useItem(selectItem);
                }

                //Equipar
                if (
                    keyCode ==
                        uiStore.keyCodeDefault[
                            config.current.nameKeyCode.equipar
                        ] &&
                    !showInputText
                ) {
                    const item = user.current.items[selectItem];

                    if (selectItem && item)
                        game.current.equiparItem(selectItem, item.idItem);
                }

                //Agarrar
                if (
                    keyCode ==
                        uiStore.keyCodeDefault[
                            config.current.nameKeyCode.agarrar
                        ] &&
                    !showInputText
                ) {
                    pkg.current.setPackageID(pkg.current.serverPacketID.agarrarItem);
                    config.current.ws.send(pkg.current.dataSend());
                }

                //Tirar
                if (
                    keyCode ==
                        uiStore.keyCodeDefault[config.current.nameKeyCode.tirar] &&
                    !showInputText
                ) {
                    let cantItem = 1;

                    if (selectItem) {
                        cantItem = prompt("¿Cuántos quieres tirar?", 1);
                    }

                    if (cantItem > 0) {
                        pkg.current.setPackageID(pkg.current.serverPacketID.tirarItem);
                        pkg.current.writeInt(selectItem);
                        pkg.current.writeShort(Math.trunc(cantItem));
                        config.current.ws.send(pkg.current.dataSend());
                    }
                }

                //Enter
                if (keyCode == 13) {
                    if (showInputText) {
                        general.current.sendDialog(textDialog);

                        ui.current.setProperty("textDialog", "");
                    }

                    ui.current.setProperty('showInputText', !showInputText)
                }

                if (keyCode == 77 && !showInputText) {
                    general.current.sendDialog("/meditar");
                }

                if (
                    keyCode ==
                        uiStore.keyCodeDefault[config.current.nameKeyCode.seguro] &&
                    !showInputText
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

                event = event || window.event;
                if (event.ctrlKey) {
                    const c = event.which || keyCode;
                    switch (c) {
                        case 83:
                        case 87:
                        case 68:
                            event.preventDefault();
                            event.stopPropagation();
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

    const selectItem = i => {
        const { keyMacro: currentKeyMacro, showMacroConfig: isShowMacroConfig, user: userData } = uiStore;

        ui.current.setProperty("selectItem", i);

        if (isShowMacroConfig) {
            const items = userData.items;
            const item = items[i];

            if (item) {
                currentKeyMacro.idSpell = "";
                currentKeyMacro.idPosItem = i;
                currentKeyMacro.img = `/static/graficos/${
                    inits.current.graphics[item.grhIndex].numFile
                }.png`;
            }

            ui.current.setProperty("keyMacro", currentKeyMacro);

            return;
        }

        if (clickUse.current > 1 && lastClickIdItem.current == i) {
            clickUse.current = 0;
            game.current.useItem(i);
        }

        clickUse.current++;

        lastClickIdItem.current = i;
    };

    const selectSpell = i => {
        const { keyMacro: currentKeyMacro, showMacroConfig: isShowMacroConfig } = uiStore;
        const spell = user.current.spells[i];

        if (isShowMacroConfig && spell) {
            currentKeyMacro.idSpell = spell.idSpell;
            currentKeyMacro.idPosSpell = i;
            currentKeyMacro.idPosItem = "";
            currentKeyMacro.img = `/static/spells/${spell.idSpell}.png`;

            ui.current.setProperty("keyMacro", currentKeyMacro);

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

    const renderBoxItems = () => {
        const { user: userData, selectItem } = uiStore;
        const items = userData.items || {};

        let html = [];

        for (let i = 1; i < 22; i++) {
            const item = items[i];

            html.push(
                <div
                    className={`${style.slot_inv} ${
                        selectItem === i ? style.item_selected : ""
                    }`}
                    key={i}
                    onClick={() => selectItem(i)}
                >
                    <div
                        className={`${style.img_item} ${
                            item && !item.validUser ? style.itemNotValid : ""
                        }`}
                        style={{
                            backgroundImage: item
                                ? `url("/static/graficos/${
                                    inits.current.graphics[item.grhIndex].numFile
                                  }.png")`
                                : "none"
                        }}
                    />
                    <div className={style.amount}>{item ? item.cant : ""}</div>

                    {item && item.equipped ? (
                        <div className={style.equipped}>E</div>
                    ) : null}
                </div>
            );
        }

        return html;
    };

    const renderBoxSpells = () => {
        const { user: userData } = uiStore;
        const spells = userData.spells || {};

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

                    {macro.idSpell !== "" && macro.img ? (
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
        const { trade } = uiStore;

        let html = [];

        for (let i = 1; i < 26; i++) {
            const item = trade.itemsUser[i];

            html.push(
                <div
                    className={`${style.slotInventary} ${
                        trade.idPosInv === i ? style.slotInventarySelected : ""
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
        const { trade } = uiStore;

        const item = trade.itemsUser[i];

        trade.idPosInv = i;

        if (item) {
            trade.titleItem = item.name;
            trade.infoItem = item.info;
            trade.imgItem = item.imgItem;
            trade.goldItem = item.gold;
        } else {
            trade.titleItem = "";
            trade.infoItem = "";
            trade.imgItem = "";
            trade.goldItem = "";
        }

        ui.current.setProperty("trade", trade);
    };

    const selectItemTrade = i => {
        const { trade } = uiStore;

        const item = trade.itemsTrade[i];

        trade.idPosTrade = i;

        if (item) {
            trade.titleItem = item.name;
            trade.infoItem = item.info;
            trade.imgItem = item.imgItem;
            trade.goldItem = item.gold;
        } else {
            trade.titleItem = "";
            trade.infoItem = "";
            trade.imgItem = "";
            trade.goldItem = "";
        }

        ui.current.setProperty("trade", trade);
    };

    const buyTrade = () => {
        const { trade, cantTrade } = uiStore;

        if (trade.idPosTrade) {
            pkg.current.setPackageID(pkg.current.serverPacketID.buyItem);
            pkg.current.writeByte(trade.idPosTrade);
            pkg.current.writeShort(cantTrade);
            config.current.ws.send(pkg.current.dataSend());
        }
    };

    const sellTrade = () => {
        const { trade, cantTrade } = uiStore;

        if (trade.idPosInv) {
            pkg.current.setPackageID(pkg.current.serverPacketID.sellItem);
            pkg.current.writeByte(trade.idPosInv);
            pkg.current.writeShort(cantTrade);
            config.current.ws.send(pkg.current.dataSend());
        }
    };

    const showInventary = () => {
        ui.current.setProperty("showInventary", true);
    };

    const showSpells = () => {
        ui.current.setProperty("showInventary", false);
    };

    const showMacroConfig = (e, key) => {
        let { keyMacro } = uiStore;

        e.preventDefault();

        const refMacro = macros[key];

        modalMacro.current.style.left = `${refMacro.offsetLeft - 57}px`;
        modalMacro.current.style.top = `${refMacro.offsetTop - 210}px`;

        keyMacro = {
            indexMacro: key,
            idPosItem: "",
            idPosSpell: "",
            idSpell: "",
            key: "",
            keyChar: ""
        };

        ui.current.setProperties({
            showMacroConfig: true,
            keyMacro: keyMacro
        });
    };

    const handleKeyMacro = e => {
        const { keyMacro: currentKeyMacro, keyCodeMacros, keyCodeDefault: currentKeyCodeDefault } = uiStore;
        const keyCode = e.keyCode;

        if (
            Object.values(currentKeyCodeDefault).indexOf(keyCode) > -1 ||
            !isNaN(parseInt(keyCodeMacros[keyCode]))
        ) {
            currentKeyMacro.key = "";
            currentKeyMacro.keyChar = "";
            alert("La tecla ya está asignada");
        } else {
            let fromChar = String.fromCharCode(keyCode);

            if (config.current.keyCodeMap[keyCode]) {
                fromChar = config.current.keyCodeMap[keyCode];
            }

            currentKeyMacro.key = keyCode;
            currentKeyMacro.keyChar = fromChar;
        }

        ui.current.setProperty("keyMacro", currentKeyMacro);
    };

    const saveMacro = () => {
        const { keyMacro: currentKeyMacro, valueKeyMacro: currentValueKeyMacro, keyCodeMacros } = uiStore;

        currentValueKeyMacro[currentKeyMacro.indexMacro] = {
            idPosItem: currentKeyMacro.idPosItem,
            idSpell: currentKeyMacro.idSpell,
            idPosSpell: currentKeyMacro.idPosSpell,
            img: currentKeyMacro.img,
            key: currentKeyMacro.key,
            keyChar: currentKeyMacro.keyChar
        };

        keyCodeMacros[currentKeyMacro.key] = currentKeyMacro.indexMacro;

        ui.current.setProperties({
            valueKeyMacro: currentValueKeyMacro,
            keyCodeMacros: keyCodeMacros,
            showMacroConfig: false
        });

        window.localStorage.setItem("macros", JSON.stringify(currentValueKeyMacro));
    };

    const handleKeyDefault = (e, keyType) => {
        const {
            keyCodeMacros,
            charKeyCodeDefault: currentCharKeyCodeDefault,
            tmpKeyCodeDefault: currentTmpKeyCodeDefault
        } = uiStore;
        const keyCode = e.keyCode;

        if (
            Object.values(currentTmpKeyCodeDefault).indexOf(keyCode) > -1 ||
            !isNaN(parseInt(keyCodeMacros[keyCode]))
        ) {
            alert("La tecla ya está asignada");
        } else {
            let fromChar = String.fromCharCode(keyCode);

            if (config.current.keyCodeMap[keyCode]) {
                fromChar = config.current.keyCodeMap[keyCode];
            }

            currentTmpKeyCodeDefault[keyType] = keyCode;
            currentCharKeyCodeDefault[keyType] = fromChar;
        }

        ui.current.setProperties({
            charKeyCodeDefault: currentCharKeyCodeDefault,
            tmpKeyCodeDefault: currentTmpKeyCodeDefault
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
                    idSpell: "",
                    idPosSpell: "",
                    img: "",
                    key: "",
                    keyChar: ""
                },
                {
                    idPosItem: "",
                    idSpell: "",
                    idPosSpell: "",
                    img: "",
                    key: "",
                    keyChar: ""
                },
                {
                    idPosItem: "",
                    idSpell: "",
                    idPosSpell: "",
                    img: "",
                    key: "",
                    keyChar: ""
                },
                {
                    idPosItem: "",
                    idSpell: "",
                    idPosSpell: "",
                    img: "",
                    key: "",
                    keyChar: ""
                },
                {
                    idPosItem: "",
                    idSpell: "",
                    idPosSpell: "",
                    img: "",
                    key: "",
                    keyChar: ""
                },
                {
                    idPosItem: "",
                    idSpell: "",
                    idPosSpell: "",
                    img: "",
                    key: "",
                    keyChar: ""
                }
            ]
        });

        alert("Macros reseteados.");
    };

    const {
        showInventary: isShowInventary,
        showMacroConfig: isShowMacroConfig,
        loading,
        user: userData,
        showConsole,
        messagesConsole,
        crosshair,
        nameMap,
        showModalReconnect,
        showInputText,
        textDialog,
        showModalTrade,
        trade,
        cantTrade,
        mapasToLoad,
        mapasCargados,
        keyMacro,
        showModalControlPanel,
        keyCodeDefault: currentKeyCodeDefault,
        charKeyCodeDefault: currentCharKeyCodeDefault
    } = uiStore;

    return (
        <>
            <div
                className={style.progressBar}
                style={{ display: loading ? "block" : "none" }}
            >
                <div className={style.logo_tmp} />
                <div className={style.text}>
                    <span id="porcentajeBarra">
                        {mapasCargados} / {mapasToLoad} Mapas
                    </span>
                </div>
                <div className={style.contentBar}>
                    <div className={style.carga} />
                    <div
                        className={style.barra}
                        style={{
                            width: `${(mapasCargados * 578) /
                                mapasToLoad}px`
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
                    display: showModalControlPanel ? "block" : "none"
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
                            currentCharKeyCodeDefault[
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
                            currentCharKeyCodeDefault[nameKeyCode.flechaAbajo]
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
                            currentCharKeyCodeDefault[
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
                            currentCharKeyCodeDefault[
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
                        value={currentCharKeyCodeDefault[nameKeyCode.usar]}
                        onKeyUp={e => {
                            handleKeyDefault(e, nameKeyCode.usar);
                        }}
                        onChange={()=>{}}
                    />
                    <input
                        type="text"
                        className={style.tecla}
                        value={currentCharKeyCodeDefault[nameKeyCode.atacar]}
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
                        value={currentCharKeyCodeDefault[nameKeyCode.agarrar]}
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
                        value={currentCharKeyCodeDefault[nameKeyCode.tirar]}
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
                        value={currentCharKeyCodeDefault[nameKeyCode.equipar]}
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
                        value={currentCharKeyCodeDefault[nameKeyCode.domar]}
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
                        value={currentCharKeyCodeDefault[nameKeyCode.robar]}
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
                        value={currentCharKeyCodeDefault[nameKeyCode.seguro]}
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
                style={{ display: isShowMacroConfig ? "block" : "none" }}
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
                    value={keyMacro.keyChar}
                    onChange={()=>{}}
                />
                <div className={style.img}>
                    {keyMacro.idPosItem && keyMacro.img ? (
                        <div
                            className={style.item}
                            style={{
                                backgroundImage: `url("${keyMacro.img}")`
                            }}
                        />
                    ) : null}

                    {keyMacro.idSpell && keyMacro.img ? (
                        <div
                            className={style.spell}
                            style={{
                                backgroundImage: `url("${keyMacro.img}")`
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
                style={{ display: showModalTrade ? "block" : "none" }}
            >
                <div className={style.headTrade}>
                    <div className={style.imgItemTrade}>
                        <div
                            className={style.imgItem}
                            style={{
                                backgroundImage: trade.imgItem
                                    ? `url("${trade.imgItem}")`
                                    : "none"
                            }}
                        />
                    </div>
                    <div className={style.titleAndGold}>
                        <div className={style.titleItemTrade}>
                            {trade.titleItem}
                        </div>
                        <div className={style.infoItem}>
                            {trade.infoItem}
                        </div>
                        <div className={style.goldItemTrade}>
                            {trade.goldItem}
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
                        value={cantTrade}
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
                style={{ display: loading ? "none" : "table" }}
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
                                        display: showInputText
                                            ? "block"
                                            : "none"
                                    }}
                                    value={textDialog}
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
                                        cursor: crosshair
                                            ? "crosshair"
                                            : "default"
                                    }}
                                />
                                <div
                                    id="console"
                                    className={style.console}
                                    style={{
                                        display: showConsole
                                            ? "block"
                                            : "none"
                                    }}
                                >
                                    {
                                        messagesConsole.map(message => (
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
                                    {userData.level}
                                </div>
                                <div
                                    className={style.configuration}
                                    onClick={() => {
                                        ui.current.setProperties({
                                            showModalControlPanel: true,
                                            tmpKeyCodeDefault: _.cloneDeep(
                                                currentKeyCodeDefault
                                            )
                                        });
                                        charKeyCodeDefault();
                                    }}
                                />
                                <div className={style.name}>
                                    {userData.nameCharacter}
                                </div>
                                <div className={style.exp}>
                                    <div
                                        className={style.progress_bar}
                                        style={{
                                            width: `${(((userData.exp * 100) /
                                                userData.expNextLevel) *
                                                config.current.xpLength) /
                                                100}px`
                                        }}
                                    />
                                    <div className={style.porcentaje}>{`${(
                                        (userData.exp * 100) /
                                        userData.expNextLevel
                                    ).toFixed(2)}%`}</div>
                                    <div className={style.num}>{`${
                                        userData.exp
                                    } / ${userData.expNextLevel}`}</div>
                                </div>
                                <div className={style.buttons}>
                                    <div
                                        className={`${style.button_inv} ${
                                            !isShowInventary
                                                ? style.buttonInvSelected
                                                : ""
                                        }`}
                                        onClick={showInventary}
                                    />
                                    <div
                                        className={`${style.button_spell} ${
                                            isShowInventary
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
                                        display: isShowInventary
                                            ? "block"
                                            : "none"
                                    }}
                                >
                                    {renderBoxItems()}
                                </div>
                                <div
                                    className={style.spell}
                                    style={{
                                        display: isShowInventary
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
                                        {nameMap}
                                    </div>
                                    <div className={style.pos_map}>
                                        {userData.pos
                                            ? `Mapa: ${
                                                  config.current.mapNumber
                                              } X: ${userData.pos.x} Y: ${
                                                  userData.pos.y
                                              }`
                                            : ""}
                                    </div>
                                </div>
                                <div className={style.left_footer}>
                                    <div className={style.hp}>
                                        <div
                                            className={style.progress_bar}
                                            style={{
                                                width: `${(userData.hp *
                                                    config.current.hpLength) /
                                                    userData.maxHp}px`
                                            }}
                                        />
                                        <div className={style.num}>{`${
                                            userData.hp
                                        } / ${userData.maxHp}`}</div>
                                    </div>
                                    <div className={style.mana}>
                                        <div
                                            className={style.progress_bar}
                                            style={{
                                                width: `${(userData.mana *
                                                    config.current
                                                        .manaLength) /
                                                    userData.maxMana}px`
                                            }}
                                        />
                                        <div className={style.num}>{`${
                                            userData.mana
                                        } / ${userData.maxMana}`}</div>
                                    </div>
                                    <div className={style.gold}>
                                        {userData.gold}
                                    </div>
                                    <div className={style.attr}>
                                        <div className={style.agilidad}>
                                            {userData.attrAgilidad}
                                        </div>
                                        <div className={style.fuerza}>
                                            {userData.attrFuerza}
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
                                                top: userData.pos
                                                    ? `${userData.pos.y - 1}px`
                                                    : 0,
                                                left: userData.pos
                                                    ? `${userData.pos.x - 1}px`
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
