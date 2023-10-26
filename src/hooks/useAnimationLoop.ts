import { useRef } from 'react';
import { playerHeight, canvasHeight } from '../constants/gameData';
import { Rect } from '../constants/types/types';
import { handleCollision } from '../collision/handleCollision';

export const useAnimationLoop = (
  getPlayerHitbox: () => Rect,
  collisionArray: Rect[],
  applyGravity: (deltaTime: number) => void,
  playerPosRef: React.MutableRefObject<{ x: number; y: number }>,
  velocity: { x: number; y: number },
  draw: () => void
) => {
  const animateRef = useRef<(timestamp: number) => void>(() => {});
  const lastFrameTimeRef = useRef<number | null>(null);
  const deltaTimeRef = useRef<number>(0);

  animateRef.current = (timestamp: number) => {
    if (lastFrameTimeRef.current === null) {
      lastFrameTimeRef.current = timestamp;
    }

    deltaTimeRef.current = (timestamp - lastFrameTimeRef.current) / 1000;
    lastFrameTimeRef.current = timestamp;
    const playerHitBox = getPlayerHitbox();
    handleCollision(playerHitBox, velocity, collisionArray, playerPosRef, 'x');

    applyGravity(deltaTimeRef.current);
    playerPosRef.current.x += velocity.x * deltaTimeRef.current;

    const newPlayerHitBox = getPlayerHitbox();
    handleCollision(
      newPlayerHitBox,
      velocity,
      collisionArray,
      playerPosRef,
      'y'
    );

    const newBottomPosition =
      playerPosRef.current.y + playerHeight + velocity.y * deltaTimeRef.current;

    if (newBottomPosition > canvasHeight) {
      playerPosRef.current.y = canvasHeight - playerHeight;
      velocity.y = 0;
    } else {
      playerPosRef.current.y += velocity.y * deltaTimeRef.current;
    }


    draw();
    requestAnimationFrame(animateRef.current);
  };

  return animateRef;
};
