import type { TGraphic, TMap } from "@/types";
import { UI } from "@/engine";

class Inits {
  ui: UI;
  preCacheGraphics: Record<string, any>;
  graphics: Record<string, TGraphic>;
  heads: Record<string, any>;
  bodies: Record<string, any>;
  armas: Record<string, any>;
  escudos: Record<string, any>;
  cascos: Record<string, any>;
  objs: Record<string, any>;
  mapData: Record<string, any>;
  mapa: TMap;
  mapasCargados: number;
  completedCount: number;
  loaded: boolean;
  fxs: Record<string, any>;

  constructor(ui: UI = null) {
    this.ui = ui;
    this.preCacheGraphics = {};
    this.graphics = {};
    this.heads = {};
    this.bodies = {};
    this.armas = {};
    this.escudos = {};
    this.cascos = {};
    this.objs = {};
    this.mapData = {};
    this.mapa = {};

    this.mapasCargados = 0;
    this.completedCount = 0;

    this.loaded = false;
  }

  setUI = (properties) => {
    this.ui.setProperties(properties);
  };

  initialize = async () => {
    if (!this.loaded) {
      await Promise.all([
        this.loadCascos(),
        this.loadHeads(),
        this.loadArmas(),
        this.loadEscudos(),
        this.loadBodies(),
        this.loadGraphics(),
      ]);

      this.loaded = true;
    }

    console.log("Loaded", this.loaded);
  };

  loadMaps = async () => {
    var arLoadMaps = [];

    const typeGame = parseInt(localStorage.getItem("typeGame"));

    if (typeGame === 2) {
      this.ui.setProperty("mapasToLoad", 1);

      arLoadMaps.push(this.loadMap(272));
    } else {
      this.ui.setProperty("mapasToLoad", 290);

      for (var i = 1; i <= 290; i++) {
        arLoadMaps.push(this.loadMap(i));
      }
    }

    await Promise.all(arLoadMaps);
  };

  loadMap = async (map) => {
    const response = await fetch("/static/mapas/mapa_" + map + ".map");
    const result = await response.json();

    this.mapa[map] = result[map];

    this.createMapData(map);

    this.mapasCargados++;

    this.ui.setProperty("mapasCargados", this.mapasCargados);
  };

  createMapData = (idMap) => {
    this.mapData[idMap] = [];

    for (var y = 1; y <= 100; y++) {
      this.mapData[idMap][y] = [];

      for (var x = 1; x <= 100; x++) {
        this.mapData[idMap][y][x] = {
          id: 0,
        };
      }
    }
  };

  loadImage = (numFile) => {
    return new Promise((resolve, reject) => {
      var image = new Image();

      image.src = "/static/graficos/" + numFile + ".png";

      image.onload = () => {
        this.preCacheGraphics[numFile] = image;

        resolve(true);
      };

      image.onerror = (e) => {
        reject(true);
      };
    });
  };

  loadObjs = async () => {
    const response = await fetch("/static/init/objs.json");
    const result = await response.json();

    this.objs = result;
  };

  loadHeads = async () => {
    const response = await fetch("/static/init/heads.json");
    const result = await response.json();

    this.heads = result;
  };

  loadBodies = async () => {
    const response = await fetch("/static/init/bodies.json");
    const result = await response.json();

    this.bodies = result;
  };

  loadGraphics = async () => {
    const response = await fetch("/static/init/graficos.json");
    const result = await response.json();

    this.graphics = result;
  };

  loadArmas = async () => {
    const response = await fetch("/static/init/armas.json");
    const result = await response.json();

    this.armas = result;
  };

  loadEscudos = async () => {
    const response = await fetch("/static/init/escudos.json");
    const result = await response.json();

    this.escudos = result;
  };

  loadCascos = async () => {
    const response = await fetch("/static/init/cascos.json");
    const result = await response.json();

    this.cascos = result;
  };

  loadFxs = async () => {
    const response = await fetch("/static/init/fxs.json");
    const result = await response.json();

    this.fxs = result;
  };
}

export default Inits;
