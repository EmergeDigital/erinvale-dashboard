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
    selector: "addDownload-cmp",
    templateUrl: "./addDownload.component.html"
})
export class AddDownloadComponent {
    new_download: any = {};
    user_group: string = "";
    updating: boolean = false;
    uploading = false;
    deleting = false;

    constructor(
        public auth: AuthService,
        public router: Router,
        private route: ActivatedRoute,
        public data: DataService,
        public notify: NotificationsService,
        public permissions: PermissionsService
    ) {}

    create() {
        if (this.updating === false) {
            this.updating = true;
            if (this.user_group !== "") {
                if (this.new_download.title && this.new_download.title !== "") {
                    // Check for file now
                    if (this.new_download.url && this.new_download.url !== "") {
                        // If file exists, upload then do the rest
                        console.log(this.new_download);
                        this.processUserGroup();
                        this.data.createDownload(this.new_download).then(result => {
                            this.new_download = {};

                            this.user_group = '';
                            this.updating = false;
                            this.notify.success("Download Added", "Download has been created successfully", true, "success");
                        }).catch(ex => {
                            console.log(ex);
                            this.notify.failure(
                                "Something Went Wrong",
                                "Please try again or refresh the page",
                                true,
                                "warning"
                            );
                        })
                    } else {
                        this.updating = false;
                        this.notify.failure(
                            "Unable to Create Download",
                            "Please upload a file",
                            true,
                            "warning"
                        );
                        // file
                    }
                } else {
                    this.updating = false;
                    this.notify.failure(
                        "Unable to Create Download",
                        "Please enter a title",
                        true,
                        "warning"
                    );
                    // title
                }
            } else {
                this.updating = false;
                this.notify.failure(
                    "Unable to Create Download",
                    "Please select a user group for this download",
                    true,
                    "warning"
                );
            }
        }
    }

    processUserGroup() {
        switch (this.user_group) {
            case "Home Owner":
                this.new_download.user_group_hoa = true;
                this.new_download.user_group_golf = false;
                break;

            case "Golf Member":
                this.new_download.user_group_hoa = false;
                this.new_download.user_group_golf = true;
                break;

            case "All":
                this.new_download.user_group_hoa = true;
                this.new_download.user_group_golf = true;
                break;
        }
    }

    onUploadError($event) {
        console.log($event);
        this.new_download.url = "asddsa";
        this.new_download.file_name = "asd";
        setTimeout(() => {
            this.new_download.url = "";
            this.new_download.file_name = "";
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
        this.new_download.url = $event[1];
        this.new_download.file_name = $event[0].name;
    }

    changeFile() {
        // call delete file endpoint
        // clear file name and download url
        this.deleting = true;
        if (this.new_download.url) {
            this.data
                .deleteFile(this.new_download.url)
                .then(() => {
                    this.new_download.url = "";
                    this.new_download.file_name = "";
                    this.deleting = false;
                    console.log("File removed", this.new_download);
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
            this.new_download.url = "";
            this.new_download.file_name = "";
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
