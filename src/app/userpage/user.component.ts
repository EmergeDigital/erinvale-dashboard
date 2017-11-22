import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import {AuthService} from "./../services/auth.service";
import {DataService} from "./../services/data.service";
import {NotificationsService} from "./../services/notifications.service";
import {PermissionsService} from "./../services/permissions.service";

@Component({
    moduleId: module.id,
    selector: 'user-cmp',
    templateUrl: 'user.component.html'
})

export class UserComponent{ 

    updating: boolean = false;
    reloadImage: boolean = true;

    constructor(public auth: AuthService, public router: Router, private route: ActivatedRoute,
        public data: DataService, public notify: NotificationsService, public permissions: PermissionsService) {
    }
    logout() {
        this.auth.logout();
        this.notify.success("Logged Out", "Logged out successfully", false, "success")
        this.router.navigateByUrl('/');
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

    getAccountType(): String {
        let acc = this.permissions.getAccountType();
        switch(acc) {
            case "Admin":
                return "Administrative Team";
            
            case "HomeOwner":
                return "Home Owner's Association";


            case "GolfMember":
                return "Golf Club Member";

            default:
                return "Unknown";
                
        }
    }

    getCircleStyle(): any {
        let acc = this.permissions.getAccountType();
        switch(acc) {
            case "Admin":
                return {'border': '5px solid #68B3C8'};
            
            case "HomeOwner":
                return {'border': '5px solid #F3BB45'};

            case "GolfMember":
                return {'border': '5px solid #7AC29A'};

            default:
                return {'border': '5px solid #FFFFFF'};
                
        }
    }
}
