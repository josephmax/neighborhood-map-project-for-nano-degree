/**
 * Google map related functions are here
 */
import style from './googlemap.style';
import $ from 'jquery';
import {context} from '../models/context';
import {fetchNYTInfo} from './nyTimes.fetchinfo';
import {FILTER_HANDLER} from '../models/context';

/**
 * {object} MapClass - short access to google.maps;
 * {object} map - map instance;
 * {object} infoWindow - info window instance;
 * {object} myGeoMarker - marker instance of current GPS location;
 * {object} myGeoLocation - current GPS location with lattitudes and longitudes;
 * {object} bounds - bounds instance to control map bounds fit;
 * {object} placeservice - Place instance contructed by Google place class;
 * {array} placeMarkers - array of marker instance, which keeps index synchronous with search results;
 * {object} currentPlace - current selected place to render Marker accordingly;
 * {object} autocomplete - Autocomplete instance constructed by Google Autocomplete;
 */
let MapClass;
let map;
let infoWindow;
let myGeoMarker;
let myGeoLocation;
let bounds;
let placeservice;
let placeMarkers = [];
let currentPlace;
let autocomplete;

// init entry
export default() => {
		MapClass = google.maps;
		bounds = new MapClass.LatLngBounds();
		infoWindow = new MapClass.InfoWindow();
		navigator
				.geolocation
				.getCurrentPosition((position) => {
						let {latitude, longitude} = position.coords
						myGeoLocation = {lat: latitude, lng: longitude};
						initMap();
				}, () => {}, {enableHighAccuracy: true});

};

/**
 * relocate function with callback
 * @param {function} cb - callback to execute after navigator gets new location
 */ 
export const relocate = (cb) => {
		if (!map) return
		navigator
				.geolocation
				.getCurrentPosition((position) => {
						cb && cb()
						let {latitude, longitude} = position.coords
						myGeoLocation = {lat: latitude, lng: longitude};
						map.setCenter(myGeoLocation);
						map.setZoom(16);
				}, () => {}, {enableHighAccuracy: true});
};

/**
 * POI search function
 * @param {object} - config options
 * {LatLng, MVCObjects} position - position to search nearby, default my current place
 * {number} radius - search radius, default 1000
 * {functino} cb - callback to execute after search completed
 */
export const searchPOIaround = ({
		position = myGeoLocation,
		radius = 1000,
		cb
}) => {
		if (!map) return
		clearMarkers(placeMarkers);
		placeservice.nearbySearch({
				location: position,
				radius,
				type: ['lodging']
		}, (results, status) => {
				if (status === MapClass.places.PlacesServiceStatus.OK) {
						context
								.resultList
								.removeAll();
						context
								.resultList
								.splice(0, 0, ...results);
						renderResultToMarkers(results);
						filterMarkers(FILTER_HANDLER[context.filter()]);
						cb && cb(results);
				}
		});
};

/**
 * this function collected all shown markers bounds and reset map bounds to show them all
 */
export const expandToSeeAllMarkers = () => {
	if (!map) return
	bounds = new MapClass.LatLngBounds();
	bounds.extend(myGeoLocation);
	context.resultList().filter(FILTER_HANDLER[context.filter()]).map(item => {
		extendBounds({position: item.geometry.location});
	});
	map.fitBounds(bounds);
}

/**
 * 
 * @param {object} place - place object to set map center to
 * @param {number} index - index in the list to set info window
 */
export const centerAndFocus = (place, index) => {
	if (!map) return;
	centerTo(place.geometry.location);
	setMarkerFocus(place, placeMarkers[index]);
};

/**
 * this function clears the markerlist and push tartget place to the list, and then rerendered the markers
 * filter condition will be forced cleared to aviod unproper action
 * @param {object} place - place object to render
 */
export const renderPlaceIdToMarker = (place) => {
	if (!map) return;
	clearMarkers(placeMarkers);
	context.filter('0');
	renderResultToMarkers([place]);
	setMarkerFocus(place, placeMarkers[0]);
}

/**
 * this function allowed the view to control filter conditions
 * @param {function} filter - if returns true, target Marker will be rendered to the map, otherwise will not.
 */
export const filterMarkers = (filter) => {
	if (!map) return;
	placeMarkers.map((item, index) => {
		if (!filter(context.resultList()[index])) {
			item.setMap(null);
		} else {
			item.setMap(map);
		}
	})
}

