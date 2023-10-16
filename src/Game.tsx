import AnimatePlayer from './player/AnimatePlayer';
import Background from './sprites/Background';
import backgroundLevel1 from './assets/backgrounds/first-map.png';
import './css/renderStyle.css';
import { canvasHeight, canvasWidth } from './constants/gameData';

function Game() {
  return (
    <>
      <div>Hello world</div>
      <div
        className="game"
        style={{
          position: 'relative',
          width: canvasWidth,
          height: canvasHeight,
        }}
      >
        <Background imageSrc={backgroundLevel1} position={{ x: 0, y: 0 }} />
        <AnimatePlayer />
      </div>
    </>
  );
}

export default Game;
