/* **********************************************************************************
 *                           Gestion des IMPORTATIONS                                *
 *************************************************************************************/
import additifsEuropeenDiviseeOrdonneeFiltree from "./additifsEUROPA.js";
import {
  capitalizeWord,
  createHTMLListElementAndInjectInDOM,
  fetchBarcodeDatas,
  injectElement,
  pushSearchedValueFromArrayToNewArray,
  removeAllChildrensOfParentElement,
  toUppercaseWord,
} from "./utils.js";

/* **********************************************************************************
 *                           Récupérer les éléments HTML                             *
 *************************************************************************************/

const el_Body = document.querySelector("body");
const el_Form = document.querySelector("#form");
const el_SearchInput = document.querySelector("#barcode");
const el_InputSubmit = document.querySelector("#submit");
const el_AllergenInput = document.querySelector("#allergen-checkbox");
const el_AdditiveInput = document.querySelector("#additive-checkbox");
const el_NoAnimalInput = document.querySelector("#no-animal-checkbox");
const el_ResultProductSection = document.querySelector("#resultSection");
const el_ResultTitle = document.querySelector(".result-section__title");
const el_ResultIntro = document.querySelector(".result-section__intro");
const el_ResultNameSection = document.querySelector("#resultNameSection");
const el_ResultAllergenSection = document.querySelector(
  "#resultAllergenSection"
);
const el_ResultAdditiveSection = document.querySelector(
  "#resultAdditiveSection"
);
const el_ResultProductInformationSection = document.querySelector(
  ".result-information"
);
const el_ResultProductInformationH3 = document.querySelector(
  ".result-information__title"
);
const el_ResultProductClassification = document.querySelector(
  ".result-classification"
);
const el_ErrorContainer = document.querySelector(".error-container");
const el_ErrormMessage = document.querySelector(".error-message");

/* **********************************************************************************
 *                                     CODE                                          *
 *************************************************************************************/

/***********************************************
 *              RECHERCHE PRODUIT               *
 ************************************************/

/***** Récupérer l'emplacement du titre "RESULTAT" de la section de résultat pour pouvoir faire un scroll lors de la recherche *****/
const verticalResultTitlePosition = el_ResultTitle.getBoundingClientRect().y;
// console.log(verticalResultTitlePosition);

