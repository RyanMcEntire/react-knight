import React, { useEffect, useRef } from 'react';
import drawPlayer from './drawPlayer';

type ValidKeys = 'ArrowRight' | 'd' | 'ArrowLeft' | 'a' | ' ';

const keysPressed: Record<ValidKeys, boolean> = {
  ArrowRight: false,
  d: false,
  ArrowLeft: false,
  a: false,
  ' ': false,
};

function isKeyValid(key: string): key is ValidKeys {
  return ['ArrowRight', 'd', 'ArrowLeft', 'a', ' '].includes(key);
}

const canvasHeight = 64 * 9;
const canvasWidth = 64 * 16;
const playerHeight = 100;
const latMovementSpeed = 375;
const baseGravity = 9.8 * 150;
const megaGravity = baseGravity * 2;
const jumpVelocity = -850;

const SceneRender: React.FC = () => {
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
      context.fillStyle = 'yellow';
      context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      drawPlayer(playerPosRef.current.x, playerPosRef.current.y, context);
    }
  };

  const gravityRef = useRef(baseGravity);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isKeyValid(e.key) && keysPressed[e.key] !== undefined) {
        keysPressed[e.key] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isKeyValid(e.key) && keysPressed[e.key] !== undefined) {
        keysPressed[e.key] = false;
      }
      if (
        e.key === ' ' &&
        playerPosRef.current.y + playerHeight < canvasHeight
      ) {
        gravityRef.current = megaGravity;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const animateRef = useRef<(timestamp: number) => void>(() => {});

  const lastFrameTimeRef = useRef<number | null>(null);

  const velocityRef = useRef(0);

  const previousVelocityRef = useRef(0);

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

    const charBottom = playerPosRef.current.y + playerHeight;
    if (charBottom >= canvasHeight && keysPressed[' ']) {
      velocityRef.current = jumpVelocity;
    }

    if (keysPressed.ArrowRight || keysPressed.d) {
      playerPosRef.current.x += latMovementSpeed * deltaTime;
    }
    if (keysPressed.ArrowLeft || keysPressed.a) {
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
    requestAnimationFrame(animateRef.current);
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
    </div>
  );
};

export default SceneRender;
