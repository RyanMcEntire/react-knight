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
  playerSpriteTrueHeight,
  playerSpriteTrueWidth,
  groundCheckExpansion,
  hitboxOffset,
  startingPosition,
} from '../constants/gameData';
import collisionArray from '../collision/collisionBlockArray';
import { drawPlayerCustom } from './drawPlayerCustom';

type PlayerProps = {
  offscreenCanvas: HTMLCanvasElement | null;
};

const Player: React.FC<PlayerProps> = () => {
  const [playerImageSrc] = useState<string>(playerSprite);

  const playerPosRef = useRef(startingPosition); // starting position
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const getPlayerHitbox = (isGroundCheck: boolean = false) => {
    const hitbox = {
      x: playerPosRef.current.x + hitboxOffset.left,
      y: playerPosRef.current.y,
      width: playerSpriteWidth - (hitboxOffset.left + hitboxOffset.right),
      height: playerSpriteHeight,
    };
    if (isGroundCheck) {
      hitbox.height += groundCheckExpansion;
    }
    return hitbox;
  };
  // const getPlayerHitbox = () => ({width: playerSpriteWidth,
  //     height: playerSpriteHeight

  // });

  const {
    handleJump,
    handleRelease,
    handleLand,
    applyGravity,
    setMoveDirection,
    velocityRef,
    isGroundedRef,
    playerDirectionRef,
  } = usePlayerPhysics();

  const { draw: drawPlayer, isImageLoaded } = useCanvasDrawing({
    canvasRef: canvasRef,
    objectPosition: playerPosRef.current,
    scale: scale * playerScale,
    imgSrc: playerImageSrc,
    customDraw: (context, img) =>
      drawPlayerCustom({
        context,
        img,
        playerDirection: playerDirectionRef.current,
        playerWidth: playerSpriteTrueWidth,
        playerHeight: playerSpriteTrueHeight,
      }),
  });

  const handleKeyChange = (key: ValidKeys, isPressed: boolean) => {
    if (key === 'Space') {
      console.log('player positioning before jump', playerPosRef.current);
      if (isPressed) {
        playerPosRef.current.y += 0.01;
        handleJump();
      } else {
        handleRelease();
        handleLand();
      }
      console.log('player positioning after jump', playerPosRef.current);
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
    velocityRef,
    drawPlayer,
    handleLand,
    isGroundedRef
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
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
    </>
  );
};

export default Player;
