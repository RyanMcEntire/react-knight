import { parse2D } from '../utilities/make2dArray';
import { canvasWidth, canvasHeight, tileSize } from '../constants/gameData';
import drawCollisionBlock from './drawCollisionBlock';
import React, { useEffect } from 'react';

type CollisionProps = {
  levelData: number[];
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
};

const Collision = React.memo(({ levelData, onCanvasReady }: CollisionProps) => {
  const parsedCollision = parse2D(levelData, canvasWidth);

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
              { x: j * tileSize, y: i * tileSize },
              offscreenContext
            );
          }
        }
      })
    );
    onCanvasReady(offscreenCanvas);
    if (offscreenCanvas) console.log('canvas ready!');
    const game = document.querySelector('.game');
    if (game) {
      game.appendChild(offscreenCanvas);
      offscreenCanvas.style.position = 'absolute';
      offscreenCanvas.style.top = '0px';
      offscreenCanvas.style.left = '0px';
      console.log('game element found!');
    }
    // offscreenCanvas.style.transform = `translateX(-224) translateY(-192)`;
    return () => {
      offscreenCanvas.remove();
    };
  }, [onCanvasReady, parsedCollision]);

  return null;
});

export default Collision;
