import React from 'react';
import { scale } from '../constants/gameData';

function drawCollisionBlock(
  position: { x: number; y: number },
  canvasRef: React.RefObject<HTMLCanvasElement>
) {
  const width = 32;
  const height = 32;
  const x = position.x * scale;
  const y = position.y * scale;
  const color = 'red';
  const context = canvasRef.current?.getContext('2d');

  if (context && canvasRef.current) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
  }
}

export default drawCollisionBlock;
