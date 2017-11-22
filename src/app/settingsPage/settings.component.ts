import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import {AuthService} from "./../services/auth.service";
import {DataService} from "./../services/data.service";
import {NotificationsService} from "./../services/notifications.service";
import {PermissionsService} from "./../services/permissions.service";

@Component({
    moduleId: module.id,
    selector: 'settings-cmp',
    templateUrl: 'settings.component.html'
})

export class SettingsComponent{ 

    updating: boolean = false;
    reloadImage: boolean = true;
    new_email: string = '';
    new_email_password: string = '';
    updatingEmail: boolean = false;
    new_password: string = '';
    new_password2: string = '';
    old_password: string = '';

    constructor(public auth: AuthService, public router: Router, private route: ActivatedRoute,
        public data: DataService, public notify: NotificationsService, public permissions: PermissionsService) {
            this.new_email = this.auth.current_user.email;
    }
    logout() {
        this.auth.logout();
        this.notify.success("Logged Out", "Logged out successfully", false, "success")
        this.router.navigateByUrl('/');
    }

    updateEmail() {
        if(this.updating === false) {
            this.updating = true;
            this.updatingEmail = false;
            if(this.new_email.length > 4) {
                this.data.changeEmail(this.new_email, this.new_email_password).then(result => {
                    if(!!result) {
                        this.notify.success("Success", "Email address has been updated", true, "success");
                        this.updating = false;
                    } else {
                        this.notify.failure("Unable to Update", result, true, "warning");
                        this.updating = false;
                    }
                }).catch(ex => {
                    this.notify.failure("Unable to Update", ex, true, "warning");
                    this.updating = false;
                })
                this.new_email_password = '';
            } else {
                this.notify.failure("Unable to Update", "Email is invalid", true, "warning");
                this.updating = false;
            }
            //Update Email here
        }

    }

    updatePassword() {
        if(this.updating === false) {
            this.updating = true;
            //Update Password here
            if(this.new_password.length > 3) {
                if(this.new_password === this.new_password2) {
                    this.data.changePassword(this.old_password, this.new_password).then(result=> {
                        if(!!result) {
                            this.notify.success("Success", "Password has been updated", true, "success");
                            this.updating = false;
                            this.old_password = '';
                            this.new_password = '';
                            this.new_password2 = '';
                        } else {
                            this.notify.failure("Unable to Update", result, true, "warning");
                            this.updating = false;
                        }
                    }).catch(ex => {
                        this.notify.failure("Unable to Update", ex, true, "warning");
                        this.updating = false;
                    })
                } else {
                    this.notify.failure("Unable to Update", "Passwords do not match", true, "warning");
                    this.updating = false;
                }
            } else {
                this.notify.failure("Unable to Update", "Password is too short", true, "warning");
                this.updating = false;
            }
        }

    }

    update() {
        if(this.updating === false) {
            this.updating = true;
            this.data.updateUser(this.auth.current_user).then(user => {  
                this.updating = false;
                if(!!user) {
                    this.notify.success("Account Updated", "Account successfully updated", true, "success");
                    this.reloadImage = false;
                    setTimeout(()=> {
                        this.reloadImage = true;
                    }, 1)
                } else {
                    this.notify.failure("Could Not Update", "Account could not be updated", true, "warning");
                }
            }).catch(ex => {            
                this.updating = false;
                this.notify.failure("Could Not Update", ex,  true, "warning");
            })

        }
    }
}
