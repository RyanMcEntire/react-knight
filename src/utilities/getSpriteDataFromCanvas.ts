export function getSpriteDataFromCanvas(
  ctx: CanvasRenderingContext2D,
  src: CanvasImageSource,
  x: number,
  y: number,
  width: number,
  height: number
): ImageData {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.drawImage(src, x, y, width, height);

  return ctx.getImageData(x, y, width, height);
}
