import React, { useEffect, useRef } from 'react';
import { playerImg, drawPlayerOnCanvas } from './drawPlayer';
import { useKeyManager, ValidKeys } from '../hooks/useKeysPressed';
import {
  canvasHeight,
  canvasWidth,
  playerHeight,
  latMovementSpeed,
  baseGravity,
  megaGravity,
  jumpVelocity,
} from '../constants/gameData';

const AnimatePlayer: React.FC = () => {
  const playerPosRef = useRef({ x: 100, y: 100 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gravityRef = useRef(baseGravity);
  const animateRef = useRef<(timestamp: number) => void>(() => {});
  const lastFrameTimeRef = useRef<number | null>(null);
  const velocityRef = useRef(0);
  const previousVelocityRef = useRef(0);
  const jumpKeyPressedRef = useRef(false);

  const handleKeyChange = (key: ValidKeys, isPressed: boolean) => {
    if (key === 'Space') {
      if (
        isPressed &&
        !jumpKeyPressedRef.current &&
        Math.abs(velocityRef.current) < 0.1
      ) {
        jumpKeyPressedRef.current = true;
      } else if (
        !isPressed &&
        playerPosRef.current.y + playerHeight < canvasHeight
      ) {
        gravityRef.current = megaGravity;
        jumpKeyPressedRef.current = false;
      }
    }
  };

  const keysPressed = useKeyManager(handleKeyChange);

  const draw = () => {
    const context = canvasRef.current?.getContext('2d');
    if (context && canvasRef.current) {
      context.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      drawPlayerOnCanvas(
        context,
        playerPosRef.current.x,
        playerPosRef.current.y,
        2
      );
    }
  };

  animateRef.current = (timestamp: number) => {
    if (lastFrameTimeRef.current === null) {
      lastFrameTimeRef.current = timestamp;
    }

    const deltaTime = (timestamp - lastFrameTimeRef.current) / 1000;
    lastFrameTimeRef.current = timestamp;

    if (previousVelocityRef.current <= 0 && velocityRef.current > 0) {
      gravityRef.current = megaGravity;
    }
    previousVelocityRef.current = velocityRef.current;

    velocityRef.current += gravityRef.current * deltaTime;

    if (jumpKeyPressedRef.current) {
      velocityRef.current = jumpVelocity;
      jumpKeyPressedRef.current = false;
    }

    if (keysPressed.ArrowRight || keysPressed.KeyD) {
      playerPosRef.current.x += latMovementSpeed * deltaTime;
    }
    if (keysPressed.ArrowLeft || keysPressed.KeyA) {
      playerPosRef.current.x -= latMovementSpeed * deltaTime;
    }

    const newBottomPosition =
      playerPosRef.current.y + playerHeight + velocityRef.current * deltaTime;

    if (newBottomPosition > canvasHeight) {
      playerPosRef.current.y = canvasHeight - playerHeight;
      velocityRef.current = 0;
      gravityRef.current = baseGravity;
    } else {
      playerPosRef.current.y += velocityRef.current * deltaTime;
    }

    draw();
    requestAnimationFrame(animateRef.current);
  };

  useEffect(() => {
    if (!playerImg.complete && playerImg.onload === null) {
      playerImg.onload = () => {
        requestAnimationFrame(animateRef.current);
      };
    } else {
      requestAnimationFrame(animateRef.current);
    }
  }, []);

  return (
    <div>
      <canvas
        className="pixelated"
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
    </div>
  );
};

export default AnimatePlayer;
