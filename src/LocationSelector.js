import React, { Component } from 'react';


class LocationSelector extends Component {

	state = {
		cityList: null,
	}

	createCityList() {

		let cityList = [];

	  if(this.props.locations) {
		  const locations = this.props.locations;

		  //create a list of the different cities involved
		  locations.forEach((location) => {
		    const city = location.location.city;
		    if(!cityList.includes(city)) {
		      cityList.push(city);
		    }
		  });

		  cityList.sort();
		  this.setState({ cityList });
		}
	}


	componentDidMount() {
		this.createCityList();
	}

	componentDidUpdate(prevProps) {
		// create list of cities from location information received
		if(this.props.locations !== prevProps.locations) {
			this.createCityList();
		}
		// add focus to the city select element 
		const chosenCityElement = document.getElementById('chosen-city');
		chosenCityElement.focus();
	}


	render() {

		return (
			<div className='location-selector'>
				<label>
					Choose your city:
					<select
						id = 'chosen-city'
						defaultValue = 'all'
						area-label = 'city filter options'
						onChange = { (event) => this.props.onActiveCityChange(event.target.value) }
					>
						<option value="all">All</option>
						{ 
							this.state.cityList && this.state.cityList.map((city) => (
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