import { useRef } from 'react';
import {
  Dimension,
  Rect,
} from '../constants/types/types';
import { sortCollisions, resolveCollision } from '../collision/handleCollision';

export const useAnimationLoop = (
  getPlayerHitbox: () => Dimension,
  collisionArray: Rect[],
  applyGravity: (deltaTime: number) => void,
  playerPosRef: React.MutableRefObject<{ x: number; y: number }>,
  velocity: { x: number; y: number },
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
    const xCollisions = sortCollisions(
      playerHitBox,
      velocity,
      collisionArray,
      playerPosRef,
      'x'
    );

    const newPlayerHitBox = getPlayerHitbox();
    const yCollisions = sortCollisions(
      newPlayerHitBox,
      velocity,
      collisionArray,
      playerPosRef,
      'y'
    );

    const sortedCollisions = [...xCollisions, ...yCollisions].sort((a, b) => {
      if (a.axis === 'x' && b.axis === 'y') return -1;
      if (a.axis === 'y' && b.axis === 'x') return 1;
      return 0;
    });

    for (const collision of sortedCollisions) {
      resolveCollision(collision, handleLand, isGrounded);
    }

    applyGravity(deltaTimeRef.current);

    playerPosRef.current.x += velocity.x * deltaTimeRef.current;
    playerPosRef.current.y += velocity.y * deltaTimeRef.current;

    const postUpdateCollisions = sortCollisions(
      getPlayerHitbox(),
      velocity,
      collisionArray,
      playerPosRef,
      'both'
    );
    for (const collision of postUpdateCollisions) {
      resolveCollision(collision, handleLand, isGrounded);
    }

    draw();
    requestAnimationFrame(animateRef.current);
  };

  return animateRef;
};
