import { parse2D } from '../utilities/parse2D';
import {
  canvasWidth,
  canvasHeight,
  tileSize,
  gameWidth,
} from '../constants/gameData';
import drawCollisionBlock from './drawCollisionBlock';
import React, { useEffect } from 'react';

type CollisionCanvasProps = {
  levelData: number[];
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
};

const CollisionCanvas = React.memo(
  ({ levelData, onCanvasReady }: CollisionCanvasProps) => {
    const parsedCollision = parse2D(levelData, gameWidth);

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
      const game = document.querySelector('.game');
      if (game) {
        game.appendChild(offscreenCanvas);
        offscreenCanvas.style.position = 'absolute';
        offscreenCanvas.style.top = '0px';
        offscreenCanvas.style.left = '0px';
        offscreenCanvas.style.opacity = '0';
      }
      return () => {
        offscreenCanvas.remove();
      };
    }, [onCanvasReady, parsedCollision]);

    return null;
  }
);

export default CollisionCanvas;
