export const scale = 2;

export const originalTileSize = 16;
export const tileSize = originalTileSize * scale;
export const gameHeight = 18;
export const gameWidth = 32;
export const canvasHeight = tileSize * gameHeight;
export const canvasWidth = tileSize * gameWidth;

const startingPosPix = {
  x: 85,
  y: 100,
};
const startingPosRatio = {
  x: startingPosPix.x / (gameWidth * originalTileSize),
  y: startingPosPix.y / (gameHeight * originalTileSize),
};
const startingPosCalc = {
  x: canvasWidth * startingPosRatio.x,
  y: canvasHeight * startingPosRatio.y,
};
export const startingPosition = startingPosCalc; //startingPositionCalculated;

export const playerHeightOptions = {
  1: 96,
  2: 192,
};
export const playerHeight = playerHeightOptions[scale];
export const latMovementSpeed = 125 * scale;
export const baseGravity = 9.8 * 45 * scale;
export const megaGravity = baseGravity * 2.5;
export const jumpVelocity = -210 * scale;
export const playerScale = 1;
export const playerSpriteTrueHeight = 32;
export const playerSpriteTrueWidth = 32;
export const playerSpriteHeight = 64 * scale;
export const playerSpriteWidth = 43 * scale;
export const groundCheckExpansion = 2;
export const hitboxOffset = {
  left: 4 * scale,
  right: 9 * scale,
  top: 24 * scale
};
