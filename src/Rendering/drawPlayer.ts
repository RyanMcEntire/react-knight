const drawPlayer = (
  x: number,
  y: number,
  context: CanvasRenderingContext2D
) => {
  const width = 75;
  const height = 100;
  const color = 'red';

  context.fillStyle = color;
  context.fillRect(x, y, width, height);
};

export default drawPlayer;
