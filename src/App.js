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


  // fetch locations from foursquare api 
  getLocations = () => {
    const clientId = 'I3YREXLTGMASOVK5ZPWCM0GCQLJ3H1LND3U0WVDB4JNCFN13';
    // const clientId = 'I3YREXLTGMASOVK5ZPWCM0GCQLJ3H1LND3U0WVDB4JNCFN1';
    const clientSecret = '4W4E3FMMWPNYQYVQR1EJXFNNOBQL5BLMAMG11DMIDN1PNQGM';
    const query = 'park';
    const limit = 40;
    const myPlace = 'Plano, TX';
    // use these categories to filter results from FourSquare
    const acceptedCategories = [
      'Park',
      'Gym / Fitness Center',
      'Dog Run',
      'Other Great Outdoors'
    ]

    fetch(`https://api.foursquare.com/v2/venues/search?client_id=${clientId}&client_secret=${clientSecret}&v=20180323&limit=${limit}&near=${myPlace}&query=${query}`)
    .then((response) => response.json())
    .then((response) => {
      // if response is not OK throw error
      if(response.meta.code === 200) {
        return(response);
      } else {
        throw new Error('Error fetching locations data');
      }
    })
    .then((response) => {
      // filter locations to include only "real" parks
      let locations = response.response.venues;
      locations = locations.filter((location) => acceptedCategories.includes(location.categories[0].name));
      this.setState({locations});
    })
    .catch(function(error) {
      console.log(error);
      const failureMessagesElement = document.getElementById('location-fetch-failure');
      failureMessagesElement.innerText = `Failed to load location information from FourSquare. Please check back later.`;
      failureMessagesElement.classList.remove('hidden');
    });
  }

  updateActiveCity = (city) => {
    this.setState({ activeCity : city });
  }

  updateActiveLocation = (locationId) => {
    this.setState({ activeLocation : locationId });
  }

  componentDidMount() {
    this.getLocations();
  }


  render() {
    return (
      <div className="App">
        <header>
          <h1 className='page-title uppercase full-width'>Parks Around Plano, TX</h1>
          <div id='location-fetch-failure' className='failure hidden'></div>
        </header>
        <main className = 'container'>
          <LocationSelector
            locations = { this.state.locations }
            activeCity = { this.state.activeCity }
            onActiveCityChange = { this.updateActiveCity }
          />
          <div className='map-and-location-list-container'>
            <LocationList 
              locations = { this.state.locations }
              activeCity = { this.state.activeCity }
              activeLocation = { this.state.activeLocation }
              onActiveLocationChange = { this.updateActiveLocation }
            />
            <MapContainer
              locations = { this.state.locations }
              activeCity = { this.state.activeCity }
              activeLocation = { this.state.activeLocation }
              onActiveLocationChange = { this.updateActiveLocation }
            />
          </div>
        </main>
        <footer>Using FourSquare To Obtain Information.</footer>
      </div>
    );        
  }

}

export default App;
