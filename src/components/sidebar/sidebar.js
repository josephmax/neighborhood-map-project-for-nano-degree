"use strict";
import {context} from '../../models/context.js';
import ko from 'knockout';

class sidebarModel {

  constructor(params) {
    this.componentName = ko.observable("footer");
    this.context = context;
    this.visible = ko.observable(true);
  }

}

export default { viewModel: sidebarModel, template: require('!raw!./sidebar.html') };
