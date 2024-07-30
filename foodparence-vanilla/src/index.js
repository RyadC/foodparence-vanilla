// * Imports
import additifsEuropeenDiviseeOrdonneeFiltree from "./data/additifsEUROPA.js";
import classificationSVG from "./assets/icon/classification.svg.js";
import {
  capitalizeWord,
  createHTMLListElementAndInjectInDOM,
  injectElement,
  pushSearchedValueFromArrayToNewArray,
  removeAllChildrensOfParentElement,
  toUppercaseWord,
} from "./utils.js";
import { fetchBarcodeDatas } from "./fetch.js";

// * Get HTML Elements from DOM
const el_Form = document.querySelector("#form");
const el_SearchInput = document.querySelector("#barcode");
const el_AllergenInput = document.querySelector("#allergen-checkbox");
const el_AdditiveInput = document.querySelector("#additive-checkbox");
const el_NoAnimalInput = document.querySelector("#no-animal-checkbox");
const el_ResultTitle = document.querySelector(".result-section__title");
const el_ResultIntro = document.querySelector(".result-section__intro");
const el_ResultNameSection = document.querySelector("#resultNameSection");
const el_ResultAllergenSection = document.querySelector(
  "#resultAllergenSection"
);
const el_ResultAdditiveSection = document.querySelector(
  "#resultAdditiveSection"
);
const el_ResultInformationSection = document.querySelector(
  ".result-information"
);
const el_ResultInformationTitle = document.querySelector(
  ".result-information__title"
);
const el_ResultProductClassification = document.querySelector(
  ".result-classification"
);
const el_ErrorContainer = document.querySelector(".error-container");
const el_ErrorMessage = document.querySelector(".error-message");

// * Starting Code :
// Get "Resutat" title position for scroll
const verticalResultTitlePosition = el_ResultTitle.getBoundingClientRect().y;

