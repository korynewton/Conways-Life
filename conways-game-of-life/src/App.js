import React from 'react';
import GridCanvas from './components/GridCanvas';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      generation: 0
    };
  }
  render() {
    return (
      <div>
        <header>Conway's Game of Life</header>
        <GridCanvas />
        <h2>Generations: {this.state.generation}</h2>
      </div>
    );
  }
}

export default App;
