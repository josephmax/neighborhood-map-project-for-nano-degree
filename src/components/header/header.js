"use strict";
import {context} from '../../models/context.js';
import ko from 'knockout';

class headerModel {

   constructor(params) {

    	this.componentName = ko.observable("header");
    	this.context = context;
    	this.visible = ko.observable(true);

   }

}

export default { viewModel: headerModel, template: require('!raw!./header.html') };
