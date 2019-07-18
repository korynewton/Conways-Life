import React, { Component } from 'react';
import './styles.css';

export default class GridCanvas extends Component {
  constructor(props) {
    super(props);
    this.numberCellsWide = this.props.width / this.props.cellWidth;
    this.numberCellsTall = this.props.height / this.props.cellHeight;
    let cells = new Array(this.numberCellsTall);
    for (let i = 0; i < this.numberCellsTall; i++) {
      cells[i] = new Array(this.numberCellsWide);
      for (let j = 0; j < this.numberCellsWide; j++) {
        cells[i][j] = 0;
      }
    }
    this.state = {
      cells,
      generation: 0
    };
  }

  getPixel(imageData, x, y) {
    const w = imageData.width; // Conveniently the width is here
    const h = imageData.height;

    if (x < 0 || x >= w || y < 0 || y >= h) {
      // Out of bounds
      return null;
    }

    // Compute index within the array
    const index = (w * y + x) * 4;

    // Return a copy of the R, G, B, and A elements
    return imageData.data.slice(index, index + 4);
  }

  // setPixel(imageData, edited, x, y) {
  //   // find canvas element, save as variable
  //   const canvas = this.refs.canvas;
  //   // creating a drawing object for our canvas
  //   const ctx = canvas.getContext('2d');

  //   const w = imageData.width; // Conveniently the width is here
  //   const h = imageData.height;

  //   if (x < 0 || x >= w || y < 0 || y >= h) {
  //     // Out of bounds
  //     return null;
  //   }

  //   // Compute index within the array
  //   let index = (w * y + x) * 4;

  //   for (let i = 0; i < 4; i++) {
  //     imageData.data[index] = edited[i];
  //     index++;
  //   }

  //   ctx.putImageData(imageData, 0, 0);

  //   // Return a copy of the R, G, B, and A elements
  //   // return imageData.data.slice(index, index + 4);
  // }

  // toggleRunning() {
  //   console.log(this.state.isRunning);
  //   this.setState({ isRunning: !this.state.isRunning }, function() {
  //     this.runLife(this.state.isRunning);
  //   });
  // }

  runLife = () => {
    this.intervalId = setInterval(() => this.stepToNextGen(), 200);
  };

  pause = () => {
    clearInterval(this.intervalId);
  };

  randomize() {
    // first off, clear the board
    this.clearBoard();

    // let randomized = new Array(this.numberCellsTall);
    // for (let i = 0; i < this.numberCellsTall; i++) {
    //   randomized[i] = new Array(this.numberCellsWide);
    //   for (let j = 0; j < this.numberCellsWide; j++) {
    //     randomized[i][j] = Math.floor(Math.random() * 2);
    //   }
    // }

    let randomized = [];
    // generate values 0 or 1 for each cell
    for (let i = 0; i < this.numberCellsTall; i++) {
      let row = [];
      for (let j = 0; j < this.numberCellsWide; j++) {
        row.push(Math.floor(Math.random() * 2));
      }
      randomized.push(row);
    }

    this.setState({ cells: randomized });
    // redraw
    this.redraw(randomized);
  }

  stepToNextGen() {
    this.setState({ generation: this.state.generation + 1 });

    let cells = arrayClone(this.state.cells);

    let newCells = arrayClone(cells);

    for (let i = 0; i < this.numberCellsTall; i++) {
      for (let j = 0; j < this.numberCellsWide; j++) {
        // const before = cells[i][j];
        let count = 0;

        if (i !== 0) {
          // only check top row if not the top row
          if (j !== 0) {
            // NorthWest -- only check if not top row or not at starting column
            count += cells[i - 1][j - 1] ? 1 : 0;
          }

          // every cell that isnt the top row will have a North
          count += cells[i - 1][j] ? 1 : 0;

          // Check Northeast only if not the last column
          if (j !== this.numberCellsWide - 1) {
            count += cells[i - 1][j + 1] ? 1 : 0;
          }
        }

        if (i < this.numberCellsTall - 1) {
          // only check bottom row if not the bottom row
          if (j !== 0) {
            //SW -  only check if also not in first column
            count += cells[i + 1][j - 1] ? 1 : 0;
          }

          // S - all rows that are not the bottom will have a S
          count += cells[i + 1][j] ? 1 : 0;

          if (j !== this.numberCellsWide - 1) {
            // SE - only check if also not in last column
            count += cells[i + 1][j + 1] ? 1 : 0;
          }
        }

        if (j < this.numberCellsWide - 1) {
          // only check easterly neightbor if not on end
          count += cells[i][j + 1] ? 1 : 0;
        }

        if (j !== 0) {
          // only check westerly neightbor if not at begining
          count += cells[i][j - 1] ? 1 : 0;
        }

        // decide if cell lives
        if (cells[i][j] === 1 && (count < 2 || count > 3)) {
          //cell dies
          newCells[i][j] = 0;
        }

        if (cells[i][j] === 0 && count === 3) {
          // reanimate from the dead
          newCells[i][j] = 1;
        }
      }
    }

    this.setState({ cells: newCells });
    this.redraw(newCells);
  }

