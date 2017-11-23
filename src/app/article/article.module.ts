import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import { ArticleComponent } from './article.component';
import { ArticleRoutes } from './article.routing';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ArticleRoutes),
        FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
        FormsModule
    ],
    declarations: [ArticleComponent]
})

export class ArticleModule {}
