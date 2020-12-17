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
    video: document.querySelector("video"),
    film: document.querySelector("[data-film]"),
    film2: document.querySelector("[data-film2]"),
    film3: document.querySelector("[data-film3]"),
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
    // this.#htmlELements.button.addEventListener("click", () => this.#newGame());
    this.#htmlELements.button.addEventListener("click", () =>
      location.reload()
    );
  }

  #newGame() {
    this.#htmlELements.film.style.display = "none";
    this.#htmlELements.film2.style.display = "none";
    this.#htmlELements.film3.style.display = "none";
    this.#htmlELements.modal.classList.add("hide");
    this.#enemiesInterval = 20;
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
    const randomNumber3 = Math.floor(Math.random() * 2) + 1;
    const randomNumber2 = Math.floor(Math.random() * 10) + 1;
    const randomNumber = Math.floor(Math.random() * 3) + 1;

    // randomNumber3 % 2 ?
    randomNumber2 % 10
      ? randomNumber % 3
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
          )
      : this.#createNewEnemy(
          this.#htmlELements.container,
          this.#enemiesInterval * 2.5,
          "enemy--huge",
          "explosion--huge",
          10
        );
    // : this.#createNewEnemy(
    //     this.#htmlELements.container,
    //     this.#enemiesInterval * 2.5,
    //     "enemy--asteroid",
    //     "explosion--big"
    //   );
  }
  #createNewEnemy(...params) {
    const enemy = new Enemy(...params);
    if (this.#enemies.length < 10) {
      enemy.init();
      this.#enemies.push(enemy);
    }
    if (this.#score > 50 && this.#score < 150) {
      this.#createNewEnemy(
        this.#htmlELements.container,
        this.#enemiesInterval * 2.5,
        "enemy--asteroid",
        "explosion--big"
      );
    }
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

      this.#ship.missilesAtom.forEach((missileAtom) => {
        const missileAtomPosition = {
          top: missileAtom.element.offsetTop,
          right:
            missileAtom.element.offsetLeft + missileAtom.element.offsetWidth,
          bottom:
            missileAtom.element.offsetTop + missileAtom.element.offsetHeight,
          left: missileAtom.element.offsetLeft,
        };
        //
        if (missileAtomPosition.bottom === enemyPosition.bottom) {
          this.#enemies.forEach((enemy) => enemy.explode());
          missileAtom.explode();
          missileAtom.remove();

          enemiesArr.splice(enemyIndex, 1);
          this.#updateScore();
        }
        if (missileAtomPosition.bottom < 0) {
          missileAtom.remove();
        }
      });
    });
  }

  #updateScore() {
    this.#score++;
    if (!(this.#score % 10)) {
      this.#enemiesInterval--;
    }

    this.#updateScoreText();
    if (!(this.#score % 100)) {
      this.#livesPlus();
    }
    this.#updateScoreText();
    if (this.#score > 150 && this.#score <= 200) {
      this.#htmlELements.film2.style.display = "none";
      this.#htmlELements.film.style.display = "block";
    }
    if (this.#score > 50 && this.#score <= 150) {
      this.#htmlELements.video.style.display = "none";
      this.#htmlELements.film2.style.display = "block";
    }
    if (this.#score > 200 && this.#score <= 300) {
      this.#htmlELements.film.style.display = "none";
      this.#htmlELements.film3.style.display = "block";
    }
 if (this.#score > 300) {
      this.#htmlELements.film3.style.display = "none";
      this.#htmlELements.video.style.display = "block";
    }
  }

  #livesPlus() {
    this.#lives++;
    this.#updateLivesText();
  }

  #updateLives() {
    this.#lives--;
    this.#updateLivesText();
    this.#htmlELements.container.classList.add("hit");
    setTimeout(() => this.#htmlELements.container.classList.remove("hit"), 100);
    if (!this.#lives) {
      this.#endGame();
    }
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
