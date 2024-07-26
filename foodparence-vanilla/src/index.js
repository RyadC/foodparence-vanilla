/* **********************************************************************************
 *                           Gestion des IMPORTATIONS                                *
 *************************************************************************************/
// import { additifsEuropeenDiviseeOrdonneeFiltree } from "./additifsEUROPA.js";
// import { additifsEuropeenDiviseeOrdonneeFiltree } from "./additifsEUROPA.mjs";
// import { translate } from "../../node_modules/google-translate-api/index.js";
// const additifsEuropeenDiviseeOrdonneeFiltree = require('./additifsEUROPA');
import additifsEuropeenDiviseeOrdonneeFiltree from "./additifsEUROPA.js";
import {
  capitalizeWord,
  createHTMLListElementAndInjectInDOM,
  injectElement,
  pushSearchedValueFromArrayToNewArray,
  removeAllChildrensOfParentElement,
  toUppercaseWord,
} from "./utils.js";
// const additifsEuropeenDiviseeOrdonneeFiltree = require('./additifsEUROPA.js');
// const translate = require('google-translate-api');

/* **********************************************************************************
 *                           Récupérer les éléments HTML                             *
 *************************************************************************************/

/**** BODY ****/
const el_Body = document.querySelector("body");

/***** FORM *****/
const el_Form = document.querySelector("#form");

/** SEARCH SECTION **/
const el_SearchInput = document.querySelector("#barcode");
const el_InputSubmit = document.querySelector("#submit");

/** ALLERGEN **/
const el_AllergenInput = document.querySelector("#allergen-checkbox");

/** ADDITIVES   **/
const el_AdditiveInput = document.querySelector("#additive-checkbox");

/** NO-ANIMAL **/
const el_NoAnimalInput = document.querySelector("#no-halal-checkbox");

/***** RESULT PRODUCT SECTION *****/
const el_ResultProductSection = document.querySelector("#resultSection");

/** H2 **/
const el_ResultTitle = document.querySelector(".result-section__title");

/** P INTRO **/
const el_ResultIntro = document.querySelector(".result-section__intro");

/** NAME SECTION **/
const el_ResultNameSection = document.querySelector("#resultNameSection");

/** ALLERGEN SECTION **/
const el_ResultAllergenSection = document.querySelector(
  "#resultAllergenSection"
);

/** ADDITIVE SECTION **/
const el_ResultAdditiveSection = document.querySelector(
  "#resultAdditiveSection"
);

/***** CLASSIFICATION SECTION *****/
const el_ResultProductInformationSection = document.querySelector(
  ".result-information"
);
const el_ResultProductInformationH3 = document.querySelector(
  ".result-information__title"
);

const el_ResultProductClassification = document.querySelector(
  ".result-classification"
);

/* **********************************************************************************
 *                                     CODE                                          *
 *************************************************************************************/

/***********************************************
 *              RECHERCHE PRODUIT               *
 ************************************************/

/***** Récupérer l'emplacement du titre H2 "RESULTAT" de la section de résultat pour pouvoir faire un scroll lors de la recherche *****/
const verticalResultTitlePosition = el_ResultTitle.getBoundingClientRect().y;
console.log(verticalResultTitlePosition);

