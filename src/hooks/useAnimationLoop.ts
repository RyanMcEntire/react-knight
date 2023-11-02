import React, { useRef } from 'react';
import {
  PlayerHitBox,
  Rect,
  SpriteAnimationState,
  XY,
} from '../constants/types/types';
import { handleCollisions } from '../collision/handleCollision';

export const useAnimationLoop = (
  getPlayerHitbox: () => PlayerHitBox,
  collisionArray: Rect[],
  applyGravity: (deltaTime: number) => void,
  playerPosRef: React.MutableRefObject<XY>,
  velocityRef: React.MutableRefObject<XY>,
  draw: () => void,
  handleLand: () => void,
  isGrounded: React.MutableRefObject<boolean>,
  spriteAnimationRef: React.MutableRefObject<SpriteAnimationState>
) => {
  const animateRef = useRef<(timestamp: number) => void>(() => {});
  const lastFrameTimeRef = useRef<number | null>(null);
  const deltaTimeRef = useRef<number>(0);
  const frameDurationRef = useRef<number>(150); // length of frame;
  const timeSinceLastFrameRef = useRef<number>(0);

  animateRef.current = (timestamp: number) => {
    if (lastFrameTimeRef.current === null) {
      lastFrameTimeRef.current = timestamp;
    }

    deltaTimeRef.current = (timestamp - lastFrameTimeRef.current) / 1000;
    timeSinceLastFrameRef.current += deltaTimeRef.current * 1000;
    lastFrameTimeRef.current = timestamp;

    if (timeSinceLastFrameRef.current > frameDurationRef.current) {
      const currentAnimation =
        spriteAnimationRef.current.animations[spriteAnimationRef.current.name];
      if (currentAnimation) {
        spriteAnimationRef.current.frame =
          (spriteAnimationRef.current.frame + 1) % currentAnimation.frameCount;
      }
      if (spriteAnimationRef.current.frame === 0) {
        spriteAnimationRef.current.frame = 1;
      }
      timeSinceLastFrameRef.current = 0;
    }

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
