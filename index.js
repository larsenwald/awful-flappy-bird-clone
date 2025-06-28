class PillarLogic{
  constructor(){}

  newPillar(){
    return {
      height: Math.floor(Math.random() * 21) + 25, //height clamped to being between 20 and 45 units (which will represent the percentage css height of the pillar element)
      width: 10, //all pillars will be 10% width
      bottom: Math.ceil(Math.random() * 2) === 1 ? true : false //by default, pillars will come from the top, but if bottom is true, it will come from the bottom
    }
  }

  renderPillar(finishJourneyInMilliseconds = 3000, force = null){//sometimes we might want to force a pillar to come from the top or bottom. we can pass `top or `bottom` to the force parameter to do this
    const pillar = this.newPillar();
    const pillarElement = document.createElement(`div`);
    pillarElement.classList.add(`pillar`)

    pillarElement.style.width = `${pillar.width}%`;
    pillarElement.style.height = `${pillar.height}%`;
    let bottomOrTop = `top`;
    if ((pillar.bottom && force !== `top`) || force === `bottom`) {
            pillarElement.classList.add(`pillar-bottom`);
            bottomOrTop = `bottom`;
    };

    document.querySelector(`#game`).appendChild(pillarElement);

    pillarElement.style.animation = `moveLeft ${finishJourneyInMilliseconds/1000}s linear`;
    setTimeout(()=>{
      pillarElement.remove();
    }, finishJourneyInMilliseconds)

    return bottomOrTop;
  }

  interval;

  streamPillars(dontAllowNumberInARow = 3, everyWhatMilliseconds = 500){
    let topInARow = 0;
    let bottomInARow = 0;

    this.interval ??= setInterval(()=>{
      if (topInARow === dontAllowNumberInARow-1){
        topInARow = 0;
        this.renderPillar(undefined, `bottom`)
        bottomInARow++;
        return;
      }
      if (bottomInARow === dontAllowNumberInARow-1){
        bottomInARow = 0;
        this.renderPillar(undefined, `top`)
        topInARow++;
        return;
      }
      this.renderPillar() === `top` ? topInARow++ : bottomInARow++
    }, everyWhatMilliseconds);
  }
  stopPillars(){
    clearInterval(this.interval)
    this.interval = null;
  }
}

class Game{
  constructor(){}
  
}

class Bird{
  constructor(){
  }

  renderBird(){
    const birdElement = document.createElement(`div`);
    birdElement.id = `bird`
    document.querySelector(`#game`).appendChild(birdElement);
  }
}

const pillarLogic = new PillarLogic();
const bird = new Bird();
bird.renderBird();


const birdy = document.querySelector(`#bird`)
const game = document.querySelector(`#game`)

function test(fps=30){
  let position = 0/fps;
  let velocity = 100/fps;
  let acceleration = 9/fps;

  game.addEventListener(`mousedown`, () => {
    velocity = 100/fps;
  })



  setInterval(()=>{
    position += velocity;
    velocity -= acceleration;
    if (position < 0) position = 0;
    if (position > 90){
      position = 90;
      velocity = 0;
    }
    birdy.style.bottom = position + '%';
  }, 1000/fps)
}

test();