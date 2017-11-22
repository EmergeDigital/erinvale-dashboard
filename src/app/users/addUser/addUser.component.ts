import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import {AuthService} from "./../../services/auth.service";
import {DataService} from "./../../services/data.service";
import {NotificationsService} from "./../../services/notifications.service";
import {PermissionsService} from "./../../services/permissions.service";

@Component({
  moduleId: module.id,
  selector: 'addUser-cmp',
  templateUrl: './addUser.component.html'
})

export class AddUserComponent{
  new_user: any = {};
  user_group: string = '';
  updating: boolean = false;
  password_confirm: string = '';

  constructor(public auth: AuthService, public router: Router, private route: ActivatedRoute,
        public data: DataService, public notify: NotificationsService, public permissions: PermissionsService) {

  }

  create() {
    if(this.updating === false) {
      this.updating = true;
      if(this.user_group !== '') {
        if(this.new_user.first_name !== '' && this.new_user.last_name !== ''){
          if(this.new_user.password && this.new_user.password.length > 3) {
            if(this.password_confirm === this.new_user.password) {
              if(this.validateEmail(this.new_user.email)) {
                this.processUserGroup();
                this.auth.createAccount(this.new_user).then(user => {
                  if(!!user) {
                    this.new_user = {};
                    this.user_group = '';
                    this.password_confirm = '';
                    this.notify.success("User Created", "New user has been created successfully", true, "success");
                    this.updating = false;    
                  } else {
                      this.notify.failure("Unable to Create User", "Unknown issue, please contact support", true, "warning");
                      this.updating = false;    
                  }
                }).catch(ex => {
                  this.notify.failure("Unable to Create User", ex, true, "warning");
                  this.updating = false;    
                });
              } else {
                this.notify.failure("Unable to Create User", "Please enter a valid email address", true, "warning");
                this.updating = false;    
              }
            } else {
              this.notify.failure("Unable to Create User", "Passwords do not match", true, "warning");
              this.updating = false;  
            }
          } else {
            this.notify.failure("Unable to Create User", "Password is not long enough", true, "warning");
            this.updating = false;  
          }
        } else {
          this.notify.failure("Unable to Create User", "Please enter a first and last name for this user", true, "warning");
          this.updating = false;    
        }
      } else {
        this.notify.failure("Unable to Create User", "Please select a user group for this user", true, "warning");
        this.updating = false;
      }
    }
  }

  processUserGroup() {
    switch(this.user_group) {
      case "Home Owner":
        this.new_user.user_group_hoa = true;
        this.new_user.user_group_golf = false;
        this.new_user.permissions = "user";
        break;
      
      case "Golf Member":        
      this.new_user.user_group_hoa = false;
        this.new_user.user_group_golf = true;
        this.new_user.permissions = "user";
        break;

      case "Admin":
        this.new_user.user_group_hoa = false;
        this.new_user.user_group_golf = false;
        this.new_user.permissions = "admin";
        break;
    }
  }

  validateEmail(email): boolean {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
}
