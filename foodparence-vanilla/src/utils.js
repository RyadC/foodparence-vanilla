/* **********************************************************************************
 *                                     FUNCTIONS                                     *
 *************************************************************************************/

/**
 * @param {string} word The string whose we want the first letter in Uppercase
 * @returns string
 */
function capitalizeWord(word) {
  return (word = word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase());
}

/**
 * @param {string} word The string to Uppercase format
 * @returns string
 */
function toUppercaseWord(word) {
  return (word = word.toUpperCase());
}

/**
 * Search an element from the array and separate the two values before and after the separator and collect the value to an other array. Formate the value with {formatTheWord}
 * @param {array} arrayFrom the array whose value we want to retrieve
 * @param {array} arrayTo the array whose value we want to push
 * @param {string} separator the characters that will separate the elements into sub-arrays
 * @param {number} indiceArrayOfValueToCollect the indice of the array that contain the value to collect
 */
function pushSearchedValueFromArrayToNewArray(
  arrayFrom,
  arrayTo,
  separator,
  indiceArrayOfValueToCollect
) {
  for (let element of arrayFrom) {
    arrayTo.push(
      capitalizeWord(element.split(separator)[indiceArrayOfValueToCollect])
    );
  }
}

/**
 *  Create an HTML element that contains a text and inject it in a parent HTML element
 * @param {string} typeOfElementToCreate The HTML's type to create
 * @param {object} parentToAppend An HTML object to append
 * @param {[string, number]} textValue A value to inject like textContent
 * @returns The element was created
 */
function injectElement(typeOfElementToCreate, parentToAppend, textValue) {
  let elementToCreate = document.createElement(typeOfElementToCreate);
  elementToCreate.textContent = textValue;
  parentToAppend.append(elementToCreate);
  console.log(textValue);
  // Return the element was create. This element is attached on the document so we can use the return value like a HTML DOM element
  return elementToCreate;
}

/**
 * Remove the childrens of the HTML element
 * @param {object} parentHTMLElement An HTML element which we want remove his childrens
 */
function removeAllChildrensOfParentElement(parentHTMLElement) {
  if (parentHTMLElement.children.length > 0) {
    for (let i = 0; i <= parentHTMLElement.children.length; i++) {
      parentHTMLElement.children.item(0).remove();
    }
  }
}

/**
 * Create an object by iterating over an array. Each properties of this object contain an HTMLElement. Each textContent of these HTMLElement of these properties contain a text value form the array. And inject all of this elements in a HTMLElement parent.
 * @param {array} arrayFrom The Array where we take the text value (textContent) for the HTMLElement
 * @param {string} nameOfProperties The name for each created object properties. This name is followed by his presence number in the properties list
 * @param {object} parentToAppend The HTMLElement that we want to inject the HTML list
 * @returns An object with HTMLElement as properties
 */
function createHTMLListElementAndInjectInDOM(
  arrayFrom,
  nameOfProperties,
  typeOfElement,
  parentToAppend
) {
  let objectToCreate = {};
  for (let indice in arrayFrom) {
    objectToCreate[`${nameOfProperties}${indice}`] = injectElement(
      typeOfElement,
      parentToAppend,
      arrayFrom[indice]
    );
  }
  return objectToCreate;
}

/**
 * Get datas from OpenFoodFact API using fetch browser API
 * @param {number} barcode to search the associated product from the OpenFoddFact API
 * @returns {object} The product datas
 */
async function fetchBarcodeDatas(barcode) {
  const response = await fetch(
    `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
  );

  const result = response.json();

  return result;
}

export {
  removeAllChildrensOfParentElement,
  capitalizeWord,
  toUppercaseWord,
  pushSearchedValueFromArrayToNewArray,
  injectElement,
  createHTMLListElementAndInjectInDOM,
  fetchBarcodeDatas,
};
