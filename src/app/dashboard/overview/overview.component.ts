import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import {AuthService} from "./../../services/auth.service";
import {DataService} from "./../../services/data.service";
import {NotificationsService} from "./../../services/notifications.service";
import {PermissionsService} from "./../../services/permissions.service";
import * as Chartist from 'chartist';

declare var $:any;

@Component({
  selector: 'overview-cmp',
  templateUrl: './overview.component.html'
})

export class OverviewComponent implements OnInit{
    account_type_user: boolean = false;
    loading: boolean = true;
    data: any;
    // initCirclePercentage(){
    //     $('#chartDashboard, #chartOrders, #chartNewVisitors, #chartSubscriptions, #chartDashboardDoc, #chartOrdersDoc').easyPieChart({
    //         lineWidth: 6,
    //         size: 160,
    //         scaleColor: false,
    //         trackColor: 'rgba(255,255,255,.25)',
    //         barColor: '#FFFFFF',
    //         animate: ({duration: 5000, enabled: true})
    //     });
    // }

    ngOnInit(){
        /*  **************** Chart Total Earnings - single line ******************** */
        // var dataPrice = {
        //     labels: ['Jan','Feb','Mar', 'April', 'May', 'June'],
        //     series: [
        //         [230, 340, 400, 300, 570, 500, 800]
        //     ]
        // };

        // var optionsPrice = {
        //     showPoint: false,
        //     lineSmooth: true,
        //     height: "210px",
        //     axisX: {
        //         showGrid: false,
        //         showLabel: true
        //     },
        //     axisY: {
        //         offset: 40,
        //         showGrid: false
        //     },
        //     low: 0,
        //     // high: 'auto',
        //     //   classNames: {
        //     //       line: 'ct-line ct-green'
        //     //   }
        // };

        // var chartTotalEarnings = new Chartist.Line('#chartTotalEarnings', dataPrice, optionsPrice);

        // /*  **************** Chart Subscriptions - single line ******************** */

        // var dataDays = {
        //     labels: ['M','T','W', 'T', 'F', 'S','S'],
        //     series: [
        //         [60, 50, 30, 50, 70, 60, 90, 100]
        //     ]
        // };

        // var optionsDays: any = {
        //     showPoint: false,
        //     lineSmooth: true,
        //     height: "210px",
        //     axisX: {
        //         showGrid: false,
        //         showLabel: true
        //     },
        //     axisY: {
        //         offset: 40,
        //         showGrid: false
        //     },
        //     low: 0,
        //     high: 'auto',
        //     classNames: {
        //         line: 'ct-line ct-red'
        //     }
        // };

        // var chartTotalSubscriptions = new Chartist.Line('#chartTotalSubscriptions', dataDays, optionsDays);

        // /*  **************** Chart Total Downloads - single line ******************** */

        // var dataDownloads = {
        //     labels: ['2009','2010','2011', '2012', '2013', '2014'],
        //     series: [
        //         [1200, 1000, 3490, 8345, 3256, 2566]
        //     ]
        // };

        // var optionsDownloads: any = {
        // showPoint: false,
        //     lineSmooth: true,
        //     height: "210px",
        //     axisX: {
        //         showGrid: false,
        //         showLabel: true
        //     },
        //     axisY: {
        //         offset: 40,
        //         showGrid: false
        //     },
        //     low: 0,
        //     high: 'auto',
        //     classNames: {
        //         line: 'ct-line ct-orange'
        //     }
        // };

        // var chartTotalDownloads = new Chartist.Line('#chartTotalDownloads', dataDownloads, optionsDownloads);
    }
    // ngAfterViewInit(){
    //     this.initCirclePercentage();
    // }

    constructor(public auth: AuthService, public router: Router, private route: ActivatedRoute,
        public dataService: DataService, public notify: NotificationsService, public permissions: PermissionsService) {

        this.account_type_user = this.isUser(permissions.getAccountType());
        this.dataService.fetchDashboardData().then(data=>{
            this.data = data;
            console.log(data);
            this.loading = false;
        });

    }

    isUser(account_type): boolean {
        switch (account_type) {
            case "Admin":
                return false;

            case "HomeOwner":
                return true;
            
            case "GolfMember":
                return true;
        }
    }

    showAttending() {
        console.log("OK GO");
    }
}
