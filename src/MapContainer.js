import React, { Component } from 'react';

class MapContainer extends Component {

	state = {
		markers : null,
	}

	//use locations and activeCity props to create markers
  createMarkers() {
  	console.log('in createMarkers');
  	// console.log(locations);
  	// let markers = null;
  	const google = this.props.google;
  	const map = this.props.map;
  	const locations = this.props.locations;
  	// const activeCity = this.props.activeCity;

  	//creating markers and set bounds based on locations
  	if(google && map && locations) {
	  	const bounds = new google.maps.LatLngBounds();
	  	// const activeCityLocations = locations.filter((locations) => location.location.address.city === activeCity);
	  	console.log('about to create markers');
	  	const markers = locations.map((location) => {	
	  		console.log('creating marker');	
	  		// const position = { location.location.lat, location.location.lng };
	  		// console.log(position);
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
	  		// marker.addListener('click', () => {
	  		// 	populateInfoWindow(marker, largeInfowindow)
	  		// });
	  		// marker.addListener('click', () => onMarkerClick(marker, largeInfowindow));
	  		// marker.addListener('click', () => onMarkerClick(marker));
	      bounds.extend(marker.position);
	      // markerList.push(marker.title);
	      console.log(marker);
	      return(marker);
	  	})

	  	//add bounds to map
	  	map.fitBounds(bounds)

	  	// this.setState({ markers }, () => console.log(this.state));

	  	// document.getElementById('marker-type').addEventListener('change', updateMarkers);
	  	// document.getElementById('zoom-to-area').addEventListener('click', zoomToArea);
	  	// updateMarkerList();

	  	// //playgorund
	  	// getLocations();

  	}
 	}

 	componentDidMount() {
 		console.log('componentWillMount');
 		console.log(this.props);
		this.createMarkers();
 	}


  //get google maps api
	// componentWillReceiveProps() {
	// 	console.log('componentWillReceiveProps');
	// 	console.log(this.props);
	// 	this.createMarkers();
	// }

	componentDidUpdate(prevProps) {
		if( this.props !== prevProps ) {
			this.createMarkers();
		}
	}

	render () {
		console.log('mapcontainer rendering');
		// console.log('in MapContainer render');
		// console.log('props:');
		// console.log(this.props);
		// console.log('state:');
		// console.log(this.state);

		return(
			<div id='map'></div>
		)
	}

}

export default MapContainer;