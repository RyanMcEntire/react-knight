export const checkCollision = (
  x: number,
  y: number,
  canvas: HTMLCanvasElement | null
) => {
  if (canvas) {
    const context = canvas.getContext('2d');
    if (context) {
      const pixel = context?.getImageData(x, y, 1, 1).data;
      if (pixel[0] === 255 && pixel[1] === 0 && pixel[2] === 0) {
        console.log('collision detected');
      }
    }
  }
};
