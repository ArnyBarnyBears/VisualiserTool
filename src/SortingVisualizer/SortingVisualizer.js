import React from 'react';
import {getMergeSortAnimations, getQuickSortAnimations, getBubbleSortAnimations ,getInsertionSortAnimations} from '../algorithms/sortingAlgorithms';
import "../styles/SortingVisualizer.css"


export default class SortingVisualizer extends React.Component {
  constructor() {
    super();

    this.state = {
      array: [], 
      animationSpeed: 3, 
      arrayBars: 50,
      primaryColour: "#0388fc" , //Base colour of bars
      secondaryColour: "red",//Colour to show a swap take palce
      width: 13, //width of bar.
      value: [],
      visualized: false,
      rendering: false


      
      
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.newArray();
  }

  newArray() {
    const array = [];
    for (let i = 0; i < this.state.arrayBars; i++) { //iterate through the bars and add random values from 5-200 
      array.push(randomIntFromInterval(5, 200));
    }
    this.setState({array});
    
  }
  arrayInput(array) {
    this.setState({array});
    this.state.value = []
  }
  arrayValidation(input) {
    input = input.replace(/\s/g, '');//remove all spaces in the string

    if (input == "") {
      alert("your array is blank!. \nan example input would be the following: \n173, 93, 73, 85, 52, 162, 189, 117, 136, 129, 168, 195, 141, 100, 153") 
      return
    }
    console.log(input[0])
    if (isNaN(input[0])) {
      alert("your array doesnt begin with a number. \nan example input would be the following: \n173, 93, 73, 85, 52, 162, 189, 117, 136, 129, 168, 195, 141, 100, 153") 
      return
    }

    

    for (let i = 0; i < input.length; i++) {
      var x = input[i]


      if ((input[i] == input[i+1]) && (input[i] == ",")) {
        alert("your array has multiple commas together! please ensure there is a number between each number.\nan example input would be the following: \n173, 93, 73, 85, 52, 162, 189, 117, 136, 129, 168, 195, 141, 100, 153")
        return
      }

      if(isNaN(x) && x !== ",") { //if not a number
        alert("Your array has elements which aernt numbers! \nan example input would be the following: \n173, 93, 73, 85, 52, 162, 189, 117, 136, 129, 168, 195, 141, 100, 153");
        return
      }
      
    }
    const array = input.split(',').map(Number)
    if (input.length < 10 || input.length > 100) {
      alert("Your array must only have 10-100 elements!. \nan example input would be the following: \n173, 93, 73, 85, 52, 162, 189, 117, 136, 129, 168, 195, 141, 100, 153")
    }
    for (let i = 0; i < array.length; i++) {
      if (array[i] > 200 || array[i] < 5) {
        alert("At least one element in your array is either greater than 200, or smaller than 5. \nan example input would be the following: \n173, 93, 73, 85, 52, 162, 189, 117, 136, 129, 168, 195, 141, 100, 153")
        return
      }
    }

    
    this.arrayInput(array)

 
  }



  setSpeed(x) {
    this.state.animationSpeed = x; 
  }
  setArraySize(bars, width) {
    this.state.arrayBars = bars;
    this.state.width = width;
    this.newArray();
    
  }



  changeAnimations(animations) { //here we take an animation array, and display the necessary animation
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName('array-bar');
      const isColorChange = i % 3 !== 2; //if its the second element when i mod 3 is not equal to 2 it will be true, so if i mod 3 is element 0, 1 or 3. this means that two will always be the else statement.
      if (isColorChange) {
        const [barOneIdx, barTwoIdx] = animations[i]; 
        const barOneStyle = arrayBars[barOneIdx].style;
        const barTwoStyle = arrayBars[barTwoIdx].style;
        const color = i % 3 === 0 ? this.state.secondaryColour : this.state.primaryColour; //if its the third element, make it red, otherwise make it blue only blue when first element. Third element represents the two bars that should be swapped. 
        setTimeout(() => {
          barOneStyle.backgroundColor = color; //change color of bar1 and bar2 according to their i element. both should be the same.
          barTwoStyle.backgroundColor = color;
        }, i * this.state.animationSpeed);
      } else {
        setTimeout(() => {
          const [barOneIdx, newHeight] = animations[i];
          const barOneStyle = arrayBars[barOneIdx].style;
          barOneStyle.height = `${newHeight}px`;
        }, i * this.state.animationSpeed);
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
  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    const x = this.state.value
    this.arrayValidation(x)
    event.preventDefault();

  }

  render() {
    const {array} = this.state;

    return (
      <div className="array-container">
        <div className="array-bar-wrapper">
          {array.map((height) => (
            <div
              className="array-bar"
              style={{
                backgroundColor: this.state.primaryColour,
                height: `${height}px`,
                width: `${this.state.width}px`,
              }}>
            </div>
          ))}
        </div>
        <button onClick={() => this.newArray()}>Generate New Array</button>
        <button onClick={() => this.mergeSort()}>Merge Sort</button>
        <button onClick={() => this.quickSort()}>Quick Sort</button>
        <button onClick={() => this.insertionSort()}>Insertion Sort</button>
        <button onClick={() => this.bubbleSort()}>Bubble Sort</button>
        <div> Animation Speed:
        <button onClick={() => this.setSpeed(7)}>Slow</button>
        <button onClick={() => this.setSpeed(3)}>Medium</button>
        <button onClick={() => this.setSpeed(1)}>Fast</button>
        </div>
        <div> Array Size:
        <button onClick={() => this.setArraySize(20, 20)}>Small</button>
        <button onClick={() => this.setArraySize(50, 13)}>Medium</button>
        <button onClick={() => this.setArraySize(100, 9)}>Large</button>
        <form onSubmit={this.handleSubmit}>
        <label>
          Input array:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>

        </div>
        
      Select the animation speed, and the size of the array, then choose your sorting algorithm to run the visualizer tool!
      <div>For the array input please make sure numbers are seperated by commas, and the length of your array is between 10-100. Make sure no number is greater then 200.</div>
      

 
      </div>
    );
  }
}

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
