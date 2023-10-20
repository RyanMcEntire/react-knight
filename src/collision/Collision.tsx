import { parse2D } from '../utilities/make2dArray';
import { canvasWidth, canvasHeight } from '../constants/gameData';
import drawCollisionBlock from './drawCollisionBlock';
import React, { useEffect } from 'react';

type CollisionProps = {
  levelData: number[];
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
};

const Collision = React.memo(({ levelData, onCanvasReady }: CollisionProps) => {
  const parsedCollision = parse2D(levelData, canvasWidth);
  const blockSize = 16;

  useEffect(() => {
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = canvasWidth;
    offscreenCanvas.height = canvasHeight;
    const offscreenContext = offscreenCanvas.getContext('2d', {
      willReadFrequently: true,
    });

    parsedCollision.map((row, i) =>
      row.map((cell, j) => {
        if (cell === 11842) {
          if (offscreenContext) {
            drawCollisionBlock(
              { x: j * blockSize, y: i * blockSize },
              offscreenContext
            );
          }
        }
      })
    );
    onCanvasReady(offscreenCanvas);
    if (offscreenCanvas) console.log('canvas ready!');
    document.body.appendChild(offscreenCanvas);
    offscreenCanvas.style.position = 'absolute';
    offscreenCanvas.style.top = '0px';
    offscreenCanvas.style.left = '0px';
    return () => {
      offscreenCanvas.remove();
    };
  }, [onCanvasReady, parsedCollision]);

  return null;
});

export default Collision;
