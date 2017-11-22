import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(public auth: AuthService, public router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // if (localStorage.getItem('currentUser')) {
        //     // logged in so return true
        //     return true;
        // }
        if (!this.auth.isAuthenticated()) {
            // this.router.navigate(['']);
            console.log("TEST");
            this.router.navigate([''], { queryParams: { returnUrl: state.url }});
            return false;
        }
        return true;
 
        // not logged in so redirect to login page with the return url and return false
        // return false;
    }
    // canActivate(): boolean {
    //     if (!this.auth.isAuthenticated()) {
    //         this.router.navigate(['']);
    //         return false;
    //     }
    //     return true;
    // }

}
