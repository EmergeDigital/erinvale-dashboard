import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import {AuthService} from "./../../services/auth.service";
import {DataService} from "./../../services/data.service";
import {NotificationsService} from "./../../services/notifications.service";
import {PermissionsService} from "./../../services/permissions.service";

@Component({
  moduleId: module.id,
  selector: 'editDownload-cmp',
  templateUrl: './editDownload.component.html'
})

export class EditDownloadComponent{


  private sub: any;
  id: string = '';
  loading: boolean = true;
  user_group: string = '';
  updating: boolean = false;
  showPreview: boolean = false;
  download: any = {};
  froala_loading: boolean = true;
  froalaOptions: any = {};

  constructor(public auth: AuthService, public router: Router, private route: ActivatedRoute,
    public data: DataService, public notify: NotificationsService, public permissions: PermissionsService) {
      this.loading = true;
      
      this.sub = this.route.params.subscribe(params => {
          this.id = params['id'];
          if(!!this.id) {
            this.data.getPost(this.id).then(download => {
              if(!!download) {
                this.download = download;
                this.loading = false;
                this.data.signUrls().then(urls => {
                  console.log(urls);
                  this.froalaOptions = {
                    // IMAGES
                    imageUploadToS3: urls.images,
                    ImageMaxSize: 4 * 1024 * 1024, // 4MB LIMIT
                    ImageAllowedTypes: ['jpg', 'jpeg', 'png', 'gif'],
                    // VIDOES
                    videoUploadToS3: urls.videos,
                    videoMaxSize: 100 * 1024 * 1024, // 100MB LIMIT
                    videoAllowedTypes: ['webm', 'mp4', 'flv', 'avi', 'wmv', 'mov'],
                    // DOCS
                    fileUploadToS3: urls.docs,
                    fileMaxSize: 25 * 1024 * 1024, // 25MB LIMIT,
                    fileAllowedTypes: ['*']
                  };
                  this.froala_loading = false;
                  // setTimeout(() => {
                  // },10)
                });
                console.log(this.download);
                this.user_group = permissions.processAccountType(download).replace(/([A-Z])/g, ' $1').trim()
              } else {
                this.loading = false;
                //Error cannot find
              }
            }).catch(ex => {
              if(ex === "Insufficient Permissions") {
                this.loading = false;
                //this.error = "Unable to access this vendor";
              } else {
                this.loading = false;
                //this.error = ex;
              }
            })
          } else {
            this.loading = false;
            //this.error = "Please enter an vendor id";
          }
    
      });
  }

  update() {
    if(this.updating === false) {
      this.updating = true;
      if(this.user_group !== '') {
        if(this.download.title && this.download.title !== '') {
          if(this.download.subtitle && this.download.subtitle !== '') {
            if(this.download.html && this.download.html !== '') {
              console.log(this.download);
              this.processUserGroup();
              this.data.updatePost(this.download, this.download.id).then(result => {
                this.download = result;
                this.showPreview = false;
                this.updating = false;
                this.notify.success("Download Updated", "Post has been updated successfully", true, "success");
              })
            } else {
              //content
              this.updating = false;
              this.notify.failure("Unable to Update Post", "Please enter content", true, "warning");
            }
          } else {
            //subtitle
            this.updating = false;
            this.notify.failure("Unable to Update Download", "Please enter a subtitle", true, "warning");
          }
        } else {
          this.updating = false;
          this.notify.failure("Unable to Update Download", "Please enter a title", true, "warning");
          //title
        }
      } else {
        this.updating = false;
        this.notify.failure("Unable to Update Download", "Please select a user group for this download", true, "warning");
      }
    }
  }




  processUserGroup() {
    switch(this.user_group) {
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
}
