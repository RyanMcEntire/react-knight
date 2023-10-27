import { useRef } from 'react';
import { PlayerPhysicsOutputs, ValidKeys } from '../constants/types/types';
import {
  baseGravity,
  megaGravity,
  jumpVelocity,
  latMovementSpeed,
} from '../constants/gameData';

export const usePlayerPhysics = (): PlayerPhysicsOutputs => {
  const setMoveDirection = (keysPressed: Record<ValidKeys, boolean>) => {
    const isLeftPressed = keysPressed.ArrowLeft || keysPressed.KeyA;
    const isRightPressed = keysPressed.ArrowRight || keysPressed.KeyD;

    if (isLeftPressed && !isRightPressed) {
      velocityRef.current.x = -latMovementSpeed;
    } else if (!isLeftPressed && isRightPressed) {
      velocityRef.current.x = latMovementSpeed;
    } else {
      velocityRef.current.x = 0;
    }
  };

  const velocityRef = useRef({ x: 0, y: 0 });
  const previousVelocityRef = useRef({ x: 0, y: 0 });
  const gravityRef = useRef(baseGravity);
  const jumpKeyPressedRef = useRef(false);
  const isGroundedRef = useRef(false);

  const handleJump = () => {
    if (
      Math.abs(velocityRef.current.y) < 0.1 &&
      jumpKeyPressedRef.current === false
    ) {
      jumpKeyPressedRef.current = true;
      velocityRef.current.y = jumpVelocity;
      gravityRef.current = baseGravity;
      handleLeaveGround();
    }
  };
  const handleRelease = () => {
    jumpKeyPressedRef.current = false;
    gravityRef.current = megaGravity;
  };

  const handleLand = () => {
    if (!jumpKeyPressedRef.current && Math.abs(velocityRef.current.y) < 0.1) {
      isGroundedRef.current = true;
      velocityRef.current.y = 0;
      gravityRef.current = baseGravity;
    }
  };

  const handleLeaveGround = () => {
    isGroundedRef.current = false;
  };

  const applyGravity = (deltaTime: number) => {
    if (!isGroundedRef.current) {
      if (previousVelocityRef.current.y <= 0 && velocityRef.current.y > 0) {
        gravityRef.current = megaGravity;
      }
      previousVelocityRef.current.y = velocityRef.current.y;
      velocityRef.current.y += gravityRef.current * deltaTime;
    }
  };

  return {
    handleJump,
    handleRelease,
    handleLand,
    handleLeaveGround,
    applyGravity,
    setMoveDirection,
    previousVelocityRef,
    velocityRef,
    gravityRef,
    isGrounded: isGroundedRef,
  };
};
