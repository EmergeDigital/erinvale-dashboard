import { Routes } from '@angular/router';

import { ListUsersComponent } from './listUsers/listUsers.component';
import { AddUserComponent } from './addUser/addUser.component';
import { EditUserComponent } from './editUser/editUser.component';


export const UsersRoutes: Routes = [{
        path: '',
        children: [{
            path: 'list',
            component: ListUsersComponent
        }]
    },{
        path: '',
        children: [{
            path: 'add',
            component: AddUserComponent
        }]
    },{
        path: '',
        children: [{
            path: 'edit/:id',
            component: EditUserComponent
        }]
    }
];
