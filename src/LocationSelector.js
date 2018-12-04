import React, { Component } from 'react';
import './App.css';
import './LocationSelector.css';

let cityList = [];

class LocationSelector extends Component {


	createCityList() {
	  // let cityList = [];
	  if(this.props.locations) {
		  // console.log(this.props);
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
		    // console.log('cityList set');
		    // console.log(this.state);
		    // const state = this.state;
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
		// console.log('rendering MarkerSelector');
		// console.log(this.props);

		// if(this.props.loaded) {
		const activeCity = this.props.activeCity;
		const activeLocation = this.props.activeLocation;
		let locations = this.props.locations;
		if (locations && activeCity !== 'all') {
			locations = locations.filter((location) => location.location.city === activeCity);
		}

		return (
			<div className="location-selector">
				<label>
					Choose your city:
					<select
						id = "chosen-city"
						defaultValue = "all"
						onChange = { (event) => this.props.onActiveCityChange(event.target.value) }
					>
						<option value="all">All</option>
						{ 
							cityList.map((city) => (
								<option
									key = { city } 
									value = { city }
								>{city}</option>
							))
						}
					</select>
				</label>
			</div>
		)
	}
}

export default LocationSelector;