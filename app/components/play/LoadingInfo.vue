<script setup lang="ts">
import { useUIStore } from "@/store/ui.store";

defineProps<{}>();
defineEmits<{}>();

const uiStore = useUIStore();
</script>
<template>
  <div class="progressBar">
    <div class="logo_tmp" />
    <div class="text">
      <span id="porcentajeBarra">
        {{ uiStore.ui.mapasCargados }} / {{ uiStore.ui.mapasToLoad }} Mapas
      </span>
    </div>
    <div class="contentBar">
      <div class="carga" />
      <div
        class="barra"
        :style="{
          width: `${(uiStore.ui.mapasCargados * 578) / uiStore.ui.mapasToLoad}px`,
        }"
      />
    </div>
    <div class="contBox">
      <div class="help">
        <p>Mover: Flechas</p>
        <p>Atacar: Ctrl</p>
        <p>Agarrar: A</p>
        <p>Usar: U</p>
        <p>Tirar: T</p>
        <p>Seguro: S</p>
        <p>Meditar: M</p>
        <p>Hablar: Enter</p>
      </div>
      <div class="news">
        <div class="news_content">
          <div class="title">Actualización 03/06/2016</div>
        </div>
        <p>- Volvimos!.</p>
        <p>
          - Síguemos en nuestra página de{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.facebook.com/ArgentumOnlineWeb"
          >
            Facebook </a
          >{" "} para más novedades!
        </p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.progressBar {
  width: 934px;
  margin: 0 auto;
  padding-top: 60px;
  .logo_tmp {
    margin: 0 auto;
    width: 418px;
    height: 92px;
    background-image: url("/static/imgs/logo.png");
    background-repeat: no-repeat;
  }
  .contentBar {
    position: relative;
    width: 578px;
    height: 62px;
    margin: 0 auto;
    margin-top: 20px;
    margin-bottom: 10px;
    img {
      position: absolute;
    }
  }
  .text {
    color: #fff;
    position: relative;
    top: 62px;
    font-size: 16px;
    color: #aa967f;
    text-align: center;
    z-index: 11;
    font-family: "Doppio One", sans-serif;
  }
  .carga {
    background-image: url("/static/imgs/loading_frame.png");
    background-repeat: no-repeat;
    width: 578px;
    height: 62px;
    z-index: 1;
    position: absolute;
  }
  .barra {
    height: 62px;
    background-image: url("/static/imgs/loading_fill.png");
    background-repeat: no-repeat;
    z-index: 10;
    position: absolute;
  }
  .contBox {
    margin: 0 auto;
    width: 934px;
    height: 408px;
    background-image: url("/static/imgs/keysandnews.png");
    background-repeat: no-repeat;
    .help {
      width: 467px;
      height: 300px;
      float: left;
      font-family: "Doppio One", sans-serif;
      color: #afa69c;
      padding-top: 80px;
      p {
        padding-left: 40px;
        font-size: 24px;
        margin-top: 5px;
        margin-bottom: 5px;
        width: 380px;
      }
    }
    .news {
      width: 467px;
      height: 300px;
      float: left;
      font-family: "Doppio One", sans-serif;
      color: #afa69c;
      padding-top: 80px;
      z-index: 12;
      .news_content {
        width: 400px;
        padding-left: 40px;
        height: 300px;
        overflow-y: scroll;
        z-index: 13;
        .title {
          font-size: 16px;
          margin-top: 5px;
          margin-bottom: 5px;
          text-decoration: underline;
          margin-top: 20px;
          &:first-child {
            margin-top: 0;
          }
        }
        p {
          font-size: 14px;
          margin-top: 5px;
          margin-bottom: 5px;
          width: 380px;
        }
      }
    }
  }
}
</style>
