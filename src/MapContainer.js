import React, { Component } from 'react';

let markers = null;

class MapContainer extends Component {

	state = {
		google : null,
		map : null,
		infoWindow : null,
		markers : null,
		bounds : null,
	}


  //adds script tag importing google maps api
  //sets updateGoogle as callback function
  getGoogleMaps() {
    // console.log(this.state);
    window.myFunction = this.updateGoogle.bind(this);
    const script = document.createElement("script");
    const apiKey = 'AIzaSyA-_D9jXkGNVDE8V7je-c09r2ctznBWYEY';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=myFunction`;
    script.async = true;
    document.body.appendChild(script);
  }


  //callback function for google map api to call
  //updates google in state 
  //calls create map function
  updateGoogle = () => {
    delete window.myFunction;
    this.setState({google : window.google},() => {
      this.createMap();
    });
  }

  //use google api to create map
  //updates map in state
  //calls create marker function
  createMap() {
  	const google = this.state.google;
    const mapElement = document.getElementById('map');
    const initialCenter = { lat: 20.7413449, lng: 73.9980244 };
    const map = new google.maps.Map(
      mapElement,
      {
        center : initialCenter,
        zoom : 13
      }
    );
    this.setState({ map }, () => {
	    //crete infroWindow
	    const infoWindow = new google.maps.InfoWindow( {
	    	map : this.state.map,
	    	content : 'elsoszia',
	    });
	    this.setState({ infoWindow });
    });
  }

	//use locations and activeCity props to create markers
  createMarkers() {
  	const google = this.state.google;
  	const map = this.state.map;
  	const locations = this.props.locations;

  	//creating markers and set bounds based on locations
  	if(google && map && locations) {
	  	const bounds = new google.maps.LatLngBounds();
	  	const markers =  locations.map((location) => {	
		  		const marker = new google.maps.Marker({
		  			map: map,
		  			position: { 
		  				lat : location.location.lat, 
		  				lng : location.location.lng 
		  			},
		  			title: location.name, 
		  			animation: google.maps.Animation.DROP,
		  			city: location.location.city,
		  		});
		  		marker.addListener('click', () => {
		  			this.updateInfoWindow(marker)
		  		});
		  		// marker.addListener('click', () => onMarkerClick(marker, largeInfowindow));
		  		// marker.addListener('click', () => onMarkerClick(marker));
		      bounds.extend(marker.position);
		      // console.log(marker);
			     return marker;
		     }
	  	);

	  	//add bounds to map
	  	map.fitBounds(bounds)
	  	this.setState({ bounds, markers });
	  	// this.setState({ markers });
  	}
 	}

 	updateMarkers() {
 		console.log('updating markers');
 		const map = this.state.map;
 		const activeCity = this.props.activeCity;
 		console.log(this.state.markers)
 		console.log(typeof this.state.markers[0])
 		const updatedMarkers = this.state.markers.slice();
 		console.log(updatedMarkers);
 		console.log(activeCity);
 		updatedMarkers.forEach((marker) => {
			const newMap = ( activeCity === 'all' || marker.city === activeCity ) ? map : null;
			marker.setMap(newMap);
			// // console.log(marker.city);
			// console.log(marker.visible);
			// console.log(activeCity === 'all' || marker.city === activeCity)
			// marker.visible = ( activeCity === 'all' || marker.city === activeCity ) ? true : false;
			// console.log(marker.visible);
 		});
 		console.log(updatedMarkers);
 		// this.setState({ markers }, () => {console.log(this.state.markers);});
 		// this.setState((state) => {

 		// })
 		console.log(this.state.markers);
 	}

 	updateInfoWindow(marker) {
 		console.log('here we are');
 		// const infoWindow = this.state.infoWindow;
 		// console.log(infoWindow);
 		// // let updatedInfoWindow = Object.assign({},this.state.infoWindow);
 		// // let infoWindow = Object.assign({},this.state.infoWindow);
 		// let updatedInfoWindow = {...infoWindow};
 		// updatedInfoWindow.title = marker.title;
 		// updatedInfoWindow.content = marker.title;
 		// updatedInfoWindow.position = marker.position;
 		// // updatedInfoWindow.map = this.state.map;

 		// // infoWindow.title = 'ujszia';
 		// // infoWindow.map = this.state.map;
 		// // infoWindow.position = marker.position;
 		// // const title = 'ujszia';
 		// console.log(updatedInfoWindow);
 		// // this.set
 		// this.setState({ infoWindow : updatedInfoWindow }, () => {
 		// // this.setState({ infoWindow }, () => {
 		// // this.setState(prevState => (
 		// // 		infoWindow : {
 		// // 			...prevState.infoWindow,
 		// // 			title : title,
 		// // 		}
 		// // ), () => {
 		// 	console.log(this.state.infoWindow);
	 	// 	// infoWindow.open(this.state.map, marker);
	 	// 	infoWindow.open(this.state.map, marker.position);
 		// });
 	}


 	componentDidMount() {
    this.getGoogleMaps();
		this.createMarkers();
 	}

	// componentDidUpdate(prevProps) {
	// 	if( this.props !== prevProps ) {
	// 		this.createMarkers();
	// 	}
	// }

	componentDidUpdate(prevProps) {
		if( this.props.locations !== prevProps.locations ) {
			this.createMarkers();
		} else if( this.props.activeCity !== prevProps.activeCity ) {
			console.log('active City change');
			this.updateMarkers();
		}
	}

	render () {
		return(
			<div id='map'></div>
		)
	}

}

export default MapContainer;