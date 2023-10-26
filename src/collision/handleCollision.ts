import { Rect } from '../constants/types/types';
import { checkCollision } from './checkCollision';

export function handleCollision(
  playerHitBox: Rect,
  velocity: { x: number; y: number },
  collisionArray: Rect[],
  playerPosRef: React.MutableRefObject<{ x: number; y: number }>,
  axis: 'x' | 'y'
) {
  for (let i = 0; i < collisionArray.length; i += 1) {
    const block = collisionArray[i];
    if (checkCollision(playerHitBox, block)) {
      const collisionDirection = getCollisionDirection(
        playerPosRef,
        playerHitBox,
        block
      );
      switch (collisionDirection) {
        case 'left':
          if (axis === 'x') {
            playerPosRef.current.x = block.x - playerHitBox.width;
            velocity.x = 0;
          }
          break;
        case 'right':
          if (axis === 'x') {
            playerPosRef.current.x = block.x + block.width;
            velocity.x = 0;
          }
          break;
        case 'top':
          if (axis === 'y') {
            playerPosRef.current.y = block.y - playerHitBox.height;
            velocity.y = 0;
          }
          break;
        case 'bottom':
          if (axis === 'y') {
            playerPosRef.current.y = block.y + block.height;
            velocity.y = 0;
          }
          break;
        default:
          break;
      }
      return; // Exit the function after resolving collision
    }
  }
}

function getCollisionDirection(
  playerPosRef: React.MutableRefObject<{ x: number; y: number }>,
  playerHitBox: Rect,
  block: Rect
) {
  const dx =
    playerPosRef.current.x +
    playerHitBox.width / 2 -
    (block.x + block.width / 2);
  const dy =
    playerPosRef.current.y +
    playerHitBox.width / 2 -
    (block.y + block.width / 2);
  const width = (playerHitBox.width + block.width) / 2;
  const height = (playerHitBox.height + block.height) / 2;
  const crossWidth = width * dy;
  const crossHeight = height * dx;
  let collisionDirection;

  if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
    if (crossWidth > crossHeight) {
      collisionDirection = crossWidth > -crossHeight ? 'bottom' : 'left';
    } else {
      collisionDirection = crossWidth > -crossHeight ? 'right' : 'top';
    }
  }
  return collisionDirection;
}
