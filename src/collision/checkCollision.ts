import { Dimension, Rect } from '../constants/types/types';

export function checkCollision(
  playerPosRef: React.MutableRefObject<{ x: number; y: number }>,
  rect1: Dimension,
  rect2: Rect
) {
  const isColliding =
    playerPosRef.current.x <= rect2.x + rect2.width &&
    playerPosRef.current.x + rect1.width >= rect2.x &&
    playerPosRef.current.y <= rect2.y + rect2.height &&
    playerPosRef.current.y + rect1.height >= rect2.y; 
    return isColliding;
}

