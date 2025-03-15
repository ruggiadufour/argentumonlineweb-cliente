import { useSnapshot } from "valtio";
import { Engine } from "@/engine";
import { UIStore } from "@/store/ui.store";
import style from "@/styles/Play.module.scss";

type TProps = {
    engine: React.RefObject<Engine>;
    canvas: React.RefObject<{
        background: {},
        techos: {},
        foreground: {},
        items: {},
        textos: {},
    }>;
}

const GameView = ({ engine, canvas }: TProps) => {
    const uiStore = useSnapshot(UIStore);

    const handleClickCanvas = (e) => {
        let xCanvas = e.nativeEvent.offsetX;
        let yCanvas = e.nativeEvent.offsetY;
        const user = engine.current.user;

        const posX = Math.round(user.pos.x + xCanvas / 32 - 544 / 64);
        const posY = Math.round(user.pos.y + yCanvas / 32 - 544 / 64);

        engine.current.clickCanvas({
            x: posX,
            y: posY,
        });
    };

    return <>
        <canvas
            width="544"
            height="544"
            id="background"
            className={style.background}
            ref={(ref) => {
                canvas.current.background = ref;
            }}
        />
        <canvas
            width="544"
            height="544"
            id="foreground"
            className={style.foreground}
            ref={(ref) => {
                canvas.current.foreground = ref;
            }}
        />
        <canvas
            width="544"
            height="544"
            id="items"
            className={style.items}
            ref={(ref) => {
                canvas.current.items = ref;
            }}
        />
        <canvas
            width="544"
            height="544"
            id="techos"
            className={style.techos}
            ref={(ref) => {
                canvas.current.techos = ref;
            }}
        />
        <canvas
            width="544"
            height="544"
            id="textos"
            className={style.textos}
            ref={(ref) => {
                canvas.current.textos = ref;
            }}
        />
        <canvas
            width="544"
            height="544"
            id="mouseEvent"
            className={style.mouseEvent}
            onClick={handleClickCanvas}
            style={{
                cursor: uiStore.crosshair ? "crosshair" : "default",
            }}
        />
    </>;
};

export default GameView;
