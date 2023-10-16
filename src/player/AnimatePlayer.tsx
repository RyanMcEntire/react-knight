import React, { useEffect, useRef, useState } from 'react';
import { useKeyManager } from '../hooks/useKeysPressed';
import { ValidKeys, KeysPressedState } from '../constants/types/types';
import { usePlayerPhysics } from '../hooks/usePlayerPhysics';
import { useCanvasDrawing } from '../hooks/useCanvasDrawing';
import {
  canvasHeight,
  canvasWidth,
  scale,
} from '../constants/gameData';
import playerSprite from '../assets/characters/attack1_1.png';
import { useAnimationLoop } from '../hooks/useAnimationLoop';

const AnimatePlayer: React.FC = () => {
  const [playerImageSrc] = useState<string>(playerSprite);

  const playerPosRef = useRef({ x: 100, y: 100 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const {
    handleJump,
    handleRelease,
    handleLand,
    applyGravity,
    setMoveDirection,
    velocity,
  } = usePlayerPhysics();

  const { draw: drawPlayer, isImageLoaded } = useCanvasDrawing(
    canvasRef,
    playerPosRef.current,
    scale,
    playerImageSrc
  );

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

  const animateRef = useAnimationLoop(
    applyGravity,
    playerPosRef,
    velocity,
    drawPlayer
  )

  useEffect(() => {
    if (isImageLoaded) {
      requestAnimationFrame(animateRef.current);
    }
  }, [isImageLoaded]);

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
