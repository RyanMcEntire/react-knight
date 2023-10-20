import { useRef } from 'react';
import { playerHeight, canvasHeight } from '../constants/gameData';

export const useAnimationLoop = (
  applyGravity: (deltaTime: number) => void,
  playerPosRef: React.MutableRefObject<{ x: number; y: number }>,
  velocity: { x: number; y: number },
  draw: () => void,
  checkCollision: (
    x: number,
    y: number,
    canvas: HTMLCanvasElement | null
  ) => void,
  offscreenCanvas: HTMLCanvasElement | null
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

    applyGravity(deltaTimeRef.current);

    const newBottomPosition =
      playerPosRef.current.y + playerHeight + velocity.y * deltaTimeRef.current;

    if (newBottomPosition > canvasHeight) {
      playerPosRef.current.y = canvasHeight - playerHeight;
      velocity.y = 0;
    } else {
      playerPosRef.current.y += velocity.y * deltaTimeRef.current;
    }

    playerPosRef.current.x += velocity.x * deltaTimeRef.current;

    checkCollision(
      playerPosRef.current.x,
      playerPosRef.current.y,
      offscreenCanvas
    );

    draw();
    requestAnimationFrame(animateRef.current);
  };

  return animateRef;
};
