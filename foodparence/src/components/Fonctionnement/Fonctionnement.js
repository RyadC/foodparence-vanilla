import React from "react";
import Navbar from "../Navigation/Navbar/Navbar";
import "./Fonctionnement.css"

const Fonctionnement = () => {

  return (
    <React.Fragment>
      <div className="overlay">
  </div>

  <div className="container">

    {/* HEADRER */}
    <Navbar />


    <section className="home">
      <h1 className="home-h1">
        <a className="home-h1-link" href="../index.html">
          <img className="home-h1-img" src="../assets/logo/Groupe 1.png" alt="Le Logo de Food'Parence" />
        </a>
      </h1>
    </section>

    <section className="section-fonctionnement">
      <div className="comment">
        <h2 className="comment-h2 fonctionnement-h2">Comment ça marche ?</h2>
        <div className="comment-textBlock">
          <p>
            Le principe est simple : un code-barre… et c'est parti !
          </p> 
          <p>
            Entrez votre code barre dans le champs de recherche puis cochez <strong className="text-important">les informations dont vous aimeriez voir apparaître suite à votre recherche (allergènes, additifs, etc.)</strong>. 
          </p>
          <p>
            Une fois vos critères de choix cochés et votre code-barre saisie, vous pouvez appuyer sur l'icone <svg className="loupe-icon" xmlns="http://www.w3.org/2000/svg" width="39.777" height="39.787" viewBox="0 0 39.777 39.787">
              <path id="Icon_ionic-ios-search" data-name="Icon ionic-ios-search" d="M43.811,41.4,32.748,30.234a15.766,15.766,0,1,0-2.393,2.424l10.99,11.094a1.7,1.7,0,0,0,2.4.062A1.714,1.714,0,0,0,43.811,41.4ZM20.359,32.793a12.449,12.449,0,1,1,8.8-3.646A12.372,12.372,0,0,1,20.359,32.793Z" transform="translate(-4.5 -4.493)" />
            </svg> pour lancer la recherche. Les résultats seront par la suite affichés juste en dessous !
          </p>
        </div>
      </div>

      <div className="resultats">
        <h2 className="resultats-h2 fonctionnement-h2">Les résultats</h2>
        <div className="resultats-textBlock">
          <p>Les résultats concernant la recherche se divisent en deux sections distinctes:</p>
          <ul>
            <li>Les informations sur l'identité du produit et son contenu (sa marque, son nom, ses ingrédients, etc.).</li>
            <li>Les informations qualitatives / nutritionnelles avec l'affichage du nutriscore et du novascore.</li>
          </ul>

          <h3>L'identité du produit</h3>
          <p>Les résultats concernant l'identité du produit s'afficheront dans la section nommée "RESUTAT".</p>
          <p>Le résultat pourront contenir trois informations:</p>
          <ul>
            <li>La marque du produit suivie de son nom;</li>
            <li>Les allergènes possiblements présents;</li>
            <li>les additifs possibelemnts présents.</li>
          </ul>

          <p>Les résultats contiendront au minimum la marque du produit suivi de sa dénomination si le produit est connu et inscris dans la base de données. Si les cases "allergènes" et/ou "additifs" ont été cochées, alors ces informations s'afficheront en complément dans la même section respectivement sous les titres "Allergènes" et "Additifs".</p>
          
          <h3>La qualité du produit</h3>
          <p>Les résultats nutritionnels s'afficheront dans la section  "Classification". Ces informations apporteront un certain regard critique du produit. Ainsi, deux labels de notations seront proposés: <a href="https://solidarites-sante.gouv.fr/prevention-en-sante/preserver-sa-sante/nutrition/nutri-score/article/nutri-score-un-etiquetage-nutritionnel-pour-favoriser-une-alimentation" title="Qu'est-ce que le nutriscore ?" target="_blank">le nutriscore</a> et <a href="https://fr.wikipedia.org/wiki/NOVA_(nutrition)" title="Qu'est-ce que le novascore ?" target="_blank">le novascore</a>.</p>

          <h3>Présence des résultats</h3>
          <p>Les résultats s'afficheront si les données sont présents dans la base de données. Dans le cas contraire, un message s'affichera pour informer l'utilisateur que le produit, l'allergène ou l'additif n'est pas connu.</p>
          <p>Il en est de même pour les notations des deux labels. Si ces derniers ne sont pas renseignés dans la base de données, le label apparaîtra grisé.</p>
        </div>
      </div>
    </section>


    {/* // FOOTER */}



  </div>
    </React.Fragment>
  )
}

export default Fonctionnement;