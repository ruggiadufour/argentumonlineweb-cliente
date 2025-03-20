<script setup lang="ts">
import { Inits, UI } from "@/engine";
import { useAuthStore } from "@/store/auth.store";
import nameClases from "@/config/config";
import type { ICharacter } from "@/types";

const authStore = useAuthStore();
const rankingList = useState<ICharacter[]>("rankingList", () => []);
await useFetch("/api/character/ranking", {
  onResponse({ response }) {
    if (response._data.success) {
      rankingList.value = response._data.data.ranking;
    }
  },
});

const ui = new UI();
const inits = new Inits(ui);

const setHeadAndBody = () => {
  rankingList.value.map((character, index) => {
    let idHead = character.idHead;

    if (character.navegando || character.dead) {
      idHead = character.idLastHead;
    }

    let idBody = character.idBody;

    if (character.navegando || character.dead) {
      idBody = character.idLastBody;
    }

    const idHelmet = character.idHelmet;

    const grhCabeza = idHead ? inits.heads[idHead][2] : "";
    const graphicGrhHead = inits.graphics[grhCabeza];

    const grhHelmet = idHelmet ? inits.cascos[idHelmet] : "";
    const graphicGrhHelmet = inits.graphics[grhHelmet[2]];

    const grhRopa: string = idBody ? inits.bodies[idBody][2] : "";
    // if(!inits.graphics[grhRopa]) return;
    const currentGrhRopa = inits.graphics[grhRopa].frames[1];
    // if(!currentGrhRopa) return;
    const graphicsGrhRopa = inits.graphics[currentGrhRopa];

    rankingList[index].headNumFile = graphicGrhHead.numFile || "";
    rankingList[index].helmetNumFile = graphicGrhHelmet.numFile || "";
    rankingList[index].helmetOffsetY = grhHelmet.offsetY || "";

    rankingList[index].bodyNumFile = graphicsGrhRopa.numFile || "";

    if (character.idRaza == 4 || character.idRaza == 5) {
      rankingList[index].posY = "-9px";
    }
  });
};

watch(
  () => authStore.initsLoaded,
  (newVal) => {
    if (newVal) setHeadAndBody();
  }
);
</script>

