<script setup lang="ts">
import configCharacter from "@/config/config";
import { useAuthStore } from "@/store/auth.store";
import { Inits, UI, RenderCharacters } from "@/engine";

interface HTMLCanvasElementExtended extends HTMLCanvasElement {
  ctx: CanvasRenderingContext2D | null;
}

const { nameClases, nameRazas, nameGeneros, razas, clases } = configCharacter;

const ui = new UI();
const inits = new Inits(ui);
inits.initialize();

const authStore = useAuthStore();
const form = useState("character", () => ({
  idClaseSelected: 1,
  idRazaSelected: 1,
  idGeneroSelected: 1,
  idHeadSelected: 1,
  character: {
    name: "",
    idBody: 1,
    idHead: 1,
    idWeapon: 48,
    idShield: 0,
    idHelmet: 0,
    idGenero: 1,
    ciudad: "",
  },
  nameClase: nameClases[1],
  nameRaza: nameRazas[1],
  nameGenero: nameGeneros[1],
}));
const canvas = ref<HTMLCanvasElementExtended | null>(null);

onMounted(() => {
  if (canvas.value) {
    canvas.value.ctx = canvas.value.getContext("2d");
  }
});

watch(
  () => authStore.initsLoaded,
  (newVal) => {
    if (newVal) drawChar();
  }
);

const drawChar = () => {
  if (authStore.initsLoaded && canvas.value?.ctx) {
    const rndChar = new RenderCharacters(
      inits,
      canvas.value.ctx,
      form.value.character,
      24,
      60
    );
    rndChar.drawChar();
  }
};

const prevHead = async () => {
  const humanoHombreFirstHead = 1,
    elfoHombreFirstHead = 101,
    elfoDHombreFirstHead = 201,
    enanoHombreFirstHead = 301,
    gnomoHombreFirstHead = 401;

  if (form.value.idRazaSelected == razas.humano) {
    if (form.value.idHeadSelected > humanoHombreFirstHead) {
      form.value.idHeadSelected--;
    }
  } else if (form.value.idRazaSelected == razas.elfo) {
    if (form.value.idHeadSelected > elfoHombreFirstHead) {
      form.value.idHeadSelected--;
    }
  } else if (form.value.idRazaSelected == razas.elfoDrow) {
    if (form.value.idHeadSelected > elfoDHombreFirstHead) {
      form.value.idHeadSelected--;
    }
  } else if (form.value.idRazaSelected == razas.enano) {
    if (form.value.idHeadSelected > enanoHombreFirstHead) {
      form.value.idHeadSelected--;
    }
  } else if (form.value.idRazaSelected == razas.gnomo) {
    if (form.value.idHeadSelected > gnomoHombreFirstHead) {
      form.value.idHeadSelected--;
    }
  }

  form.value.character.idHead = form.value.idHeadSelected;
  form.value.idHeadSelected = form.value.idHeadSelected;

  drawChar();
};

const nextHead = async () => {
  const humanoHombreLastHead = 40,
    elfoHombreLastHead = 122,
    elfoDHombreLastHead = 221,
    enanoHombreLastHead = 319,
    gnomoHombreLastHead = 416;

  if (form.value.idRazaSelected == razas.humano) {
    if (form.value.idHeadSelected < humanoHombreLastHead) {
      form.value.idHeadSelected++;
    }
  } else if (form.value.idRazaSelected == razas.elfo) {
    if (form.value.idHeadSelected < elfoHombreLastHead) {
      form.value.idHeadSelected++;
    }
  } else if (form.value.idRazaSelected == razas.elfoDrow) {
    if (form.value.idHeadSelected < elfoDHombreLastHead) {
      form.value.idHeadSelected++;
    }
  } else if (form.value.idRazaSelected == razas.enano) {
    if (form.value.idHeadSelected < enanoHombreLastHead) {
      form.value.idHeadSelected++;
    }
  } else if (form.value.idRazaSelected == razas.gnomo) {
    if (form.value.idHeadSelected < gnomoHombreLastHead) {
      form.value.idHeadSelected++;
    }
  }

  form.value.character.idHead = form.value.idHeadSelected;

  form.value.idHeadSelected = form.value.idHeadSelected;

  drawChar();
};

