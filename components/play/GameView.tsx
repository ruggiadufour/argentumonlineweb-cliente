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
        
    </>;
};

export default GameView;
