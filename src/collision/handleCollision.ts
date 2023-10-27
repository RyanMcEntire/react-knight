import { Dimension, Rect, XY } from '../constants/types/types';
import { checkCollision } from './checkCollision';

export function handleCollisions(
  playerHitBox: Dimension,
  velocityRef: React.MutableRefObject<XY>,
  collisionArray: Rect[],
  playerPosRef: React.MutableRefObject<XY>,
  axis: 'x' | 'y',
  handleLand: () => void,
  isGrounded: React.MutableRefObject<boolean>
) {
  for (let i = 0; i < collisionArray.length; i += 1) {
    const block = collisionArray[i];
    if (checkCollision(playerPosRef, playerHitBox, block)) {
      const collisionDirection = getCollisionDirection(
        playerPosRef,
        playerHitBox,
        block
      );
      console.log('collisionDirection', collisionDirection);
      console.log('collision axis', axis);
      console.log('isGrounded', isGrounded);
      console.log(
        'player position before adjustment',
        playerPosRef.current.y,
        playerPosRef.current.x
      );
      // if (isGrounded && collisionDirection === 'bottom') {
      //   return;
      // }
      switch (collisionDirection) {
        case 'left':
          if (axis === 'x') {
            playerPosRef.current.x = block.x + block.width + 0.001;
            velocityRef.current.x = 0;
          }
          console.log(
            'player position and direction after adjustment',
            playerPosRef.current.y,
            playerPosRef.current.x,
            collisionDirection
          );
          break;
        case 'right':
          if (axis === 'x') {
            playerPosRef.current.x = block.x - playerHitBox.width - 0.001;
            velocityRef.current.x = 0;
          }
          console.log(
            'player position and direction after adjustment',
            playerPosRef.current.y,
            playerPosRef.current.x,
            collisionDirection
          );
          break;
        case 'top':
          if (axis === 'y') {
            playerPosRef.current.y = block.y + playerHitBox.height + 0.001;
            velocityRef.current.y = 0;
          }
          console.log(
            'player position and direction after adjustment',
            playerPosRef.current.y,
            playerPosRef.current.x,
            collisionDirection
          );
          break;
        case 'bottom':
          if (axis === 'y') {
            console.log(
              'player position before bottom adjustment',
              playerPosRef.current.y
            );
            playerPosRef.current.y =
              block.y - block.height - block.height + 0.001;
            velocityRef.current.y = 0;
            handleLand();
          }
          console.log(
            'player position and direction after adjustment',
            playerPosRef.current.y,
            playerPosRef.current.x,
            collisionDirection
          );
          break;
        default:
          break;
      }
      return;
    }
  }
}

function getCollisionDirection(
  playerPosRef: React.MutableRefObject<XY>,
  playerHitBox: Dimension,
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

  const bias = 0.01;
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
