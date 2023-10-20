import { scale } from '../constants/gameData';

function drawCollisionBlock(
  position: { x: number; y: number },
  context: CanvasRenderingContext2D
) {
  const width = 32;
  const height = 32;
  const x = position.x * scale;
  const y = position.y * scale;
  const color = 'red';

    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

export default drawCollisionBlock;
