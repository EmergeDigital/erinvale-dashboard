import { Routes } from '@angular/router';

import { ArticleComponent } from './article.component';

export const ArticleRoutes: Routes = [{
    path: '',
    children: [{
        path: 'article/:id',
        component: ArticleComponent
    }]
}];
