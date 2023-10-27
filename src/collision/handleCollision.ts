import { Collision, Rect, XY } from '../constants/types/types';
import { checkCollision } from './checkCollision';

export function sortCollisions(
  playerHitBox: { width: number; height: number },
  velocity: XY,
  collisionArray: Rect[],
  playerPosRef: React.MutableRefObject<{ x: number; y: number }>,
  axis: 'x' | 'y' | 'both'
) {
  const collisions = [];
  for (let i = 0; i < collisionArray.length; i += 1) {
    const block = collisionArray[i];
    if (checkCollision(playerPosRef, playerHitBox, block)) {
      const collisionDirection = getCollisionDirection(
        playerPosRef,
        playerHitBox,
        block
      );

      if (
        (axis === 'x' &&
          (collisionDirection === 'left' || collisionDirection === 'right')) ||
        (axis === 'y' &&
          (collisionDirection === 'top' || collisionDirection === 'bottom')) ||
        axis === 'both'
      ) {
        collisions.push({
          block,
          collisionDirection,
          playerPosRef,
          playerHitBox,
          velocity: { ...velocity },
          axis,
        });
      }
    }
  }
  return collisions;
}

export function resolveCollision(
  collision: Collision,
  handleLand: () => void,
  isGrounded: React.MutableRefObject<boolean>
) {
  const {
    block,
    collisionDirection,
    playerPosRef,
    playerHitBox,
    velocity,
    axis,
  } = collision;
  console.log('collision direction', collisionDirection);
  console.log('playerPos before resolving:', playerPosRef);
  if (isGrounded && collisionDirection === 'bottom') {
    return;
  }
  switch (collisionDirection) {
    case 'left':
      if (axis === 'x' && velocity.x < 0) {
        playerPosRef.current.x = block.x + block.width + 0.01;
        velocity.x = 0;
      }
      break;
    case 'right':
      if (axis === 'x' && velocity.x > 0) {
        playerPosRef.current.x = block.x - playerHitBox.width - 0.01;
        velocity.x = 0;
      }
      break;
    case 'top':
      if (axis === 'y' && velocity.y < 0) {
        playerPosRef.current.y = block.y + block.height + 0.01;
        velocity.y = 0;
      }
      break;
    case 'bottom':
      if (axis === 'y' && velocity.y > 0) {
        playerPosRef.current.y = block.y - playerHitBox.height - 0.01;
        velocity.y = 0;
        handleLand();
        console.log('playerPos after resolving:', playerPosRef);
      }
      break;
    default:
      break;
  }

  return;
}

function getCollisionDirection(
  playerPosRef: React.MutableRefObject<{ x: number; y: number }>,
  playerHitBox: { width: number; height: number },
  block: Rect
) {
  const dx =
    playerPosRef.current.x +
    playerHitBox.width / 2 -
    (block.x + block.width / 2);
  const dy =
    playerPosRef.current.y +
    playerHitBox.height / 2 -
    (block.y + block.height / 2);

  const halfWidths = (playerHitBox.width + block.width) / 2;
  const halfHeights = (playerHitBox.height + block.height) / 2;

  const overlapX = halfWidths - Math.abs(dx);
  const overlapY = halfHeights - Math.abs(dy);

  const bias = 0.1;
  if (overlapX + bias >= overlapY) {
    if (dy > 0) {
      return 'top';
    } else {
      return 'bottom';
    }
  } else {
    if (dx > 0) {
      return 'left';
    } else {
      return 'right';
    }
  }
}
