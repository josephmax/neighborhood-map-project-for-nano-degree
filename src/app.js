import $ from 'jquery';

import 'babel-polyfill';
import ko from 'knockout';
import 'bootstrap';
// Css Imports
import 'bootstrap/dist/css/bootstrap.css';
import './css/style.css';
import 'font-awesome/css/font-awesome.css';

import mapInit from './service/googlemap.init';

//registered layout-level containers as components
ko.components.register('app-header', require('./components/header/header').default);
ko.components.register('app-mainview', require('./components/mainview/mainview').default);
ko.components.register('app-sidebar', require('./components/sidebar/sidebar').default);

//registered functional components
ko.components.register('searchbar', require('./components/searchbar/searchbar').default);
ko.components.register('fav', require('./components/fav/fav').default);
ko.components.register('controlpanel', require('./components/controlpanel/controlpanel').default);
ko.components.register('resultlist', require('./components/resultlist/resultlist').default);

// bind google script callback function name to window.
window.mapInit = mapInit;
$(document).ready(function(){
	//initate ko context;
    ko.applyBindings({});
});

window.googleMapLoadingTimeOut = setTimeout(() => {
	document.write('Oops, seems some error occured on google map loading, please try again later');
}, 15000);
