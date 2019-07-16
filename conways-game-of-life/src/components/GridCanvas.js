import React, { Component } from 'react';
import './styles.css';

export default class GridCanvas extends Component {
  constructor() {
    super();
    this.state = {};
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
        />
      </div>
    );
  }
}
