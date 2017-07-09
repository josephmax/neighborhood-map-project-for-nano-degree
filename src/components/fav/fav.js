"use strict";
import {context} from '../../models/context.js';
import ko from 'knockout';
import {renderPlaceIdToMarker} from '../../service/googlemap.init'
import store from '../../utils/localStorage';

class favModel {

  constructor(params) {
    // Profile
		console.log(params)
    this.componentName = ko.observable("fav");
    this.fav = context.fav;
    this.visible = ko.observable(true);
		this.foldClass = ko.observable('glyphicon-folder-open');
		this.toggleFoldIcon = () => {
			if (this.foldClass() === 'glyphicon-folder-open') {
				this.foldClass('glyphicon-folder-close')
			} else {
				this.foldClass('glyphicon-folder-open')
			}
		};
		this.renderPlaceIdToMarker = renderPlaceIdToMarker;
		this.delFav = (target) => {
			this.fav.remove(target);
			store.set('my_fav', this.fav());
		};
  }

}

export default { viewModel: favModel, template: require('!raw!./fav.html') };
