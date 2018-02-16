import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import {AuthService} from "./../../services/auth.service";
import {DataService} from "./../../services/data.service";
import {NotificationsService} from "./../../services/notifications.service";
import {PermissionsService} from "./../../services/permissions.service";

@Component({
  moduleId: module.id,
  selector: 'addNews-cmp',
  templateUrl: './addNews.component.html'
})

export class AddNewsComponent{
  showPreview: boolean = false;
  new_news: any = {};
  user_group: string = '';
  updating: boolean = false;
  froala_loading: boolean = true;
  froalaOptions: any = {};

  constructor(public auth: AuthService, public router: Router, private route: ActivatedRoute,
        public data: DataService, public notify: NotificationsService, public permissions: PermissionsService) {
          this.froala_loading = true;
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
  }

  create() {
    if(this.updating === false) {
      this.updating = true;
      if(this.user_group !== '') {
        if(this.new_news.title && this.new_news.title !== '') {
          if(this.new_news.subtitle && this.new_news.subtitle !== '') {
            if(this.new_news.html && this.new_news.html !== '') {
              console.log(this.new_news);
              this.new_news.created_by = this.auth.current_user.first_name + " " + this.auth.current_user.last_name;
              this.new_news.created_by_id = this.auth.current_user.id;
              this.processUserGroup();
              this.data.createPost(this.new_news).then(result => {
                this.new_news = {};
                this.showPreview = false;
                this.user_group = '';
                this.updating = false;
                this.notify.success("News Posted", "News has been posted successfully", true, "success");
              })
            } else {
              //content
              this.updating = false;
              this.notify.failure("Unable to Create News", "Please enter content", true, "warning");
            }
          } else {
            //subtitle
            this.updating = false;
            this.notify.failure("Unable to Create News", "Please enter a subtitle", true, "warning");
          }
        } else {
          this.updating = false;
          this.notify.failure("Unable to Create News", "Please enter a title", true, "warning");
          //title
        }
      } else {
        this.updating = false;
        this.notify.failure("Unable to Create News", "Please select a user group for this news", true, "warning");
      }
    }
  }

  processUserGroup() {
    switch(this.user_group) {
      case "Home Owner":
        this.new_news.user_group_hoa = true;
        this.new_news.user_group_golf = false;
        break;
      
      case "Golf Member":        
        this.new_news.user_group_hoa = false;
        this.new_news.user_group_golf = true;
        break;
      
      case "All":        
        this.new_news.user_group_hoa = true;
        this.new_news.user_group_golf = true;
        break;
    }
  }
}