  // clears board, reinitializes cells to 0
  reset() {
    this.clearBoard();

    let cells = new Array(this.numberCellsTall);
    for (let i = 0; i < this.numberCellsTall; i++) {
      cells[i] = new Array(this.numberCellsWide);
      for (let j = 0; j < this.numberCellsWide; j++) {
        cells[i][j] = 0;
      }
    }
    this.setState({ cells, generation: 0 });
  }

  clearBoard() {
    // find canvas element, save as variable
    const canvas = this.refs.canvas;
    // creating a drawing object for our canvas
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, this.props.width, this.props.height);
  }

  redraw(cells) {
    // first clear board
    this.clearBoard();
    // redraw based on state
    // find canvas element, save as variable
    const canvas = this.refs.canvas;
    // creating a drawing object for our canvas
    const ctx = canvas.getContext('2d');

    for (let i = 0; i < this.numberCellsTall; i++) {
      for (let j = 0; j < this.numberCellsWide; j++) {
        if (cells[i][j] === 1) {
          ctx.fillRect(
            j * 20,
            i * 20,
            this.props.cellWidth,
            this.props.cellHeight
          );
          ctx.stroke();
        }
      }
    }
  }

  presetObjects = e => {
    let { name } = e.target;

    let cells;

    if (name === 'glider') {
      cells = new Array(this.numberCellsTall);
      for (let i = 0; i < this.numberCellsTall; i++) {
        cells[i] = new Array(this.numberCellsWide);
        for (let j = 0; j < this.numberCellsWide; j++) {
          if (i === 1 && j === 2) {
            cells[i][j] = 1;
          } else if (i === 2 && j === 3) {
            cells[i][j] = 1;
          } else if (i === 3 && (j === 1 || j === 2 || j === 3)) {
            cells[i][j] = 1;
          } else {
            cells[i][j] = 0;
          }
        }
      }
    }

    if (name === 'blinker') {
      cells = new Array(this.numberCellsTall);
      for (let i = 0; i < this.numberCellsTall; i++) {
        cells[i] = new Array(this.numberCellsWide);
        for (let j = 0; j < this.numberCellsWide; j++) {
          if (i === 4 && j === 4) {
            cells[i][j] = 1;
          } else if (i === 5 && j === 4) {
            cells[i][j] = 1;
          } else if (i === 6 && j === 4) {
            cells[i][j] = 1;
          } else {
            cells[i][j] = 0;
          }
        }
      }
    }

    if (name === 'unsure') {
      cells = new Array(this.numberCellsTall);
      for (let i = 0; i < this.numberCellsTall; i++) {
        cells[i] = new Array(this.numberCellsWide);
        for (let j = 0; j < this.numberCellsWide; j++) {
          if (i === 12 && j === 12) {
            cells[i][j] = 1;
          } else if (i === 13 && j === 12) {
            cells[i][j] = 1;
          } else if (i === 14 && j === 12) {
            cells[i][j] = 1;
          } else if ((i === 13 && j === 11) || j === 13) {
            cells[i][j] = 1;
          } else {
            cells[i][j] = 0;
          }
        }
      }
    }

    if (name === 'otherblinker') {
      cells = new Array(this.numberCellsTall);
      for (let i = 0; i < this.numberCellsTall; i++) {
        cells[i] = new Array(this.numberCellsWide);
        for (let j = 0; j < this.numberCellsWide; j++) {
          if (i === 12 && j === 12) {
            cells[i][j] = 1;
          } else if (i === 13 && j === 12) {
            cells[i][j] = 1;
          } else if (i === 14 && j === 12) {
            cells[i][j] = 1;
          } else if (i === 13 && (j === 11 || j === 13)) {
            cells[i][j] = 1;
          } else {
            cells[i][j] = 0;
          }
        }
      }
    }

    this.setState({ cells });
    this.redraw(cells);
  };

  handleClick(e) {
    // find canvas element, save as variable
    const canvas = this.refs.canvas;
    // creating a drawing object for our canvas
    const ctx = canvas.getContext('2d');

    // Get click coords
    let rect = canvas.getBoundingClientRect();
    let clickX = e.clientX - rect.left;
    let clickY = e.clientY - rect.top;
    let cellTopX, cellTopY;

    for (let i = clickX; i >= 0; i--) {
      if (i % this.props.cellWidth === 0) {
        cellTopX = i;
        break;
      }
    }
    for (let i = clickY; i >= 0; i--) {
      if (i % this.props.cellWidth === 0) {
        cellTopY = i;
        break;
      }
    }

    let column = cellTopX / this.props.cellWidth;
    let row = cellTopY / this.props.cellHeight;

    // make copy of current state of cells
    let updatedState = this.state.cells;

    if (updatedState[row][column] === 0) {
      // Toggle on by filling in cell
      ctx.fillRect(
        cellTopX,
        cellTopY,
        this.props.cellWidth,
        this.props.cellHeight
      );
      updatedState[row][column] = 1;
      this.setState({ cells: updatedState });
    } else {
      let stateCopy = [...this.state.cells];
      stateCopy[row][column] = 0;
      this.setState({ cells: stateCopy });
      // redraw
      this.redraw(stateCopy);
    }
  }

  componentDidMount() {
    // destructuring props
    const { width, height, cellHeight, cellWidth } = this.props;

    // this.requestAnimationFrame();

    // find canvas element, save as variable
    const canvas = this.refs.grid;
    // creating a drawing object for our canvas
    const ctx = canvas.getContext('2d');

    // draws grid:
    // draw outer rectangle and begin tracing path of grid
    ctx.clearRect(0, 0, width, height);
    ctx.translate(0.5, 0.5);
    ctx.beginPath();

    ctx.moveTo(0, 0);
    ctx.lineTo(width, 0);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.lineTo(0, 0);

    for (let x = cellWidth; x < width; x += cellWidth) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }

    for (let y = cellHeight; y < height; y += cellHeight) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }

    ctx.stroke();
  }

  // onAnimFrame(timestamp) {}

  // requestAnimationFrame() {
  //   const ctx = this.refs.canvas.getContext('2d');
  //   ctx.fillRect(0, 0, 10, 10);
  // }

  render() {
    return (
      <>
        <div style={{ position: 'relative' }}>
          <canvas
            style={{ position: 'absolute', left: 0, top: 0, zIndex: 1 }}
            ref="canvas"
            width={this.props.width + 1}
            height={this.props.height + 1}
            onClick={e => this.handleClick(e)}
          />
          <canvas
            style={{ position: 'absolute', left: 0, top: 0, zIndex: 0 }}
            ref="grid"
            width={this.props.width + 1}
            height={this.props.height + 1}
          />
        </div>
        <div style={{ position: 'absolute', left: 0, top: 560 }}>
          <h2>Generations: {this.state.generation}</h2>
          <button onClick={() => this.stepToNextGen()}>Next Generation</button>
          <button onClick={() => this.reset()}>Clear Board</button>
          <button onClick={() => this.randomize()}>Randomize</button>
          <button onClick={() => this.runLife()}>Play</button>
          <button onClick={() => this.pause()}>Pause</button>
          <div>
            <h3>Presets:</h3>
            <button name="glider" onClick={e => this.presetObjects(e)}>
              Glider
            </button>
            <button name="blinker" onClick={e => this.presetObjects(e)}>
              Blinker
            </button>
            <button name="unsure" onClick={e => this.presetObjects(e)}>
              Not Sure What This Is
            </button>
            <button name="otherblinker" onClick={e => this.presetObjects(e)}>
              Another Blinker
            </button>
          </div>
        </div>
      </>
    );
  }
}

function arrayClone(arr) {
  return JSON.parse(JSON.stringify(arr));
}
