import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import {AuthService} from "./../services/auth.service";
import {DataService} from "./../services/data.service";
import {NotificationsService} from "./../services/notifications.service";
import {PermissionsService} from "./../services/permissions.service";

import * as moment from 'moment';

declare var swal: any;
declare var require: any;
declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'news-events-cmp',
    templateUrl: 'news.component.html'
})

export class NewsComponent implements OnInit{

    ngOnInit() {
        // // Init Tags Input
    }

    updating: boolean = false;
    loading: boolean = true;
    news: any;

    constructor(public auth: AuthService, public router: Router, private route: ActivatedRoute,
        public data: DataService, public notify: NotificationsService, public permissions: PermissionsService) {
            //FETCH NEWS
			let params = this.processUserGroup(this.permissions.getAccountType());
			this.getNews(params).then(news => {
				console.log(news);
				// for(const n of news) {
				// 	if(n.date_start) {
				// 		console.log("EVENT: ", n);
				// 	} else {
				// 		console.log("POST: ", n);
				// 	}
                // }
                this.news = news;
                this.loading = false;
                setTimeout(()=>{
                    if($(".tagsinput").length != 0){
                        $(".tagsinput").tagsinput();
                    }
                }, 1);
			}).catch(ex => {
                this.loading = false;
				console.log(ex);
			});
    }

    clicked(n) {
        console.log(n);
        if(n.date_start) { //EVENT

            let dateStrings = "<b>Start: </b>" + moment(n.date_start).format("DD MMM YYYY - h:mm a") + "<br><b>End: </b>" + moment(n.date_end).format("DD MMM YYYY - h:mm a");
            let calcHtml = n.html;
            calcHtml += "<p style='margin-top: 25px'>"+dateStrings+"</p>";
            let _event = n;
            _event.calcHtml = calcHtml;
            this.eventClicked(_event);
        } else { //POST
            this.router.navigate(["/article/" + n.id]);
        }
    }

	eventClicked(event) {
		let that = this;
		swal({
			title: event.title,
			html: event.calcHtml,
			showCancelButton: true,
			confirmButtonText: 'I am attending',
			cancelButtonText: "No I'm not going",
			confirmButtonClass: 'btn btn-success',
			cancelButtonClass: 'btn btn-danger',
			buttonsStyling: false
		}).then(function() {            
			that.data.attendEvent(event.id, true).then(result => {
				that.notify.success("Thank you", "Your attendance has been updated", false, "success");					
			});
		}, function(dismiss) {
			if (!!dismiss && dismiss === 'cancel') {
				that.data.attendEvent(event.id, false).then(result => {
					that.notify.success("Thank you", "Your attendance has been updated", false, "success");					
				});
			}
		});
	}

    getTags(n){
        let tags = "";

        if(n.date_start) {
            tags +="Event";
        } else {
            tags +="News";
        }

        if(n.user_group_hoa){
            tags += ", HOA";
        }

        if(n.user_group_golf){
            tags += ", Golf";
        }
        
        return tags;
    }

    getMoment(date) {
        return moment(date).format("DD MMM YYYY - h:mm a");
    }
    
    getNews(params): Promise<any> {
        return new Promise((resolve, reject) => {
            this.data.getNews(params).then(news => {
                resolve(news);
            }).catch(ex => {
                this.notify.failure("Unable to Fetch News", ex, true, "warning");
                reject(ex);
            })

        });

    }
	
	processUserGroup(group) {
		switch(group) {
		case "HomeOwner":
			return {
				user_group_hoa: true
			};
		
		case "GolfMember":        
			return {
				user_group_golf: true
			};
		
		default:
			return {};
		}
	}
    
}
