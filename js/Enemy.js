// import { EnemyMissile } from "./EnemyMissile.js";

export class Enemy {
  // enemyMissiles = [];
  constructor(container, intervalTime, enemyClass, explosionClass, lives = 1) {
    this.container = container;
    this.element = document.createElement("div");
    this.enemyClass = enemyClass;
    this.explosionClass = explosionClass;
    this.interval = null;
    this.intervalTime = intervalTime;
    this.lives = lives;
  }
  init() {
    this.#setEnemy();
    this.#updatePosition();
    // this.#enemyBullet();
  }
  #setEnemy() {
    this.element.classList.add(this.enemyClass);
    this.container.appendChild(this.element);
    this.element.style.top = "10px";
    this.element.style.left = `${this.#randomPosition()}px`;
  }

  #randomPosition() {
    return Math.floor(
      Math.random() * (window.innerWidth - this.element.offsetWidth)
    );
  }
  #updatePosition() {
    this.interval = setInterval(
      () => this.#setNewPosition(),
      this.intervalTime
    );
  }
  #setNewPosition() {
    this.element.style.top = `${this.element.offsetTop + 1}px`;
  }
  hit() {
    this.lives--;
    if (!this.lives) {
      this.explode();
    }
  }
  explode() {
    this.element.classList.remove(this.enemyClass);
    this.element.classList.add(this.explosionClass);
    clearInterval(this.interval);
    const animationTime = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--explosion-animation-time"
      ),
      10
    );
    setTimeout(() => this.element.remove(), animationTime);
  }
  // #shot() {
  //   const enemyMissile = new EnemyMissile(
  //     this.#setNewPosition(),
  //     this.element.offsetTop,
  //     this.container
  //   );
  //   if (this.enemyMissiles.length < 20) {
  //     enemyMissile.init();
  //     this.enemyMissiles.push(enemyMissile);
  //   }
  // }

  // #enemyBullet() {
  //   if ((this.element.style.top = "100px")) {
  //     this.#shot();
  //   }
  // }
}