const prevClase = async () => {
  if (form.value.idClaseSelected > 1) {
    form.value.idClaseSelected--;
    if (form.value.idClaseSelected == 5) {
      form.value.idClaseSelected--;
    }

    if (form.value.idClaseSelected == clases.cazador) {
      form.value.character.idWeapon = 40;
    } else {
      form.value.character.idWeapon = 48;
    }

    form.value.idClaseSelected = form.value.idClaseSelected;
    form.value.nameClase = nameClases[form.value.idClaseSelected];

    drawChar();
  }
};

const nextClase = async () => {
  if (form.value.idClaseSelected < 9) {
    form.value.idClaseSelected++;
    if (form.value.idClaseSelected == 5) {
      form.value.idClaseSelected++;
    }

    if (form.value.idClaseSelected == clases.cazador) {
      form.value.character.idWeapon = 40;
    } else {
      form.value.character.idWeapon = 48;
    }

    form.value.idClaseSelected = form.value.idClaseSelected;
    form.value.nameClase = nameClases[form.value.idClaseSelected];

    drawChar();
  }
};

const prevRaza = async () => {
  console.log("prevRaza", form.value.idRazaSelected);
  const humanoHombreFirstHead = 1,
    elfoHombreFirstHead = 101,
    elfoDHombreFirstHead = 201,
    enanoHombreFirstHead = 301,
    gnomoHombreFirstHead = 401;

  if (form.value.idRazaSelected > 1) {
    form.value.idRazaSelected--;

    if (form.value.idRazaSelected == razas.humano) {
      form.value.character.idBody = 1;
    } else if (form.value.idRazaSelected == razas.elfo) {
      form.value.character.idBody = 2;
    } else if (form.value.idRazaSelected == razas.elfoDrow) {
      form.value.character.idBody = 3;
    } else if (form.value.idRazaSelected == razas.enano) {
      form.value.character.idBody = 300;
    } else if (form.value.idRazaSelected == razas.gnomo) {
      form.value.character.idBody = 300;
    }

    if (form.value.idRazaSelected == razas.humano) {
      form.value.idHeadSelected = humanoHombreFirstHead;
    } else if (form.value.idRazaSelected == razas.elfo) {
      form.value.idHeadSelected = elfoHombreFirstHead;
    } else if (form.value.idRazaSelected == razas.elfoDrow) {
      form.value.idHeadSelected = elfoDHombreFirstHead;
    } else if (form.value.idRazaSelected == razas.enano) {
      form.value.idHeadSelected = enanoHombreFirstHead;
    } else if (form.value.idRazaSelected == razas.gnomo) {
      form.value.idHeadSelected = gnomoHombreFirstHead;
    }

    form.value.character.idHead = form.value.idHeadSelected;

    form.value.idHeadSelected = form.value.idHeadSelected;

    form.value.nameRaza = nameRazas[form.value.idRazaSelected];

    form.value.idRazaSelected = form.value.idRazaSelected;

    drawChar();
  }
};

const nextRaza = async () => {
  console.log("nextRaza", form.value.idRazaSelected);

  const humanoHombreFirstHead = 1,
    elfoHombreFirstHead = 101,
    elfoDHombreFirstHead = 201,
    enanoHombreFirstHead = 301,
    gnomoHombreFirstHead = 401;

  if (form.value.idRazaSelected < 5) {
    form.value.idRazaSelected = form.value.idRazaSelected + 1;
    console.log("nextRaza", form.value.idRazaSelected);
    

    if (form.value.idRazaSelected == razas.humano) {
      form.value.character.idBody = 1;
    } else if (form.value.idRazaSelected == razas.elfo) {
      form.value.character.idBody = 2;
    } else if (form.value.idRazaSelected == razas.elfoDrow) {
      form.value.character.idBody = 3;
    } else if (form.value.idRazaSelected == razas.enano) {
      form.value.character.idBody = 300;
    } else if (form.value.idRazaSelected == razas.gnomo) {
      form.value.character.idBody = 300;
    }

    if (form.value.idRazaSelected == razas.humano) {
      form.value.idHeadSelected = humanoHombreFirstHead;
    } else if (form.value.idRazaSelected == razas.elfo) {
      form.value.idHeadSelected = elfoHombreFirstHead;
    } else if (form.value.idRazaSelected == razas.elfoDrow) {
      form.value.idHeadSelected = elfoDHombreFirstHead;
    } else if (form.value.idRazaSelected == razas.enano) {
      form.value.idHeadSelected = enanoHombreFirstHead;
    } else if (form.value.idRazaSelected == razas.gnomo) {
      form.value.idHeadSelected = gnomoHombreFirstHead;
    }

    form.value.character.idHead = form.value.idHeadSelected;

    form.value.idHeadSelected = form.value.idHeadSelected;

    form.value.nameRaza = nameRazas[form.value.idRazaSelected];

    // form.value.idRazaSelected = form.value.idRazaSelected;

    drawChar();
  }
};

