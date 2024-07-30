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

export { fetchBarcodeDatas };
