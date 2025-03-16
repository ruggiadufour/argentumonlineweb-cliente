export type TGraphic = {
  numFrames: number,
  numFile: string,
  sX: number,
  sY: number,
  width: number,
  height: number,
  frames: Record<string, string>,
  offset: { x: number, y: number },
  grhIndex: number,
  frameCounter: number,
  speed: number,
};
