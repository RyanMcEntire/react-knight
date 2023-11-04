import React, { useEffect, useRef, useState } from 'react';
import { useKeyManager } from '../hooks/useKeysPressed';
import {
  ValidKeys,
  KeysPressedState,
  SpriteAnimationState,
} from '../constants/types/types';
import { usePlayerPhysics } from '../hooks/usePlayerPhysics';
import { useCanvasDrawing } from '../hooks/useCanvasDrawing';
import { useAnimationLoop } from '../hooks/useAnimationLoop';
import {
  canvasHeight,
  canvasWidth,
  scale,
  playerScale,
  playerSpriteHeight,
  playerSpriteWidth,
  groundCheckExpansion,
  hitboxOffset,
  startingPosition,
} from '../constants/gameData';
import collisionArray from '../collision/collisionBlockArray';
import { loadAllAnimations } from '../utilities/handleAnimationData';
import { drawHitbox } from '../collision/handleCollision';
import { useAnimationState } from '../hooks/useAnimationState';

type PlayerProps = {
  offscreenCanvas: HTMLCanvasElement | null;
};

const Player: React.FC<PlayerProps> = ({ offscreenCanvas }) => {
  console.log('Player component rendered');
  const [isLoading, setIsLoading] = useState(true);

  const playerPosRef = useRef(startingPosition); // starting position
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const spriteAnimationRef = useRef<SpriteAnimationState>({
    name: 'idle',
    frame: 1,
    animations: {},
  });

  const { setAnimationState, getAnimationState } = useAnimationState();

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

  useEffect(() => {
    loadAllAnimations()
      .then((animations) => {
        if (!animations['idle']) {
          console.error('Animation data for "idle" is missing');
          return;
        }
        if (
          !animations['idle'].img.complete ||
          animations['idle'].img.naturalHeight === 0
        ) {
          console.error('Failed to load image for animation "idle"');
          return;
        }
        spriteAnimationRef.current.animations = animations;
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load animations', error);
      });
  }, []);

  const getPlayerHitbox = (isGroundCheck: boolean = false) => {
    const hitbox = {
      x: playerPosRef.current.x + hitboxOffset.left,
      y: playerPosRef.current.y + hitboxOffset.top,
      width: playerSpriteWidth - (hitboxOffset.left + hitboxOffset.right),
      height: playerSpriteHeight,
    };
    if (isGroundCheck) {
      hitbox.height += groundCheckExpansion;
    }
    return hitbox;
  };

  const { draw } = useCanvasDrawing({
    canvasRef,
    objectPosition: playerPosRef.current,
    scale: scale * playerScale,
    spriteAnimationRef,
    getPlayerHitbox,
    playerDirectionRef,
    getAnimationState,
  });

  const handleKeyChange = (key: ValidKeys, isPressed: boolean) => {
    if (key === 'Space') {
      if (isPressed) {
        playerPosRef.current.y += 0.01;
        handleJump();
        setAnimationState('jump')
      } else {
        handleRelease();
        handleLand();
        setAnimationState('idle')
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

  if (canvasRef.current) {
    const context = canvasRef.current.getContext('2d');
    drawHitbox(context, getPlayerHitbox());
  }

  const animateRef = useAnimationLoop(
    getPlayerHitbox,
    collisionArray,
    applyGravity,
    playerPosRef,
    velocityRef,
    draw,
    handleLand,
    isGroundedRef,
    spriteAnimationRef,
    getAnimationState,
    setAnimationState
  );

  useEffect(() => {
    if (!isLoading) {
      requestAnimationFrame(animateRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useEffect(() => {
    if (offscreenCanvas) {
      setIsLoading(false);
    }
  }, [offscreenCanvas]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
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