const prevGenero = async () => {
  if (form.value.idGeneroSelected > 1) {
    form.value.idGeneroSelected--;

    form.value.character.idGenero = form.value.idGeneroSelected;

    form.value.idGeneroSelected = form.value.idGeneroSelected;

    form.value.nameGenero = nameGeneros[form.value.idGeneroSelected];

    drawChar();
  }
};

const nextGenero = async () => {
  if (form.value.idGeneroSelected < 2) {
    form.value.idGeneroSelected++;

    form.value.character.idGenero = form.value.idGeneroSelected;

    form.value.idGeneroSelected = form.value.idGeneroSelected;

    form.value.nameGenero = nameGeneros[form.value.idGeneroSelected];

    drawChar();
  }
};

const createCharacter = async () => {
  console.log("createCharacter", form.value.character);
  const response = await fetch("/api/character/create", {
    method: "POST",
    body: JSON.stringify({
        // ...form.value.character,
        name: form.value.character.name, 
        class: form.value.nameClase, 
        race: form.value.nameRaza, 
        idGenero: form.value.idGeneroSelected,
        idHead: form.value.idHeadSelected,
        idBody: form.value.character.idBody,
        idWeapon: form.value.character.idWeapon,
        idShield: form.value.character.idShield,
        idHelmet: form.value.character.idHelmet
    }),
  });
  console.log("response", response);
};
</script>

<template>
  <MainContainer>
    <div class="contentLeft">
      <div class="shadow">
        <h4>Crear Personaje</h4>

        <div class="createCharacter">
          <div class="content_general">
            <div class="content_left">
              <label htmlFor="name" class="text"> Nombre </label>
              <input type="text" class="input_text" id="name" v-model="form.character.name" />
              <div class="canvasCharacter">
                <!-- <FontAwesomeIcon
                  icon="{faAngleLeft}"
                  class="faAngleLeft"
                  onClick="{this.prevHead}"
                /> -->
                <button @click="prevHead">Anterior</button>
                <canvas ref="canvas" class="character" width="80" height="100" />
                <!-- <FontAwesomeIcon
                    icon={faAngleRight}
                    class="faAngleRight"
                    onClick={this.nextHead}
                /> -->
                <button @click="nextHead">Siguiente</button>
              </div>
            </div>
            <div class="content_right">
              <label htmlFor="name" class="text"> Clase </label>

              <div class="content_input_text">
                <!-- <FontAwesomeIcon
                    icon={faAngleLeft}
                    class="faAngleLeft"
                    onClick={this.prevClase}
                /> -->
                <button @click="prevClase">Anterior</button>
                <input
                  type="text"
                  class="input_text"
                  id="clase"
                  disabled=""
                  v-model="form.nameClase"
                />
                <!-- <FontAwesomeIcon
                    icon={faAngleRight}
                    class="faAngleRight"
                    onClick={this.nextClase}
                /> -->
                <button @click="nextClase">Siguiente</button>
              </div>

              <label htmlFor="name" class="text"> Raza </label>

              <div class="content_input_text">
                <!-- <FontAwesomeIcon
                    icon={faAngleLeft}
                    className={style.faAngleLeft}
                    onClick={this.prevRaza}
                /> -->
                <button @click="prevRaza">Prev Raza</button>
                <input
                  type="text"
                  class="input_text"
                  id="raza"
                  v-model="form.nameRaza"
                  disabled=""
                />
                <!-- <FontAwesomeIcon
                    icon={faAngleRight}
                    className={style.faAngleRight}
                    onClick={this.nextRaza}
                /> -->
                <button @click="nextRaza">Next Raza</button>
              </div>

              <label htmlFor="name" class="text"> Género </label>

              <div class="content_input_text">
                <!-- <FontAwesomeIcon
                    icon={faAngleLeft}
                    className={style.faAngleLeft}
                    onClick={this.prevGenero}
                /> -->
                <button @click="prevGenero">Anterior</button>
                <input
                  type="text"
                  class="input_text"
                  id="genero"
                  v-model="form.nameGenero"
                  disabled=""
                />
                <!-- <FontAwesomeIcon
                    icon={faAngleRight}
                    className={style.faAngleRight}
                    onClick={this.nextGenero}
                /> -->
                <button @click="nextGenero">Siguiente</button>
              </div>

              <label htmlFor="name" class="text"> Ciudad </label>

              <div class="content_input_text margin_left">
                <input
                  type="text"
                  class="input_text"
                  id="ciudad"
                  v-model="form.character.ciudad"
                  disabled=""
                />
              </div>
            </div>
          </div>

          <button @click="createCharacter">Crear personaje</button>
        </div>
      </div>
    </div>
  </MainContainer>
