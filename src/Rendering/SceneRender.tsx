import React, { useEffect, useRef } from 'react';
import drawPlayer from './drawPlayer';

type ValidKeys = 'ArrowRight' | 'd' | 'ArrowLeft' | 'a';

const keysPressed: Record<ValidKeys, boolean> = {
  ArrowRight: false,
  d: false,
  ArrowLeft: false,
  a: false,
};

function isKeyValid(key: string): key is ValidKeys {
  return (
    key === 'ArrowRight' || key === 'd' || key === 'ArrowLeft' || key === 'a'
  );
}

const canvasHeight = 64 * 9;
const canvasWidth = 64 * 16;

const SceneRender: React.FC = () => {
  const playerPosRef = useRef({ x: 100, y: 200 });
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

  animateRef.current = (timestamp: number) => {
    if (lastFrameTimeRef.current === null) {
      lastFrameTimeRef.current = timestamp;
    }

    const deltaTime = (timestamp - lastFrameTimeRef.current) / 1000;
    lastFrameTimeRef.current = timestamp;

    const latMovementSpeed = 375;
    const gravitySpeed = 500;
    const charBottom = playerPosRef.current.y + 100;
    const newBottom = charBottom + gravitySpeed * deltaTime;

    if (keysPressed.ArrowRight || keysPressed.d) {
      playerPosRef.current.x += latMovementSpeed * deltaTime;
    }
    if (keysPressed.ArrowLeft || keysPressed.a) {
      playerPosRef.current.x -= latMovementSpeed * deltaTime;
    }

    if (newBottom > canvasHeight) {
      playerPosRef.current.y = gravitySpeed - deltaTime;
    } else {
      playerPosRef.current.y += gravitySpeed * deltaTime;
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
