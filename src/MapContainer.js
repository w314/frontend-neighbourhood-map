import React, { Component } from 'react';

class MapContainer extends Component {

	//use locations and activeCity props to create markers
  createMarkers() {
  	const google = this.props.google;
  	const map = this.props.map;
  	const locations = this.props.locations;
  	const activeCity = this.props.activeCity;

  	//creating markers and set bounds based on locations
  	if(google && map && locations) {
	  	const bounds = new google.maps.LatLngBounds();
	  	locations.forEach((location) => {	
	  		//include locations if all locations are needed
	  		//or if the city of the locations === activeCity
	  		if( activeCity === 'all' || location.location.city === activeCity ) {
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
		      // console.log(marker);
		     }
	  	})

	  	//add bounds to map
	  	map.fitBounds(bounds)
  	}
 	}

 	componentDidMount() {
		this.createMarkers();
 	}

	componentDidUpdate(prevProps) {
		if( this.props !== prevProps ) {
			this.createMarkers();
		}
	}

	render () {
		return(
			<div id='map'></div>
		)
	}

}

export default MapContainer;