import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import {AuthService} from "./../../services/auth.service";
import {DataService} from "./../../services/data.service";
import {NotificationsService} from "./../../services/notifications.service";

declare var $:any;
// import * as $ from 'jquery';
// window["$"] = $;
// window["jQuery"] = $;

@Component({
    moduleId:module.id,
    selector: 'login-cmp',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit{
    test : Date = new Date();
    private toggleButton;
    private sidebarVisible: boolean;
    private nativeElement: Node;
    email: string = '';
    password: string = '';
    authenticating: boolean = false;
    resettingPassword: boolean = false;
    returnUrl: string = '';
    reset_email: string = '';
    showForgotPassword: boolean = false;
    loading: boolean = false;

    constructor(private element : ElementRef, public auth: AuthService, public router: Router, private route: ActivatedRoute,
                public data: DataService, public notify: NotificationsService) {
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
        if(auth.isAuthenticated()) {
          this.router.navigateByUrl(this.returnUrl);
        }
    
        if(this.auth.getAuth()) {
          this.authenticating = true;
          this.loginStored();
        }
    }
    checkFullPageBackgroundImage(){
        var $page = $('.full-page');
        var image_src = $page.data('image');

        if(image_src !== undefined){
            var image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>'
            $page.append(image_container);
        }
    };

    ngOnInit(){
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard/overview';
        this.checkFullPageBackgroundImage();

        var navbar : HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];

        setTimeout(function(){
            // after 1000 ms we add the class animated to the login/register card
            $('.card').removeClass('card-hidden');
        }, 700)
    }
    sidebarToggle(){
        var toggleButton = this.toggleButton;
        var body = document.getElementsByTagName('body')[0];
        var sidebar = document.getElementsByClassName('navbar-collapse')[0];
        if(this.sidebarVisible == false){
            setTimeout(function(){
                toggleButton.classList.add('toggled');
            },500);
            body.classList.add('nav-open');
            this.sidebarVisible = true;
        } else {
            this.toggleButton.classList.remove('toggled');
            this.sidebarVisible = false;
            body.classList.remove('nav-open');
        }
    }

    // createAccount() {
    //     this.auth.createAccount().then((user)=> {
    //         console.log(user);
    //     }).catch(ex=> {
    //         console.log(ex);
    //     })
    // }

    login($event){
        $event.preventDefault();
        this.authenticating = true;
        console.log("LEGGO");
        this.auth.login(this.email, this.password).then(user => {
            if(!!user) {
                console.log(user);
                if(user.account_setup === false) {
                    this.firstLogin();
                } else {
                    this.success("Success", "Logged in successfully", false);
                    this.router.navigateByUrl(this.returnUrl);
                }
            } else {
                console.log("ERROR");
                this.failure("Failure", "Unknown failure", true);
            }
        }).catch(ex => {
            this.failure("Failure", ex, true);
            console.log(ex);
        });
    }



    resetPassword($event) {
        $event.preventDefault();
        this.resettingPassword = true;
        this.data.resetPassword(this.reset_email).then(result => {
          this.showForgotPassword = false;
          this.resettingPassword = false;
          this.reset_email = '';
          this.success("Success", result, true);
        }).catch(ex => {
            this.resettingPassword = false;
          this.failure("Failure", ex, true);
        });
    }
    
    loginStored() {
        this.auth.loginStored().then(user=>{
            
            if(!!user) {
                console.log(user);
                if(user.account_setup === false) {
                    this.firstLogin();
                } else {
                    this.success("Success", "Logged in successfully", false);
                    this.router.navigateByUrl(this.returnUrl);
                }
            } else {
                console.log("ERROR");
                this.failure("Failure", "Unknown failure", true);
            }
        }).catch(e=>{
            console.log(e);
            this.failure("Failure", e, true);
        });
    }

    success(title, message, popup) {
    this.authenticating = false;  
    this.notify.success(title, message, popup, 'success');
    }

    failure(title, message, popup) {
    this.authenticating = false;
    this.notify.failure(title, message, popup, 'warning')
    }

    firstLogin() {
        this.notify.success("Logged In", "Welcome to your dashboard, please head to the account page and fill in your details", true, 'success-control').then(result => {
            if(result) {
                this.router.navigateByUrl('/myAccount');
            } else {
                this.router.navigateByUrl(this.returnUrl);
            }
        })
        this.data.updateUser({account_setup: true}).then((user)=> {
            console.log(user);
        })
    }
//   login($event) {
//     $event.preventDefault()
//     this.authenticating = true;
//     this.auth.login(this.auth_email, this.auth_password).then(user=>{
//       if(!!user) {
//         this.finishLoading();
//         this.router.navigateByUrl(this.returnUrl);
//       }
//     }).catch(e=>{
//       console.log(e);
//       this.failedLogin(e._body.replace(/['"]+/g, ''));
//     });
//   }
}
