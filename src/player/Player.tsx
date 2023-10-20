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
import playerSprite from '../assets/characters/attack1_1.png';
import { useAnimationLoop } from '../hooks/useAnimationLoop';

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
    scale * playerScale,
    playerImageSrc
  );

  const checkCollision = (
    x: number,
    y: number,
    canvas: HTMLCanvasElement | null
  ) => {
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        const pixel = context?.getImageData(x, y, 1, 1).data;
        console.log(
          `Pixel RGBA: ${pixel[0]}, ${pixel[1]}, ${pixel[2]}, ${pixel[3]}`
        );
        console.log(
          'player position',
          playerPosRef.current.x,
          playerPosRef.current.y
        );
        // if (pixel[0] === 255 && pixel[1] === 0 && pixel[2] === 0) {
        //   console.log('collision detected');
        // }
      }
    }
  };

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
