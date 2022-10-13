import React from "react";
import "./ResultsSection.css";
import ResultHome from "./ResultHome/ResultHome";
import ResultNameContainer from "./ResultNameContainer/ResultNameContainer";


const ResultsSection = (props) => {
  const { launchedSearch, allergenIsChecked, additifIsChecked, brandProduct, allergenList, additifList } = props;

  console.log('launchedSearch', launchedSearch,  'allergenIsChecked', allergenIsChecked, 'additifIsChecked', additifIsChecked)

  let displayBrand = null;
  let displayAllergen = null;
  let displayAdditif = null;

  // Si je lance la recherche
  if(launchedSearch){
    // J'affiche la 1ère sous section qui est : Produit - Nom du produit
    displayBrand = <ResultNameContainer resultTitle={'Produit'} productName={brandProduct}/>

    // Lors de la recherche: si j'ai coché "Allergènes"
    if(allergenIsChecked){
      // J'affiche la sous section "Allergènes: Liste des allergènes"
      displayAllergen = <ResultNameContainer resultTitle={'Allergènes'} list={allergenList} />
    }

    // Lors de la recherche: si j'ai coché "Additifs"
    if(additifIsChecked){
      // J'affiche la sous section "Additifs: Liste des additifs"
      console.log('additif is check')
      displayAdditif = <ResultNameContainer resultTitle={'Additifs'} list={additifList} />
    }

  // Si je n'ai pas encore lancé la recherche
  } else {
    // Alors j'affiche le message par défaut
    displayBrand = <ResultHome />
  }
  

  return (
    <section className="resultProduct-section" id="id-resultProductSection">

      <h2 className="resultProduct-section-h2">
        <svg xmlns="http://www.w3.org/2000/svg" width="705" height="149" viewBox="0 0 705 149">
          <g id="Groupe_9" data-name="Groupe 9" transform="translate(-690.067 -1176.656)">
            <path id="Rectangle_11" data-name="Rectangle 11" d="M11,0H575A130,130,0,0,1,705,130v8a11,11,0,0,1-11,11H130A130,130,0,0,1,0,19V11A11,11,0,0,1,11,0Z" transform="translate(690.067 1176.656)" fill="#dec0f5"/>
            <text id="Résultat" transform="translate(855.067 1280.656)" fill="#f8f8f8" fontSize="76" fontFamily="Comfortaa" fontWeight="300" letterSpacing="-0.03em"><tspan x="10" y="0">RÉSULTAT</tspan></text>
          </g>
        </svg>
      </h2>

      {displayBrand}
      {displayAllergen}
      {displayAdditif}


      {/* <div class="resultAllergen-section resultProduct-section-sousSection center-BP" id="resultAllergenSection"> */}
        {/* <!-- H3 class="resultProduct-section-h3": Allergènes --> */}
        {/* <!-- ul class="resultProduct-section-list"
        li class="resultProduct-section-list-item"
        li
        --> */}
      {/* </div> */}

      {/* <div class="resultAdditive-section resultProduct-section-sousSection center-BP" id="resultAdditiveSection"> */}
        {/* <!-- H3 class="resultProduct-section-h3": Additifs --> */}
        {/* <!-- ul
        li
        li
        --> */}
      {/* </div> */}
      
    </section>
  )
}

export default ResultsSection;