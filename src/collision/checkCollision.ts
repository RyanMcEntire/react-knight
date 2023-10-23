
// returns true if collision detected
// returns false if collision not detected

export function checkCollision(
  ctx: CanvasRenderingContext2D,
  spriteData: ImageData,
  x: number,
  y: number
) {
  const collisionData = ctx.getImageData(
    x,
    y,
    spriteData.width,
    spriteData.height
  ).data;

  for (let i = 0; i < spriteData.data.length; i += 4) {
    if (spriteData.data[i + 3] !== 0) {
      if (
        collisionData[i] === 255 && // Red
        collisionData[i + 1] === 0 && // Green
        collisionData[i + 2] === 0 && // Blue
        collisionData[i + 3] !== 0 // Not transparent
      ) {
        return true;
      }
    }
  }
  return false;
}
