import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra, AStar, getShortestPath, primMaze } from '../algorithms/pathfindingAlgorithms';
import "../styles/PathfindingVisualizer.css"

export default class PathFindingVisualizer extends Component {
  constructor() {
      super();
      this.state = {
          grid: [],
          FR: 8,
          FC: 30,
          mouseIsPressed: false,
          changingStart: false,
          changingFinish: false,
          visualized: false,
          rendering: false,
          numRow: 17,
          numCol: 37, //default values 17 rows 37 columns.
          SR: 8,
          SC: 6,
          speed: 10
      };  
  }

isRendering() {
  return this.state.rendering;
}

componentDidMount() {
  const grid = this.initializeGrid(false); //create a grid with default constraints
  this.setState({
      grid: grid,
  })
  this.state.grid = grid;
}

initializeGrid(clearWall) {
  const grid = []; 
  for (let row = 0; row < this.state.numRow; row++) { //iterate through all the rows and columns
      const currentRow = []; 
      for (let col = 0; col < this.state.numCol; col++) {
          let isW = false; //iswall
          const element = document.getElementById(`node-${row}-${col}`); //the position of the node is found
          if (element && (element.className === 'node node-path' || element.className === 'node node-visited')) {//if this node is either part of node-path or node-visited,
              element.className = 'node'; //add this node to the class "node"
          }
          if (!clearWall && element && element.className === 'node node-wall') { //if  clearwall is false, and the specific node is a wall
              isW = true; //isWall is true
          }
          currentRow.push(this.createNode(row, col, isW)); //create a node at the row and column, with is wall being true or false.
      }
      grid.push(currentRow);
  }
  return grid;
}

createNode(row, col, isW) {
  return {
      col,
      row,
      isStart: row === this.state.SR && col === this.state.SC, //the start node
      isFinish: row === this.state.FR && col === this.state.FC, //the end node.
      distance: Infinity,
      heuristic: Infinity,
      isVisited: false,
      isWall: isW,
      previousNode: null,
      //creates a node with the passed in parameters and default values for distance and heuristics.
  };
}

handleMouseDown(row, col) {
  if (row === this.state.SR && col === this.state.SC) {
      this.setState({ changingStart: true }); //check if the node being held down is the start node.
  }
  else if (row === this.state.FR && col === this.state.FC) {
      this.setState({ changingFinish: true }); //check if the node being held down is the finish node.
  }
  else if (!this.state.rendering) { //if the node is neither the start or finish, and the visualizer tool is not currently rendering anything,
      this.updateGridWithWall(this.state.grid, row, col); //change the node selected to either a wall, or revert it back to normal.
      this.setState({ mouseIsPressed: true });
      this.clearVisitedAndPath(); //reset the values of all the nodes back to default
  }
}

handleMouseEnter(row, col) {
  if (this.state.mouseIsPressed) { //wait until the mouse is pressed, before changing the node its hovering over to either a wall, or revert it back to normal
      this.updateGridWithWall(this.state.grid, row, col); 
      this.setState({ mouseIsPressed: true });
  }

  else if (this.state.changingStart && !(row === this.state.FR && col === this.state.FC)) { //if a start node has been selected, and it has been dragged to a place which isnt the position of the finish node
      const start = document.getElementById(`node-${this.state.SR}-${this.state.SC}`); //get the node corresponding to the position of the start node
      if (start) {
          start.className = 'node';
          start.isStart = false;
          this.state.grid[this.state.SR][this.state.SC].isStart = false; //change the node that used to be the start node, to a normal node now.
      }
      const newStart = document.getElementById(`node-${row}-${col}`); //get the node corresponding to the position of the new start node.
      if (newStart) {
          newStart.isStart = true;
          newStart.className = 'node node-start';
          this.state.grid[row][col].isStart = true; //change the node to become the new start node.
      }
      this.setState({ SR: row, SC: col }); //set the SR and SC attributes equal to the new row and column which where hovered over by the mouse
      this.clearVisitedAndPath(); //reset the values of all the nodes back to default

  }
  else if (this.state.changingFinish && !(row === this.state.SR && col === this.state.SC)) { //this section of code will do the same as the above section of code, except on the finish node instead of the start node.
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
      changingStart: false, //after releasing the mouse, set the following attributes back to false, if they were ever true.
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

clearVisitedAndPath(){ //go through all the nodes in the grid, and check whether the node is part of the node-visited/ node-path class
  for(let row = 0; row < this.state.numRow; row++){
      for(let col = 0; col < this.state.numCol; col++){
          let n = document.getElementById(`node-${row}-${col}`);
          console.log(n);
          if(n && (n.className === 'node node-visited' || n.className === 'node node-path')){
              n.className = 'node'; //change the class back to the original node class
          }
      }
  }
}

setSpeed(speed){
  this.setState({speed: speed});
}


  animate(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 1; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder); //call the animateShortestPath function to display the optiomal path.
        }, this.state.speed * i); 
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited'; //iterate through the visited nodes in order and animate them one by one, by changing the CSS to the node-visited class.
      }, this.state.speed * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 1; i < nodesInShortestPathOrder.length - 1; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-path'; //iterate through the nodesInShortestPathOrder array, and display all these nodes, by changing the CSS to the node-path class.
      }, this.state.speed * i * 5);
    }
  }


  

  visualize(algorithm) {
    let g = this.initializeGrid(false);
    this.setState({
        grid: g
    });
    const grid = this.state.grid;
    const start = grid[this.state.SR][this.state.SC];
    const finish = grid[this.state.FR][this.state.FC];
    let visitedNodesInOrder = null
    if (algorithm) { //if algorithm is true then do dijkstra
       visitedNodesInOrder = dijkstra(grid, start, finish);
    }
    else {
       visitedNodesInOrder = AStar(grid, start, finish); //else do astar
    }
    const shortedPath = getShortestPath(finish);
    this.animate(visitedNodesInOrder, shortedPath);

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
          <button onClick={() => this.visualize(true)}>Visualize Dijkstra's Algorithm</button>
          <button onClick={() => this.visualize(false)}>Visualize A* Pathfinding Algorithm</button>
          <button 
                          onClick={() => { 
                              primMaze(this.state.grid);
                              this.setState({ finish: false});
                              this.clearVisitedAndPath();
                          }}
                          disabled={this.state.rendering}>
                          Generate Maze
                          
          </button>
          <button 
                          onClick={() => { 
                              this.clearVisualizer();
                          }}
                          disabled={this.state.rendering}>
                          Reset Grid
          </button>
          <div>
            Animation Speed:
          <button onClick={() => this.setSpeed(20)}>Slow</button>
          <button onClick={() => this.setSpeed(10)}>Medium</button>
          <button onClick={() => this.setSpeed(5)}>Fast</button>
          </div>
          Create and remove walls on the grid with your mouse, or use the maze generation to create obstacles!
          <div>Drag the start/end nodes around with your mouse, and change the animation speed to your liking.</div>
           


                          
          
        </div>
      </>
    );
  }
}
