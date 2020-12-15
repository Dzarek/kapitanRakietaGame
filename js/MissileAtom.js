export class MissileAtom {
  constructor(x, y, container) {
    this.x = x;
    this.y = y;
    this.container = container;
    this.element = document.createElement("div");
    this.interval = null;

    // this.intervalTime = intervalTime;
  }

  init() {
    this.element.classList.add("missileAtom");
    this.container.appendChild(this.element);
    this.element.style.left = `${this.x - this.element.offsetWidth / 2}px`;
    this.element.style.top = `${this.y - this.element.offsetHeight}px`;
    this.interval = setInterval(
      () => (this.element.style.top = `${this.element.offsetTop - 1}px`),
      5
    );
  }

  remove() {
    clearInterval(this.interval);
    this.element.remove();
  }
  explode() {
    this.element.classList.remove("missileAtom");
    this.element.classList.add("explosion--huge");
    this.remove();

    clearInterval(this.interval);

    setTimeout(() => this.element.remove(), 600);
  }
}
