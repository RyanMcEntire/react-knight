import Player from './player/Player';
import Background from './sprites/Background';
import backgroundLevel1 from './assets/backgrounds/first-background-level.png';
import './css/renderStyle.css';
import { canvasHeight, canvasWidth } from './constants/gameData';
import CollisionCanvas from './collision/CollisionCanvas';
import collisionsLevel1 from './constants/levelData/collisions-lvl-1';
import { useEffect, useMemo, useRef, useState } from 'react';

function Game() {
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
const [isCanvasReady, setIsCanvasReady] = useState(false);

  console.log('game component');
  const levelData = collisionsLevel1;
  
  useEffect(() => {
    if (offscreenCanvasRef.current) {
      setIsCanvasReady(true);
    }
  }, []);

  const gameStyle = useMemo<React.CSSProperties>(
    () => ({
      position: 'relative',
      width: canvasWidth,
      height: canvasHeight,
    }),
    []
  );

  return (
    <>
      <div className="game" style={gameStyle}>
        <CollisionCanvas
          levelData={levelData}
          onCanvasReady={(canvas) => {
            offscreenCanvasRef.current = canvas;
          }}
        />
        save
        <Background imageSrc={backgroundLevel1} position={{ x: 0, y: 0 }} />
        {isCanvasReady && (
          <Player offscreenCanvas={offscreenCanvasRef.current} />
        )}
      </div>
    </>
  );
}

export default Game;
