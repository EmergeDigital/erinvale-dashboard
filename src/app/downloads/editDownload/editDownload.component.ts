import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
    Location,
    LocationStrategy,
    PathLocationStrategy
} from "@angular/common";
import { AuthService } from "./../../services/auth.service";
import { DataService } from "./../../services/data.service";
import { NotificationsService } from "./../../services/notifications.service";
import { PermissionsService } from "./../../services/permissions.service";

@Component({
    moduleId: module.id,
    selector: "editDownload-cmp",
    templateUrl: "./editDownload.component.html"
})
export class EditDownloadComponent {
    private sub: any;
    id: string = "";
    loading: boolean = true;
    user_group: string = "";
    updating: boolean = false;
    download: any = {};
    uploading = false;
    deleting = false;

    constructor(
        public auth: AuthService,
        public router: Router,
        private route: ActivatedRoute,
        public data: DataService,
        public notify: NotificationsService,
        public permissions: PermissionsService
    ) {
        this.loading = true;
        this.sub = this.route.params.subscribe(params => {
            this.id = params["id"];
            if (!!this.id) {
                this.data
                    .getDownload(this.id)
                    .then(download => {
                        if (!!download) {
                            this.download = download;
                            this.loading = false;
                            console.log(this.download);
                            this.user_group = permissions
                                .processAccountType(download)
                                .replace(/([A-Z])/g, " $1")
                                .trim();
                        } else {
                            this.loading = false;
                            // Error cannot find
                        }
                    })
                    .catch(ex => {
                        if (ex === "Insufficient Permissions") {
                            this.loading = false;
                            // this.error = "Unable to access this download";
                        } else {
                            this.loading = false;
                            // this.error = ex;
                        }
                    });
            } else {
                this.loading = false;
                // this.error = "Please enter an download id";
            }
        });
    }

    update() {
        if (this.updating === false) {
            this.updating = true;
            if (this.user_group !== "") {
                if (this.download.title && this.download.title !== "") {
                    if (this.download.url && this.download.url !== "") {
                        console.log(this.download);
                        this.processUserGroup();
                        this.data
                            .updateDownload(this.download, this.download.id)
                            .then(result => {
                                this.download = result;
                                this.updating = false;
                                this.notify.success(
                                    "Download Updated",
                                    "Download has been updated successfully",
                                    true,
                                    "success"
                                );
                            });
                    } else {
                        // file
                        this.updating = false;
                        this.notify.failure(
                            "Unable to Create Download",
                            "Please upload a file",
                            true,
                            "warning"
                        );
                    }
                } else {
                    this.updating = false;
                    this.notify.failure(
                        "Unable to Update Download",
                        "Please enter a title",
                        true,
                        "warning"
                    );
                    // title
                }
            } else {
                this.updating = false;
                this.notify.failure(
                    "Unable to Update Download",
                    "Please select a user group for this download",
                    true,
                    "warning"
                );
            }
        }
    }

    onUploadError($event) {
        console.log($event);
        this.download.url = "asddsa";
        this.download.file_name = "asd";
        setTimeout(() => {
            this.download.url = "";
            this.download.file_name = "";
            this.uploading = false;
            this.notify.failure(
                "Something Went Wrong",
                "Please try again or refresh the page",
                true,
                "warning"
            );
        }, 10);
    }

    onUploadSuccess($event) {
        console.log($event);
        this.uploading = false;
        this.download.url = $event[1];
        this.download.file_name = $event[0].name;
    }

    processUserGroup() {
        switch (this.user_group) {
            case "Home Owner":
                this.download.user_group_hoa = true;
                this.download.user_group_golf = false;
                break;

            case "Golf Member":
                this.download.user_group_hoa = false;
                this.download.user_group_golf = true;
                break;

            case "All":
                this.download.user_group_hoa = true;
                this.download.user_group_golf = true;
                break;
        }
    }


    changeFile() {
        // call delete file endpoint
        // clear file name and download url
        this.deleting = true;
        if (this.download.url) {
            this.data
                .deleteFile(this.download.url)
                .then(() => {
                    this.download.url = "";
                    this.download.file_name = "";
                    this.deleting = false;
                    console.log("File removed", this.download);
                })
                .catch(ex => {
                    console.log(ex);
                    this.deleting = false;
                    this.notify.failure(
                        "Something Went Wrong",
                        "Please try again or refresh the page",
                        true,
                        "warning"
                    );
                });
        } else {
            this.download.url = "";
            this.download.file_name = "";
            this.deleting = false;
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
