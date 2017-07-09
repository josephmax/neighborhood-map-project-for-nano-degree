"use strict";
import {context, FILTER_HANDLER} from '../../models/context.js';
import ko from 'knockout';
import {centerAndFocus, setMarkerFocus} from '../../service/googlemap.init';
import store from '../../utils/localStorage';

class resultListModel {

  constructor(params) {
    this.componentName = ko.observable("resultlist");
    this.context = context;
    this.visible = ko.observable(true);
		this.results = ko.computed(() => {
			let filterRaw = context.filter();
			return context.resultList().filter(FILTER_HANDLER[filterRaw]);
		});
		this.centerAndFocus = (target, index) => {
			centerAndFocus(target, index());
		};
		this.FavClass = (item) => {
			for (let i = 0, len = context.fav().length; i < len; i++) {
				if (context.fav()[i].place_id === item.place_id) {
					return 'glyphicon-heart';
				}
			}
			return 'glyphicon-heart-empty';
		};
		this.addFav = (item) => {
			for (let i = 0, len = context.fav().length; i < len; i++) {
				if (context.fav()[i].place_id === item.place_id) {
					return;
				}
			}
			context.fav.push(item);
			store.set('my_fav', context.fav());
		}
  }

}

export default { viewModel: resultListModel, template: require('!raw!./resultlist.html') };