/***** Récupérer le code-Barre à la soumission du formulaire *****/
el_Form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const barcode = el_SearchInput.value;
  const REGEX_VALID_BARCODE = /^([0-9]{8}|[0-9]{13})$/g;

  const result = await fetchBarcodeDatas(barcode);
  console.log("result", result);

  // If barcode isn't valid
  if (!REGEX_VALID_BARCODE.test(barcode)) {
    el_ErrormMessage.textContent =
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
    removeAllChildrensOfParentElement(el_ResultProductInformationH3);
    removeAllChildrensOfParentElement(el_ResultProductClassification);
    el_ResultProductInformationSection.classList.remove(
      "result-information-actif"
    );
    document.querySelector(".wave")?.remove();

    return;
  }

  // If product not found
  if (result.status_verbose === "product not found") {
    // Gestion d'erreur à afficher à l'utilisateur => Product not found
    el_ErrormMessage.textContent =
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

  // * Effacer l'élément anciennement chercher lors d'une nouvelle recherche
  removeAllChildrensOfParentElement(el_ResultNameSection);
  removeAllChildrensOfParentElement(el_ResultAllergenSection);
  removeAllChildrensOfParentElement(el_ResultAdditiveSection);
  removeAllChildrensOfParentElement(el_ResultProductInformationH3);
  removeAllChildrensOfParentElement(el_ResultProductClassification);
  el_ResultProductInformationSection.classList.remove(
    "result-information-actif"
  );
  document.querySelector(".wave")?.remove();

  if (result.status_verbose === "product found") {
    // * Récupérer le nom de la marque et du produit
    let product = result.product;
    let findedNameProduct = null;

    // On remplace les ',' par ', ' si il y en a
    let brands = product.brands.replaceAll(",", ", ");
    let abbreviatedProductName = product.abbreviated_product_name;
    let productName = product.product_name;
    let productNameFr = product.product_name_fr;
    let genericName = product.generic_name;

    // Regarder si les éléments du nom du produit récupérés sont présents en tant que propriété et si ils ne sont pas vide (on récupère dans l'ordre donné sinon)
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

    // * Récupérer le nom de la marque: le formater ou texte par defaut sinon
    let formatedBrand = null;
    if (brands) {
      brands = toUppercaseWord(brands);
      formatedBrand = `${brands} - ${findedNameProduct}`;
    } else {
      formatedBrand = `Marque inconnue - ${findedNameProduct}`;
    }

    // * Récupérer les allergenes
    let allergenArray = product.allergens_hierarchy;
    let traceArray = product.traces_hierarchy;
    let filteredAllAllergens = [];
    let allergensNotFound = false;

    if (el_AllergenInput.checked) {
      console.log("les allergènes :", allergenArray, traceArray);

      // Si les tableaux d'allergenes et de traces récupérés sont vides
      if (!allergenArray.length && !traceArray.length) {
        allergensNotFound = true;
      } else {
        // Récupérer les éléments du tableau allergenArray
        let formatedAllergensArray = [];
        pushSearchedValueFromArrayToNewArray(
          allergenArray,
          formatedAllergensArray,
          ":",
          1
        );
        console.log("Tableaux des allergies :", formatedAllergensArray);

        // Récupérer les éléments du tableau allergenArray
        let formatedTracesArray = [];
        pushSearchedValueFromArrayToNewArray(
          traceArray,
          formatedTracesArray,
          ":",
          1
        );
        console.log("Tableaux des traces d'allergies :", formatedTracesArray);

        // Concaténer les deux tableaux pour former le tableau total d'allergènes
        let allAllergens = new Set(
          formatedAllergensArray.concat(formatedTracesArray).sort()
        );
        console.log("allAllergens :", allAllergens);

        filteredAllAllergens = [...allAllergens];
      }
    }

    /***** Récupérer les additifs *****/
    let additifArray = product.additives_original_tags;
    let additivesNotFound = false;
    let formatedAdditivesArray = [];
    let resultAdditif = "";
    const formatedAdditivesList = [];

    if (el_AdditiveInput.checked) {
      console.log("liste des additifs :", additifArray);

      // Si le tableau d'additifs est vide
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
        console.log("resultAdditif : ", resultAdditif);
        console.log("formatedAdditivesArray : ", formatedAdditivesArray);

        // * Récupérer le nom additif correspondant au code additif (dans le module additifsEUROPA.js)
        //Rechercher les additifs du produits recherché dans la liste additifsEuro
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
        console.log("formatedAdditivesList :", formatedAdditivesList);
      }
    }

    // TODO:  Récupérer les ingrédients avec la présence animal

    // * Injecter les resultats dans le DOM

    /*** Supprimer l'élément <p> d'intro ***/
    el_ResultIntro.remove();

    /*** Injecter le NOM du produit ***/
    const titleResultNameSectionEl = injectElement(
      "h3",
      el_ResultNameSection,
      "Produit"
    );
    titleResultNameSectionEl.classList.add("result-section__subtitle");

    const productNameEl = injectElement("p", el_ResultNameSection, result);
    productNameEl.classList.add("resultName-section__product");

    /*** Injecter les ALLERGENES ***/
    if (el_AllergenInput.checked) {
      const titleResultAllergenSectionEl = injectElement(
        "h3",
        el_ResultAllergenSection,
        "Allergènes"
      );
      titleResultAllergenSectionEl.classList.add("result-section__subtitle");

      if (allergensNotFound) {
        console.log("aucun allergernes trouvés");
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

    /*** Injecter les ADDITIFS ***/
    // Les additifs
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

    /*** Injecter les informations complémentaires (Nutriscore et Nova) ***/
    /* Injecter le svg au sein de la balise h3'*/
    el_ResultProductInformationH3.innerHTML = `<svg class="result-information-H3-svg" xmlns="http://www.w3.org/2000/svg" width="498" height="94" viewBox="0 0 498 94">
          <g id="Groupe_27" data-name="Groupe 27" transform="translate(-634 -1177)">
            <path id="Rectangle_11" data-name="Rectangle 11" d="M7.333,0h404A86.667,86.667,0,0,1,498,86.667v0A7.333,7.333,0,0,1,490.667,94h-404A86.667,86.667,0,0,1,0,7.333v0A7.333,7.333,0,0,1,7.333,0Z" transform="translate(634 1177)" fill="#a9de81"/>
            <text id="Classification" transform="translate(687 1244)" fill="#f8f8f8" font-size="48" font-family="Comfortaa" font-weight="300" letter-spacing="-0.03em"><tspan x="0" y="0">CLASSIFICATION</tspan></text>
          </g>
        </svg>`;

    /* Ajouter la classe pour les styles lorsque cette section apparaît */
    el_ResultProductInformationSection.classList.add(
      "result-information-actif"
    );

    /* Ajouter les deux éléments graphique pour l'effet de vague */
    const injectedImgWaveInformation = injectElement(
      "img",
      el_ResultProductInformationSection
    );
    injectedImgWaveInformation.setAttribute("src", "src/assets/icon/Wave.png");
    injectedImgWaveInformation.setAttribute(
      "alt",
      "Image utilisé pour le graphisme de la page"
    );
    injectedImgWaveInformation.classList.add("wave");

    /* Injecter l'image du nutriscore */
    let nutriScore = product.nutriscore_grade;
    let injectedNutriscore = null;

    injectedNutriscore = injectElement("img", el_ResultProductClassification);
    injectedNutriscore.classList.add(
      "result-nutriscore",
      "result-classification-childrens"
    );

    switch (nutriScore) {
      case "a":
        injectedNutriscore.setAttribute(
          "src",
          "src/assets/images/NutriScore/NutriScore A.png"
        );
        injectedNutriscore.setAttribute("alt", "Image nutriscore classement A");
        break;

      case "b":
        injectedNutriscore.setAttribute(
          "src",
          "src/assets/images/NutriScore/NutriScore B.png"
        );
        injectedNutriscore.setAttribute("alt", "Image nutriscore classement B");
        break;

      case "c":
        injectedNutriscore.setAttribute(
          "src",
          "src/assets/images/NutriScore/NutriScore C.png"
        );
        injectedNutriscore.setAttribute("alt", "Image nutriscore classement C");
        break;

      case "d":
        injectedNutriscore.setAttribute(
          "src",
          "src/assets/images/NutriScore/NutriScore D.png"
        );
        injectedNutriscore.setAttribute("alt", "Image nutriscore classement D");
        break;

      case "e":
        injectedNutriscore.setAttribute(
          "src",
          "src/assets/images/NutriScore/NutriScore E.png"
        );
        injectedNutriscore.setAttribute("alt", "Image nutriscore classement E");
        break;

      default:
        injectedNutriscore.setAttribute(
          "src",
          "src/assets/images/NutriScore/NutriScore - Undefined.png"
        );
        injectedNutriscore.setAttribute("alt", "Image nutriscore indéfini");
    }

    /* Injecter l'image du NOVA score */
    let novaScore = product.nova_group;
    let injectedNovascore = null;

    injectedNovascore = injectElement("img", el_ResultProductClassification);
    injectedNovascore.classList.add(
      "result-novascore",
      "result-classification-childrens"
    );

    switch (novaScore) {
      case 1:
        injectedNovascore.setAttribute(
          "src",
          "src/assets/images/NovaScore/NovaScore 1_1.png"
        );
        injectedNovascore.setAttribute("alt", "Image novascore classement 1");
        break;

      case 2:
        injectedNovascore.setAttribute(
          "src",
          "src/assets/images/NovaScore/NovaScore 2_1.png"
        );
        injectedNovascore.setAttribute("alt", "Image novascore classement 2");
        break;

      case 3:
        injectedNovascore.setAttribute(
          "src",
          "src/assets/images/NovaScore/NovaScore 3_1.png"
        );
        injectedNovascore.setAttribute("alt", "Image novascore classement 3");
        break;

      case 4:
        injectedNovascore.setAttribute(
          "src",
          "src/assets/images/NovaScore/NovaScore 4_2.png"
        );
        injectedNovascore.setAttribute("alt", "Image novascore classement 4");
        break;

      default:
        injectedNovascore.setAttribute(
          "src",
          "src/assets/images/NovaScore/NovaScore Inconnu.png"
        );
        injectedNovascore.setAttribute("alt", "Image novascore inconnu");
    }

    // Sinon (repsonse.status != 1), le produit n'est pas présent dans la base de données

    /** Faire défiler la page jusqu'à la section de résultat **/
    // Récupérer l'emplacement Y de la page actuelle (dans le cas où la page à été scrollée)
    const actuallyVerticalPagePosition = window.scrollY;

    // Scroller vars le titre en soustrayant la hauteur de scroll actuelle en enlevant qque pixel pour écarter le titre du haut du window (question d'ergonomie)
    window.scrollBy(
      0,
      verticalResultTitlePosition - actuallyVerticalPagePosition - 20
    );
  } else {
    // Cas erreur de retour non 200
    let errorServerResponseText = `${xhr.statusText} : Une erreur est survenue, impossible d'afficher le produit`;
    const errorServerResponse = injectElement(
      "h3",
      el_ResultNameSection,
      errorServerResponseText
    );
  }
});
