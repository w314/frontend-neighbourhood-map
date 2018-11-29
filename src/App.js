import React, { Component } from 'react';
import './App.css';
import MapContainer from './MapContainer';
import MarkerSelector from './MarkerSelector';

class App extends Component {

  state = {
    locations : null,
    cityList : null,
    activeCity : 'all',
    activeLocation : null,
  }


  //fetching locations from foursquare api 
  //and updating locations in the state
  getLocations = () => {
    const clientId = 'I3YREXLTGMASOVK5ZPWCM0GCQLJ3H1LND3U0WVDB4JNCFN13';
    const clientSecret = '4W4E3FMMWPNYQYVQR1EJXFNNOBQL5BLMAMG11DMIDN1PNQGM';
    const query = 'park';
    const limit = 20;
    const myPlace = 'Plano, TX';
    let locations = null;

    fetch(`https://api.foursquare.com/v2/venues/search?client_id=${clientId}&client_secret=${clientSecret}&v=20180323&limit=${limit}&near=${myPlace}&query=${query}`)
      .then((response) => response.json())
      .then((response) => {
        locations = response.response.venues;
        this.setState({locations});
      })
      .catch(function(error) {
        console.log(error);
        const locationFetchFailureElement = document.getElementById("locationFetchFailure");
        locationFetchFailureElement.innerText = "Failed to load information.Please check back later."
      });
  }

  updateActiveCity = (city) => {
    // console.log('in updateActiveCity');
    // console.log(city);
    this.setState({ activeCity : city });
  }

  updateActiveLocation = (locationId) => {
    console.log('in updateActiveLocation');
    console.log(locationId);
    this.setState({ activeLocation : locationId });
  }

  componentDidMount() {
    console.log(document.online)
    this.getLocations();
  }


  render() {
    return (
      <div className="App">
        <h1>Frontend Neighbourhood Map</h1>
        <div id="internetFailure" className="failure"></div>
        <div className="container">
          <MarkerSelector
            locations = { this.state.locations }
            activeCity = { this.state.activeCity }
            activeLocation = {this.state.activeLocation }
            onActiveCityChange = { this.updateActiveCity }
            onActiveLocationChange = { this.updateActiveLocation }
          />
          <div id="locationFetchFailure" className="failure"></div>
          <MapContainer
            locations = { this.state.locations }
            activeCity = { this.state.activeCity }
            activeLocation = {this.state.activeLocation }
            onActiveLocationChange = { this.updateActiveLocation }
          />
        </div>
      </div>
    );        
  }

}

export default App;