function initMap() {
		map = new MapClass.Map(document.getElementById('mainview'), {
				center: {
						lat: myGeoLocation.lat,
						lng: myGeoLocation.lng
				},
				zoom: 16,
				styles: style,
				mapTypeControl: false,
				clickableIcons: false
		});
		placeservice = new MapClass.places.PlacesService(map);
		initAutoComplete();
		setMyGeoMarkerMarker(myGeoLocation);
		searchPOIaround({});
};

function setMyGeoMarkerMarker (position) {
		let selfMarker = makeMarkerIcon('E68078');
		let selfMarkerHover = makeMarkerIcon('F19B39');
		myGeoMarker = new MapClass.Marker({
				position,
				map,
				animation: MapClass.Animation.BOUNCE,
				icon: selfMarker,
				title: 'I am Here!'
		});
		myGeoMarker.addListener('mouseover', () => {
				myGeoMarker.setIcon(selfMarkerHover);
				if (myGeoMarker.getAnimation() !== MapClass.Animation.BOUNCE) {
						myGeoMarker.setAnimation(MapClass.Animation.BOUNCE);
				}
		});
		myGeoMarker.addListener('mouseout', () => {
				myGeoMarker.setIcon(selfMarker);
		});
};

function centerTo (LatLng) {
	map.setCenter(LatLng);
	map.setZoom(19);
};

function initAutoComplete(){
	autocomplete = new MapClass.places.Autocomplete(document.getElementById('pac-input'));
	autocomplete.addListener('place_changed', () => {
		let targetGeo = autocomplete.getPlace().geometry.location;
		searchPOIaround({position: targetGeo});
	})
}

function setMarkerFocus (place, marker) {
	if (context.filter() !== '0') context.filter('0');
	marker.setMap(map);
	marker.setAnimation(MapClass.Animation.BOUNCE);
		infoWindow.setContent(htmlContent(place));
		fetchNYTInfo(place).then((res) => {
				infoWindow.setContent(htmlContent(place, res))
		}, (err) => {
			infoErrorHandler(place)
		});
		infoWindow.open(map, marker);
		currentPlace = place;
}

function clearMarkers(markers = []) {
		markers.map((item) => {
				item.setMap(null);
		});
		placeMarkers = [];
		context.resultList.removeAll();
}

function renderResultToMarkers(results) {
		bounds = new MapClass.LatLngBounds();
		placeMarkers = results.map((item, index) => addPlaceMarker(item, index, map)).map((item, index) => addMarkerListener(item, index, results));
		placeMarkers.map(item => extendBounds(item));
		map.fitBounds(bounds);
}

function extendBounds(item) {
		bounds.extend(item.position);
		return item;
}

function addPlaceMarker(item, index, map) {
		return new MapClass.Marker({map, position: item.geometry.location, animation: MapClass.Animation.DROP});
}

function addMarkerListener(item, index, results) {
		item.addListener('click', function() {
				if (!currentPlace || currentPlace.id !== results[index].id) {
						clearAnimation(placeMarkers);
						this.setAnimation(MapClass.Animation.BOUNCE);
						infoWindow.setContent(htmlContent(results[index]));
						fetchNYTInfo(results[index]).then((res) => {
							infoWindow.setContent(htmlContent(results[index], res))
						}, (err) => {
							infoErrorHandler(results[index]);
						});
				}
				infoWindow.open(map, item);
				currentPlace = results[index];
		})
		return item;
}

function infoErrorHandler(content) {
	infoWindow.setContent(htmlContent(content, [{
		web_url:'#',
		headline: {
			main: 'net work errored, please try later'
		}
	}]));
}

function clearAnimation(markers) {
	markers.map((item) => {
		item.setAnimation(null)
	});
}

function makeMarkerIcon(markerColor) {
		return new MapClass.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + markerColor, new google.maps.Size(21, 34), new google.maps.Point(0, 0), new google.maps.Point(10, 34));
}

function htmlContent(content, list) {
		return `<div id="siteNotice"></div>
	<h1 id="firstHeading" class="firstHeading">${content.name}</h1>
	<div id="bodyContent">
	${content.rating ? '<p>Rating: ' + content.rating + '</p>' : ''}
	<p><b>${content.vicinity}</b></p>
	<div id="article-container">
		<ul class="list-group">
			${list
				? list.map(toListContent).join('')
				: '<li class="list-group-item articles">searching relevant news...</li>'}
		</ul>
	</div>
	</div>${content.html_attributions}</div>
	`;
}

function toListContent(item) {
		return `<li class="list-group-item articles">
					<a href="${item.web_url}">${item.headline.main}</a>
				</li>`;
}
