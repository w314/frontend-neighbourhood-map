import React, { Component } from 'react';


class MapContainer extends Component {

	state = {
		google : null,
		map : null,
		infoWindow : null,
		markers : null,
		activeMarker : null,
	}


  // add script tag to import google maps api
  getGoogleMaps() {
    // create a global handles for functions to use by google maps api
	  // set updateGoogle() as callback function for google maps api
    window.googleMapsCallback = this.updateGoogle.bind(this);
	  // set googleMapsAuthFalire() to call if there is authorization failure
    window.gm_authFailure = this.googleMapsAuthFailure.bind(this);
    
    const script = document.createElement('script');
    const apiKey = 'AIzaSyA-_D9jXkGNVDE8V7je-c09r2ctznBWYEY';
    // const apiKey = 'AIzaSyA-_D9jXkGNVDE8V7je-c09r2ctznBWYE';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=googleMapsCallback`;
    script.async = true;
    document.body.appendChild(script);
  }

  googleMapsAuthFailure() {
	   	console.log('Failed to include Google Maps API');
	   	// clean up global variable
	    delete window.gm_authFailure;
	    //display failure message
	   	const mapFailureElement = document.getElementById('map-failure');
	   	// const mapContainerElement = document.getElementsByClassName('map-container')[0];
	   	const mapElement = document.getElementById('map');
	   	mapFailureElement.innerText = 'Failed to load Google Maps';  	
	   	mapFailureElement.classList.remove('hidden');
	   	mapElement.classList.add('hidden');
  }


  // callback function for google map api
  // updates google in state 
  // calls create map function
  updateGoogle = () => {
  	// console.log('in updateGoogle');
    delete window.myFunction;
    if( window.google ){
	    this.setState({google : window.google},() => {
	      this.createMap();
	    });
	   } else { 	
	   	console.log('Failed to include Google Maps API');
	   	const mapFailureElement = document.getElementById('mapFailure');
	   	mapFailureElement.innerText = 'Failed to load Google Maps';
	   }
  }

  //use google api to create map
  //updates map in state
  //calls create marker function
  createMap() {
  	const google = this.state.google;
    const mapElement = document.getElementById('map');
    const initialCenter = { lat: 33.019844, lng: -96.698883 };
    const map = new google.maps.Map(
      mapElement,
      {
        center : initialCenter,
        zoom : 13
      }
    );
    this.setState({ map }, () => {
	    //create infoWindow
	    const infoWindow = new google.maps.InfoWindow();
	    infoWindow.addListener('closeclick', () => {
	    	this.closeInfoWindow()
	    })
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
	  				lat: location.location.lat, 
	  				lng: location.location.lng 
	  			},
	  			title: location.name, 
	  			animation: google.maps.Animation.DROP,
	  			formattedAddress: location.location.formattedAddress, 
	  			category: location.categories[0].name,
	  			city: location.location.city,
	  			id: location.id,
	  		});
	  		marker.addListener('click', () => {
	  			this.updateInfoWindow(marker);
	  			this.props.onActiveLocationChange(marker.id);
	  		});
	      bounds.extend(marker.position);
		     return marker;
	     }
	  	);

	  	// fit map to bounds
	  	map.fitBounds(bounds)
	  	this.setState({ markers });
  	}
 	}


 	// update markers if activeCity has changed
 	updateMarkers() {
 		const google = this.state.google;
 		const map = this.state.map;
 		const activeCity = this.props.activeCity;
 		const activeLocation = this.props.activeLocation;
 		const markers = this.state.markers;
 		// create boudns variable to track new bounds
 		const bounds = new google.maps.LatLngBounds();
 		markers.forEach((marker) => {
			// set marker animation to null to stop any previos active markers from bouncing
			marker.setAnimation(null);
 			// if marker is not needed set newMap to null
			const newMap = (activeCity === 'all' || marker.city === activeCity) ? map : null;
			marker.setMap(newMap);
			// if marker is included include it into bounds
			if(newMap){
				bounds.extend(marker.position);
				// if marker is the new activeLocation make it bounce
				if(marker.id === activeLocation) {
					marker.setAnimation(google.maps.Animation.BOUNCE);
				}
			};
 		});
 		// fit map to new bounds
 		map.fitBounds(bounds);
 		// set new markers in state
 		this.setState({ markers });
 	}


 	// makes the infoWindow displayed if there is an active location selected
 	updateInfoWindow(marker) {
 		const map = this.state.map;
 		const infoWindow = this.state.infoWindow;
 		// if the  new marker is different than the previous one
 		// update marker 
 		if(infoWindow.marker !== marker) {
 			infoWindow.marker = marker;
 			// only update title and open infoWindow
 			// if new marker is not null
 			if(marker) {
		 		infoWindow.setContent(`
		 			<p class='park-name'>${ marker.title }</p>
		 			<p class='park-address'>${ marker.formattedAddress[0] } <br>
		 			${ marker.formattedAddress[1] }</p>
		 			<p class='park-category'>${ marker.category }</p>
		 			`);
		 		infoWindow.open(map, marker);
 			}
 		}
 		this.setState({ infoWindow  });
 	}


 	// closes inforWindow sets active location to null
 	closeInfoWindow() {
 		const infoWindow = this.state.infoWindow;
 		infoWindow.marker = null;
 		this.setState({ infoWindow });
 		// closing infoWindow sets activeLocation to null
 		this.props.onActiveLocationChange(null)
 	}


 	componentDidMount() {
    this.getGoogleMaps();
		this.createMarkers();
 	}


	componentDidUpdate(prevProps) {
		// if receiving locations for the first time create markers
		if(this.props.locations !== prevProps.locations) {
			this.createMarkers();
		// if activeLocation has changed update markers and infoWindow
		} else if(this.props.activeLocation !== prevProps.activeLocation) {
			const activeMarker = this.state.markers.filter((marker) => marker.id === this.props.activeLocation )[0];
			this.updateMarkers(activeMarker);
			this.updateInfoWindow(activeMarker);
		// if only activeCity has changed update markers only
		} else if(this.props.activeCity !== prevProps.activeCity) {
			this.updateMarkers();
		}
	}

	render () {
		return(
			<div className='map-container'>
				<div id='map-failure' className='failure hidden'></div>
				{
				 this.state.google  && (
				<div role='application' area-label='map showing selected parks' id='map'></div> )
				}
				{ 
					!this.state.google && (
						<p>Google Maps Loading...</p>)
				}
			</div>
		)
	}

}

export default MapContainer;