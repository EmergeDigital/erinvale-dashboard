import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import {AuthService} from "./../../services/auth.service";
import {DataService} from "./../../services/data.service";
import {NotificationsService} from "./../../services/notifications.service";
import {PermissionsService} from "./../../services/permissions.service";

@Component({
  moduleId: module.id,
  selector: 'addEvent-cmp',
  templateUrl: './addEvent.component.html'
})

export class AddEventComponent{
  showPreview: boolean = false;
  new_event: any = {};
  user_group: string = '';
  updating: boolean = false;

  constructor(public auth: AuthService, public router: Router, private route: ActivatedRoute,
        public data: DataService, public notify: NotificationsService, public permissions: PermissionsService) {

  }

  create() {
    if(this.updating === false) {
      this.updating = true;
      if(this.user_group !== '') {
        if(this.new_event.title && this.new_event.title !== '') {
          if(this.new_event.subtitle && this.new_event.subtitle !== '') {
            if(this.new_event.html && this.new_event.html !== '') {
              console.log(this.new_event);
              this.new_event.created_by = this.auth.current_user.first_name + " " + this.auth.current_user.last_name;
              this.new_event.created_by_id = this.auth.current_user.id;
              this.processUserGroup();
              this.data.createPost(this.new_event).then(result => {
                this.new_event = {};
                this.showPreview = false;
                this.user_group = '';
                this.updating = false;
                this.notify.success("Event Posted", "Event has been posted successfully", true, "success");
              })
            } else {
              //content
              this.updating = false;
              this.notify.failure("Unable to Create Event", "Please enter content", true, "warning");
            }
          } else {
            //subtitle
            this.updating = false;
            this.notify.failure("Unable to Create Event", "Please enter a subtitle", true, "warning");
          }
        } else {
          this.updating = false;
          this.notify.failure("Unable to Create Event", "Please enter a title", true, "warning");
          //title
        }
      } else {
        this.updating = false;
        this.notify.failure("Unable to Create Event", "Please select a user group for this Event", true, "warning");
      }
    }
  }

  processUserGroup() {
    switch(this.user_group) {
      case "Home Owner":
        this.new_event.user_group_hoa = true;
        this.new_event.user_group_golf = false;
        break;
      
      case "Golf Member":        
        this.new_event.user_group_hoa = false;
        this.new_event.user_group_golf = true;
        break;
    }
  }
}
