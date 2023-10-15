import AnimatePlayer from './player/AnimatePlayer';
import Background from './sprites/Background';
import backgroundLevel1 from './assets/backgrounds/uhhh-map1.png';
import './css/renderStyle.css'

const canvasWidth = 32 * 16;
const canvasHeight = 32 * 9;

function Game() {
  return (
    <>
      <div>Hello world</div>
      <div className='game'
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
