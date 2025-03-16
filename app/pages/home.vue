<script setup lang="ts">
import { onMounted } from "vue";
import MainContainer from "@/components/MainContainer.vue";

const isMobile = useState("isMobile", () => false);

onMounted(async () => {});
</script>

<template>
  <MainContainer>
    <div class="gralinfo">
      <div class="shadow">
        <h2>¡Bienvenidos a Argentum Online Web!</h2>
        <p v-if="!isMobile">
          <NuxtLink to="/register"> Regístrate </NuxtLink>
          o <strong>Ingresa</strong> para poder jugar!
        </p>

        <p>
          Síguemos en nuestra página de
          <a
            className="link"
            href="https://www.facebook.com/ArgentumOnlineWeb"
            rel="noreferrer"
            target="_blank"
          >
            Facebook
          </a>
          !
        </p>
      </div>
    </div>
  </MainContainer>
</template>

<style scoped>
.gralinfo {
  margin-top: 20px;
  width: 598px;
  height: 140px;
  background-color: #0b0f13;
  float: left;
  padding: 1px;
  position: relative;
  bottom: 70px;
  .shadow {
    box-shadow: inset 0 0 10px #555657;
    background-image: url("/static/imgs/bg1.png");
    background-repeat: no-repeat;
    background-position: right;
    float: left;
    width: 100%;
    height: 140px;
    h2 {
      padding: 10px 10px 0px 20px;
      font-size: 20px;
      color: #006e2e;
      font-weight: normal;
    }
    p {
      margin: 10px;
      padding-left: 10px;
      color: #525252;
      font-size: 13px;
      width: 419px;
      max-height: 64px;
      overflow: hidden;
      a {
        text-decoration: none;
      }
    }
  }

  @media only screen and (max-width: 768px) {
    width: 100%;

    .shadow {
      background-image: none;
    }
  }
}
</style>
