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
      <>
        <header>
          <h2>Conway's Game of Life</h2>
        </header>
        <GridCanvas width={540} height={540} cellHeight={20} cellWidth={20} />
      </>
    );
  }
}

export default App;
