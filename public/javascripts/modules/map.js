import axios from 'axios';
import { $ } from './bling';

const mapOptions = {
	center: { lat: 43.2, lng: -79.8 },
	zoom: 8
};

function loadPlaces(map, lat = 43.2, lng = -79.8) {
	axios.get(`/api/stores/near?lat=${lat}&lng${lng}`).then((res) => {
		const places = res.data;
		console.log(places);
		if (!places.length) {
			alert('no places found');
			return;
		}

		const markers = places.map((places) => {
			const [ placeLng, placeLat ] = place.location.coordinates;
		});
	});
}

function makeMap(mapDiv) {
	if (!mapDiv) return;

	// make our map
	const map = new google.maps.Map(mapDiv, mapOptions);
	loadPlaces(map);
	const input = $('[name="geolocate]');
	const autocomplete = new google.maps.places.Autocomplete(inpute);
	console.log(mapDiv);
}

export default makeMap;
