import { Missile } from "./Missile.js";

export class Spaceship {
  missiles = [];
  #modifier = 7;
  #leftArrow = false;
  #rightArrow = false;
  #upArrow = false;
  #downArrow = false;
  constructor(element, container) {
    this.element = element;
    this.container = container;
  }

  init() {
    this.setPosition();
    this.#eventListeners();
    this.#gameLoop();
  }
  setPosition() {
    this.element.style.bottom = "0px";
    this.element.style.left = `${
      window.innerWidth / 2 - this.#getPosition()
    }px`;
  }
  #getPosition() {
    return this.element.offsetLeft + this.element.offsetWidth / 2;
  }
  #touching() {
    if (this.#getPosition() + 12 < window.innerWidth) {
      this.element.style.left = `${
        parseInt(this.element.style.left, 10) + 10
      }px`;
    }
  }
  #eventListeners() {
    const btnS = document.createElement("button");
    this.container.appendChild(btnS);
    btnS.classList.add("shoot");
    btnS.style.backgroundImage = "url(images/3.png)";
    btnS.addEventListener("touchend", () => {
      this.#shot();
    });

    const leftMove = document.createElement("button");
    this.container.appendChild(leftMove);
    leftMove.classList.add("leftMove");
    leftMove.style.backgroundImage = "url(images/1.png)";
    leftMove.addEventListener("touchstart", () => {
      this.#leftArrow = true;
    });
    leftMove.addEventListener("touchend", () => {
      this.#leftArrow = false;
    });

    const rightMove = document.createElement("button");
    this.container.appendChild(rightMove);
    rightMove.classList.add("rightMove");
    // rightMove.innerHTML = "R";
    rightMove.style.backgroundImage = "url(images/1.png)";
    rightMove.addEventListener("touchstart", () => {
      this.#rightArrow = true;
    });
    rightMove.addEventListener("touchend", () => {
      this.#rightArrow = false;
    });

    const upMove = document.createElement("button");
    this.container.appendChild(upMove);
    upMove.classList.add("upMove");
    upMove.style.backgroundImage = "url(images/1.png)";
    upMove.addEventListener("touchstart", () => {
      this.#upArrow = true;
    });
    upMove.addEventListener("touchend", () => {
      this.#upArrow = false;
    });

    const downMove = document.createElement("button");
    this.container.appendChild(downMove);
    downMove.classList.add("downMove");
    downMove.style.backgroundImage = "url(images/1.png)";
    downMove.addEventListener("touchstart", () => {
      this.#downArrow = true;
    });
    downMove.addEventListener("touchend", () => {
      this.#downArrow = false;
    });

    window.addEventListener("keydown", ({ keyCode }) => {
      switch (keyCode) {
        case 37:
          this.#leftArrow = true;
          break;
        case 39:
          this.#rightArrow = true;
          break;
        case 38:
          this.#upArrow = true;
          break;
        case 40:
          this.#downArrow = true;
          break;
      }
    });
    window.addEventListener("keyup", ({ keyCode }) => {
      switch (keyCode) {
        case 32:
          this.#shot();
          break;
        case 37:
          this.#leftArrow = false;
          break;
        case 39:
          this.#rightArrow = false;
          break;
        case 38:
          this.#upArrow = false;
          break;
        case 40:
          this.#downArrow = false;
          break;
      }
    });
  }
  #gameLoop = () => {
    this.#whatKey();
    requestAnimationFrame(this.#gameLoop);
  };
  #whatKey() {
    if (this.#leftArrow && this.#getPosition() > 12) {
      this.element.style.left = `${
        parseInt(this.element.style.left, 10) - this.#modifier
      }px`;
    }
    if (this.#rightArrow && this.#getPosition() + 12 < window.innerWidth) {
      this.element.style.left = `${
        parseInt(this.element.style.left, 10) + this.#modifier
      }px`;
    }
    if (this.#upArrow && this.element.style.bottom !== "500px") {
      this.element.style.bottom = `${
        parseInt(this.element.style.bottom, 10) + this.#modifier
      }px`;
    }
    if (this.#downArrow && this.element.style.bottom !== "0px") {
      this.element.style.bottom = `${
        parseInt(this.element.style.bottom, 10) - this.#modifier
      }px`;
    }
  }

  #shot() {
    const missile = new Missile(
      this.#getPosition(),
      this.element.offsetTop,
      this.container
    );
    missile.init();
    this.missiles.push(missile);
  }
}
