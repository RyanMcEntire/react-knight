import { parse2D } from '../utilities/make2dArray';
import { canvasWidth, canvasHeight } from '../constants/gameData';
import drawCollisionBlock from './drawCollisionBlock';
import { useRef } from 'react';

type CollisionProps = {
  levelData: number[];
};

const Collision: React.FC<CollisionProps> = ({ levelData }) => {
  const parsedCollision = parse2D(levelData, canvasWidth);
  const blockSize = 16;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const renderedBlocks = parsedCollision.map((row, i) =>
    row.map((cell, j) => {
      if (cell === 11842) {
        drawCollisionBlock({ x: j * blockSize, y: i * blockSize }, canvasRef);
      }
    })
  );
  return (
    <div>
      <canvas
      className='pixelated collision'
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
      {renderedBlocks}
    </div>
  );
};

export default Collision;
