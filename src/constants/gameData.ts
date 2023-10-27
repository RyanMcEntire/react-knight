export const scale = 2;
export const originalPixelTileSize = 16;
export const tileSize = originalPixelTileSize * scale;
export const gameHeight = 18;
export const gameWidth = 32;
export const canvasHeight = tileSize * gameHeight;
export const canvasWidth = tileSize * gameWidth;
export const playerHeightOptions = {
  1: 96,
  2: 192,
};
export const playerHeight = playerHeightOptions[scale];
export const latMovementSpeed = 125 * scale;
export const baseGravity = 9.8 * 45 * scale;
export const megaGravity = baseGravity * 2.5;
export const jumpVelocity = -190 * scale;
export const playerScale = 1;
export const playerSpriteHeight = 32 * scale;
export const playerSpriteWidth = 32 * scale;
