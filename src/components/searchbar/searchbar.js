"use strict";
import {context} from '../../models/context.js';
import ko from 'knockout';

class searchBarModel {

  constructor(params) {
    this.componentName = ko.observable("searchbar");
    this.context = context;
    this.visible = ko.observable(true);
  }

}

export default { viewModel: searchBarModel, template: require('!raw!./searchbar.html') };
