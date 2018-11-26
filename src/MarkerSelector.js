import React, { Component } from 'react';

let cityList = [];

class MarkerSelector extends Component {


	createCityList() {
	  // let cityList = [];
	  if(this.props.locations) {
		  console.log(this.props);
		  const locations = this.props.locations;

		  //create a list of the different cities involved
		  locations.forEach((location) => {
		    const city = location.location.city;
		    if(!cityList.includes(city)) {
		      cityList.push(city);
		    }
		  });

		  cityList.sort();
		  this.setState({ cityList }, () => {
		    console.log('cityList set');
		    console.log(this.state);
		    const state = this.state;
		    // this.setState({state}, () => {
		    	// console.log('state reset');
		    	// this.props.onActiveCityChange('all');
		    // });
		  });
		}
	  // console.log(cityList);
	}

	componentDidMount() {
		this.createCityList();
	}

	componentDidUpdate(prevProps) {
		if (this.props.locations !== prevProps.locations) {
			this.createCityList();
		}
	}

	render() {
		console.log('rendering MarkerSelector');
		console.log(this.props);

		// if(this.props.loaded) {
		return (
			<div className="marker-selector">
				<div className="options">
					<select id="chosen-city" defaultValue="all">
						<option value='all'>All</option>
						{ 
							cityList.map((city) => (
								<option
									key = { city } 
									value = { city }
								>{city}</option>
							))
						}
					</select>
				</div>
				<div className="markers-shown">
					<ul id="marker-list">
						{
							this.props.locations && this.props.locations.map((location) => (
								<li
									key = { location.id }
								>{ location.name }</li>
							))
						}
					</ul>
				</div>
			</div>
		)
	// } else {
	// 	return (
	// 		<div>Marker list will go here</div>
	// 	)
	// }

	}
}

export default MarkerSelector;