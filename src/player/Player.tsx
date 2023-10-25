import React, { useEffect, useRef, useState } from 'react';
import { useKeyManager } from '../hooks/useKeysPressed';
import { ValidKeys, KeysPressedState } from '../constants/types/types';
import { usePlayerPhysics } from '../hooks/usePlayerPhysics';
import { useCanvasDrawing } from '../hooks/useCanvasDrawing';
import {
  canvasHeight,
  canvasWidth,
  scale,
  playerScale,
} from '../constants/gameData';
import playerSprite from '../assets/characters/idle-01.png';
import { useAnimationLoop } from '../hooks/useAnimationLoop';
import { checkCollision } from '../collision/checkCollision';

type PlayerProps = {
  offscreenCanvas: HTMLCanvasElement | null;
};

const Player: React.FC<PlayerProps> = ({ offscreenCanvas }) => {
  console.log('Player render - offscreenCanvas:', offscreenCanvas);

  useEffect(() => {
    if (offscreenCanvas) {
      // Do whatever you need with the offscreenCanvas
      // For example, if you want to log when it's available:
      console.log('offscreenCanvas is now available!');
    }
  }, [offscreenCanvas]);
  const [playerImageSrc] = useState<string>(playerSprite);

  const playerPosRef = useRef({ x: 0, y: 0 });
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
    scale * playerScale,
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
    drawPlayer,
    () =>
      checkCollision(
        playerPosRef.current.x,
        playerPosRef.current.y,
        offscreenCanvas
      ),
    offscreenCanvas
  );

  useEffect(() => {
    if (isImageLoaded) {
      requestAnimationFrame(animateRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isImageLoaded]);

  return (
    <>
      <canvas
        className="pixelated"
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
    </>
  );
};

export default Player;
