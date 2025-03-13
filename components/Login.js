import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import style from "../styles/Login.module.scss";
import { fetchUrl } from "../config/utils";
import CreateLink from "./CreateLink";

const Login = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const dispatch = useDispatch();
    const account = useSelector((state) => state.account);

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogin = async () => {
        const { username, password } = formData;

        if (!username || !password) return;

        const body = {
            name: username,
            password: password
        };

        try {
            const result = await fetchUrl("/auth/login", {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });

            if (result.error) {
                alert(result.message);
                return;
            }

            dispatch({
                type: 'SET_ACCOUNT',
                payload: result.data.user
            });
        } catch (error) {
            console.error('Error during login:', error);
            alert('Error al intentar iniciar sesión');
        }
    };

    const handleLogout = async () => {
        try {
            await fetchUrl("/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });

            dispatch({
                type: 'SET_ACCOUNT',
                payload: {}
            });
        } catch (error) {
            console.error('Error during logout:', error);
            alert('Error al intentar cerrar sesión');
        }
    };

    return (
        <div className={style.servidores}>
            <div className={style.svtitulo}>
                <img src="/static/imgs/deco.png" alt="" />
                <p className={style.servidorTxt}>SERVIDOR</p>
                <p className={style.cantUser} style={{ color: "green" }}>
                    Online
                </p>
            </div>

            {account?.accountId ? (
                <div className={style.login} style={{ height: "150px" }}>
                    <div className={style.avatar}>
                        <img src="/static/imgs/logo-aoweb.png" alt="" />
                        <a onClick={handleLogout}>
                            SALIR <FontAwesomeIcon icon={faSignOutAlt} />
                        </a>
                    </div>
                    <span className={style.name}>{account.name}</span>
                </div>
            ) : (
                <div className={style.login} style={{ height: "140px" }}>
                    <div className={style.user}>
                        <p>USUARIO</p>
                        <div className={style.contentInput}>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                value={formData.username}
                                onChange={handleInput}
                            />
                        </div>
                    </div>
                    <div className={style.pass}>
                        <p>CONTRASEÑA</p>
                        <div className={style.contentInput}>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleInput}
                            />
                        </div>
                    </div>

                    <CreateLink href="/register">
                        <div
                            style={{
                                textDecoration: "none",
                                color: "#006e2e",
                                marginRight: "44px"
                            }}
                        >
                            CREAR CUENTA
                        </div>
                    </CreateLink>

                    <button
                        onClick={handleLogin}
                        className={style.bold}
                        style={{
                            color: "#ff9000",
                            marginRight: "29px"
                        }}
                    >
                        ENTRAR
                    </button>
                </div>
            )}
        </div>
    );
};

export default Login;
