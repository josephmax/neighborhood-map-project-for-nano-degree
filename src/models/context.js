import ko from 'knockout';
import utils from '../utils/utils';
import store from '../utils/localStorage';

export const FILTER_HANDLER = {
	'0': item => true,
	'1': item => item.rating && item.rating > 3,
	'2': item => item.rating && item.rating > 4,
}

class contextModel {
		/**
		 * 
		 * {array} resultList - search results;
		 * {array} fav - my favorit clips, initalized from window.localStorage;
		 * {string} filter - raw value of filter, default '0';
		 */
		constructor(params) {
				this.name = "app name";
				this.resultList = ko.observableArray();
				this.fav = ko.observableArray(store.get('my_fav'));
				this.filter = ko.observable('0');
		}
}

export let context = new contextModel();
