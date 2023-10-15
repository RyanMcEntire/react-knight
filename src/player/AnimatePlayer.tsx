import React, { useEffect, useRef } from 'react';
import { playerImg, drawPlayerOnCanvas } from './drawPlayer';
import { useKeyManager } from '../hooks/useKeysPressed';
import { ValidKeys, KeysPressedState } from '../constants/types/types';
import { usePlayerPhysics } from '../hooks/usePlayerPhysics';
import { canvasHeight, canvasWidth, playerHeight } from '../constants/gameData';

const AnimatePlayer: React.FC = () => {
  const playerPosRef = useRef({ x: 100, y: 100 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animateRef = useRef<(timestamp: number) => void>(() => {});
  const lastFrameTimeRef = useRef<number | null>(null);
  const deltaTimeRef = useRef<number>(0);

  const {
    handleJump,
    handleRelease,
    handleLand,
    applyGravity,
    setMoveDirection,
    velocity,
  } = usePlayerPhysics();

  const handleKeyChange = (key: ValidKeys, isPressed: boolean) => {
    if (key === 'Space') {
      if (isPressed) {
        handleJump();
      } else {
        handleRelease();
        handleLand();
      }
    }
  };

  const handleKeysChanged = (keys: KeysPressedState) => {
    setMoveDirection(keys);
  };

  const keysPressed: KeysPressedState = useKeyManager(
    handleKeyChange,
    handleKeysChanged
  );

  useEffect(() => {
    setMoveDirection(keysPressed);
  }, [keysPressed, setMoveDirection]);

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
