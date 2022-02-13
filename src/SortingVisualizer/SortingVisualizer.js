import React from 'react';
import {getMergeSortAnimations, getQuickSortAnimations, getBubbleSortAnimations ,getInsertionSortAnimations} from '../algorithms/sortingAlgorithms';
import "../styles/SortingVisualizer.css"

// Change this value for the speed of the animations.
let ANIMATION_SPEED_MS = 3;

// Change this value for the number of bars (value) in the array.
const NUMBER_OF_ARRAY_BARS = 100;

// This is the main color of the array bars.
const PRIMARY_COLOR = 'blue';

// This is the color of array bars that are being compared throughout the animations.
const SECONDARY_COLOR = 'red';

export default class SortingVisualizer extends React.Component {
  constructor() {
    super();

    this.state = {
      array: [],
      test: []
      
    };
  }

  componentDidMount() {
    this.newArray();
  }

  newArray() {
    const array = [];
    for (let i = 0; i < NUMBER_OF_ARRAY_BARS; i++) {
      array.push(randomIntFromInterval(5, 200));
    }
    this.setState({array});
    
  }
  setSpeed(x) {
    ANIMATION_SPEED_MS = x;
  }




  changeAnimations(animations) {
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName('array-bar');
      const isColorChange = i % 3 !== 2; //if its the second element when i mod 3 is not equal to 2 it will be true, so if i mod 3 is element 0, 1 or 3. this means that two will always be the else statement.
      if (isColorChange) {
        const [barOneIdx, barTwoIdx] = animations[i]; 
        const barOneStyle = arrayBars[barOneIdx].style;
        const barTwoStyle = arrayBars[barTwoIdx].style;
        const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR; //if its the third element, make it red, otherwise make it blue only blue when first element. Third element represents the two bars that should be swapped. 
        setTimeout(() => {
          barOneStyle.backgroundColor = color; //change color of bar1 and bar2 according to their i element. both should be the same.
          barTwoStyle.backgroundColor = color;
        }, i * ANIMATION_SPEED_MS);
      } else {
        setTimeout(() => {
          const [barOneIdx, newHeight] = animations[i];
          const barOneStyle = arrayBars[barOneIdx].style;
          barOneStyle.height = `${newHeight}px`;
        }, i * ANIMATION_SPEED_MS);
      }
    }
  }
  mergeSort() {
    const animations = getMergeSortAnimations(this.state.array);
    this.changeAnimations(animations);

  }
  quickSort() {
    const animations = getQuickSortAnimations(this.state.array);
    this.changeAnimations(animations);
  }

  bubbleSort() {
    const animations = getBubbleSortAnimations(this.state.array);
    this.changeAnimations(animations);
  }

  insertionSort() {
    const animations = getInsertionSortAnimations(this.state.array);
    this.changeAnimations(animations);
  }


  render() {
    const {array} = this.state;

    return (
      <div className="array-container">
        <div className="array-bar-wrapper"
             style={{height: `${this.maxValue}px`}}>
          {array.map((height, idx) => (
            <div
              className="array-bar"
              key={idx}
              style={{
                backgroundColor: PRIMARY_COLOR,
                opacity: 1,
                height: `${height}px`,
                width: `${7}px`,
              }}>
            </div>
          ))}
        </div>
        <button onClick={() => this.newArray()}>Generate New Array</button>
        <button onClick={() => this.mergeSort()}>Merge Sort</button>
        <button onClick={() => this.quickSort()}>Quick Sort</button>
        <button onClick={() => this.insertionSort()}>Insertion Sort</button>
        <button onClick={() => this.bubbleSort()}>Bubble Sort</button>
        <div>
        <button onClick={() => this.setSpeed(7)}>Slow</button>
        <button onClick={() => this.setSpeed(3)}>Medium</button>
        <button onClick={() => this.setSpeed(1)}>Fast</button>
        </div>

 
      </div>
    );
  }
}

// From https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
