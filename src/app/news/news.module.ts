import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import { AddNewsComponent } from './addNews/addNews.component';
import { NewsRoutes } from './news.routing';
import { ListNewsComponent } from './listNews/listNews.component';
import { EditNewsComponent } from './editNews/editNews.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(NewsRoutes),
        FormsModule,
        FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
    ],
    declarations: [
        AddNewsComponent,
        ListNewsComponent,
        EditNewsComponent
    ]
})

export class NewsModule {}
