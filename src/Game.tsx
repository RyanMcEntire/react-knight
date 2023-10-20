import Player from './player/Player';
import Background from './sprites/Background';
import backgroundLevel1 from './assets/backgrounds/first-map.png';
import './css/renderStyle.css';
import { canvasHeight, canvasWidth } from './constants/gameData';
import Collision from './collision/Collision';
import collisionsLevel1 from './constants/levelData/collisions-lvl-1';
import { useRef } from 'react';

function Game() {
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null)

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
        <Collision
          levelData={levelData}
          onCanvasReady={(canvas) => {
            console.log('Setting offscreen canvas ref!');
            offscreenCanvasRef.current = canvas
          }}
        />
        <Background imageSrc={backgroundLevel1} position={{ x: 0, y: 0 }} />

        {offscreenCanvasRef.current && <Player offscreenCanvas={offscreenCanvasRef.current} />}
      </div>
    </>
  );
}

export default Game;