/***** Récupérer le code-Barre à la soumission du formulaire *****/
el_Form.addEventListener("submit", function (e) {
  e.preventDefault();
  const barcode = el_SearchInput.value;
  const REGEX_VALID_BARCODE = /^([0-9]{8}|[0-9]{13})$/g;

  // Si l'utilisateur n'a pas entré un texte valide
  if (!REGEX_VALID_BARCODE.test(barcode)) {
    alert("Veuillez entrer un code barre valide");
    el_AllergenInput.checked = false;
    el_NoAnimalInput.checked = false;
    el_AdditiveInput.checked = false;
    removeAllChildrensOfParentElement(el_ResultNameSection);
    removeAllChildrensOfParentElement(el_ResultAllergenSection);
    removeAllChildrensOfParentElement(el_ResultAdditiveSection);
  } else {
    console.dir(el_ResultNameSection);

    /***** Effacer l'élément anciennement chercher lors d'une nouvelle recherche *****/
    removeAllChildrensOfParentElement(el_ResultNameSection);
    removeAllChildrensOfParentElement(el_ResultAllergenSection);
    removeAllChildrensOfParentElement(el_ResultAdditiveSection);
    removeAllChildrensOfParentElement(el_ResultProductInformationH3);
    removeAllChildrensOfParentElement(el_ResultProductClassification);

    /***** Ouvrir une requête pour récupérer des données sur OpenFoodFact *****/
    const xhr = new XMLHttpRequest();

    xhr.open(
      "GET",
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    );
    xhr.send();

    /***** Agir lorsque la réponse est arrivée *****/
    xhr.addEventListener("loadend", () => {
      console.log(xhr.status);

      // Vérifier le retour du serveur ET d'une requête sans erreur (200)
      if (xhr.status === 200) {
        // Vérifier si le produit est présent dans la base de données, si oui effectuer toutes les actions d'affichage
        const xhrResponse = JSON.parse(xhr.response);

        if (xhrResponse.status === 1) {
          /***** Récupérer la réponse *****/
          // Récupérer la réponse
          let responseRequest = xhr.response;

          // Parser en objet JS
          let responseRequestObject = JSON.parse(responseRequest);

          console.log(responseRequestObject);
          // console.log(responseRequestObject.product.generic_name);

          /***** Récupérer le nom de la marque et du produit *****/
          // Déclarer les valeurs récupérant les différents nom du produits selon leur disponibilité
          let nameProduct = null;

          // On remplace les ',' par ', ' si il y en a
          let brands = responseRequestObject.product.brands.replaceAll(
            ",",
            ", "
          );
          let abbreviatedProductName =
            responseRequestObject.product.abbreviated_product_name;
          let productName = responseRequestObject.product.product_name;
          let productNameFr = responseRequestObject.product.product_name_fr;
          let genericName = responseRequestObject.product.generic_name;

          // Regarder si les éléments du nom du produit récupérés sont présents en tant que propriété et si ils ne sont pas vide (on récupère dans l'ordre donné sinon)
          if (productNameFr) {
            nameProduct = capitalizeWord(productNameFr);
          } else if (productName) {
            nameProduct = capitalizeWord(productName);
          } else if (abbreviatedProductName) {
            nameProduct = capitalizeWord(abbreviatedProductName);
          } else if (genericName) {
            nameProduct = capitalizeWord(genericName);
          } else {
            nameProduct = "Nom du produit inconnu";
          }

          /***** Récupérer le nom de la marque: le formater ou texte par defaut sinon *****/
          let result = null;
          if (brands) {
            brands = toUppercaseWord(brands);
            result = `${brands} - ${nameProduct}`;
          } else {
            result = `Marque inconnue - ${nameProduct}`;
          }

          /***** Récupérer les allergenes *****/
          let allergenArray = responseRequestObject.product.allergens_hierarchy;
          let traceArray = responseRequestObject.product.traces_hierarchy;
          let resultAllergenAndTraceArrayOrdonned = [];
          let resultAllergenAndTraceArrayFiltered = [];
          let resultAllergenAndTraceABSENT = false;

          if (el_AllergenInput.checked === true) {
            console.log(allergenArray, traceArray);

            // Si les tableaux d'allergenes et de traces récupérés sont vides
            if (allergenArray.length < 1 && traceArray.length < 1) {
              resultAllergenAndTraceABSENT = true;
            } else {
              // Récupérer les éléments du tableau allergenArray
              let allergenArrayFormate = [];
              pushSearchedValueFromArrayToNewArray(
                allergenArray,
                allergenArrayFormate,
                ":",
                1
              );
              console.log(allergenArrayFormate);

              // Récupérer les éléments du tableau allergenArray
              let traceArrayFormate = [];
              pushSearchedValueFromArrayToNewArray(
                traceArray,
                traceArrayFormate,
                ":",
                1
              );
              console.log(traceArrayFormate);

              // Concaténer les deux tableaux pour former le tableau total d'allergènes
              resultAllergenAndTraceArrayOrdonned = allergenArrayFormate
                .concat(traceArrayFormate)
                .sort();
              console.log(resultAllergenAndTraceArrayOrdonned);

              /* Filtre le tableau ordonné pour supprimmer les occurences */
              // Lors de la première itération car le tableau est vide
              resultAllergenAndTraceArrayFiltered.push(
                resultAllergenAndTraceArrayOrdonned[0]
              );

              // Itère sur le tableau ordonné et récupère la valeur à comparer pour voir s'il est présent dans le tableau filtré
              for (
                let i = 1;
                i < resultAllergenAndTraceArrayOrdonned.length;
                i++
              ) {
                let trouvee = false;
                // On récupère la valeur de comparaison présent dans le tableau ordonné
                let elementDeRecherche = resultAllergenAndTraceArrayOrdonned[i];

                // On compare elementDeRecherche avec la dernière valeur injecté du tableau filtré (la comparaison est nécessaire seulement pour le dernier élément du tableau filtré étant donné que les valeurs sont dans l'ordre, la seul occurence possible sera sur la dernière valeur qu'on vient d'injecter)
                for (
                  let x = resultAllergenAndTraceArrayFiltered.length - 1;
                  x < resultAllergenAndTraceArrayFiltered.length;
                  x++
                ) {
                  if (
                    elementDeRecherche ===
                    resultAllergenAndTraceArrayFiltered[
                      resultAllergenAndTraceArrayFiltered.length - 1
                    ]
                  ) {
                    // Si oui, on sort de la boucle et on injecte pas cet élément
                    trouvee = true;
                    break;
                  }
                }
                if (trouvee === false) {
                  // Sinon, on injecte l'élément car il n'est pas présent dans le tableau
                  resultAllergenAndTraceArrayFiltered.push(
                    resultAllergenAndTraceArrayOrdonned[i]
                  );
                }
              }

              console.log(
                "resultAllergenAndTraceArrayFiltered : ",
                resultAllergenAndTraceArrayFiltered
              );
            }
          }

          /***** Récupérer les additifs *****/
          let additifArray =
            responseRequestObject.product.additives_original_tags;
          let resultAdditifABSENT = false;
          let additifArrayFormate = [];
          let resultAdditif = "";
          let additifArrayFormateWithNameGrouped = [];

          if (el_AdditiveInput.checked === true) {
            console.log(additifArray);

            // Si le tableau d'additifs est vide
            if (additifArray.length < 1) {
              // resultAdditif = "Aucuns additifs ne semblent être présents"
              resultAdditifABSENT = true;
            } else {
              // Récupérer les éléments du tableau additifArray
              pushSearchedValueFromArrayToNewArray(
                additifArray,
                additifArrayFormate,
                ":",
                1
              );
              console.log(additifArrayFormate);
              resultAdditif = additifArrayFormate.join(", ");
              console.log(resultAdditif);

              /*** Récupérer le nom additif correspondant au code additif (dans le module additifsEUROPA.js) ***/
              // Rechercher si l'élément est présent dans la liste des additifs et les extraire dans un tableau
              let additifArrayFormateWithNameSeparated = [];
              for (
                let numberOfPresentAdditives = 0;
                numberOfPresentAdditives < additifArrayFormate.length;
                numberOfPresentAdditives++
              ) {
                let trouvee = false;

                for (
                  let i = 0;
                  i < additifsEuropeenDiviseeOrdonneeFiltree.length;
                  i++
                ) {
                  if (
                    additifsEuropeenDiviseeOrdonneeFiltree[i][0] ===
                    additifArrayFormate[numberOfPresentAdditives]
                  ) {
                    additifArrayFormateWithNameSeparated.push(
                      additifsEuropeenDiviseeOrdonneeFiltree[i]
                    );
                    trouvee = true;
                    break;
                  }
                }

                if (!trouvee) {
                  additifArrayFormateWithNameSeparated.push([
                    additifArrayFormate[numberOfPresentAdditives],
                    "Oups! Additif inconnu",
                  ]);
                }

                console.log(additifArrayFormateWithNameSeparated);
              }

              // Regrouper les codes repsectivement avec leur dénomination
              for (
                let numberOfSubArray = 0;
                numberOfSubArray < additifArrayFormateWithNameSeparated.length;
                numberOfSubArray++
              ) {
                additifArrayFormateWithNameGrouped.push(
                  additifArrayFormateWithNameSeparated[numberOfSubArray].join(
                    ": "
                  )
                );
              }

              console.log(additifArrayFormateWithNameGrouped);
            }
          }

          /***** Récupérer les ingrédients non halal *****/

          /***** Injecter les resultats dans le DOM *****/

          /*** Supprimer l'élément <p> d'intro ***/
          el_ResultIntro.remove();

          /*** Injecter le NOM du produit ***/
          // Injecter le H2
          const injectedH3Name = injectElement(
            "h3",
            el_ResultNameSection,
            "Produit"
          );
          injectedH3Name.classList.add("result-section__subtitle");
          // Le nom du produit
          const injectedProduct = injectElement(
            "p",
            el_ResultNameSection,
            result
          );
          injectedProduct.classList.add("resultName-section__product");
          console.log(injectedProduct);

          /*** Injecter les ALLERGENES ***/
          // Les allergènes
          if (el_AllergenInput.checked) {
            // Le <h2>
            const injectedH3Allergen = injectElement(
              "h3",
              el_ResultAllergenSection,
              "Allergènes"
            );
            injectedH3Allergen.classList.add("result-section__subtitle");

            if (resultAllergenAndTraceABSENT) {
              const injectedPAllergen = injectElement(
                "p",
                el_ResultAllergenSection,
                "Aucun allergène semble être présent"
              );
              injectedPAllergen.classList.add("result-section-default");
            } else {
              // La liste <ul>
              const injectedUlAllergen = injectElement(
                "ul",
                el_ResultAllergenSection
              );

              // Les items <li>
              /* Voir explication dans additifs pour la logique de ce code */
              const itemsListAllergenObject =
                createHTMLListElementAndInjectInDOM(
                  resultAllergenAndTraceArrayFiltered,
                  "injectedLIAllergen",
                  "li",
                  injectedUlAllergen
                );

              let itemsListAllergenObjectKeyArray = Object.keys(
                itemsListAllergenObject
              );

              for (let li of itemsListAllergenObjectKeyArray) {
                itemsListAllergenObject[li].classList.add(
                  "result-section__item"
                );
              }
            }
          }

          /*** Injecter les ADDITIFS ***/
          // Les additifs
          if (el_AdditiveInput.checked) {
            // Le <h2>
            const injectedH3Additive = injectElement(
              "h3",
              el_ResultAdditiveSection,
              "Additifs"
            );
            injectedH3Additive.classList.add("result-section__subtitle");

            if (resultAdditifABSENT) {
              const injectedPAdditive = injectElement(
                "p",
                el_ResultAdditiveSection,
                "Aucun additif semble être présent"
              );
              injectedPAdditive.classList.add("result-section-default");
            } else {
              // La liste <ul>
              const injectedUlAdditive = injectElement(
                "ul",
                el_ResultAdditiveSection
              );

              // Les items <li>
              /* Créer un objet contenant dynamiquement des propriétés 'injectedAdditive${N}' où chacune de ces propriété contient l'objet HTML <li> créé. Je peux donc accéder à l'objet HTML DOM en passant par l'objet puis la propriété pour manipuler cet HTMLElement avec les méthodes du DOM.
              EX: itemsListAdditiveObject.injectedAdditive0.style.color = "red";
              J'accède à l'objet puis à la propriété injectedAdditive0 qui à pour valeur un <li>. Puis je le manipule avec les méthodes du DOM. Cela ne créé pas des sous propriétés mais utilise l'objet li est accède à ses méthodes et propriétés.
              Si je veux ajouter une classe ou autre sur l'ensemble des <li>, je n'ai qu'à itérer sur les propriétés de l'objets qui sont les <li> crées. */
              const itemsListAdditiveObject =
                createHTMLListElementAndInjectInDOM(
                  additifArrayFormateWithNameGrouped,
                  "injectedLIAdditive",
                  "li",
                  injectedUlAdditive
                );

              let itemsListAdditiveObjectKeyArray = Object.keys(
                itemsListAdditiveObject
              );

              for (let li of itemsListAdditiveObjectKeyArray) {
                itemsListAdditiveObject[li].classList.add(
                  "result-section__item"
                );
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
          injectedImgWaveInformation.setAttribute(
            "src",
            "src/assets/icon/Wave.png"
          );
          injectedImgWaveInformation.setAttribute(
            "alt",
            "Image utilisé pour le graphisme de la page"
          );
          injectedImgWaveInformation.classList.add("wave");

          /* Injecter l'image du nutriscore */
          let nutriScore = responseRequestObject.product.nutriscore_grade;
          let injectedNutriscore = null;

          injectedNutriscore = injectElement(
            "img",
            el_ResultProductClassification
          );
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
              injectedNutriscore.setAttribute(
                "alt",
                "Image nutriscore classement A"
              );
              break;

            case "b":
              injectedNutriscore.setAttribute(
                "src",
                "src/assets/images/NutriScore/NutriScore B.png"
              );
              injectedNutriscore.setAttribute(
                "alt",
                "Image nutriscore classement B"
              );
              break;

            case "c":
              injectedNutriscore.setAttribute(
                "src",
                "src/assets/images/NutriScore/NutriScore C.png"
              );
              injectedNutriscore.setAttribute(
                "alt",
                "Image nutriscore classement C"
              );
              break;

            case "d":
              injectedNutriscore.setAttribute(
                "src",
                "src/assets/images/NutriScore/NutriScore D.png"
              );
              injectedNutriscore.setAttribute(
                "alt",
                "Image nutriscore classement D"
              );
              break;

            case "e":
              injectedNutriscore.setAttribute(
                "src",
                "src/assets/images/NutriScore/NutriScore E.png"
              );
              injectedNutriscore.setAttribute(
                "alt",
                "Image nutriscore classement E"
              );
              break;

            default:
              injectedNutriscore.setAttribute(
                "src",
                "src/assets/images/NutriScore/NutriScore - Undefined.png"
              );
              injectedNutriscore.setAttribute(
                "alt",
                "Image nutriscore indéfini"
              );
          }

          /* Injecter l'image du NOVA score */
          let novaScore = responseRequestObject.product.nova_group;
          let injectedNovascore = null;

          injectedNovascore = injectElement(
            "img",
            el_ResultProductClassification
          );
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
              injectedNovascore.setAttribute(
                "alt",
                "Image novascore classement 1"
              );
              break;

            case 2:
              injectedNovascore.setAttribute(
                "src",
                "src/assets/images/NovaScore/NovaScore 2_1.png"
              );
              injectedNovascore.setAttribute(
                "alt",
                "Image novascore classement 2"
              );
              break;

            case 3:
              injectedNovascore.setAttribute(
                "src",
                "src/assets/images/NovaScore/NovaScore 3_1.png"
              );
              injectedNovascore.setAttribute(
                "alt",
                "Image novascore classement 3"
              );
              break;

            case 4:
              injectedNovascore.setAttribute(
                "src",
                "src/assets/images/NovaScore/NovaScore 4_2.png"
              );
              injectedNovascore.setAttribute(
                "alt",
                "Image novascore classement 4"
              );
              break;

            default:
              injectedNovascore.setAttribute(
                "src",
                "src/assets/images/NovaScore/NovaScore Inconnu.png"
              );
              injectedNovascore.setAttribute("alt", "Image novascore inconnu");
          }

          // Sinon (repsonse.status != 1), le produit n'est pas présent dans la base de données
        } else {
          let unknownProductText =
            "Désolé, nous ne connaissons pas ce produit :(";
          const unknownProduct = injectElement(
            "h3",
            el_ResultNameSection,
            unknownProductText
          );

          el_SearchInput.value = "";
          el_AdditiveInput.checked = false;
          el_AllergenInput.checked = false;
        }

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
  }
});
