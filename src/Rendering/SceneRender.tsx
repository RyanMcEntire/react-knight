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

const movementSpeed = 375;

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

    if (keysPressed.ArrowRight || keysPressed.d) {
      playerPosRef.current.x += movementSpeed * deltaTime;
    }
    if (keysPressed.ArrowLeft || keysPressed.a) {
      playerPosRef.current.x -= movementSpeed * deltaTime;
    }
    draw();
    requestAnimationFrame(animateRef.current);
  };

  useEffect(() => {
    requestAnimationFrame(animateRef.current);
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} width={64 * 16} height={64 * 9} />
    </div>
  );
};

export default SceneRender;
