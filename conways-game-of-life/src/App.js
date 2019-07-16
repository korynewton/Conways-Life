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
        <GridCanvas width={540} height={540} cellHeight={20} cellWidth={20} />
        <h2>Generations: {this.state.generation}</h2>
      </div>
    );
  }
}

export default App;
