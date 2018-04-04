import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import {DataService} from "./../../services/data.service";
import {NotificationsService} from "./../../services/notifications.service";

declare var $:any;

@Component({
    moduleId:module.id,
    selector: 'contact-cmp',
    templateUrl: './contact.component.html'
})

export class ContactComponent implements OnInit{
    test : Date = new Date();
    private toggleButton;
    private sidebarVisible: boolean;
    private nativeElement: Node;
    email: string;
    name: string;
    message: string;
    loading = false;
    current_error: string;

    constructor(public data: DataService, private element : ElementRef, public notify: NotificationsService) {
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
        this.current_error = '';
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

    

    checkFields() {
        if (!this.email || this.email === '' || !this.validateEmail(this.email.toLowerCase().trim())) {
            this.current_error = 'Please enter a valid email address';
            return false;
        } else if (!this.name || this.name === '') {
            this.current_error = 'Please enter your name';
            return false;
        } else if (!this.message || this.message === '') {
            this.current_error = 'Please enter a message';
            return false;
        }
        return true;
    }

    submit($event) {
        $event.preventDefault();
        this.loading = true;
        if (!this.checkFields()) {
            this.notify.failure('Unable to send contact request', this.current_error, true, 'warning');
            this.loading = false;
            return;
        }

        this.data.contact(this.name, this.message, this.email.toLowerCase().trim()).then(() => {
            this.notify.success('Contact request sent', 'Thank you, we will be in touch', true, 'success');
            this.resetFields();
            this.loading = false;
        }).catch(ex => {
            console.log(ex);
            this.notify.failure('Unable to send contact request', 'An internal error occured', true, 'warning');
            this.loading = false;
        })
    }

    resetFields() {
        this.name = '';
        this.email = '';
        this.message = '';
    }

    validateEmail(email): boolean {
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
}
