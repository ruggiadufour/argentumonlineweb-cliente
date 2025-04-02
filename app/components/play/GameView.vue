<script setup lang="ts">
import { useUIStore } from "@/store/ui.store";
import type { Engine } from "@/engine";

const { engine } = defineProps<{
  engine: Engine;
  // canvas: {
  //   background: {};
  //   techos: {};
  //   foreground: {};
  //   items: {};
  //   textos: {};
  // };
}>();
const emit = defineEmits<{
  (e: "telep-position", pos: { x: number; y: number }): void;
}>();

const uiStore = useUIStore();
const canvasBackground = ref<HTMLCanvasElement>();
const canvasForeground = ref<HTMLCanvasElement>();
const canvasItems = ref<HTMLCanvasElement>();
const canvasTechos = ref<HTMLCanvasElement>();
const canvasTextos = ref<HTMLCanvasElement>();
const gameView = ref<HTMLDivElement>();

const getPosCanvas = (e: MouseEvent) => {
  let xCanvas = e.offsetX;
  let yCanvas = e.offsetY;
  const user = engine.user;

  const posX = Math.round(user.pos.x + xCanvas / 32 - uiStore.ui.screen.width / 64);
  const posY = Math.round(user.pos.y + yCanvas / 32 - uiStore.ui.screen.height / 64);
  return {
    x: posX,
    y: posY,
  };
};

const handleClickCanvas = (e: MouseEvent) => {
  const pos = getPosCanvas(e);
  console.log(pos);
  
  engine.clickCanvas(pos);
};

const handleClickCanvasRight = (e: MouseEvent) => {
  const pos = getPosCanvas(e);
  emit("telep-position", pos);
};

defineExpose({
  canvasBackground,
  canvasForeground,
  canvasItems,
  canvasTechos,
  canvasTextos,
});
</script>

<template>
  <div class="game-view" ref="gameView">
    <canvas
      ref="canvasBackground"
      :width="uiStore.ui.screen.width"
      :height="uiStore.ui.screen.height"
      id="canvas_background"
      class="background"
    />
    <canvas
      ref="canvasForeground"
      :width="uiStore.ui.screen.width"
      :height="uiStore.ui.screen.height"
      id="canvas_foreground"
      class="foreground"
    />
      <canvas
      ref="canvasItems"
      :width="uiStore.ui.screen.width"
      :height="uiStore.ui.screen.height"
      id="canvas_items"
      class="items"
    />
    <canvas
      ref="canvasTechos"
      :width="uiStore.ui.screen.width"
      :height="uiStore.ui.screen.height"
      id="canvas_techos"
      class="techos"
    />
    <canvas
      ref="canvasTextos"
      :width="uiStore.ui.screen.width"
      :height="uiStore.ui.screen.height"
      id="canvas_textos"
      class="textos"
    />
    <canvas
      ref="canvasMouseEvent"
      :width="uiStore.ui.screen.width"
      :height="uiStore.ui.screen.height"
      id="canvas_mouseEvent"
      class="mouseEvent"
      @click="handleClickCanvas"
      @click.right="handleClickCanvasRight"
      :style="{
        cursor: uiStore.ui.crosshair ? 'crosshair' : 'default',
      }"
    />
  </div>
</template>

<style scoped>
.game-view {
  position: relative;
  width: 100%;
  height: 100%;
}
.background {
  z-index: 0;
  position: absolute;
}
.foreground {
  z-index: 2;
  position: absolute;
}
.items {
  z-index: 1;
  position: absolute;
}
.characters {
  z-index: 3;
  position: absolute;
}
.techos {
  z-index: 4;
  position: absolute;
}
.textos {
  z-index: 5;
  position: absolute;
}
.mouseEvent {
  z-index: 7;
  position: absolute;
}
</style>
