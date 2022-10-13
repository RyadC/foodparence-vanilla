import React from "react";
import logo from "../../assets/images/Groupe 1.png"
import BarCodeSearch from "./BarCodeSearch/BarCodeSearch";
import CheckboxSearch from "./CheckboxSearch/CheckboxSearch";
import "./HomeSection.css"
import functions from "../../functions/functions";
import additifsEuropeenDiviseeOrdonneeFiltree from "../../tools/additifsEUROPA"

class HomeSection extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      inputValue: '',
      // allergenIsChecked: false,
      // additifIsChecked: false,
      // nohalalIsChecked: false,
    };
  };
 

  handleCheckbox = async (checkbox) => {
    const { allergenIsChecked, additifIsChecked, allergenCheck, additifCheck } = this.props;
    let isChecked = null;
    switch (checkbox) {
      case 'allergen':
        isChecked = allergenIsChecked;
        allergenCheck();
      break;
      case 'additive':
        isChecked = additifIsChecked;
        additifCheck();
      break;
      case 'no-halal':
        isChecked = this.state.nohalalIsChecked;
        this.setState({nohalalIsChecked: !isChecked})
      break;
    
      default:
        this.setState({
          allergenIsChecked: false,
          additifIsChecked: false,
          nohalalIsChecked: false,
        });
      break;
    };
  };

  onInputChange = (e) => {
    console.log(e.target.value)
    this.setState({inputValue: e.target.value})
  }

  getProduct = (e) => {
    const { inputValue } = this.state;

    return fetch(`https://world.openfoodfacts.org/api/v0/product/${inputValue}.json`, {
      method: 'GET',
    })
    .then(res => {
      if(res.status === 200){
        return res;
      } else {
        return { error: 'no response'}
      }
    })
    .catch(err => {
      return { error: `Failed to fetch: ${err}` }
    })
    .then(res => res.json())
    .then(data => {
      // console.log(data);
      if(data.status === 1){
        return data.product;
      } else {
        return { 
          error: {
            messageError: 'product not found in the database ',
            codeError: 597,
          }
        };
      }
    })
    .catch(err => {
      return { error: `Failed to get data: ${err}` }
    })
  }

  getBrandAndNameProduct = (product) => {
    const { formatTheWord, formatToUppercase } = functions;

    /***** Récupérer le nom de la marque et du produit *****/
    // Déclarer les valeurs récupérant les différents nom du produits selon leur disponibilité
    let nameProduct = null;
    
    // On remplace les ',' par ', ' si il y en a
    let brands = product.brands.replaceAll(',', ', ');
    const abbreviatedProductName = product.abbreviated_product_name;
    const productName = product.product_name;
    const productNameFr = product.product_name_fr;
    const genericName = product.generic_name;

    // Regarder si les éléments du nom du produit récupérés sont présents en tant que propriété et si ils ne sont pas vide (on récupère dans l'ordre donné sinon)
    if(productNameFr){
      nameProduct = formatTheWord(productNameFr);
    }else if(productName){
      nameProduct = formatTheWord(productName);
    }else if(abbreviatedProductName){
      nameProduct = formatTheWord(abbreviatedProductName);
    }else if(genericName){
      nameProduct = formatTheWord(genericName);
    }else{
      nameProduct = "Nom du produit inconnu"
    };
    
    /***** Récupérer le nom de la marque: le formater ou texte par defaut sinon *****/
    let resultProduct = null;
    if(brands){
      brands = formatToUppercase(brands);
      return resultProduct = `${brands} - ${nameProduct}`;
    }else{
      return resultProduct = `Marque inconnue - ${nameProduct}`
    };
  }

  getAllergens = (product) => {
    const { getValueSearchedFromArrayToNewArray } = functions;
    /***** Récupérer les allergenes *****/
    console.log(product)
    let allergenArray = product.allergens_hierarchy;
    let traceArray = product.traces_hierarchy;
    let resultAllergenAndTraceArrayOrdonned = [];
    let resultAllergenAndTraceArrayFiltered = [];
    let resultAllergenAndTraceABSENT = false;
    
    // console.log(allergenArray, traceArray);

    // Si les tableaux d'allergenes et de traces récupérés sont vides
    if(allergenArray.length < 1 && traceArray.length < 1){
      resultAllergenAndTraceABSENT = true;

    }else{

      // Récupérer les éléments du tableau allergenArray
      let allergenArrayFormate = [];
      getValueSearchedFromArrayToNewArray(allergenArray, allergenArrayFormate, ':', 1);


      // Récupérer les éléments du tableau traceArray
      let traceArrayFormate = [];
      getValueSearchedFromArrayToNewArray(traceArray, traceArrayFormate, ':', 1);
      // console.log(traceArrayFormate)
      

      // Concaténer les deux tableaux pour former le tableau total d'allergènes
      resultAllergenAndTraceArrayOrdonned = allergenArrayFormate.concat(traceArrayFormate).sort();
      // console.log(resultAllergenAndTraceArrayOrdonned);


      /* Filtre le tableau ordonné pour supprimmer les occurences */
      // Lors de la première itération car le tableau est vide
      resultAllergenAndTraceArrayFiltered.push(resultAllergenAndTraceArrayOrdonned[0]);
      
      // Itère sur le tableau ordonné et récupère la valeur à comparer pour voir s'il est présent dans le tableau filtré
      for(let i = 1; i < resultAllergenAndTraceArrayOrdonned.length; i++){
        let trouvee = false;
        // On récupère la valeur de comparaison présent dans le tableau ordonné
        let elementDeRecherche = resultAllergenAndTraceArrayOrdonned[i];

        // On compare elementDeRecherche avec la dernière valeur injecté du tableau filtré (la comparaison est nécessaire seulement pour le dernier élément du tableau filtré étant donné que les valeurs sont dans l'ordre, la seul occurence possible sera sur la dernière valeur qu'on vient d'injecter)
        for(let x = resultAllergenAndTraceArrayFiltered.length - 1; x < resultAllergenAndTraceArrayFiltered.length; x++){  
          if(elementDeRecherche === resultAllergenAndTraceArrayFiltered[resultAllergenAndTraceArrayFiltered.length - 1]){
            // Si oui, on sort de la boucle et on injecte pas cet élément
            trouvee = true;
            break;
          };
        };
        if(trouvee === false){
          // Sinon, on injecte l'élément car il n'est pas présent dans le tableau
          resultAllergenAndTraceArrayFiltered.push(resultAllergenAndTraceArrayOrdonned[i]);
        };
      };

      // console.log('resultAllergenAndTraceArrayFiltered : ', resultAllergenAndTraceArrayFiltered )

      return resultAllergenAndTraceArrayFiltered
    };  
  }

  getAdditifs = (product) => {
    const { getValueSearchedFromArrayToNewArray } = functions;

    console.log('product in additif', product)
    
    let additifArray = product.additives_original_tags;
    let resultAdditifABSENT = false;
    let additifArrayFormate = [];
    let resultAdditif = "";
    let additifArrayFormateWithNameGrouped = [];


    console.log(additifArray);

    // Si le tableau d'additifs est vide
    if(additifArray.length < 1){
    // resultAdditif = "Aucuns additifs ne semblent être présents"
      resultAdditifABSENT = true;

    }else{

      // Récupérer les éléments du tableau additifArray
      getValueSearchedFromArrayToNewArray(additifArray, additifArrayFormate, ':', 1);
      console.log(additifArrayFormate)
      resultAdditif = additifArrayFormate.join(', ');
      console.log(resultAdditif);

      
      /*** Récupérer le nom additif correspondant au code additif (dans le module additifsEUROPA.js) ***/
      // Rechercher si l'élément est présent dans la liste des additifs et les extraire dans un tableau
      let additifArrayFormateWithNameSeparated = [];
      for(let numberOfPresentAdditives = 0; numberOfPresentAdditives < additifArrayFormate.length; numberOfPresentAdditives++){
        let trouvee = false;

        for(let i = 0; i < additifsEuropeenDiviseeOrdonneeFiltree.length; i++){
          if(additifsEuropeenDiviseeOrdonneeFiltree[i][0] === additifArrayFormate[numberOfPresentAdditives]){
            additifArrayFormateWithNameSeparated.push(additifsEuropeenDiviseeOrdonneeFiltree[i]);
            trouvee = true;
            break;
          };
        };

        if(!trouvee){
          additifArrayFormateWithNameSeparated.push([additifArrayFormate[numberOfPresentAdditives], "Oups! Additif inconnu"]);
        };

        console.log(additifArrayFormateWithNameSeparated);
      };


      // Regrouper les codes repsectivement avec leur dénomination
      for(let numberOfSubArray = 0; numberOfSubArray < additifArrayFormateWithNameSeparated.length; numberOfSubArray++){
        additifArrayFormateWithNameGrouped.push(additifArrayFormateWithNameSeparated[numberOfSubArray].join(': '));
      };

      console.log(additifArrayFormateWithNameGrouped);
      return additifArrayFormateWithNameGrouped;

    };
    

  }

  jsProduct = async () => {
    const { allergenIsChecked, additifIsChecked, onBrandProductChange, onAllergenChange, onAdditifChange } = this.props;
    const { scrollToResultSection } = functions;

    const product = await this.getProduct();
    
    const brandProduct = this.getBrandAndNameProduct(product);
    onBrandProductChange(brandProduct);
    
    if(allergenIsChecked){
      const allergenList = this.getAllergens(product);
      console.log('allergenList', allergenList)
      onAllergenChange(allergenList);
    }

    if(additifIsChecked){
      const additifList = this.getAdditifs(product);
      console.log('additifList', additifList)
      onAdditifChange(additifList);
    }

    scrollToResultSection();

  }

  

  render() {
    const { launchSearch } = this.props;
    const { jsProduct, onInputChange, handleCheckbox } = this;

    return (
      <section className="home">
          <h1 className="home-h1">
            <a className="home-h1-link" href="index.html">
              <img className="home-h1-img" src={logo} alt="Le Logo de Food'Parence" />
            </a>
          </h1>
        
          <p className="home-slogan">Exigez plus de <strong className="slogan-important">transparence</strong>  pour vos <strong className="slogan-important">produits</strong></p>
        
          <form id="form" onSubmit={(e) => {
            e.preventDefault();
            launchSearch();
            jsProduct();
          }} >
            <BarCodeSearch onInputChange={onInputChange} />
            <div className="search-detailsProduct">
              <div className="search-detailsProduct-container"> 
                <CheckboxSearch checkboxName={'Allergènes'} nameProp={'allergen'} handleCheckbox={handleCheckbox} />
                <CheckboxSearch checkboxName={'Additifs'} nameProp={'additive'} handleCheckbox={handleCheckbox} />
                <CheckboxSearch checkboxName={'Non Halal'} nameProp={'no-halal'} handleCheckbox={handleCheckbox} />
              </div>
            </div>
          </form>
      </section>
    )
  }

}

export default HomeSection;