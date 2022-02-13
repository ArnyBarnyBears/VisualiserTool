import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra, AStar, getShortestPath, primMaze } from '../algorithms/pathfindingAlgorithms';
import "../styles/PathfindingVisualizer.css"

export default class PathFindingVisualizer extends Component {
  constructor() {
      super();
      this.state = {
          grid: [],
          FR: 7,
          FC: 31,
          mouseIsPressed: false,
          changingStart: false,
          changingFinish: false,
          visualized: false,
          rendering: false,
          numRow: 17,
          numCol: 37,
          SR: 7,
          SC: 5,
          speed: 10
      };  
  }

isRendering() {
  return this.state.rendering;
}

componentDidMount() {
  const grid = this.initializeGrid(false);
  this.setState({
      grid: grid,
  })
  this.state.grid = grid;
}

initializeGrid(clearWall) {
  const grid = [];
  for (let row = 0; row < this.state.numRow; row++) {
      const currentRow = [];
      for (let col = 0; col < this.state.numCol; col++) {
          let isW = false;
          const element = document.getElementById(`node-${row}-${col}`);
          if (element && (element.className === 'node node-path' || element.className === 'node node-visited')) {
              element.className = 'node';
          }
          if (!clearWall && element && element.className === 'node node-wall') {
              isW = true;
          }
          currentRow.push(this.createNode(row, col, isW));
      }
      grid.push(currentRow);
  }
  return grid;
}

createNode(row, col, isW) {
  return {
      col,
      row,
      isStart: row === this.state.SR && col === this.state.SC,
      isFinish: row === this.state.FR && col === this.state.FC,
      distance: Infinity,
      heuristic: Infinity,
      isVisited: false,
      isWall: isW,
      previousNode: null,
  };
}

handleMouseDown(row, col) {
  if (row === this.state.SR && col === this.state.SC) {
      this.setState({ changingStart: true });
  }
  else if (row === this.state.FR && col === this.state.FC) {
      this.setState({ changingFinish: true });
  }
  else if (!this.state.rendering) {
      this.updateGridWithWall(this.state.grid, row, col);
      this.setState({ mouseIsPressed: true });
      this.clearVisitedAndPath();
  }
}

handleMouseEnter(row, col) {
  if (this.state.mouseIsPressed) {
      this.updateGridWithWall(this.state.grid, row, col);
      this.setState({ mouseIsPressed: true });
  }

  else if (this.state.changingStart && !(row === this.state.FR && col === this.state.FC)) {
      const start = document.getElementById(`node-${this.state.SR}-${this.state.SC}`);
      if (start) {
          start.className = 'node';
          start.isStart = false;
          this.state.grid[this.state.SR][this.state.SC].isStart = false;
      }
      const newStart = document.getElementById(`node-${row}-${col}`);
      if (newStart) {
          newStart.isStart = true;
          newStart.className = 'node node-start';
          this.state.grid[row][col].isStart = true;
      }
      this.setState({ SR: row, SC: col });
      this.clearVisitedAndPath();

  }
  else if (this.state.changingFinish && !(row === this.state.SR && col === this.state.SC)) {
      const finish = document.getElementById(`node-${this.state.FR}-${this.state.FC}`);
      if (finish) {
          finish.className = 'node';
          finish.isFinish = false;
          this.state.grid[this.state.FR][this.state.FC].isFinish = false;
      }
      const newFinish = document.getElementById(`node-${row}-${col}`);
      if (newFinish) {
          newFinish.isFinish = true;
          newFinish.className = 'node node-finish';
          this.state.grid[row][col].isFinish = true;
      }
      this.setState({ FR: row, FC: col });
      this.clearVisitedAndPath();
  }

}

handleMouseUp() {
  this.setState({
      changingStart: false,
      changingFinish: false,
      mouseIsPressed: false
  });
}

updateGridWithWall(grid, row, col) {
  const node = grid[row][col];
  const newNode = {
      ...node,
      isWall: !node.isWall
  }
  grid[row][col] = newNode;
}

clearVisualizer() {
  if (!this.state.rendering)
      this.setState({ grid: this.initializeGrid(true), visualized: false });

}

clearVisitedAndPath(){
  for(let row = 0; row < this.state.numRow; row++){
      for(let col = 0; col < this.state.numCol; col++){
          let n = document.getElementById(`node-${row}-${col}`);
          console.log(n);
          if(n && (n.className === 'node node-visited' || n.className === 'node node-path')){
              n.className = 'node';
          }
      }
  }
}

setSpeed(speed){
  this.setState({speed: speed});
}


  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 1; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, this.state.speed * i); //change time (3 for fast 10 for meh 17 for slow?)
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
      }, this.state.speed * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 1; i < nodesInShortestPathOrder.length - 1; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-path';
      }, this.state.speed * i * 5);
    }
  }


  

  visualizeDijkstra() {
    let g = this.initializeGrid(false);
    this.setState({
        grid: g
    });
    const grid = this.state.grid;
    const start = grid[this.state.SR][this.state.SC];
    const finish = grid[this.state.FR][this.state.FC];
    const visitedNodesInOrder = dijkstra(grid, start, finish);
    const shortedPath = getShortestPath(finish);
    this.animateDijkstra(visitedNodesInOrder, shortedPath);
  }

  visualizeAstar() {
    let g = this.initializeGrid(false);
    this.setState({
        grid: g
    });
    const grid = this.state.grid;
    const start = grid[this.state.SR][this.state.SC];
    const finish = grid[this.state.FR][this.state.FC];
    const visitedNodesInOrder = AStar(grid, start, finish);
    const shortedPath = getShortestPath(finish);
    this.animateDijkstra(visitedNodesInOrder, shortedPath);
  }
  dropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
  }












  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className="button">
          <button onClick={() => this.visualizeDijkstra()}>Visualize Dijkstra's Algorithm</button>
          <button onClick={() => this.visualizeAstar()}>Visualize A* Pathfinding Algorithm</button>
          <button 
                          onClick={() => { 
                              primMaze(this.state.grid);
                              this.setState({ finish: false});
                              this.clearVisitedAndPath();
                          }}
                          disabled={this.state.rendering}>
                          generate maze
                          
          </button>
          <button 
                          onClick={() => { 
                              this.clearVisualizer();
                          }}
                          disabled={this.state.rendering}>
                          reset grid
          </button>
          <div>
          <button onClick={() => this.setSpeed(20)}>Slow</button>
          <button onClick={() => this.setSpeed(10)}>Medium</button>
          <button onClick={() => this.setSpeed(5)}>Fast</button>
          </div>

                          
          
        </div>
      </>
    );
  }
}
