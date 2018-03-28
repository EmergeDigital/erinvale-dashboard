import { Routes } from '@angular/router';

import { ListDownloadsComponent } from './listDownloads/listDownloads.component';
import { AddDownloadComponent } from './addDownload/addDownload.component';
import { EditDownloadComponent } from './editDownload/editDownload.component';


export const DownloadRoutes: Routes = [{
        path: '',
        children: [{
            path: 'list',
            component: ListDownloadsComponent
        }]
    },{
        path: '',
        children: [{
            path: 'add',
            component: AddDownloadComponent
        }]
    },{
        path: '',
        children: [{
            path: 'edit/:id',
            component: EditDownloadComponent
        }]
    }
];
