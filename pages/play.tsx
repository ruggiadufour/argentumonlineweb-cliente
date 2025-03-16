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

    



    // if(!game.current) return <div>Loading...</div>

    return (
        <>
            
        </>
    );
};

export default connect()(Play);
