import { Component, OnInit, OnDestroy, ViewChild, HostListener, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import 'rxjs/add/operator/filter';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import {PermissionsService} from "./../../services/permissions.service";
// import { EventEmitter } from 'events';

declare var $: any;

@Component({
    selector: 'app-layout',
    templateUrl: './admin-layout.component.html'
})

export class AdminLayoutComponent implements OnInit {
    location: Location;
    private _router: Subscription;
    colours: string[] = ['info', 'success', 'warning'];
    perms: string[] = ['Admin', 'GolfMember', 'HomeOwner'];
    $sidebar: any;
    $off_canvas_sidebar: any;
    window_width: any;
    _colourChanged: EventEmitter<String> = new EventEmitter();

    // url: string;

    @ViewChild('sidebar') sidebar;
    @ViewChild(NavbarComponent) navbar: NavbarComponent;
    constructor( private router: Router, location:Location, public permissions: PermissionsService ) {
      this.location = location;
    }

    ngOnInit() {
        this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
        //   this.url = event.url;
          this.navbar.sidebarClose();
        });
        var $sidebar = $('.sidebar');
        var $off_canvas_sidebar = $('.off-canvas-sidebar');
        var window_width = $(window).width();

        var isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;
        if (isWindows){
        // if we are on windows OS we activate the perfectScrollbar function
            var $main_panel = $('.main-panel');
            $main_panel.perfectScrollbar();
        }

        this._colourChanged.subscribe(new_colour => {        
            if($sidebar.length != 0){
                $sidebar.attr('data-active-color',new_colour);
            }
    
            if($off_canvas_sidebar.length != 0){
                $off_canvas_sidebar.attr('data-active-color',new_colour);
            }
        })
        this.processPermissions();

    }

    processPermissions() {
        let p = this.permissions.getAccountType();
        let i = this.perms.indexOf(p);

        if(i === -1) {
            //fail here
            this._colourChanged.emit('warning')
        }

        this._colourChanged.emit(this.colours[i])
    }

    public isMap(){
        // console.log(this.location.prepareExternalUrl(this.location.path()));
        if(this.location.prepareExternalUrl(this.location.path()) == '/maps/fullscreen'){
            return true;
        }
        else {
            return false;
        }
    }
}
