import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DisclaimerComponent } from './disclaimer.component';
import { DisclaimerRoutes } from './disclaimer.routing';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DisclaimerRoutes),
        FormsModule
    ],
    declarations: [DisclaimerComponent]
})

export class DisclaimerModule {}
