import { useRef } from 'react';
import { PlayerHitBox, Rect, XY } from '../constants/types/types';
import { handleCollisions } from '../collision/handleCollision';

export const useAnimationLoop = (
  getPlayerHitbox: () => PlayerHitBox,
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

    playerPosRef.current.x += velocityRef.current.x * deltaTimeRef.current;
    playerPosRef.current.y += velocityRef.current.y * deltaTimeRef.current;
    

    const playerHitBox = getPlayerHitbox();
    handleCollisions(
      playerHitBox,
      velocityRef,
      collisionArray,
      playerPosRef,
      'x',
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
      'y',
      handleLand,
      isGrounded
    );

    draw();
    requestAnimationFrame(animateRef.current);
  };

  return animateRef;
};