el_Form.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Get barcode
  const barcode = el_SearchInput.value;
  const REGEX_VALID_BARCODE = /^([0-9]{8}|[0-9]{13})$/g;

  const result = await fetchBarcodeDatas(barcode);

  // If barcode isn't valid
  if (!REGEX_VALID_BARCODE.test(barcode)) {
    el_ErrorMessage.textContent =
      "Veuillez saisir un code barre comprenant 8 ou 13 chiffres";
    el_ErrorContainer.classList.add("display-error");

    el_AllergenInput.checked = false;
    el_NoAnimalInput.checked = false;
    el_AdditiveInput.checked = false;

    setTimeout(() => {
      el_ErrorContainer.classList.remove("display-error");
    }, 3000);

    removeAllChildrensOfParentElement(el_ResultNameSection);
    removeAllChildrensOfParentElement(el_ResultAllergenSection);
    removeAllChildrensOfParentElement(el_ResultAdditiveSection);
    removeAllChildrensOfParentElement(el_ResultInformationTitle);
    removeAllChildrensOfParentElement(el_ResultProductClassification);
    el_ResultInformationSection.classList.remove("result-information-actif");
    document.querySelector(".wave")?.remove();

    return;
  }

  // If product not found
  if (result.status_verbose === "product not found") {
    el_ErrorMessage.textContent =
      "Désolé, nous n'avons pu trouver le produit recherché";
    el_ErrorContainer.classList.add("display-error");

    el_SearchInput.value = "";
    el_AdditiveInput.checked = false;
    el_AllergenInput.checked = false;
    el_NoAnimalInput.checked = false;

    setTimeout(() => {
      el_ErrorContainer.classList.remove("display-error");
    }, 3000);

    return;
  }

  // Remove old search
  removeAllChildrensOfParentElement(el_ResultNameSection);
  removeAllChildrensOfParentElement(el_ResultAllergenSection);
  removeAllChildrensOfParentElement(el_ResultAdditiveSection);
  removeAllChildrensOfParentElement(el_ResultInformationTitle);
  removeAllChildrensOfParentElement(el_ResultProductClassification);
  el_ResultInformationSection.classList.remove("result-information-actif");
  document.querySelector(".wave")?.remove();

  if (result.status_verbose === "product found") {
    // Get product name and product brand
    let product = result.product;
    let findedNameProduct = null;

    // Formate brand
    let brands = product.brands.replaceAll(",", ", ");
    let abbreviatedProductName = product.abbreviated_product_name;
    let productName = product.product_name;
    let productNameFr = product.product_name_fr;
    let genericName = product.generic_name;

    // Formate product name
    if (productNameFr) {
      findedNameProduct = capitalizeWord(productNameFr);
    } else if (productName) {
      findedNameProduct = capitalizeWord(productName);
    } else if (abbreviatedProductName) {
      findedNameProduct = capitalizeWord(abbreviatedProductName);
    } else if (genericName) {
      findedNameProduct = capitalizeWord(genericName);
    } else {
      findedNameProduct = "Nom du produit inconnu";
    }

    // Formate brand with product name
    let formatedBrand = null;
    if (brands) {
      brands = toUppercaseWord(brands);
      formatedBrand = `${brands} - ${findedNameProduct}`;
    } else {
      formatedBrand = `Marque inconnue - ${findedNameProduct}`;
    }

    // Get allergens
    let allergenArray = product.allergens_hierarchy;
    let traceArray = product.traces_hierarchy;
    let filteredAllAllergens = [];
    let allergensNotFound = false;

    if (el_AllergenInput.checked) {
      if (!allergenArray.length && !traceArray.length) {
        allergensNotFound = true;
      } else {
        let formatedAllergensArray = [];
        pushSearchedValueFromArrayToNewArray(
          allergenArray,
          formatedAllergensArray,
          ":",
          1
        );

        let formatedTracesArray = [];
        pushSearchedValueFromArrayToNewArray(
          traceArray,
          formatedTracesArray,
          ":",
          1
        );

        // Concat arrays to have one array without duplicates
        let allAllergens = new Set(
          formatedAllergensArray.concat(formatedTracesArray).sort()
        );

        filteredAllAllergens = [...allAllergens];
      }
    }

    // * Get additives
    let additifArray = product.additives_original_tags;
    let additivesNotFound = false;
    let formatedAdditivesArray = [];
    let resultAdditif = "";
    const formatedAdditivesList = [];

    if (el_AdditiveInput.checked) {
      if (!additifArray.length) {
        // resultAdditif = "Aucuns additifs ne semblent être présents"
        additivesNotFound = true;
      } else {
        // Récupérer les éléments du tableau additifArray
        pushSearchedValueFromArrayToNewArray(
          additifArray,
          formatedAdditivesArray,
          ":",
          1
        );
        resultAdditif = formatedAdditivesArray.join(", ");

        // For each product additive, search if he's in the additive array datas
        for (
          let additifProduct = 0;
          additifProduct < formatedAdditivesArray.length;
          additifProduct++
        ) {
          for (
            let indexAdditifArray = 0;
            indexAdditifArray < additifsEuropeenDiviseeOrdonneeFiltree.length;
            indexAdditifArray++
          ) {
            const isFoundedSameAdditif =
              formatedAdditivesArray[additifProduct] ===
              additifsEuropeenDiviseeOrdonneeFiltree[indexAdditifArray][0];
            if (isFoundedSameAdditif) {
              formatedAdditivesList.push(
                additifsEuropeenDiviseeOrdonneeFiltree[indexAdditifArray].join(
                  ": "
                )
              );
            }
          }
        }
      }
    }

    // TODO:  Get ingredients with animal presence

    //  Remove intro sentence
    el_ResultIntro.remove();

    // Inject result in DOM
    const titleResultNameSectionEl = injectElement(
      "h3",
      el_ResultNameSection,
      "Produit"
    );
    titleResultNameSectionEl.classList.add("result-section__subtitle");

    const productNameEl = injectElement("p", el_ResultNameSection, result);
    productNameEl.classList.add("resultName-section__product");

    // Inject allergens
    if (el_AllergenInput.checked) {
      const titleResultAllergenSectionEl = injectElement(
        "h3",
        el_ResultAllergenSection,
        "Allergènes"
      );
      titleResultAllergenSectionEl.classList.add("result-section__subtitle");

      if (allergensNotFound) {
        const allergenTextEl = injectElement(
          "p",
          el_ResultAllergenSection,
          "Aucun allergène semble être présent"
        );
        allergenTextEl.classList.add("result-section-default");
      } else {
        // Create <ul> element in the allergen result section
        const allergenListEl = injectElement("ul", el_ResultAllergenSection);

        // Create the <li> elements, inject them in the <ul> element was created and return an object of <li> HTML elements
        const allergenItemsListObject = createHTMLListElementAndInjectInDOM(
          filteredAllAllergens,
          "allergenItem",
          "li",
          allergenListEl
        );

        for (const li in allergenItemsListObject) {
          allergenItemsListObject[li].classList.add("result-section__item");
        }
      }
    }

    // Inject additives
    if (el_AdditiveInput.checked) {
      const titleResultAdditivSectionEl = injectElement(
        "h3",
        el_ResultAdditiveSection,
        "Additifs"
      );
      titleResultAdditivSectionEl.classList.add("result-section__subtitle");

      if (additivesNotFound) {
        const additivTextEl = injectElement(
          "p",
          el_ResultAdditiveSection,
          "Aucun additif semble être présent"
        );
        additivTextEl.classList.add("result-section-default");
      } else {
        // Create <ul> element in the allergen result section
        const additivListEl = injectElement("ul", el_ResultAdditiveSection);

        // Create the <li> elements, inject them in the <ul> element was created and return an object of <li> HTML elements
        const additivItemsListObject = createHTMLListElementAndInjectInDOM(
          formatedAdditivesList,
          "additivItem",
          "li",
          additivListEl
        );

        for (const li in additivItemsListObject) {
          additivItemsListObject[li].classList.add("result-section__item");
        }
      }
    }

    // Inject additional informations (Nutriscore and Nova)
    // Inject SVG Element in <h3>
    el_ResultInformationTitle.insertAdjacentHTML(
      "beforeend",
      classificationSVG
    );

    el_ResultInformationSection.classList.add("result-information-actif");

    // Add wave img (no "alt" because image used as part of page design => see W3C)
    const waveImgEl = injectElement("img", el_ResultInformationSection);
    waveImgEl.setAttribute("src", "src/assets/icon/Wave.png");
    waveImgEl.classList.add("wave");

    // Inject nutriscore img
    const nutriscore = product.nutriscore_grade.toUpperCase();
    const validNutriscore = ["A", "B", "C", "D", "E"];

    const nutriscoreImgEl = injectElement(
      "img",
      el_ResultProductClassification
    );
    nutriscoreImgEl.classList.add(
      "result-nutriscore",
      "result-classification-childrens"
    );

    if (!validNutriscore.includes(nutriscore)) {
      nutriscoreImgEl.setAttribute(
        "src",
        "src/assets/images/NutriScore/NutriScore - Undefined.png"
      );
      nutriscoreImgEl.setAttribute("alt", "Image nutriscore indéfini");
    } else {
      nutriscoreImgEl.setAttribute(
        "src",
        `src/assets/images/NutriScore/NutriScore ${nutriscore}.png`
      );
      nutriscoreImgEl.setAttribute(
        "alt",
        `Image nutriscore classement ${nutriscore}`
      );
    }

    // Inject novascore img
    const novascore = product.nova_group;

    const novascoreImgEl = injectElement("img", el_ResultProductClassification);
    novascoreImgEl.classList.add(
      "result-novascore",
      "result-classification-childrens"
    );

    if (!validNutriscore.includes(nutriscore)) {
      novascoreImgEl.setAttribute(
        "src",
        "src/assets/images/NovaScore/NovaScore Inconnu.png"
      );
      novascoreImgEl.setAttribute("alt", "Image novascore inconnu");
    } else {
      novascoreImgEl.setAttribute(
        "src",
        `src/assets/images/NovaScore/NovaScore ${novascore}_1.png`
      );
      novascoreImgEl.setAttribute(
        "alt",
        `Image novascore classement ${novascore}`
      );
    }

    // Scroll to the result page
    // Get Y page position (if the page has been scrolled)
    const actuallyVerticalPagePosition = window.scrollY;

    // Scroll to the title
    window.scrollBy(
      0,
      verticalResultTitlePosition - actuallyVerticalPagePosition - 20
    );

    return;
  }

  // Non 200 return error case
  el_ErrorMessage.textContent =
    "Une erreur est survenue, impossible d'afficher le produit";
  setTimeout(() => {
    el_ErrorContainer.classList.remove("display-error");
  }, 3000);

  return;
});
