class PillarLogic{
  constructor(){}

  pillarDeletionTimeouts = [];

  deleted = 0;
  resetDeletedCounter(){
    this.deleted = 0;
  }

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
        this.deleted++;
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

class Collision{

  static check(subject, objects = []){//both the subject and objects parameters take DOM elements
    const sbj = subject.getBoundingClientRect();
  
    for (let i = 0; i < objects.length; i++){
      const obj = objects[i].getBoundingClientRect();

      if (
        sbj.right > obj.left && 
        sbj.left < obj.right &&
        sbj.bottom > obj.top &&
        sbj.top < obj.bottom
      ) return true;
    }

    return false;
  }

}

class Game{

  static refreshInterval;
  static pillarLogic = new PillarLogic();
  static gameElement = document.querySelector(`#game`);

  static start(fps=60){
                const bird = new Bird();
                bird.renderBird();

                const birdy = document.querySelector(`#bird`)
                const score = document.querySelector(`#score`);
                let currentScore = 0;
                score.innerText = currentScore;

                let position = 45;
                let velocity = 0;
                let acceleration = 6/fps;

                Game.gameElement.addEventListener(`mousedown`, () => {
                  if (!Game.refreshInterval){
                    document.querySelector(`#you-lost`).classList.add(`hidden`);
                    document.querySelector(`#restart-prompt`).classList.add(`hidden`);
                    currentScore = 0;
                    position = 45;
                    Game.pillarLogic.resetDeletedCounter();
                    Game.pillarLogic.clearPillars();
                    Game.pillarLogic.streamPillars();

                    Game.refreshInterval = setInterval(()=>{
                          if (Collision.check(birdy, document.querySelectorAll(`.pillar`)))
                            Game.lose();
                          currentScore = Game.pillarLogic.deleted;
                          position += velocity;
                          velocity -= acceleration;
                          if (position < 0) position = 0;
                          if (position > 90){
                            position = 90;
                            velocity = 0;
                          }
                          birdy.style.bottom = position + '%';
                          score.innerText = currentScore;
                    }, 1000/fps);
                  }
                  velocity = 100/fps;
                })
  }

  static lose(){
    clearInterval(Game.refreshInterval);
    Game.refreshInterval = null;
    document.querySelector(`#you-lost`).classList.remove(`hidden`);

    const birdElement = document.querySelector(`#bird`);
    birdElement.classList.remove(`loss-animation`);
    birdElement.getBoundingClientRect(); //force browser reflow
    birdElement.classList.add(`loss-animation`);

    
    Game.gameElement.style.pointerEvents = 'none';
    setTimeout(()=>{
      document.querySelector(`#restart-prompt`).classList.remove(`hidden`);
      Game.gameElement.style.pointerEvents = 'auto';
    }, 2000)

    Game.pillarLogic.stopStream();
    Game.pillarLogic.freezePillars();
  }
}

Game.start();