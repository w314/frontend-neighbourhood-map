import React from 'react';

function LocationList(props) {

		const { activeCity, activeLocation, onActiveLocationChange } = props;
		let { locations } = props;

		// if not all locations needed filter locations to display
		if(locations && activeCity !== 'all') {
			locations = locations.filter((location) => location.location.city === activeCity);
		}

		return (
			<ul id='location-list' className='full-width'>
				{
					locations && locations.map((location) => (
						<li
							id = { location.id }
							key = { location.id }
							className = { activeLocation && location.id === activeLocation ? 
								'active-location location' : 
								'location' }
							tabIndex = '0'
							onClick = { (event) => onActiveLocationChange(event.target.id) }
						>{ location.name }</li>
					))
				}
			</ul>
		)
}

export default LocationList;