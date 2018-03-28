import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import { DownloadRoutes } from './downloads.routing';

import { ListDownloadsComponent } from './listDownloads/listDownloads.component';
import { AddDownloadComponent } from './addDownload/addDownload.component';
import { EditDownloadComponent } from './editDownload/editDownload.component';

import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

import { environment } from '../../environments/environment';

const DROPZONE_CONFIG: DropzoneConfigInterface = {
 // Change this to your upload POST address:
  url: environment.apiUrl + '/v1/functions/uploadFile',
  maxFilesize: 50,
  maxFiles: 1
};

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DownloadRoutes),
        FormsModule,
        FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),

        DropzoneModule.forRoot(DROPZONE_CONFIG)
    ],
    declarations: [
        AddDownloadComponent,
        ListDownloadsComponent,
        EditDownloadComponent
    ]
})

export class DownloadsModule {}
