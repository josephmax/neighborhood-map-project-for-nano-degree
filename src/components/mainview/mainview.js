"use strict";
import {context} from '../../models/context.js';
import ko from 'knockout';

class mainViewModel {

  constructor(params) {

    this.componentName = ko.observable("workspace");
    this.context = context;
    this.visible = ko.observable(true);
  }

}

export default { viewModel: mainViewModel, template: require('!raw!./mainview.html') };
