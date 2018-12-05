import React, { Component } from 'react';
import './App.css';
import MapContainer from './MapContainer';
import LocationSelector from './LocationSelector';
import LocationList from './LocationList';

class App extends Component {

  state = {
    locations : null,
    cityList : null,
    activeCity : 'all',
    activeLocation : null,
  }


  //fetching locations from foursquare api 
  getLocations = () => {
    const clientId = 'I3YREXLTGMASOVK5ZPWCM0GCQLJ3H1LND3U0WVDB4JNCFN13';
    // const clientId = 'I3YREXLTGMASOVK5ZPWCM0GCQLJ3H1LND3U0WVDB4JNCFN1';
    const clientSecret = '4W4E3FMMWPNYQYVQR1EJXFNNOBQL5BLMAMG11DMIDN1PNQGM';
    const query = 'park';
    const limit = 20;
    const myPlace = 'Plano, TX';

    fetch(`https://api.foursquare.com/v2/venues/search?client_id=${clientId}&client_secret=${clientSecret}&v=20180323&limit=${limit}&near=${myPlace}&query=${query}`)
    .then((response) => response.json())
    .then((response) => {
      if(response.meta.code === 200) {
        // console.log('status is ok');
        return(response);
      } else {
        throw new Error('Error fetching locations data');
      }
    })
    .then((response) => {
      console.log(response);
      const locations = response.response.venues;
      this.setState({locations});
    })
    .catch(function(error) {
      console.log(error);
      const failureMessagesElement = document.getElementById("failure-messages");
      const failureMessage = failureMessagesElement.innerText;
      failureMessagesElement.innerText = `${ failureMessage } Failed to load location information from FourSquare. Please check back later.`;
      failureMessagesElement.classList.remove('hidden');
    });
  }

  updateActiveCity = (city) => {
    // console.log('in updateActiveCity');
    // console.log(city);
    this.setState({ activeCity : city });
  }

  updateActiveLocation = (locationId) => {
    // console.log('in updateActiveLocation');
    // console.log(locationId);
    this.setState({ activeLocation : locationId });
  }


  componentDidMount() {
    this.getLocations();
  }


  render() {
    return (
      <div className="App">
        <header>
          <h1 className="page-title uppercase full-width">Parks Around Plano, TX</h1>
          <div id="failure-messages" className="failure hidden"></div>
        </header>
        <main className = "container">
          <LocationSelector
            locations = { this.state.locations }
            activeCity = { this.state.activeCity }
            onActiveCityChange = { this.updateActiveCity }
          />
          <div className="map-and-location-list-container">
            <MapContainer
              locations = { this.state.locations }
              activeCity = { this.state.activeCity }
              activeLocation = {this.state.activeLocation }
              onActiveLocationChange = { this.updateActiveLocation }
            />
            <LocationList 
              locations = { this.state.locations }
              activeCity = { this.state.activeCity }
              activeLocation = {this.state.activeLocation }
              onActiveLocationChange = { this.updateActiveLocation }
            />
          </div>
        </main>
      </div>
    );        
  }

}

export default App;
