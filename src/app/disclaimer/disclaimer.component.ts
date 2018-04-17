import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

import * as moment from 'moment';

declare var swal: any;
declare var require: any;
declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'disclaimer-cmp',
    templateUrl: 'disclaimer.component.html'
})

export class DisclaimerComponent implements OnInit{

    ngOnInit() {
        // // Init Tags Input
    }

    constructor() {
    }
}