</template>

<style scoped>
a {
  color: #ff9000;
}

.contentLeft {
  margin-top: 20px;
  width: 598px;
  background-color: #0b0f13;
  float: left;
  padding: 1px;
  position: relative;
  bottom: 70px;
  .shadow {
    box-shadow: inset 0 0 10px #555657;
    float: left;
    width: 578px;
    padding: 10px;
    h4 {
      color: #ff9000;
      text-align: center;
      font-size: 20px;
      float: left;
      width: 100%;
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
}

.createCharacter {
  text-align: center;
  margin: 0 auto;
  width: 500px;
  padding-top: 20px;
  button {
    margin-top: 50px;
    margin-bottom: 15px;
    border: none;
    background: #11171d;
    border: 1px solid #1a242d;
    color: #006e2e;
    font-size: 16px;
    font-weight: normal;
    padding: 5px 30px;
    cursor: pointer;
  }
  .content_general {
    width: 500px;
    height: 280px;
    margin-top: 25px;
    float: left;
    .content_left {
      width: 250px;
      height: 280px;
      float: left;
      .input_text {
        border: 1px solid #1a1d22;
        background: #000;
        padding: 5px;
        color: #485867;
        width: 150px;
        margin: 0 auto;
        float: left;
        margin-left: 44px;
        margin-bottom: 20px;
      }
      .text {
        float: left;
        color: #485867;
        width: 100%;
        text-align: center;
        margin-bottom: 10px;
      }
      .canvasCharacter {
        width: 130px;
        margin: 0 auto;
        .character {
          float: left;
          width: 80px;
          height: 100px;
          background-color: #12171a;
          border: 1px solid #1a1f25;
        }
        .faAngleLeft {
          color: #333333;
          float: left;
          font-size: 23px;
          font-weight: bold;
          margin-right: 10px;
          cursor: pointer;
          margin-top: 20px;
        }
        .faAngleRight {
          color: #333333;
          float: left;
          font-size: 23px;
          font-weight: bold;
          margin-left: 10px;
          cursor: pointer;
          margin-top: 20px;
        }
      }
    }
    .content_right {
      width: 250px;
      height: 280px;
      float: left;
      .text {
        color: #485867;
        margin-bottom: 10px;
        width: 100%;
        text-align: center;
        float: left;
      }
      .content_input_text {
        float: left;
        margin-bottom: 20px;
        margin-left: 26px;
        text-align: center;
        .input_text {
          border: 1px solid #1a1d22;
          background: #000;
          padding: 5px;
          color: #485867;
          width: 150px;
          margin: 0 auto;
          float: left;
          text-align: center;
        }
        .faAngleLeft {
          color: #333333;
          float: left;
          font-size: 23px;
          font-weight: bold;
          margin-right: 10px;
          cursor: pointer;
        }
        .faAngleRight {
          color: #333333;
          float: left;
          font-size: 23px;
          font-weight: bold;
          margin-left: 10px;
          cursor: pointer;
        }
      }
      .margin_left {
        margin-left: 44px;
      }
    }
  }
}
</style>
