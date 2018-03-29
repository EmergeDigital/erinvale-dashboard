import { Routes } from '@angular/router';

import { DownloadsComponent } from './downloads.component';

export const DownloadsRoutes: Routes = [{
    path: '',
    children: [{
        path: 'downloads',
        component: DownloadsComponent
    }]
}];
