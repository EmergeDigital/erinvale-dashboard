import { Routes } from '@angular/router';

import { ListEventComponent } from './listEvent/listEvent.component';
import { AddEventComponent } from './addEvent/addEvent.component';
import { EditEventComponent } from './editEvent/editEvent.component';


export const EventRoutes: Routes = [{
        path: '',
        children: [{
            path: 'list',
            component: ListEventComponent
        }]
    },{
        path: '',
        children: [{
            path: 'add',
            component: AddEventComponent
        }]
    },{
        path: '',
        children: [{
            path: 'edit/:id',
            component: EditEventComponent
        }]
    }
];
