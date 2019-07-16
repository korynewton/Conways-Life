import React, { Component } from 'react';
import './styles.css';

export default class GridCanvas extends Component {
  constructor() {
    super();
    this.state = {};
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

  handleClick(e) {
    // find canvas element, save as variable
    const canvas = this.refs.canvas;
    // creating a drawing object for our canvas
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(
      0,
      0,
      this.props.width,
      this.props.height
    );

    // const pixelRGBA = this.getPixel(imageData, 10, 10);
    // pixelRGBA[0] = 0;
    // pixelRGBA[1] = 0x00;
    // pixelRGBA[2] = 0x00;
    // pixelRGBA[3] = 0xff;

    // this.setPixel(imageData, pixelRGBA, 10, 10);

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

    let pixelInfo = this.getPixel(imageData, clickX, clickY);

    if (pixelInfo[3]) {
      ctx.clearRect(
        cellTopX + 1,
        cellTopY + 1,
        this.props.cellWidth - 1,
        this.props.cellHeight - 1
      );
      console.log('here', pixelInfo[3]);
    }

    console.log(pixelInfo[3]);

    console.log('click coords');
    console.log(clickX);
    console.log(clickY);
    console.log('cell coords:');
    console.log(cellTopX);
    console.log(cellTopY);

    //  fill cell with rectangle
    ctx.fillRect(
      cellTopX,
      cellTopY,
      this.props.cellWidth,
      this.props.cellHeight
    );
  }

  componentDidMount() {
    // destructuring props
    const { width, height, cellHeight, cellWidth } = this.props;

    // this.requestAnimationFrame();

    // find canvas element, save as variable
    const canvas = this.refs.canvas;
    // creating a drawing object for our canvas
    const ctx = canvas.getContext('2d');

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

  componentWillUnmount() {}

  render() {
    return (
      <div>
        <canvas
          // className="grid"
          ref="canvas"
          width={this.props.width + 2}
          height={this.props.height + 2}
          onClick={e => this.handleClick(e)}
        />
      </div>
    );
  }
}
