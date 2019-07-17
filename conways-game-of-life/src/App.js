import React from 'react';
import GridCanvas from './components/GridCanvas';
import './App.css';

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
        <div>
          <GridCanvas width={540} height={540} cellHeight={20} cellWidth={20} />
        </div>
      </div>
    );
  }
}

export default App;