<template>
  <MainContainer>
    <div class="contentLeft">
      <div class="shadow">
        <h4>Ranking</h4>
        <div class="tabs">
          <div class="tab active">
            <span>General</span>
            <div class="line" />
          </div>
        </div>

        <div class="contentBox contentBoxRanking" :style="{ height: 'auto' }">
          <div class="tableHeader">
            <div class="rank rankGeneral">Ranking</div>
            <div class="name nameGeneral">Nombre</div>
            <div class="levelGeneral">Nivel</div>
            <div class="claseGeneral">Clase</div>
            <div class="kills killsGeneral">Asesinatos</div>
          </div>

          <div v-for="(character, key) of rankingList" :key="key" class="row">
            <div class="rank rankGeneral" :style="{ height: '60px', padding: 0 }">
              <span>{{ key + 1 }}.</span>
            </div>
            <div class="name nameGeneral" :style="{ height: '60px', padding: 0 }">
              <a>
                <div class="character">
                  <div
                    class="bodyImgCharacter"
                    :style="{
                      backgroundImage: character.bodyNumFile
                        ? `url('/static/graficos/${character.bodyNumFile}.png')`
                        : 'none',
                      backgroundPositionY: character.posY ? character.posY : 0,
                    }"
                  />
                  <div
                    class="headImgCharacter"
                    :style="{
                      backgroundImage: character.headNumFile
                        ? `url('/static/graficos/${character.headNumFile}.png')`
                        : '',
                    }"
                  />
                  <div
                    class="helmetImgCharacter"
                    :style="{
                      backgroundImage: character.helmetNumFile
                        ? `url('/static/graficos/${character.helmetNumFile}.png')`
                        : '',
                      backgroundPositionY: character.helmetOffsetY
                        ? character.helmetOffsetY
                        : 0,
                    }"
                  />
                </div>
                <span
                  :style="{
                    color: character.criminal ? 'red' : 'blue',
                  }"
                >
                  {{ character.name }}
                </span>
              </a>
            </div>
            <div class="levelGeneral" :style="{ height: '60px', padding: 0 }">
              <span>{{ character.level }}</span>
            </div>
            <div class="claseGeneral" :style="{ height: '60px', padding: 0 }">
              <span>
                {{ nameClases[character.idClase] }}
              </span>
            </div>
            <div class="kills killsGeneral" :style="{ height: '60px', padding: 0 }">
              <span>
                {{ character.ciudadanosMatados + character.criminalesMatados }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainContainer>
</template>

<style scoped>
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
.tabs {
  float: left;
  width: 100%;
  margin-top: 10px;
  .tab {
    background-color: #11171d;
    float: left;
    border: 1px solid #1a242d;
    border-bottom: 0;
    color: #496076;
    margin-right: 3px;
    cursor: pointer;
    span {
      float: left;
      font-size: 15px;
      padding: 5px 20px;
    }
  }
  .tabActive {
    font-weight: normal;
    .line {
      width: 100%;
      float: left;
      position: relative;
      top: 1px;
      border-bottom: 1px solid #11171d;
    }
  }
}

.contentBox {
  float: left;
  width: 576px;
  background-color: #11171d;
  border: 1px solid #1a242d;
  padding-bottom: 15px;
}

.contentBoxRanking {
  padding: 10px;
  width: 556px !important;
  .tableHeader {
    background: #0d1317;
    color: #ff9000;
    float: left;
    text-align: center;
    border: 1px solid #1a242d;
    .rank {
      width: 120px;
      float: left;
      padding: 10px 0;
      border-right: 1px solid #1a242d;
    }
    .name {
      width: 312px;
      float: left;
      padding: 10px 0;
    }
    .kills {
      width: 120px;
      float: left;
      padding: 10px 0;
      border-left: 1px solid #1a242d;
    }
    .rankGeneral {
      width: 90px;
    }
    .nameGeneral {
      width: 230px;
    }
    .levelGeneral {
      width: 50px;
      float: left;
      padding: 10px 0;
      border-left: 1px solid #1a242d;
    }
    .killsGeneral {
      width: 90px;
    }
    .claseGeneral {
      width: 90px;
      float: left;
      padding: 10px 0;
      border-left: 1px solid #1a242d;
    }
  }
  .row {
    background: #111a1d;
    color: #ff9000;
    float: left;
    text-align: center;
    border: 1px solid #1a242d;
    border-top: 0;
    .rank {
      width: 120px;
      float: left;
      padding: 10px 0;
      border-right: 1px solid #1a242d;
      span {
        position: relative;
        top: 21.5px;
      }
    }
    .rankGeneral {
      width: 90px;
    }
    .name {
      width: 312px;
      float: left;
      padding: 10px 0;
      a span {
        position: relative;
        top: 21.5px;
      }
      .character {
        width: 40px;
        height: 40px;
        border: 1px solid #1a242d;
        float: left;
        margin-top: 9px;
        margin-left: 9px;
        margin-bottom: 9px;
        box-shadow: 0px 0px 1px #575757;
        cursor: pointer;
        .bodyNakedImgCharacter {
          background: url("/statics/assets/bodies/bodyNaked.png");
          background-repeat: no-repeat;
          width: 25px;
          height: 16px;
          position: absolute;
          margin-top: 16px;
          margin-left: 8px;
          z-index: 10;
        }
        .headImgCharacter {
          background-repeat: no-repeat;
          width: 15px;
          height: 30px;
          position: absolute;
          z-index: 12;
          margin-top: 7px;
          margin-left: 12.4px;
        }
        .helmetImgCharacter {
          background-repeat: no-repeat;
          width: 15px;
          height: 30px;
          position: absolute;
          z-index: 12;
          margin-top: 7px;
          margin-left: 12.4px;
        }
        .bodyImgCharacter {
          position: absolute;
          background-repeat: no-repeat;
          width: 25px;
          height: 16px;
          margin-top: 16px;
          margin-left: 8px;
          z-index: 11;
        }
      }
      a {
        color: #496076;
      }
    }
    .nameGeneral {
      width: 230px;
      a {
        text-decoration: none;
      }
    }
    .levelGeneral {
      width: 50px;
      float: left;
      padding: 10px 0;
      border-left: 1px solid #1a242d;
      span {
        position: relative;
        top: 21.5px;
      }
    }
    .kills {
      width: 120px;
      float: left;
      padding: 10px 0;
      border-left: 1px solid #1a242d;
      span {
        position: relative;
        top: 21.5px;
      }
    }
    .killsGeneral {
      width: 90px;
    }
    .claseGeneral {
      width: 90px;
      float: left;
      padding: 10px 0;
      border-left: 1px solid #1a242d;
      span {
        position: relative;
        top: 21.5px;
      }
    }
  }
  .rowColor {
    background: #11191d;
  }
}

@media only screen and (max-width: 768px) {
  .contentLeft {
    width: 100%;

    .shadow {
      width: 100%;
      box-sizing: border-box;
      overflow: scroll;
    }
  }

  .row {
    .name {
      .character {
        position: relative;
      }
    }
  }
}
</style>
