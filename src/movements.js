class KeyMovements {
  constructor() {
    this.movement = {};
    window.addEventListener('keydown', this.down.bind(this));
    window.addEventListener('keyup', this.up.bind(this));
  }

  down(e) {
    if (this.movement[e.keyCode]) return;
    this.movement[e.keyCode] = true;
    console.log('key down: ', e.key, ' keycode: ', e.keyCode);
  }

  up(e) {
    this.movement[e.keyCode] = false;
    console.log('key down: ', e.key, ' keycode: ', e.keyCode);
  }

  isPressed(keycode) {
    return this.movement[keycode] ? this.movement[keycode] : false;
  }
}

const Movements = new KeyMovements();
export default Movements;
