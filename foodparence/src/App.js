import React from 'react';
import './App.css';
import Fonctionnement from './components/Fonctionnement/Fonctionnement';
import Footer from './components/Footer/Footer';
import HomeSection from './components/HomeSection/HomeSection';
import Navbar from './components/Navigation/Navbar/Navbar';
import ResultsSection from './components/ResultsSection/ResultsSection';
class App extends React.Component {
  constructor(){
    super();
    this.state = {
      launchedSearch: false,
      allergenIsChecked: false,
      additifIsChecked: false,
      brandProduct: '',
      allergenList: '',
      additifList: '',
      route: 'Home',
    }
  }

  onRouteChange = (route) => {
    this.setState({route: route})
  }

  // onFonctionnementLinkClick = () => {

  // }

  launchSearch = () => {
    this.setState({launchedSearch: true});
  }

  allergenCheck = () => {
    const isChecked = this.state.allergenIsChecked;
    this.setState({ allergenIsChecked: !isChecked })
    console.log('allergen is checked', isChecked)
  }

  additifCheck = () => {
    const isChecked = this.state.additifIsChecked;
    this.setState({ additifIsChecked: !isChecked })
    console.log('additif is checked', isChecked)
  }

  onBrandProductChange = (brandProduct) => {
    this.setState({ brandProduct: brandProduct})
  }

  onAllergenChange = (allergenlist) => {
    this.setState({ allergenList: allergenlist })
  }

  onAdditifChange = (additifList) => {
    this.setState({ additifList: additifList })
  }

  render(){
    const { route } = this.state;
    let display = null;

    switch (route) {
      case 'Home':
        display =        
        <React.Fragment>
          <HomeSection 
          launchSearch={this.launchSearch}
          allergenIsChecked={this.state.allergenIsChecked}
          additifIsChecked={this.state.additifIsChecked}
          allergenCheck={this.allergenCheck} 
          additifCheck={this.additifCheck} 
          onBrandProductChange={this.onBrandProductChange} 
          onAllergenChange={this.onAllergenChange}
          onAdditifChange={this.onAdditifChange} 
          />
          <ResultsSection 
          launchSearch={this.launchSearch} 
          launchedSearch={this.state.launchedSearch} 
          allergenIsChecked={this.state.allergenIsChecked} 
          additifIsChecked={this.state.additifIsChecked} 
          brandProduct={this.state.brandProduct} 
          allergenList={this.state.allergenList} 
          additifList={this.state.additifList} 
          />
        </React.Fragment>
      break;
    
      case 'Fonctionnement':
        display = 
        <Fonctionnement />
      break;

      default:
        <React.Fragment>
        <HomeSection 
        launchSearch={this.launchSearch}
        allergenIsChecked={this.state.allergenIsChecked}
        additifIsChecked={this.state.additifIsChecked}
        allergenCheck={this.allergenCheck} 
        additifCheck={this.additifCheck} 
        onBrandProductChange={this.onBrandProductChange} 
        onAllergenChange={this.onAllergenChange}
        onAdditifChange={this.onAdditifChange} 
        />
        <ResultsSection 
        launchSearch={this.launchSearch} 
        launchedSearch={this.state.launchedSearch} 
        allergenIsChecked={this.state.allergenIsChecked} 
        additifIsChecked={this.state.additifIsChecked} 
        brandProduct={this.state.brandProduct} 
        allergenList={this.state.allergenList} 
        additifList={this.state.additifList} 
        />
      </React.Fragment>
      break;
    }

    return (
      <React.Fragment>
        <Navbar onRouteChange={this.onRouteChange}/>
        {display}
        <Footer />
      </React.Fragment>
    )
  } 

}

export default App;
