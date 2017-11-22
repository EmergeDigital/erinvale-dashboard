import { Routes } from '@angular/router';

import { ListNewsComponent } from './listNews/listNews.component';
import { AddNewsComponent } from './addNews/addNews.component';
import { EditNewsComponent } from './editNews/editNews.component';


export const NewsRoutes: Routes = [{
        path: '',
        children: [{
            path: 'list',
            component: ListNewsComponent
        }]
    },{
        path: '',
        children: [{
            path: 'add',
            component: AddNewsComponent
        }]
    },{
        path: '',
        children: [{
            path: 'edit/:id',
            component: EditNewsComponent
        }]
    }
];
