/**
 * @param {string} word The string whose we want the first letter in Uppercase
 * @returns string
 */
 function formatTheWord(word){
  return word = word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase();
};

/** 
 * @param {string} word The string to Uppercase format
 * @returns string
 */
 function formatToUppercase(word){
  return word = word.toUpperCase();
};

/**
 * Search an element from the array and separate the two values before and after the separator and collect the value to an other array. Formate the value with {formatTheWord}
 * @param {array} arrayFrom the array whose value we want to retrieve
 * @param {array} arrayTo the array whose value we want to push
 * @param {string} separator the characters that will separate the elements into sub-arrays
 * @param {number} indiceArrayOfValueToCollect the indice of the array that contain the value to collect
 */
 function getValueSearchedFromArrayToNewArray(arrayFrom, arrayTo, separator, indiceArrayOfValueToCollect){
  for(let element of arrayFrom){
    arrayTo.push(formatTheWord(element.split(separator)[indiceArrayOfValueToCollect]));
  };
};




const functions = {
  formatTheWord,
  formatToUppercase,
  getValueSearchedFromArrayToNewArray,
}
export default functions;