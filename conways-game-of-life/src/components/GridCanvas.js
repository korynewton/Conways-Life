import React, { Component } from 'react';
import './styles.css';

export default class GridCanvas extends Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {
    this.requestAnimationFrame();
  }
  requestAnimationFrame() {
    const ctx = this.refs.canvas.getContext('2d');
    ctx.fillRect(0, 0, 10, 10);
  }

  componentWillUnmount() {}

  render() {
    return (
      <div>
        <canvas className="grid" ref="canvas" width={500} height={500} />
      </div>
    );
  }
}
