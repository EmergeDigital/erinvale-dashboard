import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import { AddEventComponent } from './addEvent/addEvent.component';
import { EventRoutes } from './event.routing';
import { ListEventComponent } from './listEvent/listEvent.component';
import { EditEventComponent } from './editEvent/editEvent.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(EventRoutes),
        FormsModule,
        FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
    ],
    declarations: [
        AddEventComponent,
        ListEventComponent,
        EditEventComponent
    ]
})

export class EventModule {}
