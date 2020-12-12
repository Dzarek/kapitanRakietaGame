import { Spaceship } from "./Spaceship.js";
import { Enemy } from "./Enemy.js";

class Game {
  #htmlELements = {
    spaceship: document.querySelector("[data-spaceship]"),
    container: document.querySelector("[data-container]"),
    score: document.querySelector("[data-score]"),
    lives: document.querySelector("[data-lives]"),
    modal: document.querySelector("[data-modal]"),
    scoreInfo: document.querySelector("[data-score-info]"),
    button: document.querySelector("[data-button]"),
  };
  #ship = new Spaceship(
    this.#htmlELements.spaceship,
    this.#htmlELements.container
  );
  #enemies = [];
  #lives = null;
  #score = null;
  #enemiesInterval = null;
  #checkPositionInterval = null;
  #createEnemyInterval = null;

  init() {
    this.#ship.init();
    this.#newGame();
    this.#htmlELements.button.addEventListener("click", () => this.#newGame());
  }

  #newGame() {
    this.#htmlELements.modal.classList.add("hide");
    this.#enemiesInterval = 30;
    this.#lives = 3;
    this.#score = 0;
    this.#updateLivesText();
    this.#updateScoreText();
    this.#ship.element.style.left = "0px";
    this.#ship.setPosition();
    this.#createEnemyInterval = setInterval(() => this.#randomNewEnemy(), 2000);
    this.#checkPositionInterval = setInterval(() => this.#checkPosition(), 1);
  }

  #endGame() {
    this.#htmlELements.modal.classList.remove("hide");
    this.#htmlELements.scoreInfo.textContent = `You loose! Your score is: ${
      this.#score
    }`;
    this.#enemies.forEach((enemy) => enemy.explode());
    this.#enemies.length = 0;
    clearInterval(this.#createEnemyInterval);
    clearInterval(this.#checkPositionInterval);
  }

  #randomNewEnemy() {
    const randomNumber = Math.floor(Math.random() * 5) + 1;
    randomNumber % 5
      ? this.#createNewEnemy(
          this.#htmlELements.container,
          this.#enemiesInterval,
          "enemy",
          "explosion"
        )
      : this.#createNewEnemy(
          this.#htmlELements.container,
          this.#enemiesInterval * 2,
          "enemy--big",
          "explosion--big",
          3
        );
  }
  #createNewEnemy(...params) {
    const enemy = new Enemy(...params);
    enemy.init();
    this.#enemies.push(enemy);
  }

  #checkPosition() {
    this.#enemies.forEach((enemy, enemyIndex, enemiesArr) => {
      const enemyPosition = {
        top: enemy.element.offsetTop,
        right: enemy.element.offsetLeft + enemy.element.offsetWidth,
        bottom: enemy.element.offsetTop + enemy.element.offsetHeight,
        left: enemy.element.offsetLeft,
      };
      const shipPosition = {
        top: this.#ship.element.offsetTop,
        right: this.#ship.element.offsetLeft + this.#ship.element.offsetWidth,
        bottom: this.#ship.element.offsetTop + this.#ship.element.offsetHeight,
        left: this.#ship.element.offsetLeft,
      };
      if (
        enemyPosition.top > window.innerHeight ||
        (shipPosition.bottom >= enemyPosition.top &&
          shipPosition.top <= enemyPosition.bottom &&
          shipPosition.right >= enemyPosition.left &&
          shipPosition.left <= enemyPosition.right)
      ) {
        enemy.explode();
        enemiesArr.splice(enemyIndex, 1);
        this.#updateLives();
      }
      this.#ship.missiles.forEach((missile, missileIndex, missileArr) => {
        const missilePosition = {
          top: missile.element.offsetTop,
          right: missile.element.offsetLeft + missile.element.offsetWidth,
          bottom: missile.element.offsetTop + missile.element.offsetHeight,
          left: missile.element.offsetLeft,
        };
        if (
          missilePosition.bottom >= enemyPosition.top &&
          missilePosition.top <= enemyPosition.bottom &&
          missilePosition.right >= enemyPosition.left &&
          missilePosition.left <= enemyPosition.right
        ) {
          enemy.hit();
          if (!enemy.lives) {
            enemiesArr.splice(enemyIndex, 1);
          }
          missile.remove();
          missileArr.splice(missileIndex, 1);
          this.#updateScore();
        }
        if (missilePosition.bottom < 0) {
          missile.remove();
          missileArr.splice(missileIndex, 1);
        }
      });
    });
  }
  #updateScore() {
    this.#score++;
    if (!(this.#score % 5)) {
      this.#enemiesInterval--;
    }
    this.#updateScoreText();
  }
  #updateLives() {
    this.#lives--;
    this.#updateLivesText();
    this.#htmlELements.container.classList.add("hit");
    setTimeout(() => this.#htmlELements.container.classList.remove("hit"), 100);
    if (!this.#lives) {
      this.#endGame();
    }
    // if (!(this.#score % 5))
  }
  #updateScoreText() {
    this.#htmlELements.score.textContent = `Score: ${this.#score}`;
  }
  #updateLivesText() {
    this.#htmlELements.lives.textContent = `Lives: ${this.#lives}`;
  }
}

window.onload = function () {
  const game = new Game();
  game.init();
};
