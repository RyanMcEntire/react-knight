export const scale = 2;
export const originalPixelTileSize = 16;
export const tileSize = originalPixelTileSize * scale;
export const gameHeight = 18;
export const gameWidth = 32;
export const canvasHeight = tileSize * scale * gameHeight;
export const canvasWidth = tileSize * scale * gameWidth;
export const playerHeightOptions = {
  1: 123,
  2: 822,
};
export const playerHeight = playerHeightOptions[scale];
export const latMovementSpeed = 125 * scale;
export const baseGravity = 9.8 * 45;
export const megaGravity = baseGravity * 2.5 * scale;
export const jumpVelocity = -190 * scale;
export const playerScale = 1;
