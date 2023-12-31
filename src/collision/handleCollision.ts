import { groundCheckExpansion, hitboxOffset } from '../constants/gameData';
import { AnimationState, PlayerHitBox, Rect, XY } from '../constants/types/types';
import { checkCollision } from './checkCollision';

export function handleCollisions(
  playerHitBox: PlayerHitBox,
  velocityRef: React.MutableRefObject<XY>,
  collisionArray: Rect[],
  playerPosRef: React.MutableRefObject<XY>,
  axis: 'x' | 'y',
  handleLand: () => void,
  isGroundedRef: React.MutableRefObject<boolean>,
  setAnimationState: { (newState: AnimationState): void; (newState: AnimationState): void; }
) {
  for (let i = 0; i < collisionArray.length; i += 1) {
    const block = collisionArray[i];
    if (checkCollision(playerHitBox, block)) {
      const collisionDirection = getCollisionDirection(playerHitBox, block);
      // if (isGroundedRef && collisionDirection === 'bottom') {
      //   return;
      // }
      switch (collisionDirection) {
        case 'left':
          if (axis === 'x') {
            playerPosRef.current.x = block.x + block.width - hitboxOffset.left + 0.01;
            velocityRef.current.x = 0;
          }
          break;
        case 'right':
          if (axis === 'x') {
            playerPosRef.current.x =
              block.x - playerHitBox.width - hitboxOffset.left - 0.01;
            velocityRef.current.x = 0;
          }
          break;
        case 'top':
          if (axis === 'y') {
            playerPosRef.current.y =
              block.y + block.height - hitboxOffset.top + 0.1;
            velocityRef.current.y = 0;
          }
          break;
        case 'bottom':
          if (axis === 'y') {
            playerPosRef.current.y =
              block.y - playerHitBox.height - hitboxOffset.top + 0.001;
            velocityRef.current.y = 0;
            handleLand();
            isGroundedRef.current = true;
            setAnimationState('idle')
          }
          break;
        default:
          break;
      }
      return;
    }
  }
}

function getCollisionDirection(playerHitBox: PlayerHitBox, block: Rect) {
  const dx =
    playerHitBox.x + playerHitBox.width / 2 - (block.x + block.width / 2);
  const dy =
    playerHitBox.y -
    groundCheckExpansion +
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

export function drawHitbox(
  context: CanvasRenderingContext2D | null,
  hitbox: PlayerHitBox
) {
  if (!context) {
    console.error('No drawing context available');
    return;
  }


  const { x, y, width, height } = hitbox;
  context.beginPath();
  context.rect(x, y, width, height);
  context.strokeStyle = 'red';
  context.lineWidth = 2;
  context.stroke();
  context.fillStyle = 'rgba(255, 0, 0, 0.3)';
  context.fill();
}
