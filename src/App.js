import React, { Component } from 'react';
import './App.css';
import MapContainer from './MapContainer';
import MarkerSelector from './MarkerSelector';

class App extends Component {

  state = {
    locations : null,
    cityList : null,
    activeCity : 'all',
    google : null,
    map : null,
  }


  //fetching locations from foursquare api 
  //and updating locations in the state
  getLocations = () => {
    // console.log('in getLocations');
    const clientId = 'I3YREXLTGMASOVK5ZPWCM0GCQLJ3H1LND3U0WVDB4JNCFN13';
    const clientSecret = '4W4E3FMMWPNYQYVQR1EJXFNNOBQL5BLMAMG11DMIDN1PNQGM';
    const query = 'park';
    const limit = 25;
    const myPlace = 'Plano, TX';
    let locations = null;

    fetch(`https://api.foursquare.com/v2/venues/search?client_id=${clientId}&client_secret=${clientSecret}&v=20180323&limit=${limit}&near=${myPlace}&query=${query}`)
      .then((response) => response.json())
      .then((response) => {
        locations = response.response.venues;
        this.setState({locations}, () => {console.log('locations state changed');})
      })
      .then(() => {
        console.log('locations are set');
        console.log(this.state);
        // createMarkers();
        // this.createCityList();
      })
      .catch(function(error) {
        console.log(error);
      });
  }


  // createCityList() {
  //   let cityList = [];
  //   const locations = this.state.locations;

  //   //create a list of the different cities involved
  //   locations.forEach((location) => {
  //     const city = location.location.city;
  //     if(!cityList.includes(city)) {
  //       cityList.push(city);
  //     }
  //   });

  //   cityList.sort();
  //   this.setState({ cityList }, () => {
  //     console.log('cityList set');
  //     console.log(this.state);
  //     const state = this.state;
  //     this.setState({state}, () => {console.log('state reset');});
  //   });
  //   // console.log(cityList);
  // }

    //adds script tag importing google maps api
    //sets updateGoogle as callback function
    getGoogleMaps() {
      // console.log(this.state);
      window.myFunction = this.updateGoogle.bind(this);
      const script = document.createElement("script");
      const apiKey = 'AIzaSyA-_D9jXkGNVDE8V7je-c09r2ctznBWYEY';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=myFunction`;
      script.async = true;
      // console.log(script);
      document.body.appendChild(script);
    }


    //callback function for google map api to call
    //updates google in state 
    //calls create map function
    updateGoogle = () => {
      delete window.myFunction;
      this.setState({google : window.google},() => {
        console.log('state after setting google');
        console.log(this.state);
        this.createMap();
      });
    }

    //use google api to create map
    //updates map in state
    //calls create marker function
    createMap() {
      const mapElement = document.getElementById('map');
      // console.log(mapElement);
      const initialCenter = { lat: 20.7413449, lng: 73.9980244 };
      const map = new this.state.google.maps.Map(
        mapElement,
        {
          center : initialCenter,
          zoom : 13
        }
      );
      this.setState({map},() => {
      });
    }

  updateActiveCity(city) {
    this.setState({ activeCity : city });
  }

  componentDidMount() {
    // console.log('in onComponentWillMound');
    this.getLocations();
    this.getGoogleMaps();
  }


  render() {
    // if(this.state.locations) {
      console.log('app rendering');
      // if(this.state.map && this.state.cityList) {
        return (
          <div className="App">
            <h1>Frontend Neighbourhood Map</h1>
            <div className="container">
              <MarkerSelector
                locations = { this.state.locations }
                activeCity = { this.state.activeCity }
                cityList = { this.props.cityList }
                onActiveCityChange = { () => this.props.updateActiveCity }
              />
              <MapContainer
                locations = { this.state.locations }
                activeCity = { this.state.activeCity }
                google = { this.state.google }
                map = { this.state.map }
              />
            </div>
          </div>
        );        
      // } else {
      //   return (
      //     <div className="App">
      //       <p>Loading...</p>
      //     </div>
      //   );
      // }

    }
  // }
}

export default App;
