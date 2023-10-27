import React, { useEffect, useRef, useState } from 'react';
import { useKeyManager } from '../hooks/useKeysPressed';
import { ValidKeys, KeysPressedState } from '../constants/types/types';
import { usePlayerPhysics } from '../hooks/usePlayerPhysics';
import { useCanvasDrawing } from '../hooks/useCanvasDrawing';
import playerSprite from '../assets/characters/idle-01.png';
import { useAnimationLoop } from '../hooks/useAnimationLoop';
import {
  canvasHeight,
  canvasWidth,
  scale,
  playerScale,
  playerSpriteHeight,
  playerSpriteWidth,
} from '../constants/gameData';
import collisionArray from '../collision/collisionBlockArray';

type PlayerProps = {
  offscreenCanvas: HTMLCanvasElement | null;
};

const Player: React.FC<PlayerProps> = () => {
  const [playerImageSrc] = useState<string>(playerSprite);

  const playerPosRef = useRef({ x: 855, y: 320 }); // starting position
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const getPlayerHitbox = () => ({
    width: playerSpriteWidth,
    height: playerSpriteHeight,
  });

  const {
    handleJump,
    handleLeaveGround,
    handleRelease,
    handleLand,
    applyGravity,
    setMoveDirection,
    velocity,
    isGrounded
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
        handleLeaveGround();
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
    getPlayerHitbox,
    collisionArray,
    applyGravity,
    playerPosRef,
    velocity,
    drawPlayer,
    handleLand,
    isGrounded
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
