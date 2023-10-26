import Player from './player/Player';
import Background from './sprites/Background';
import backgroundLevel1 from './assets/backgrounds/first-background-level.png';
import './css/renderStyle.css';
import { canvasHeight, canvasWidth } from './constants/gameData';
import CollisionCanvas from './collision/CollisionCanvas';
import collisionsLevel1 from './constants/levelData/collisions-lvl-1';
import { useRef } from 'react';

function Game() {
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const levelData = collisionsLevel1;

  return (
    <>
      <div
        className="game"
        style={{
          position: 'relative',
          width: canvasWidth,
          height: canvasHeight,
        }}
      >
        <CollisionCanvas
          levelData={levelData}
          onCanvasReady={(canvas) => {
            offscreenCanvasRef.current = canvas;
          }}
        />
        <Background imageSrc={backgroundLevel1} position={{ x: 0, y: 0 }} />
        {offscreenCanvasRef.current && (
          <Player offscreenCanvas={offscreenCanvasRef.current} />
        )}
      </div>
    </>
  );
}

export default Game;
