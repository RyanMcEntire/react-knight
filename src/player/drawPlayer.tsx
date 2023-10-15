import playerSprite from '../assets/characters/attack1_1.png';

export const playerImg = new Image();
playerImg.src = playerSprite;

export const drawPlayerOnCanvas = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number
) => {
  context.save();
  context.translate(x, y);
  context.transform(scale, 0, 0, scale, 0, 0);
  context.imageSmoothingEnabled = false;
  if (playerImg.complete) {
    context.drawImage(playerImg, 0, 0);
  }
  context.restore();
  console.log(playerSprite);
};
