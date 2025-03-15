import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import MainContainer from "@/components/MainContainer";
import Inits from "@/engine/inits";
import RenderCharacters from "@/engine/RenderCharacters";
import { fetchUrl, routerPush } from "@/config/utils";
import {
    clases,
    razas,
    nameClases,
    nameGeneros,
    nameRazas
} from "@/config/config";
import style from "@/styles/CreateCharacter.module.scss";

import { RootState } from "@/types/store";

// Constantes para las cabezas de los personajes
const HEADS = {
    HUMANO: { FIRST: 1, LAST: 40 },
    ELFO: { FIRST: 101, LAST: 122 },
    ELFO_DROW: { FIRST: 201, LAST: 221 },
    ENANO: { FIRST: 301, LAST: 319 },
    GNOMO: { FIRST: 401, LAST: 416 }
};

export async function getServerSideProps({ req }) {
    return {
        props: {
            userAgent: req ? req.headers["user-agent"] : navigator.userAgent
        }
    };
}

const CreateCharacter = ({ userAgent }) => {
    const inits = new Inits();
    
    const canvasRef = useRef(null);
    const initsLoaded = useSelector((state: RootState) => state.initsLoaded);
    const [characterState, setCharacterState] = useState({
        idClaseSelected: 1,
        idRazaSelected: 1,
        idGeneroSelected: 1,
        idHeadSelected: 1,
        character: {
            idBody: 1,
            idHead: 1,
            idWeapon: 48,
            idShield: 0,
            idHelmet: 0,
            idGenero: 1
        },
        nameClase: nameClases[1],
        nameRaza: nameRazas[1],
        nameGenero: nameGeneros[1],
        name: ""
    });

    useEffect(() => {
        if (initsLoaded && canvasRef.current) {
            drawChar();
        }
    }, [initsLoaded, characterState]);

    const drawChar = () => {
        if (!initsLoaded || !canvasRef.current) return;

        const ctx = canvasRef.current.getContext("2d");
        const rndChar = new RenderCharacters(
            inits,
            ctx,
            characterState.character,
            24,
            60
        );
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        rndChar.drawChar();
    };

    const updateCharacterState = (updates) => {
        setCharacterState(prev => ({
            ...prev,
            ...updates,
            character: {
                ...prev.character,
                ...(updates.character || {})
            }
        }));
    };

    const handleHeadChange = (direction) => {
        const { idRazaSelected, idHeadSelected } = characterState;
        let newHeadId = idHeadSelected;
        let headLimits;

        switch (idRazaSelected) {
            case razas.humano:
                headLimits = HEADS.HUMANO;
                break;
            case razas.elfo:
                headLimits = HEADS.ELFO;
                break;
            case razas.elfoDrow:
                headLimits = HEADS.ELFO_DROW;
                break;
            case razas.enano:
                headLimits = HEADS.ENANO;
                break;
            case razas.gnomo:
                headLimits = HEADS.GNOMO;
                break;
        }

        if (direction === 'prev' && newHeadId > headLimits.FIRST) {
            newHeadId--;
        } else if (direction === 'next' && newHeadId < headLimits.LAST) {
            newHeadId++;
        }

        updateCharacterState({
            idHeadSelected: newHeadId,
            character: { idHead: newHeadId }
        });
    };

    const handleClaseChange = (direction) => {
        let { idClaseSelected } = characterState;

        if (direction === 'prev' && idClaseSelected > 1) {
            idClaseSelected--;
            if (idClaseSelected === 5) idClaseSelected--;
        } else if (direction === 'next' && idClaseSelected < 9) {
            idClaseSelected++;
            if (idClaseSelected === 5) idClaseSelected++;
        }

        const idWeapon = idClaseSelected === clases.cazador ? 40 : 48;

        updateCharacterState({
            idClaseSelected,
            nameClase: nameClases[idClaseSelected],
            character: { idWeapon }
        });
    };

    const handleRazaChange = (direction) => {
        let { idRazaSelected } = characterState;

        if ((direction === 'prev' && idRazaSelected <= 1) ||
            (direction === 'next' && idRazaSelected >= 5)) {
            return;
        }

        idRazaSelected = direction === 'prev' ? idRazaSelected - 1 : idRazaSelected + 1;

        let idBody, idHeadSelected;

        switch (idRazaSelected) {
            case razas.humano:
                idBody = 1;
                idHeadSelected = HEADS.HUMANO.FIRST;
                break;
            case razas.elfo:
                idBody = 2;
                idHeadSelected = HEADS.ELFO.FIRST;
                break;
            case razas.elfoDrow:
                idBody = 3;
                idHeadSelected = HEADS.ELFO_DROW.FIRST;
                break;
            case razas.enano:
            case razas.gnomo:
                idBody = 300;
                idHeadSelected = idRazaSelected === razas.enano ?
                    HEADS.ENANO.FIRST : HEADS.GNOMO.FIRST;
                break;
        }

        updateCharacterState({
            idRazaSelected,
            idHeadSelected,
            nameRaza: nameRazas[idRazaSelected],
            character: {
                idBody,
                idHead: idHeadSelected
            }
        });
    };

    const handleGeneroChange = (direction) => {
        let { idGeneroSelected } = characterState;

        if ((direction === 'prev' && idGeneroSelected > 1) ||
            (direction === 'next' && idGeneroSelected < 2)) {
            idGeneroSelected = direction === 'prev' ? idGeneroSelected - 1 : idGeneroSelected + 1;

            updateCharacterState({
                idGeneroSelected,
                nameGenero: nameGeneros[idGeneroSelected],
                character: { idGenero: idGeneroSelected }
            });
        }
    };

    const handleNameChange = (e) => {
        setCharacterState(prev => ({
            ...prev,
            name: e.target.value
        }));
    };

    const handleCreateCharacter = async () => {
        const { name, idClaseSelected, idRazaSelected, idGeneroSelected, character } = characterState;

        if (!name) {
            alert('Por favor ingresa un nombre para tu personaje');
            return;
        }

        try {
            const response = await fetchUrl("/character/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    idClase: idClaseSelected,
                    idRaza: idRazaSelected,
                    idGenero: idGeneroSelected,
                    ...character
                })
            });

            if (response.error) {
                alert(response.message);
                return;
            }

            routerPush("/");
        } catch (error) {
            console.error('Error al crear el personaje:', error);
            alert('Error al crear el personaje');
        }
    };

    return (
        <MainContainer userAgent={userAgent}>
            <div className={style.contentLeft}>
                <div className={style.shadow}>
                    <h4>Crear Personaje</h4>

                    <div className={style.createCharacter}>
                        <div className={style.content_general}>
                            <div className={style.content_left}>
                                <label htmlFor="name" className={style.text}>
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    className={style.input_text}
                                    id="name"
                                    value={characterState.name}
                                    onChange={handleNameChange}
                                />
                                <div className={style.canvasCharacter}>
                                    <FontAwesomeIcon
                                        icon={faAngleLeft}
                                        className={style.faAngleLeft}
                                        onClick={() => handleHeadChange('prev')}
                                    />
                                    <canvas
                                        ref={canvasRef}
                                        className={style.character}
                                        width="80"
                                        height="100"
                                    />
                                    <FontAwesomeIcon
                                        icon={faAngleRight}
                                        className={style.faAngleRight}
                                        onClick={() => handleHeadChange('next')}
                                    />
                                </div>
                            </div>
                            <div className={style.content_right}>
                                <label htmlFor="clase" className={style.text}>
                                    Clase
                                </label>
                                <div className={style.content_input_text}>
                                    <FontAwesomeIcon
                                        icon={faAngleLeft}
                                        className={style.faAngleLeft}
                                        onClick={() => handleClaseChange('prev')}
                                    />
                                    <input
                                        type="text"
                                        className={style.input_text}
                                        id="clase"
                                        value={characterState.nameClase}
                                        readOnly
                                    />
                                    <FontAwesomeIcon
                                        icon={faAngleRight}
                                        className={style.faAngleRight}
                                        onClick={() => handleClaseChange('next')}
                                    />
                                </div>

                                <label htmlFor="raza" className={style.text}>
                                    Raza
                                </label>
                                <div className={style.content_input_text}>
                                    <FontAwesomeIcon
                                        icon={faAngleLeft}
                                        className={style.faAngleLeft}
                                        onClick={() => handleRazaChange('prev')}
                                    />
                                    <input
                                        type="text"
                                        className={style.input_text}
                                        id="raza"
                                        value={characterState.nameRaza}
                                        readOnly
                                    />
                                    <FontAwesomeIcon
                                        icon={faAngleRight}
                                        className={style.faAngleRight}
                                        onClick={() => handleRazaChange('next')}
                                    />
                                </div>

                                <label htmlFor="genero" className={style.text}>
                                    Género
                                </label>
                                <div className={style.content_input_text}>
                                    <FontAwesomeIcon
                                        icon={faAngleLeft}
                                        className={style.faAngleLeft}
                                        onClick={() => handleGeneroChange('prev')}
                                    />
                                    <input
                                        type="text"
                                        className={style.input_text}
                                        id="genero"
                                        value={characterState.nameGenero}
                                        readOnly
                                    />
                                    <FontAwesomeIcon
                                        icon={faAngleRight}
                                        className={style.faAngleRight}
                                        onClick={() => handleGeneroChange('next')}
                                    />
                                </div>

                                <label htmlFor="ciudad" className={style.text}>
                                    Ciudad
                                </label>
                                <div className={`${style.content_input_text} ${style.margin_left}`}>
                                    <input
                                        type="text"
                                        className={style.input_text}
                                        id="ciudad"
                                        value="Ullathorpe"
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>

                        <button onClick={handleCreateCharacter}>
                            Crear personaje
                        </button>
                    </div>
                </div>
            </div>
        </MainContainer>
    );
};

export default CreateCharacter;
