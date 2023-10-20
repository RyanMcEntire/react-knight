import { tileSize } from '../constants/gameData';

function drawCollisionBlock(
  position: { x: number; y: number },
  context: CanvasRenderingContext2D
) {
  const width = tileSize;
  const height = tileSize;
  const x = position.x;
  const y = position.y;
  const color = 'red';

  context.fillStyle = color;
  context.fillRect(x, y, width, height);
}

export default drawCollisionBlock;
