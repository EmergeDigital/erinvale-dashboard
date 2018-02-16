import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import {AuthService} from "./../../services/auth.service";
import {DataService} from "./../../services/data.service";
import {NotificationsService} from "./../../services/notifications.service";
import {PermissionsService} from "./../../services/permissions.service";

@Component({
  moduleId: module.id,
  selector: 'editNews-cmp',
  templateUrl: './editNews.component.html'
})

export class EditNewsComponent{


  private sub: any;
  id: string = '';
  loading: boolean = true;
  user_group: string = '';
  updating: boolean = false;
  showPreview: boolean = false;
  news: any = {};
  froala_loading: boolean = true;
  froalaOptions: any = {};

  constructor(public auth: AuthService, public router: Router, private route: ActivatedRoute,
    public data: DataService, public notify: NotificationsService, public permissions: PermissionsService) {
      this.loading = true;
      
      this.sub = this.route.params.subscribe(params => {
          this.id = params['id'];
          if(!!this.id) {
            this.data.getPost(this.id).then(news => {
              if(!!news) {
                this.news = news;
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
                console.log(this.news);
                this.user_group = permissions.processAccountType(news).replace(/([A-Z])/g, ' $1').trim()
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
        if(this.news.title && this.news.title !== '') {
          if(this.news.subtitle && this.news.subtitle !== '') {
            if(this.news.html && this.news.html !== '') {
              console.log(this.news);
              this.processUserGroup();
              this.data.updatePost(this.news, this.news.id).then(result => {
                this.news = result;
                this.showPreview = false;
                this.updating = false;
                this.notify.success("News Updated", "Post has been updated successfully", true, "success");
              })
            } else {
              //content
              this.updating = false;
              this.notify.failure("Unable to Update Post", "Please enter content", true, "warning");
            }
          } else {
            //subtitle
            this.updating = false;
            this.notify.failure("Unable to Update News", "Please enter a subtitle", true, "warning");
          }
        } else {
          this.updating = false;
          this.notify.failure("Unable to Update News", "Please enter a title", true, "warning");
          //title
        }
      } else {
        this.updating = false;
        this.notify.failure("Unable to Update News", "Please select a user group for this news", true, "warning");
      }
    }
  }




  processUserGroup() {
    switch(this.user_group) {
      case "Home Owner":
        this.news.user_group_hoa = true;
        this.news.user_group_golf = false;
        break;
      
      case "Golf Member":        
        this.news.user_group_hoa = false;
        this.news.user_group_golf = true;
        break;

      case "All":        
        this.news.user_group_hoa = true;
        this.news.user_group_golf = true;
        break;
    }
  }
}
