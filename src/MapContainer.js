import React, { Component } from 'react';


class MapContainer extends Component {

	// markers = [];

	state = {
		google : null,
		map : null,
		infoWindow : null,
		markers : null,
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
  	console.log('creating map');
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
	    //crete infoWindow
	    const infoWindow = new google.maps.InfoWindow();
	    // const infoWindow = new google.maps.InfoWindow( {
	    // 	map : this.state.map,
	    // 	content : 'elsoszia',
	    // });
	    this.setState({ infoWindow });
    });
  }

	//use locations and activeCity props to create markers
  createMarkers() {
  	console.log('creating markers');
  	const google = this.state.google;
  	const map = this.state.map;
  	const locations = this.props.locations;

  	//creating markers and set bounds based on locations
  	if(google && map && locations) {
	  	const bounds = new google.maps.LatLngBounds();
	  	const markers =  locations.map((location) => {	
		  		const marker = new google.maps.Marker({
		  			map : map,
		  			position : { 
		  				lat : location.location.lat, 
		  				lng : location.location.lng 
		  			},
		  			title : location.name, 
		  			animation : google.maps.Animation.DROP,
		  			city : location.location.city,
		  			id : location.id,
		  		});
		  		marker.addListener('click', () => {
		  			this.updateInfoWindow(marker);
		  			this.props.onActiveLocationChange(marker.id);
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
	  	this.setState({ markers });
	  	// this.setState({ markers });
  	}
 	}


 	updateMarkers() {
 		console.log('updating markers');
 		const google = this.state.google;
 		const map = this.state.map;
 		const activeCity = this.props.activeCity;
 		const updatedMarkers = this.state.markers;
 		const bounds = new google.maps.LatLngBounds();
 		updatedMarkers.forEach((marker) => {
			const newMap = ( activeCity === 'all' || marker.city === activeCity ) ? map : null;
			marker.setMap(newMap);
			if( newMap ){
				bounds.extend(marker.position)
			};
 		});
 		map.fitBounds(bounds);
 		this.setState({ markers : updatedMarkers });
 	}


 	updateActiveLocation() {

 	}

 	updateInfoWindow(marker) {
 		console.log('updating infoWindow');
 		console.log(marker);
 		const map = this.state.map;
 		const infoWindow = this.state.infoWindow;
 		console.log(infoWindow.marker);
 		console.log(infoWindow);
 		if(infoWindow.marker !== marker) {
 			console.log('uj marker needed');
 			infoWindow.marker = marker;
	 		infoWindow.setContent(marker.title);
	 		infoWindow.open(map, marker);
 		}
 		// infoWindow.position = marker.position;
 		this.setState({ infoWindow  });
 		// this.setState({ infoWindow  }, () => {
 		// 	console.log(this.state.infoWindow);
	 	// 	this.state.infoWindow.open(this.state.map, marker);
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
			// console.log('active City change');
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