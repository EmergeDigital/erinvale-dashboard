import { Routes } from '@angular/router';

import { DisclaimerComponent } from './disclaimer.component';

export const DisclaimerRoutes: Routes = [{
    path: '',
    children: [{
        path: 'disclaimer',
        component: DisclaimerComponent
    }]
}];
