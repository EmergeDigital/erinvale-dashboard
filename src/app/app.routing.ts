import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
// import {LoginComponent} from "./pages/login/login.component";
import {AuthGuardService as AuthGuard} from "./services/auth-guard.service";

export const AppRoutes: Routes = [
    
        {path: '', redirectTo: 'login', pathMatch: 'full'},
        {
           
            path: '',
            component: AdminLayoutComponent,
            canActivate: [AuthGuard],      
            children: [{
                path: 'dashboard',
                loadChildren: './dashboard/dashboard.module#DashboardModule'
            },{
                path: 'components',
                loadChildren: './components/components.module#ComponentsModule'
            },{
                path: 'forms',
                loadChildren: './forms/forms.module#Forms'
            },{
                path: 'tables',
                loadChildren: './tables/tables.module#TablesModule'
            },{
                path: 'maps',
                loadChildren: './maps/maps.module#MapsModule'
            },{
                path: 'charts',
                loadChildren: './charts/charts.module#ChartsModule'
            },{
                path: 'calendar',
                loadChildren: './calendar/calendar.module#CalendarModule'
            },{
                path: '',
                loadChildren: './userpage/user.module#UserModule'
            },{
                path: '',
                loadChildren: './settingsPage/settings.module#SettingsModule'
            },{
                path: '',
                loadChildren: './timeline/timeline.module#TimelineModule'
            },{
                path: '',
                loadChildren: './newsPage/news.module#NewsModule'
            },{
                path: '',
                loadChildren: './article/article.module#ArticleModule'
            },{
                path: 'users',
                loadChildren: './users/users.module#UsersModule'
            },{
                path: 'news',
                loadChildren: './news/news.module#NewsModule'
            },{
                path: 'event',
                loadChildren: './event/event.module#EventModule'
            },{
                path: 'download',
                loadChildren: './downloads/downloads.module#DownloadsModule'
            }]
        },
        {
            path: '',
            component: AuthLayoutComponent,
            children: [{
                path: '',
                loadChildren: './pages/pages.module#PagesModule'
            }]
        }
];
