import React from "react";
import style from "../styles/MainContainer.module.scss";

import Header from "./Header";
import Login from "./Login";

class MainContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { userAgent } = this.props;

        return (
            <div className={style.container}>
                <Header userAgent={userAgent} />

                {this.props.children}

                <Login />
            </div>
        );
    }
}

export default MainContainer;
