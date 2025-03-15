import { useSnapshot } from "valtio";
import { UIStore } from "@/store/ui.store";
import style from "@/styles/Play.module.scss";

const LoadingInfo = () => {
    const uiStore = useSnapshot(UIStore);

    return (
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
    )
}

export default LoadingInfo;