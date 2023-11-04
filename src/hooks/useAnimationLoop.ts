import React, { useRef } from 'react';
import {
  AnimationState,
  PlayerHitBox,
  Rect,
  SpriteAnimationState,
  XY,
} from '../constants/types/types';
import { handleCollisions } from '../collision/handleCollision';
import { animations } from '../constants/animationData';

export const useAnimationLoop = (
  getPlayerHitbox: () => PlayerHitBox,
  collisionArray: Rect[],
  applyGravity: (deltaTime: number) => void,
  playerPosRef: React.MutableRefObject<XY>,
  velocityRef: React.MutableRefObject<XY>,
  draw: () => void,
  handleLand: () => void,
  isGrounded: React.MutableRefObject<boolean>,
  spriteAnimationRef: React.MutableRefObject<SpriteAnimationState>,
  getAnimationState: () => AnimationState,
  setAnimationState: (newState: AnimationState) => void
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

    const currentAnimation = getAnimationState();

    if (spriteAnimationRef.current.name !== currentAnimation) {
      const animationData = animations[currentAnimation];
      frameDurationRef.current = animationData.frameDuration;
      spriteAnimationRef.current.name = currentAnimation;
      spriteAnimationRef.current.frame = 1;
    }

    if (timeSinceLastFrameRef.current > frameDurationRef.current) {
      spriteAnimationRef.current.frame =
        (spriteAnimationRef.current.frame + 1) %
        animations[spriteAnimationRef.current.name].frameCount;
      if (spriteAnimationRef.current.frame === 0) {
        spriteAnimationRef.current.frame = 1;
      }
      timeSinceLastFrameRef.current -= frameDurationRef.current;
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
      isGrounded,
      setAnimationState
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
      isGrounded,
      setAnimationState
    );

    draw();
    requestAnimationFrame(animateRef.current);
  };

  return animateRef;
};
