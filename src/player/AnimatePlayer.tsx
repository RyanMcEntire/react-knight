import React, { useEffect, useRef } from 'react';
import { playerImg, drawPlayerOnCanvas } from './drawPlayer';

type ValidKeys = 'ArrowRight' | 'KeyD' | 'ArrowLeft' | 'KeyA' | 'Space';

const keysPressed: Record<ValidKeys, boolean> = {
  ArrowRight: false,
  KeyD: false,
  ArrowLeft: false,
  KeyA: false,
  Space: false,
};

function isKeyValid(code: string): code is ValidKeys {
  return ['ArrowRight', 'KeyD', 'ArrowLeft', 'KeyA', 'Space'].includes(code);
}

const canvasHeight = 64 * 9;
const canvasWidth = 64 * 16;
const playerHeight = 312;
const latMovementSpeed = 325;
const baseGravity = 9.8 * 100;
const megaGravity = baseGravity * 3;
const jumpVelocity = -420;

const AnimatePlayer: React.FC = () => {
  const playerPosRef = useRef({ x: 100, y: 100 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

  const gravityRef = useRef(baseGravity);
  const animateRef = useRef<(timestamp: number) => void>(() => {});
  const lastFrameTimeRef = useRef<number | null>(null);
  const velocityRef = useRef(0);
  const previousVelocityRef = useRef(0);
  const jumpKeyPressedRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isKeyValid(e.code) && keysPressed[e.code] !== undefined) {
        if (
          e.code === 'Space' &&
          !keysPressed.Space &&
          Math.abs(velocityRef.current) < 0.1
        ) {
          jumpKeyPressedRef.current = true;
        }
        keysPressed[e.code] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isKeyValid(e.code) && keysPressed[e.code] !== undefined) {
        keysPressed[e.code] = false;
      }
      if (
        e.code === 'Space' &&
        playerPosRef.current.y + playerHeight < canvasHeight
      ) {
        gravityRef.current = megaGravity;
        jumpKeyPressedRef.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

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
