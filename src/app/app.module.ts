import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import { AppComponent }   from './app.component';

//Services
import {DataService} from "./services/data.service";
import {AuthService} from "./services/auth.service";
import {AuthGuardService as AuthGuard} from "./services/auth-guard.service";
import { PermissionsService } from './services/permissions.service';
import { FileUtilService } from './services/file-util.service';
import { NotificationsService } from './services/notifications.service';


import { SidebarModule } from './sidebar/sidebar.module';
import { FixedPluginModule } from './shared/fixedplugin/fixedplugin.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule} from './shared/navbar/navbar.module';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AppRoutes } from './app.routing';

// import {LoginComponent} from './pages/login/login.component';

@NgModule({
    imports:      [
        BrowserModule,
        FormsModule,
        RouterModule.forRoot(AppRoutes),
        FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
        HttpModule,
        SidebarModule,
        NavbarModule,
        FooterModule,
        FixedPluginModule
    ],
    declarations: [
        AppComponent,
        // LoginComponent,
        AdminLayoutComponent,
        AuthLayoutComponent
    ],
    providers: [ DataService, AuthService, AuthGuard, PermissionsService, FileUtilService, NotificationsService],
    bootstrap:    [ AppComponent ]
})

export class AppModule { }
