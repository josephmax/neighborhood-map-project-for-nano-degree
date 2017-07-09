"use strict";
import {context} from '../../models/context.js';
import ko from 'knockout';
import {relocate, searchPOIaround, filterMarkers, expandToSeeAllMarkers} from '../../service/googlemap.init'
import {FILTER_HANDLER} from '../../models/context'

const FILTER_R2L = {
	'0': 'No Filter',
	'1': 'Rating over 3',
	'2': 'Rating over 4'
}

class controlPanelModel {

  constructor(params) {
    this.componentName = ko.observable("fav");
    this.visible = ko.observable(true);
		this.relocating = ko.observable(false);
		this.relocate = () => {
			this.relocating(true);
			relocate(() => {
				this.relocating(false);
			})
		};
		this.reseach = () => {
			this.researching(true);
			searchPOIaround({cb: () => {
				this.researching(false);
			}})
		}
		this.researching = ko.observable(false);
		this.isRelocating = ko.pureComputed(() => this.relocating() ? 'bouncing' : '');
		this.isReseaching = ko.pureComputed(() => this.researching() ? 'rotating' : '');
		this.filter = context.filter;
		this.filterLiteral = ko.pureComputed(() => FILTER_R2L[this.filter()]);
		this.setFilter = (target) => {
			this.filter(target);
			filterMarkers(FILTER_HANDLER[this.filter()]);
		};
		this.expandToSeeAll = expandToSeeAllMarkers;
  }

}

export default { viewModel: controlPanelModel, template: require('!raw!./controlpanel.html') };
