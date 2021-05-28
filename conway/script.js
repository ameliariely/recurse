/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints a message in the browser's dev tools console
console.log("Hello 🌎");

console.log("amelia");

class BoardViz {
  mount(parentSelector, board) {
    const $parent = document.querySelector(parentSelector);
    this.divs = [];
    for (let y = 0; y < board.width; y++) {
      const $row = div('row');
      this.divs.push([]);
      for (let x = 0; x < board.width; x++) {
        const $cell = div('cell');
        $row.appendChild($cell);
        if (board.cells[y][x].value === 1) {
          $cell.classList.add('alive');
        }
        this.divs[y].push($cell);
      }
      $parent.appendChild($row);
    }     
  }
  update(board) {
    if (!this.divs) {
      throw new Error('Board must be mounted first!');
    }
    this.divs.forEach((rows, y) => {
      rows.forEach((div, x) => {
        if (board.cells[y][x].value === 1) {
          div.classList.add('alive');
        } else {
          div.classList.remove('alive');
        }
      });
    });
  }
}

class Cell { 
  constructor() {
    this.value = 0;
    this.nextValue = null;
    this.neighbors = [];
  }

  prepare() { 
    const aliveCount = this.neighbors
        .map(cell => cell.value)
        .reduce((acc, n, i) => acc+n, 0);
    this.aliveCount = aliveCount;
    
    // 2-3 survives = this.value
    // exactly 3 comes back to life = 1
    // otherwise dies = 0
    switch (aliveCount) {
      case 3:
        this.nextValue = 1;
        break;
      case 2:
        this.nextValue = this.value;
        break;
      default: 
        this.nextValue = 0;
    }
  }
  update() {
    if (this.nextValue != null) {
          this.value = this.nextValue;
    } else {
      throw new Error('MUST RUN PREPARE FIRST');
    }
    this.nextValue = null;
  }
  
  addNeighbor(cell) {
    this.neighbors.push(cell);
  }
}

class Board {
  constructor(width, presenter) {
    this._loopInterval = null;
    this.width = width;
    this.presenter = presenter;
    
    this.cells = this.makeCells(width);
    this.assignNeighbors();
  }
  
  makeCells(width) {
    return Array(width).fill().map(() => 
      Array(width).fill().map(() => new Cell()),
    );
  }
  update() {
    this.each(cell => cell.prepare());
    this.each(cell => cell.update());
    this.presenter.update(this);
    console.log(this);
  }
  assignNeighbors() {
    this.each((cell, x, y) => {
      let offsets = [-1, 0, 1]; // <-- this was the error (we needed 0), otherwise it was ONLY diagonals
      for (let ox of offsets) {
        for (let oy of offsets) {
          if (!ox && !oy) continue; // <-- just skip if it's the present cell
          const maybeNeighbor = this.cells[y+oy] && this.cells[y+oy][x+ox];
          if (maybeNeighbor === undefined) continue;
          cell.addNeighbor(maybeNeighbor);
        }
      }
    });
  }
  each(cb) {
    this.cells.forEach((row, y) => row.forEach((cell, x) => cb(cell, x, y)));
  }
  loop(delay) {
    this._loopInterval = window.setInterval(() => {
      this.update();
    }, delay);
  }
  stopLoop() {
    window.clearInterval(this._loopInterval);
  }
  randomStart(threshold) {
    this.each((cell) => {
      cell.value = (Math.random() <= threshold) ? 1 : 0;
    })
    this.presenter.mount('.board', this);
  }
}

function div(className, style) {
  const el = document.createElement('div');
  el.classList.add(className);
  Object.assign(el.style, style);
  return el;
}

const boardViz = new BoardViz();
const board =  window.board  = new Board(80, boardViz);

board.randomStart(0.45); // <-- now takes percentage fill as param
board.loop(130); // <-- now takes update speed in ms as param


