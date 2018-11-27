import React, { Component } from 'react';
import './App.css';
import MapContainer from './MapContainer';
import MarkerSelector from './MarkerSelector';

class App extends Component {

  state = {
    locations : null,
    cityList : null,
    activeCity : 'all',
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
      });
  }

  updateActiveCity = (city) => {
    console.log('in updateActiveCity');
    console.log(city);
    this.setState({ activeCity : city });
  }

  componentDidMount() {
    this.getLocations();
  }


  render() {
    return (
      <div className="App">
        <h1>Frontend Neighbourhood Map</h1>
        <div className="container">
          <MarkerSelector
            locations = { this.state.locations }
            activeCity = { this.state.activeCity }
            onActiveCityChange = { this.updateActiveCity }
          />
          <MapContainer
            locations = { this.state.locations }
            activeCity = { this.state.activeCity }
          />
        </div>
      </div>
    );        
  }

}

export default App;
