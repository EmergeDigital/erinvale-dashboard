import { Component, OnInit, AfterViewInit, AfterViewChecked, AfterContentInit } from '@angular/core';
import { PermissionsService } from "../services/permissions.service";
import { AuthService } from "../services/auth.service";

declare var $:any;
//Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    // icon: string;
    children?: ChildrenItems[];
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
}

//Menu Items
export const ROUTES: RouteInfo[] = [
    {
        path: '/dashboard/overview',
        title: 'Dashboard',
        type: 'link',
        icontype: 'ti-panel'

    },
    {
        path: '/news-events',
        title: 'News & Events',
        type: 'link',
        icontype: 'ti-book'

    },
    {
        path: '/calendar',
        title: 'Calendar',
        type: 'link',
        icontype: 'ti-calendar'

    },
    {
        path: '#',
        title: 'Downloads',
        type: 'link',
        icontype: 'ti-import'

    },
    // {
    //     path: '',
    //     title: 'Dashboard',
    //     type: 'sub',
    //     icontype: 'ti-panel',
    //     children: [
    //         {path: 'overview', title: 'Overview', ab:'O'},
    //         {path: 'stats', title: 'Stats', ab:'S'}
    //     ]
    // },
    // {
    //     path: '/components',
    //     title: 'Components',
    //     type: 'sub',
    //     icontype: 'ti-package',
    //     children: [
    //         {path: 'buttons', title: 'Buttons', ab:'B'},
    //         {path: 'grid', title: 'Grid System', ab:'GS'},
    //         {path: 'panels', title: 'Panels', ab:'P'},
    //         {path: 'sweet-alert', title: 'Sweet Alert', ab:'SA'},
    //         {path: 'notifications', title: 'Notifications', ab:'N'},
    //         {path: 'icons', title: 'Icons', ab:'I'},
    //         {path: 'typography', title: 'Typography', ab:'T'}
    //     ]
    // },{
    //     path: '/forms',
    //     title: 'Forms',
    //     type: 'sub',
    //     icontype: 'ti-clipboard',
    //     children: [
    //         {path: 'regular', title: 'Regular Forms', ab:'RF'},
    //         {path: 'extended', title: 'Extended Forms', ab:'EF'},
    //         {path: 'validation', title: 'Validation Forms', ab:'VF'},
    //         {path: 'wizard', title: 'Wizard', ab:'W'}
    //     ]
    // },
    // {
    //     path: '/tables',
    //     title: 'Tables',
    //     type: 'sub',
    //     icontype: 'ti-view-list-alt',
    //     children: [
    //         {path: 'regular', title: 'Regular Tables', ab:'RT'},
    //         {path: 'extended', title: 'Extended Tables', ab:'ET'},
    //         {path: 'datatables.net', title: 'Datatables.net', ab:'DT'}
    //     ]
    // },
    // {
    //     path: '/maps',
    //     title: 'Maps',
    //     type: 'sub',
    //     icontype: 'ti-map',
    //     children: [
    //         {path: 'google', title: 'Google Maps', ab:'GM'},
    //         {path: 'fullscreen', title: 'Full Screen Map', ab:'FSM'},
    //         {path: 'vector', title: 'Vector Map', ab:'VM'}
    //     ]
    // },{
    //     path: '/charts',
    //     title: 'Charts',
    //     type: 'link',
    //     icontype: 'ti-gift'

    // },{
    //     path: '/calendar',
    //     title: 'Calendar',
    //     type: 'link',
    //     icontype: 'ti-calendar'
    // },{
    //     path: '/pages',
    //     title: 'Pages',
    //     type: 'sub',
    //     icontype: 'ti-gift',
    //     children: [
    //         {path: 'timeline', title: 'Timeline Page', ab:'T'},
    //         {path: 'user', title: 'User Page', ab:'UP'},
    //         {path: 'login', title: 'Login Page', ab:'LP'},
    //         {path: 'register', title: 'Register Page', ab:'RP'},
    //         {path: 'lock', title: 'Lock Screen Page', ab:'LSP'}
    //     ]
    // }
];

export const ROUTES_ADMIN: RouteInfo[] = [
    {
        path: '/users',
        title: 'Users',
        type: 'sub',
        icontype: 'ti-user',
        children: [
            {path: 'add', title: 'Add User', ab:'U+'},
            {path: 'list', title: 'List Users', ab:'LU'}
        ]
    },
    {
        path: '/news',
        title: 'News',
        type: 'sub',
        icontype: 'ti-announcement',
        children: [
            {path: 'add', title: 'Add News', ab:'N+'},
            {path: 'list', title: 'List News', ab:'LN'}
        ]
    },
    {
        path: '/event',
        title: 'Events',
        type: 'sub',
        icontype: 'ti-flag',
        children: [
            {path: 'add', title: 'Add Event', ab:'E+'},
            {path: 'list', title: 'List Events', ab:'LE'}
        ]
    },
    // {
    //     path: '#',
    //     title: 'Downloads',
    //     type: 'sub',
    //     icontype: 'ti-link',
    //     children: [
    //         {path: '#', title: 'Add Download', ab:'D+'},
    //         {path: '#', title: 'List Downloads', ab:'LD'}
    //     ]
    // },
]

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent {
    public menuItems: any[];
    public menuItemsAdmin: any[];
    // permissions: string = "";
    isNotMobileMenu(){
        if($(window).width() > 991){
            return false;
        }
        return true;
    }
    
    constructor(private permissions : PermissionsService, public auth: AuthService) {
        
    }

    ngOnInit() {
        var isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;
        this.menuItems = ROUTES.filter(menuItem => menuItem);
        this.menuItemsAdmin = ROUTES_ADMIN.filter(menuItem => menuItem);

        isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

        if (isWindows){
           // if we are on windows OS we activate the perfectScrollbar function
           $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();
           $('html').addClass('perfect-scrollbar-on');
       } else {
           $('html').addClass('perfect-scrollbar-off');
       }
    }
    ngAfterViewInit(){
        var $sidebarParent = $('.sidebar .nav > li.active .collapse li.active > a').parent().parent().parent();

        var collapseId = $sidebarParent.siblings('a').attr("href");

        $(collapseId).collapse("show");
    }
}
