import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import {AuthService} from "./../../services/auth.service";
import {DataService} from "./../../services/data.service";
import {NotificationsService} from "./../../services/notifications.service";
import {PermissionsService} from "./../../services/permissions.service";
import * as Chartist from 'chartist';
import * as moment from 'moment';

declare var $:any;
declare var swal: any;

@Component({
  selector: 'overview-cmp',
  templateUrl: './overview.component.html'
})

export class OverviewComponent implements OnInit{
    account_type_user: boolean = false;
    loading: boolean = true;
    data: any;
    colours: String[] = ["orange", "blue", "green", "brown", "purple"];
    showAttending: boolean = false;
    days_array: number [] = [];
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
            for(let event of data.events) {
                event.colour = this.randomColour();
                let dateStrings = "<b>Start: </b>" + moment(event.date_start).format("DD MMM YYYY - h:mm a") + "<br><b>End: </b>" + moment(event.date_end).format("DD MMM YYYY - h:mm a");
                let calcHtml = event.html;
                calcHtml += "<p style='margin-top: 25px'>"+dateStrings+"</p>";
                event.calcHtml = calcHtml;
            }
            for(let event of data.my_events) {
                event.colour = this.randomColour();
                let dateStrings = "<b>Start: </b>" + moment(event.date_start).format("DD MMM YYYY - h:mm a") + "<br><b>End: </b>" + moment(event.date_end).format("DD MMM YYYY - h:mm a");
                let calcHtml = event.html;
                calcHtml += "<p style='margin-top: 25px'>"+dateStrings+"</p>";
                event.calcHtml = calcHtml;
            }
            this.loading = false;
            setTimeout(()=>{
                if(permissions.getAccountType() === "Admin"){
                    
                    /*  **************** Chart Subscriptions - single line ******************** */
                    let labels = [];
                    let series = [];
    
                    for(let x = 0; x < 7; x++){
                        let day = moment().subtract(x, 'days').format('dddd');
                        labels.push(day.charAt(0));
                        series.push(data.new_users[day]);
                    }

                    this.days_array = series.reverse();
    
                    var dataDays = {
                        labels: labels.reverse(),
                        series: [
                            series
                        ]
                    };
    
                    console.log(dataDays);
    
                    var optionsDays: any = {
                        showPoint: false,
                        lineSmooth: true,
                        height: "210px",
                        axisX: {
                            showGrid: false,
                            showLabel: true
                        },
                        axisY: {
                            offset: 40,
                            showGrid: false
                        },
                        low: 0,
                        high: 'auto',
                        classNames: {
                            line: 'ct-line ct-red'
                        }
                    };
    
                    var chartTotalSubscriptions = new Chartist.Line('#chartTotalSubscriptions', dataDays, optionsDays);

                    var dataUserTypes = {
                        labels: ["Admin", "Resident", "Golf Member"],
                        series: [data.user_counts.admin, data.user_counts.hoa, data.user_counts.golf]
                    }
                    console.log(dataUserTypes);

                    var optionsTypes: any = {
                        height: "210px",
                        axisX: {
                            showGrid: false,
                            showLabel: true
                        },
                        axisY: {
                            offset: 40,
                            showGrid: false
                        },
                        // low: 0,
                        // high: 'auto',
                        distributeSeries: true
                    };
    
                    var chartTotalAccounts = new Chartist.Bar('#chartAccountTypes', dataUserTypes, optionsTypes);
                }
            }, 1);
            
        });

    }

    getTotalAccounts(){
        if(this.days_array) {
            return this.days_array.reduce((a, b) => a + b, 0);
        }
        return 0;
    }

    getTotalUsers(){
        return this.data.user_counts.admin + this.data.user_counts.golf + this.data.user_counts.hoa;
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

	eventClicked(event) {
		let that = this;
		swal({
			title: event.title,
			html: event.calcHtml,
			showCancelButton: true,
			confirmButtonText: 'Save this event',
			cancelButtonText: "Don't save this",
			confirmButtonClass: 'btn btn-success',
			cancelButtonClass: 'btn btn-danger',
			buttonsStyling: false
		}).then(function() {            
			that.dataService.attendEvent(event.id, true).then(result => {
				that.notify.success("Thank you", "Your event has been saved", false, "success");
                
                that.data.my_events = that.data.my_events.filter(e => e.id !== event.id);	
                that.data.my_events.splice(0, 0, event);			
			});
		}, function(dismiss) {
			if (!!dismiss && dismiss === 'cancel') {
				that.dataService.attendEvent(event.id, false).then(result => {
					that.notify.success("Thank you", "Your event has been unsaved", false, "success");
                    that.data.my_events = that.data.my_events.filter(e => e.id !== event.id);						
				});
			}
		});
    }
    
    newsClicked(post) {
        this.router.navigate(["/article/" + post.id]);
    }

    randomColour(): string {
        let colour = this.colours[Math.floor(Math.random() * this.colours.length)] + "";
        console.log(colour);
        return colour;
    }

    getClass(event): string {
        let colour_class = event.colour + "-card";
        return "card card-circle-chart " + colour_class;
    }

    getDate(event_date) {
        return moment(event_date).format("DD MMM YYYY - h:mm a")
    }

    unescape(input) {
        const e = document.createElement('div');
        e.innerHTML = input;
        return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue;
    }

    shorten(text): string {
        return text.length > 250 ? text.substring(0, 249) + '...' : text;
    }
}
