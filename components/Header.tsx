import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import style from "../styles/Header.module.scss";

import { routerPush } from "../config/utils";

import pvpChars from "../config/pvpChars.json";
import Inits from "../engine/inits";
import UI from "../engine/UI";
import RenderCharacters from "../engine/RenderCharacters";

import CreateLink from "./CreateLink";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import MobileDetect from "mobile-detect";
import { useSnapshot } from "valtio";

import { UIStore } from "../store/ui.store";

const Header = ({ userAgent }) => {
    const uiStore = useSnapshot(UIStore);
    const ui = new UI(UIStore);
    const inits = new Inits(ui);
    const [openModalCharacters, setOpenModalCharacters] = useState(false);
    const [characters, setCharacters] = useState([]);
    const [charactersPvP] = useState(pvpChars);
    const [typeGame, setTypeGame] = useState("PvE");
    const [loadCharacters, setLoadCharacters] = useState(false);
    const [buttonCreatePj, setButtonCreatePj] = useState("Creación deshabilitada");

    const canvasCharacterRefs = useRef([]);
    const dispatch = useDispatch();
    const account = useSelector((state) => state.account);

    useEffect(() => {
        const initializeComponent = async () => {
            if (account.accountId && !loadCharacters) {
                setLoadCharacters(true);
                getAllCharacters();
            }

            canvasCharacterRefs.current.forEach((canvas, index) => {
                if (canvas) {
                    canvasCharacterRefs.current[index].ctx = canvas.getContext("2d");
                }
            });

            await inits.initialize();

            dispatch({
                type: 'SET_INITS_LOADED',
                payload: true
            });
        };

        initializeComponent();
    }, [account?.accountId, loadCharacters]);

    const clearCanvas = () => {
        canvasCharacterRefs.current.forEach((canvas) => {
            if (canvas?.ctx) {
                canvas.ctx.clearRect(0, 0, 80, 100);
            }
        });
    };

    const getAllCharacters = async () => {
        // const result = await fetchUrl("/character/list");
        setCharacters([]); //result
    };

    const changeTypeGame = async (newTypeGame) => {
        setTypeGame(newTypeGame);
        setButtonCreatePj(newTypeGame === "PvP" ? "Crear Personaje" : "Creación deshabilitada");
        renderCharacters();
    };

    const renderCharacters = () => {
        clearCanvas();

        const tmpCharacters = typeGame === "PvE" ? characters : charactersPvP;

        tmpCharacters.forEach((character, index) => {
            const canvas = canvasCharacterRefs.current[index];
            if (canvas?.ctx) {
                const rndChar = new RenderCharacters(inits, canvas.ctx, character, 24, 60);
                rndChar.drawChar();
            }
        });
    };

    const play = (character, key) => {
        if (!character) {
            setOpenModalCharacters(false);
            return routerPush("/createCharacter");
        }

        window.localStorage.setItem("idAccount", account.accountId);
        window.localStorage.setItem("email", account.email);
        if (typeGame === "PvE") {
            window.localStorage.setItem("idCharacter", character._id);
        } else {
            window.localStorage.setItem("idChar", key);
        }

        window.localStorage.setItem("typeGame", typeGame === "PvE" ? 1 : 2);

        return routerPush("/play", "", true);
    };

    const renderBoxCharacters = () => {
        let html = [];

        for (let i = 0; i < 10; i++) {
            const character = typeGame === "PvE" ? characters[i] : charactersPvP[i];

            html.push(
                <div className={style.contentGral} key={i}>
                    <span className={style.name}>
                        {character ? character.name : ""}
                    </span>
                    <canvas
                        ref={ref => {
                            canvasCharacterRefs.current[i] = ref;
                        }}
                        className={style.contentImgA}
                        onClick={() => play(character, i)}
                        width="80"
                        height="100"
                    />
                </div>
            );
        }

        return html;
    };

    const openModal = () => {
        const md = new MobileDetect(userAgent);

        if (md.mobile()) {
            alert("Argentum Online Web no está disponible para celulares.");
            return;
        }

        if (!account.accountId) {
            return routerPush("/register");
        }

        setOpenModalCharacters(!openModalCharacters);
        renderCharacters();
    };

    useEffect(() => {
        if (typeof window !== "undefined" && account.accountId && !loadCharacters) {
            getAllCharacters();
        }
    }, [account?.accountId, loadCharacters]);

    return (
        <React.Fragment>
            <div className={style.logo}>
                <CreateLink href="/">
                    <img src="/static/imgs/logo.png" alt="logo" />
                </CreateLink>
            </div>

            <nav className={style.nav}>
                <ul>
                    <CreateLink href="/">
                        <li className={style.inicio}>INICIO</li>
                    </CreateLink>

                    <a onClick={openModal}>
                        <li className={style.jugar} />
                    </a>

                    <CreateLink href="/ranking">
                        <li className={style.inicio}>RANKING</li>
                    </CreateLink>
                </ul>
            </nav>

            <div
                className={style.modalPlay}
                style={{ display: openModalCharacters ? "block" : "none" }}
            >
                <div className={style.shadow}>
                    <div className={style.header}>
                        <div className={style.selectTypeGame}>
                            <button
                                className={typeGame === "PvE" ? style.selected : ""}
                                onClick={() => changeTypeGame("PvE")}
                            >
                                PvE
                            </button>
                            <button
                                className={typeGame === "PvP" ? style.selected : ""}
                                onClick={() => changeTypeGame("PvP")}
                            >
                                PvP
                            </button>
                        </div>

                        <FontAwesomeIcon
                            icon={faTimes}
                            className={style.closeWindow}
                            onClick={() => setOpenModalCharacters(!openModalCharacters)}
                        />
                    </div>

                    {renderBoxCharacters()}

                    <div
                        className={style.createCharacter}
                        data-js="createCharacter"
                    >
                        <CreateLink href="/createCharacter">
                            <div className={style.buttonRegister}>
                                {buttonCreatePj}
                            </div>
                        </CreateLink>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Header;
