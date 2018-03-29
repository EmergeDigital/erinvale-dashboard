import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DownloadsComponent } from './downloads.component';
import { DownloadsRoutes } from './downloads.routing';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DownloadsRoutes),
        FormsModule
    ],
    declarations: [DownloadsComponent]
})

export class ViewDownloadsModule {}
