import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import {AuthService} from "./../../services/auth.service";
import {DataService} from "./../../services/data.service";
import {NotificationsService} from "./../../services/notifications.service";
import {PermissionsService} from "./../../services/permissions.service";

@Component({
  moduleId: module.id,
  selector: 'editUser-cmp',
  templateUrl: './editUser.component.html'
})

export class EditUserComponent{


  private sub: any;
  user: any = {};
  id: string = '';
  loading: boolean = true;
  user_group: string = '';
  updating: boolean = false;
  old_email: string = '';
  user_group_admin: boolean = false;
  show_alt = false;

  constructor(public auth: AuthService, public router: Router, private route: ActivatedRoute,
    public data: DataService, public notify: NotificationsService, public permissions: PermissionsService) {
      this.loading = true;
      
      this.sub = this.route.params.subscribe(params => {
          this.id = params['id'];
          if(!!this.id) {
            this.data.getUser(this.id).then(user => {
              if(!!user) {
                this.user = user;
                this.old_email = user.email;
                this.loading = false;
                console.log(this.user);
                // this.user_group = permissions.processAccountType(user).replace(/([A-Z])/g, ' $1').trim()
                if (permissions.processAccountType(user) === 'Admin') {
                  this.user_group_admin = true;
                } else {
                  this.user_group_admin = false;
                }
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
      if(this.checkUserGroups()) {
        if(this.user.first_name !== '' && this.user.last_name !== ''){
          if(this.validateEmail(this.user.email)) {
            this.processUserGroup();
            this.data.updateUserAlt(this.user, this.old_email).then(_user => {
              if(!!_user) {
                this.user = _user;
                this.old_email = _user.email;
                this.user_group = this.permissions.processAccountType(_user).replace(/([A-Z])/g, ' $1').trim();
                this.notify.success("User Updated", "User has been updated successfully", true, "success");
                this.updating = false;    
              } else {
                  this.notify.failure("Unable to Update User", "Unknown issue, please contact support", true, "warning");
                  this.updating = false;    
              }
            }).catch(ex => {
              this.notify.failure("Unable to Update User", ex, true, "warning");
              this.updating = false;    
            });
          } else {
            this.notify.failure("Unable to Update User", "Please enter a valid email address", true, "warning");
            this.updating = false;    
          }
        } else {
          this.notify.failure("Unable to Update User", "Please enter a first and last name for this user", true, "warning");
          this.updating = false;    
        }
      } else {
        this.notify.failure("Unable to Update User", "Please select a user group for this user", true, "warning");
        this.updating = false;
      }
    }
  }

  checkUserGroups() {
    // console.log(this.new_user);
    if (this.user.user_group_hoa) {
      return true;
    } else if (this.user.user_group_golf) {
      return true;
    } else if (this.user_group_admin) {
      return true;
    }
    return false;
  }

  processUserGroup() {
    if (this.user_group_admin) {
      this.user.permissions = "admin";
    } else {
      this.user.permissions = "user";
    }
  }
  validateEmail(email): boolean {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
}
