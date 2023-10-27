import { useRef } from 'react';
import { Dimension, Rect, XY } from '../constants/types/types';
import { handleCollisions } from '../collision/handleCollision';

export const useAnimationLoop = (
  getPlayerHitbox: () => Dimension,
  collisionArray: Rect[],
  applyGravity: (deltaTime: number) => void,
  playerPosRef: React.MutableRefObject<XY>,
  velocityRef: React.MutableRefObject<XY>,
  draw: () => void,
  handleLand: () => void,
  isGrounded: React.MutableRefObject<boolean>
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
    handleCollisions(
      playerHitBox,
      velocityRef,
      collisionArray,
      playerPosRef,
      'y',
      handleLand,
      isGrounded
    );

    applyGravity(deltaTimeRef.current);

    const newPlayerHitBox = getPlayerHitbox();
    handleCollisions(
      newPlayerHitBox,
      velocityRef,
      collisionArray,
      playerPosRef,
      'x',
      handleLand,
      isGrounded
    );

    playerPosRef.current.y += velocityRef.current.y * deltaTimeRef.current;
     playerPosRef.current.x += velocityRef.current.x * deltaTimeRef.current;

    draw();
    requestAnimationFrame(animateRef.current);
  };

  return animateRef;
};
