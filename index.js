/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints a message in the browser's dev tools console
console.log("Hello 🌎");

console.log("amelia");


class Cell { 
  constructor() {
    this.neighbors = [];
  }
  update() {
    console.log("I updated")
  }
  
  addNeighbor(cell) {
    this.neighbors.push(cell);
    console.log('cell', cell);
    console.warn('neighbors', this.neighbors);
  }
}

class Board {
  constructor(width) {
    this.cells = this.makeCells(width);
    this.assignNeighbors();
  }
  
  makeCells(width) {
    return Array(width).fill().map(() => 
      Array(width).fill().map(() => new Cell()),
    );
  }
  update() {
    this.each(cell => cell.update());
  }
  assignNeighbors() {
    this.each((cell, x, y) => {
      let offsets = [-1, 0, 1]; // <-- this was the error (we needed 0), otherwise it was ONLY diagonals
      for (let ox of offsets) {
        for (let oy of offsets) {
          if (!ox && !oy) continue; // <-- just skip if it's the present cell
          const maybeNeighbor = this.cells[x+ox] && this.cells[x+ox][y+oy];
          if (maybeNeighbor === undefined) continue;
          cell.addNeighbor(maybeNeighbor);
        }
      }
    });
  }
  each(cb) {
    this.cells.forEach((row, y) => row.forEach((cell, x) => cb(cell, x, y)));
  }

}

const board =  window.board  = new Board(2)

console.log(board)

board.update();
