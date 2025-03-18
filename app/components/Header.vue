<script setup lang="ts">
import { UI, Inits, RenderCharacters } from "@/engine";
import { useUIStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";
import pvpChars from "@/config/pvpChars.json";

interface HTMLCanvasElementExtended extends HTMLCanvasElement {
  ctx: CanvasRenderingContext2D | null;
}

defineProps<{}>();
defineEmits<{}>();

const router = useRouter();
const uiStore = useUIStore();
const authStore = useAuthStore();

const ui = new UI();
const inits = new Inits(ui);
const openModalCharacters = useState("openModalCharacters", () => false);
const characters = useState("characters", () => []);
const charactersPvP = useState("charactersPvP", () => pvpChars);
const typeGame = useState("typeGame", () => "PvE");
const loadCharacters = useState("loadCharacters", () => false);
const buttonCreatePj = useState("buttonCreatePj", () => "Creación deshabilitada");
await useFetch("/api/character/list", {
  onResponse({ response }) {
    if (response._data.success) {
      console.log(response._data.data.characters);
      
      characters.value = response._data.data.characters;
    }
  },
});

const canvasCharacterRefs = ref<HTMLCanvasElementExtended[]>([]);

const boxCharacters = computed(() => {
  let boxes = [];

  for (let i = 0; i < 10; i++) {
    const character =
      typeGame.value === "PvE" ? characters.value[i] : charactersPvP.value[i];

    boxes.push(character);
  }

  return boxes;
});

onMounted(() => {
  const initializeComponent = async () => {
    if (authStore.account?.accountId && !loadCharacters.value) {
      loadCharacters.value = true;
      getAllCharacters();
    }

    canvasCharacterRefs.value.forEach((canvas, index) => {
      if (canvas && canvasCharacterRefs.value[index]) {
        canvasCharacterRefs.value[index].ctx = canvas.getContext("2d");
      }
    });

    await inits.initialize();

    authStore.initsLoaded = true;
  };

  initializeComponent();
});
// , [authStore.account?.accountId, loadCharacters] // TODO: ver si es necesario watch

const clearCanvas = () => {
  canvasCharacterRefs.value.forEach((canvas) => {
    if (canvas?.ctx) {
      canvas.ctx.clearRect(0, 0, 80, 100);
    }
  });
};

const getAllCharacters = async () => {
  // const result = await $fetch("/character/list");
  characters.value = [];
};

const changeTypeGame = async (newTypeGame: string) => {
  typeGame.value = newTypeGame;
  buttonCreatePj.value =
    newTypeGame === "PvP" ? "Crear Personaje" : "Creación deshabilitada";
  renderCharacters();
};

const renderCharacters = () => {
  clearCanvas();

  const tmpCharacters = typeGame.value === "PvE" ? characters : charactersPvP;

  tmpCharacters.value.forEach((character, index) => {
    const canvas = canvasCharacterRefs.value[index];
    if (canvas?.ctx) {
      const rndChar = new RenderCharacters(inits, canvas.ctx, character, 24, 60);
      rndChar.drawChar();
    }
  });
};

const play = (character: Record<string, any>, key: number) => {
  if (!authStore.account) return;

  if (!character) {
    openModalCharacters.value = false;
    return router.push("/create_character");
  }

  window.localStorage.setItem("idAccount", authStore.account.accountId || "");
  window.localStorage.setItem("email", authStore.account.email || "");
  if (typeGame.value === "PvE") {
    window.localStorage.setItem("idCharacter", character._id);
  } else {
    window.localStorage.setItem("idCharacter", key.toString());
  }

  window.localStorage.setItem("typeGame", typeGame.value === "PvE" ? "1" : "2");

  // return router.push("/play", "", true);
  document.location.href = "/play";
};

const openModal = () => {
  // const md = new MobileDetect(userAgent);

  // if (md.mobile()) {
  //   alert("Argentum Online Web no está disponible para celulares.");
  //   return;
  // }

  if (!authStore.account?.accountId) {
    return router.push("/register");
  }

  openModalCharacters.value = !openModalCharacters.value;
  renderCharacters();
};

watchEffect(() => {
  if (
    typeof window !== "undefined" &&
    authStore.account?.accountId &&
    !loadCharacters.value
  ) {
    getAllCharacters();
  }
});
</script>

<template>
  <div class="logo">
    <NuxtLink to="/home">
      <img src="/static/imgs/logo.png" alt="logo" />
    </NuxtLink>
  </div>

  <nav class="nav">
    <ul>
      <NuxtLink to="/home">
        <li class="inicio">INICIO</li>
      </NuxtLink>

      <a @click="openModal">
        <li class="jugar" />
      </a>

      <NuxtLink to="/ranking">
        <li class="inicio">RANKING</li>
      </NuxtLink>
    </ul>
  </nav>
  <div v-show="openModalCharacters" class="modalPlay">
    <div class="shadow">
      <div class="header">
        <div class="selectTypeGame">
          <button
            :class="typeGame === 'PvE' ? 'selected' : ''"
            @click="changeTypeGame('PvE')"
          >
            PvE
          </button>
          <button
            :class="typeGame === 'PvP' ? 'selected' : ''"
            @click="changeTypeGame('PvP')"
          >
            PvP
          </button>
        </div>

        <!-- <FontAwesomeIcon
              icon={faTimes}
              class="closeWindow"
              @click="openModalCharacters = !openModalCharacters"
          /> -->
      </div>

      <div v-for="(character, i) of boxCharacters" class="contentGral" :key="i">
        <span class="name">{{ character ? character.name : "" }}</span>
        <canvas
          ref="canvasCharacterRefs"
          class="contentImgA"
          @click="play(character, i)"
          width="80"
          height="100"
        />
      </div>

      <div class="createCharacter" data-js="createCharacter">
        <NuxtLink to="/create_character">
          <div class="buttonRegister">{{ buttonCreatePj }}</div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
nav {
  width: 444px;
  height: 232px;
  font-family: tahoma;
  background-image: url("/static/imgs/navbar2.png");
  background-repeat: no-repeat;
  margin: 0 auto;
  position: relative;
  bottom: 70px;
  img {
    position: absolute;
    top: 60px;
  }
  ul {
    list-style: none;
    line-height: 78px;
    height: 158px;
    margin: 20px auto;
    padding: 0;
    width: 899.5px;
    z-index: 1;
    position: relative;
    top: 40px;
    font-family: arial;
    li {
      width: 122px;
      float: left;
      text-align: center;
      color: #496076;
      cursor: pointer;
      margin-top: 62px;
      margin-left: 5px;
    }
    .inicio {
      width: 118px;
    }
    .registro {
      width: 126px;
    }
    .tienda {
      width: 104px;
    }
    .jugar {
      cursor: pointer;
      position: relative;
      width: 195px;
      height: 158px;
      padding: 0;
      margin: 0;
      top: 20px;
      left: 5px;
    }
    .rankingNav {
      width: 100px;
    }
    .right-bar {
      width: 10px;
      margin: 0;
      padding: 0;
    }
  }
}

@media only screen and (max-width: 768px) {
  .logo {
    img {
      width: 100%;
    }
  }

  nav {
    width: 100%;
    background-size: 100%;
    bottom: 30px;

    ul {
      width: 100%;
      font-size: 0;

      a {
        font-size: 15px;
        display: inline-block;
        width: 33%;
        vertical-align: top;
        text-decoration: none;

        &:first-child {
          text-align: left;
          padding-left: 25px;
          box-sizing: border-box;
        }

        &:last-child {
          text-align: right;
          padding-right: 15px;
          box-sizing: border-box;
        }
      }

      li {
        float: none;
        margin-top: 32px;
        margin-left: 0;
        width: 100% !important;
        text-align: inherit;
      }
    }
  }
}

.modalPlay {
  margin-left: -250px;
  margin-top: -200px;
  position: fixed;
  left: 50%;
  z-index: 15;
  width: 500px;
  background: #0b0f13;
  padding: 1px;
  .shadow {
    box-shadow: inset 0 0 10px #555657;
    width: 100%;
    height: 100%;
    padding: 20px;
    width: 460px;
    float: left;
    .header {
      width: 100%;
      float: left;
      position: relative;
      margin-bottom: 15px;
      p {
        margin: 0;
        color: #ff9000;
        float: left;
      }
      .nameRoom {
        float: left;
        text-align: center;
        text-decoration: underline;
      }
      .help {
        width: 100%;
        margin-top: 10px;
        font-size: 12px;
      }
      .closeWindow {
        float: right;
        color: #ff9000;
        cursor: pointer;
      }
      .selectTypeGame {
        position: absolute;
        button {
          border: none;
          background: #11171d;
          border: 1px solid #1a242d;
          color: #006e2e;
          font-size: 16px;
          font-weight: normal;
          padding: 5px 30px;
          cursor: pointer;
          text-decoration: none;
          outline: none;
        }
        .selected {
          border: 1px solid #006e2e;
          background: #1a242d;
        }
      }
    }
    .createCharacter {
      display: none;
      float: left;
      width: 100%;
      padding-top: 30px;
      text-align: center;
      .buttonRegister {
        margin-top: 20px;
        border: none;
        background: #11171d;
        border: 1px solid #1a242d;
        color: #006e2e;
        font-size: 16px;
        font-weight: normal;
        padding: 5px 30px;
        cursor: pointer;
        text-decoration: none;
      }
    }
    .contentGral {
      font-size: 14px;
      text-align: center;
      float: left;
      width: 80px;
      margin-left: 10px;
      margin-top: 10px;
      .name {
        height: 32px;
        float: left;
        width: 80px;
        color: #ff9000;
        margin-bottom: 5px;
        word-wrap: break-word;
      }
      .contentImgLast {
        margin-left: 0;
      }
      .contentImgA {
        float: left;
        background: #11171d;
        text-align: center;
        border: 1px solid #18222c;
        margin: 0 auto;
        background: #24313d;
        cursor: pointer;
        .bodyNakedImgA {
          background-repeat: no-repeat;
          width: 25px;
          height: 50px;
          position: absolute;
          margin-top: 29px;
          margin-left: 28px;
          z-index: 10;
        }
        .headImgA {
          background-repeat: no-repeat;
          width: 15px;
          height: 30px;
          position: absolute;
          z-index: 12;
          margin-top: 20px;
          margin-left: 35px;
        }
        .helmetImgA {
          background-repeat: no-repeat;
          width: 20px;
          height: 30px;
          position: absolute;
          z-index: 12;
          margin-top: 8px;
          margin-left: 29px;
        }
        .bodyImgA {
          position: absolute;
          background-repeat: no-repeat;
          width: 25px;
          height: 50px;
          margin-top: 29px;
          margin-left: 28px;
          z-index: 11;
        }
        .weaponImgA {
          position: absolute;
          background-repeat: no-repeat;
          width: 25px;
          height: 50px;
          margin-top: 28px;
          margin-left: 38px;
          z-index: 13;
        }
      }
    }
  }
}
</style>
