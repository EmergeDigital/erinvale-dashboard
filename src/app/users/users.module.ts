import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AddUserComponent } from './addUser/addUser.component';
import { UsersRoutes } from './users.routing';
import { ListUsersComponent } from './listUsers/listUsers.component';
import { EditUserComponent } from './editUser/editUser.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(UsersRoutes),
        FormsModule
    ],
    declarations: [
        AddUserComponent,
        ListUsersComponent,
        EditUserComponent
    ]
})

export class UsersModule {}
