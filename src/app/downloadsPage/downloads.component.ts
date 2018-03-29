import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
    Location,
    LocationStrategy,
    PathLocationStrategy
} from "@angular/common";
import { AuthService } from "./../services/auth.service";
import { DataService } from "./../services/data.service";
import { NotificationsService } from "./../services/notifications.service";
import { PermissionsService } from "./../services/permissions.service";

import * as moment from "moment";

declare var swal: any;
declare var require: any;
declare var $: any;

@Component({
    moduleId: module.id,
    selector: "app-downloads-cmp",
    templateUrl: "downloads.component.html"
})
export class DownloadsComponent implements OnInit {
    updating: boolean = false;
    loading: boolean = true;
    downloads: any[];
    self_id: string;

    ngOnInit() {
        // // Init Tags Input
    }

    constructor(
        public auth: AuthService,
        public router: Router,
        private route: ActivatedRoute,
        public data: DataService,
        public notify: NotificationsService,
        public permissions: PermissionsService
    ) {
        //FETCH DOWNLOADS
        this.self_id = this.auth.current_user.id;
        let params = this.processUserGroup(this.permissions.getAccountType());
        console.log(params);
        this.getDownloads(params)
            .then(downloads => {
                console.log(downloads);
                // for(const n of download) {
                // 	if(n.date_start) {
                // 		console.log("EVENT: ", n);
                // 	} else {
                // 		console.log("POST: ", n);
                // 	}
                // }
                this.downloads = downloads;
                this.loading = false;
                // setTimeout(() => {
                //     if ($(".tagsinput").length != 0) {
                //         $(".tagsinput").tagsinput();
                //     }
                // }, 1);
            })
            .catch(ex => {
                this.loading = false;
                console.log(ex);
            });
    }

    clicked(d) {
        console.log(d);
        this.saveFile(d.url, d.file_name);
        const index = this.downloads.indexOf(d);
        this.data.updateDownloadCount(this.self_id, d.id).then(download => {
            console.log(download);
            this.downloads[index] = download;
            // d = download;
            // this.loading = true;
            // setTimeout(() => {
            //     this.loading = false;
            // }, 10);
        });
    }

    // getTags(n) {
    //     let tags = "";

    //     if (n.date_start) {
    //         tags += "Event";
    //     } else {
    //         tags += "Download";
    //     }

    //     if (n.user_group_hoa) {
    //         tags += ", HOA";
    //     }

    //     if (n.user_group_golf) {
    //         tags += ", Golf";
    //     }

    //     return tags;
    // }

    getMoment(date) {
        return moment(date).format("DD MMM YYYY - h:mm a");
    }

    getDownloads(params): Promise<any> {
        return new Promise((resolve, reject) => {
            this.data
                .getDownloads(params)
                .then(downloads => {
                    resolve(downloads);
                })
                .catch(ex => {
                    this.notify.failure(
                        "Unable to Fetch Downloads",
                        ex,
                        true,
                        "warning"
                    );
                    reject(ex);
                });
        });
    }

    processUserGroup(group) {
        switch (group) {
            case "HomeOwner":
                return {
                    user_group_hoa: true,
                    archived: false
                };

            case "GolfMember":
                return {
                    user_group_golf: true,
                    archived: false
                };

            default:
                return {archived: false};
        }
    }

    showDesc($event, download) {
        $event.stopPropagation();
        this.notify.success(download.title, download.description, true, 'title-and-text');
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
