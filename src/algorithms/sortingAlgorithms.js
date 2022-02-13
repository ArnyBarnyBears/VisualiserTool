export function getMergeSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) return array;
  const auxiliaryArray = array.slice();
  mergeSortHelper(array, 0, array.length - 1, auxiliaryArray, animations);
  return animations;
}

export function getQuickSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) return array;
  quickSortHelper(array, 0, array.length - 1, animations);
  return animations;
}


export function getBubbleSortAnimations(array) {
  const animations = [];
  bubbleSortHelper(array, animations);
  console.log(animations)
  return animations;
}
export function getInsertionSortAnimations(array) {
  const animations = [];
  insertionSortHelper(array, animations);
  console.log(animations)
  return animations;
}




function mergeSortHelper(mainArray, startIdx, endIdx, auxiliaryArray, animations) {
  if (startIdx === endIdx) return;
  const middleIdx = Math.floor((startIdx + endIdx) / 2);
  mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations);
  mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations);
  doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations);
}

function quickSortHelper(mainArray, startIdx, endIdx, animations) {
  if (startIdx < endIdx) {
    let pi = doPartition(mainArray, startIdx, endIdx, animations);
    quickSortHelper(mainArray, startIdx, pi - 1, animations);
    quickSortHelper(mainArray, pi + 1, endIdx, animations);
  }
}
function bubbleSortHelper(mainArray, animations) {
  let length = mainArray.length;
  for (let i = 0; i < length; i++) {
    let swapped = false;

    for (let j = 0; j < length - i - 1; j++) {
      if (mainArray[j] > mainArray[j + 1]) {

        animations.push([j, j + 1]);
        animations.push([j, j + 1]);
        animations.push([j, mainArray[j + 1]]);
        animations.push([j + 1, j]);
        animations.push([j + 1, j]);
        animations.push([j + 1, mainArray[j]]);
        let temp = mainArray[j];
        mainArray[j] = mainArray[j + 1];
        mainArray[j + 1] = temp;
        swapped = true;
      }
    }

    if (swapped === false) {
      break;
    }
  }
}

function insertionSortHelper(mainArray, animations) {
  let n = mainArray.length;
      for (let i = 1; i < n; i++) {
          // Choosing the first element in our unsorted subarray
          let current = mainArray[i];
          // The last element of our sorted subarray
          let j = i-1; 
          while ((j > -1) && (current < mainArray[j])) {



            animations.push([j, j + 1]);
            animations.push([j, j + 1]);
            animations.push([j + 1, mainArray[j]]);
            mainArray[j+1] = mainArray[j];
              j--;
          }
          

          animations.push([j + 1, i]);
          animations.push([j + 1, i]);
          animations.push([j+1, current]); 
          mainArray[j+1] = current

          ; //this j+1 resembles element 0. 0 is equal to the element that was stored at 1.
      }
}














function doPartition(mainArray, startIdx, endIdx, animations) {
  let i = startIdx - 1;
  let pivot = mainArray[endIdx];
  for (let j = startIdx; j < endIdx; j++) {
    if (mainArray[j] < pivot) {
      i++;
      animations.push([i, j]);
      animations.push([i, j]);
      animations.push([i, mainArray[j]]);
      animations.push([j, i]);
      animations.push([j, i]);
      animations.push([j, mainArray[i]]);
      let temp = mainArray[i];
      mainArray[i] = mainArray[j];
      mainArray[j] = temp;
    }
  }
  i++;
  animations.push([i, endIdx]);
  animations.push([i, endIdx]);
  animations.push([i, mainArray[endIdx]]);
  animations.push([endIdx, i]);
  animations.push([endIdx, i]);
  animations.push([endIdx, mainArray[i]]);
  let temp = mainArray[i];
  mainArray[i] = mainArray[endIdx];
  mainArray[endIdx] = temp;
  return i;
}

function doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations) {
  let k = startIdx;
  let i = startIdx;
  let j = middleIdx + 1;
  while (i <= middleIdx && j <= endIdx) {
    animations.push([i, j]);
    animations.push([i, j]);
    if (auxiliaryArray[i] <= auxiliaryArray[j]) {
      animations.push([k, auxiliaryArray[i]]);
      mainArray[k++] = auxiliaryArray[i++];
    } else {
      animations.push([k, auxiliaryArray[j]]);
      mainArray[k++] = auxiliaryArray[j++];
    }
  }
  while (i <= middleIdx) {
    animations.push([i, i]);
    animations.push([i, i]);
    animations.push([k, auxiliaryArray[i]]);
    mainArray[k++] = auxiliaryArray[i++];
  }
  while (j <= endIdx) {
    animations.push([j, j]);
    animations.push([j, j]);
    animations.push([k, auxiliaryArray[j]]);
    mainArray[k++] = auxiliaryArray[j++];
  }
}
