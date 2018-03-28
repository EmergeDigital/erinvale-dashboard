import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import {AuthService} from "./../../services/auth.service";
import {DataService} from "./../../services/data.service";
import {NotificationsService} from "./../../services/notifications.service";
import {PermissionsService} from "./../../services/permissions.service";

declare var $:any;

declare interface Table_With_Checkboxes {
    id?: number;
    name: string;
    job_position: string;
    salary: string;
    active?: boolean;
}
declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}
declare interface TableData2 {
    headerRow: string[];
    dataRows: Table_With_Checkboxes[];
}

@Component({
    moduleId: module.id,
    selector: 'listDownloads-cmp',
    templateUrl: 'listDownloads.component.html'
})

export class ListDownloadsComponent{
    public tableData1: TableData;
    loading: boolean = true;
    downloads: any[];
    user_type: any = {
        value: "AllUsers",
        name: "All Users"
    };


    ngOnInit(){

        
    }

    constructor(public auth: AuthService, public router: Router, private route: ActivatedRoute,
        public data: DataService, public notify: NotificationsService, public permissions: PermissionsService) {
        this.refresh(null);
        // setTimeout(()=> {
        //     // this.tableData1 = {
        //     //     headerRow: [ '#', 'Name', 'Job Position', 'Since', 'Salary', 'Actions'],
        //     //     dataRows: [
        //     //         ['1', 'Andrew Mike', 'Develop', '2013', '99,225',''],
        //     //         ['2', 'John Doe', 'Design', '2012', '89,241', ''],
        //     //         ['3', 'Alex Mike', 'Design', '2010', '92,144', ''],
        //     //         ['4','Mike Monday', 'Marketing', '2013', '49,990', ''],
        //     //         ['5', 'Paul Dickens', 'Communication', '2015', '69,201', '']
        //     //     ]
        //     // };
        //     // this.loading = false;

        // }, 3000);
    }

    refresh(params) {
        this.loading = true;
        this.data.getDownloads(params).then(downloads => {
            console.log(downloads);
            this.downloads = downloads;
            const _downloads = downloads.map((d) => {
                return [
                    d.url,
                    d.title,
                    d.subtitle,
                    this.permissions.processAccountType(d).replace(/([A-Z])/g, ' $1').trim(),
                    d.archived,
                    d.file_name,
                    d.id
                ];
            })
            console.log(_downloads);
            this.tableData1 = {
                headerRow: ['Link', 'Title', 'Subtitle', 'User Group', 'Status'],
                dataRows: _downloads
            };
            this.loading = false;
            console.log(this.tableData1);
        }).catch(ex => {
            this.notify.failure("Unable to Fetch Downloads", ex, true, "warning");
            this.loading = true;
        })

    }

    edit(row) {

      let id = row[6];
      this.router.navigate(["/download/edit/" + id]);
    }

    confirmDelete(row) {
        console.log(row);
        this.notify.success("Are You Sure?", "This file will be deleted permanently", true, "warning-message-and-cancel").then( result => {
            if(result) {
                this.loading = true;
                this.data.deleteDownload(row[6]).then(result => {
                    this.notify.success("File Deleted", "File has been deleted", false, "success");
                    this.changeUserType(this.user_type.name);
                    this.loading = false;
                }).catch(ex => {
                    this.notify.failure("Unable To Delete File", ex, true, "warning");
                    this.loading = false;
                })
            }
        })
    }

    toggleArchive(row) {
        console.log(row);
        this.loading = true;
        // row.archived = !row.archived;
        const download = this.downloads.filter(d => d.id === row[6])[0];
        download.archived = !download.archived;
        this.data.updateDownload(download, download.id).then(result => {
            this.notify.success("File Updated", "File has been updated", false, "success");
            this.changeUserType(this.user_type.name);
            this.loading = false;
        }).catch(ex => {
            this.notify.failure("Unable To Update File", ex, true, "warning");
            this.loading = false;
        })
    }

    changeUserType(new_group) {
        let params = this.processUserGroup(new_group);
        this.user_type = {
            value: new_group.replace(/\s/g, ''),
            name: new_group 
        };
        console.log(this.user_type);
        this.refresh(params);
    }

    processUserGroup(group) {
      switch(group) {
        case "Home Owner":
            return {
                user_group_hoa: true
            };
        
        case "Golf Member":        
            return {
                user_group_golf: true
            };
        
        default:
            return {};
      }
    }

    saveFile(url, filename) {
        // Get file name from url.
        // const _filename = filename.substring(0, filename.lastIndexOf('.'));
        const xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = function() {
            const a = document.createElement("a");
            a.href = window.URL.createObjectURL(xhr.response); // xhr.response is a blob
            a.download = filename; // Set the file name.
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };
        xhr.open("GET", url);
        xhr.send();
    }
}
