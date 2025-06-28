class PillarLogic{
  constructor(){}

  pillarDeletionTimeouts = [];

  freezePillars(){
    this.pillarDeletionTimeouts.forEach(timeOut => clearTimeout(timeOut));
    document.querySelectorAll(`.pillar`).forEach(pillar => {
      const rightOffset = getComputedStyle(pillar).right;
      pillar.style.removeProperty(`animation`);
      pillar.style.right = rightOffset;
    })
  }

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


    const timeOutId = setTimeout(
      ()=>{
        pillarElement.remove();
        const index = this.pillarDeletionTimeouts.indexOf(timeOutId);
        if (index > -1) 
          this.pillarDeletionTimeouts.splice(index, 1);
      }, finishJourneyInMilliseconds);

    this.pillarDeletionTimeouts.push(timeOutId);

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
  stopStream(){
    clearInterval(this.interval)
    this.interval = null;
  }

  clearPillars(){
    document.querySelectorAll(`.pillar`).forEach(pillar => pillar.remove());
  }
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

class Game{

  static refreshInterval;
  static pillarLogic = new PillarLogic();

  static start(fps=60){
                const bird = new Bird();
                bird.renderBird();


                const birdy = document.querySelector(`#bird`)
                const game = document.querySelector(`#game`)


                let position = 45;
                let velocity = 0;
                let acceleration = 6/fps;

                game.addEventListener(`mousedown`, () => {
                  if (!Game.refreshInterval){
                    this.pillarLogic.clearPillars();
                    position = 45;
                    Game.pillarLogic.streamPillars();
                    Game.refreshInterval = setInterval(()=>{
                          position += velocity;
                          velocity -= acceleration;
                          if (position < 0) position = 0;
                          if (position > 90){
                            position = 90;
                            velocity = 0;
                          }
                          birdy.style.bottom = position + '%';
                    }, 1000/fps);
                  }
                  velocity = 100/fps;
                })
  }

  static lose(){
    clearInterval(Game.refreshInterval);
    Game.refreshInterval = null;

    Game.pillarLogic.stopStream();
    Game.pillarLogic.freezePillars();
  }
}

function startGame(){
  Game.start();
}

startGame();