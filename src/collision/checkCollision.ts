import { PlayerHitBox, Rect } from '../constants/types/types';

export function checkCollision(
  playerHitBox: PlayerHitBox,
  rect2: Rect
) {
  const isColliding =
    playerHitBox.x <= rect2.x + rect2.width &&
    playerHitBox.x + playerHitBox.width >= rect2.x &&
    playerHitBox.y <= rect2.y + rect2.height &&
    playerHitBox.y + playerHitBox.height >= rect2.y; 
    return isColliding;
}

