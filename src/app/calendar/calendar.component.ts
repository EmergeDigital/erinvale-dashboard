import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import {AuthService} from "./../services/auth.service";
import {DataService} from "./../services/data.service";
import {NotificationsService} from "./../services/notifications.service";
import {PermissionsService} from "./../services/permissions.service";

import * as moment from 'moment';

declare var swal: any;
declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'calendar-cmp',
    templateUrl: 'calendar.component.html'
})

export class CalendarComponent implements OnInit{
	calendar: any;
	loading: boolean = false;
	colours: String[] =	['event-azure', 'event-rose', 'event-green', 'event-orange', 'event-red'];

    ngOnInit(){
        
		this.loading = true;
		// this.calendar = $calendar;
	}
	
	eventClicked(event) {
		let that = this;
		swal({
			title: event.title,
			html: event.html,
			showCancelButton: true,
			confirmButtonText: 'Save this event',
			cancelButtonText: "Don't save this",
			confirmButtonClass: 'btn btn-success',
			cancelButtonClass: 'btn btn-danger',
			buttonsStyling: false
		}).then(function() {
			var $calendar = $('#fullCalendar');
			$calendar.fullCalendar('unselect');
			that.data.attendEvent(event.id, true).then(result => {
				that.notify.success("Thank you", "Your event has been saved", false, "success");					
			});
		}, function(dismiss) {
			// dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
			var $calendar = $('#fullCalendar');
			$calendar.fullCalendar('unselect');
			if (!!dismiss && dismiss === 'cancel') {
				that.data.attendEvent(event.id, false).then(result => {
					that.notify.success("Thank you", "Your event has been unsaved", false, "success");					
				});
			}
		});
	}
	

    refresh(params): Promise<any> {
		return new Promise((resolve, reject) => {
			this.loading = true;
			this.data.getEvents(params).then(events => {
				resolve(events);
			}).catch(ex => {
				this.notify.failure("Unable to Fetch Events", ex, true, "warning");
				reject(ex);
				this.loading = false;
			})

		});

	}
	
    constructor(public auth: AuthService, public router: Router, private route: ActivatedRoute,
        public data: DataService, public notify: NotificationsService, public permissions: PermissionsService) {
			let params = this.processUserGroup(this.permissions.getAccountType());
			this.refresh(params).then(events=> {
				var $calendar = $('#fullCalendar');
				var today = new Date();
				var y = today.getFullYear();
				var m = today.getMonth();
				var d = today.getDate();
				let that = this;
		
				$calendar.fullCalendar({
					viewRender: function(view, element) {
						// We make sure that we activate the perfect scrollbar when the view isn't on Month
						if (view.name != 'month'){
							var $fc_scroller = $('.fc-scroller');
							$fc_scroller.perfectScrollbar();
						}
					},
					header: {
						left: 'title',
						center: 'month,agendaWeek,agendaDay',
						right: 'prev,next,today'
					},
					defaultDate: today,
					selectable: true,
					selectHelper: true,
					views: {
						month: { // name of view
							titleFormat: 'MMMM YYYY'
							// other view-specific options here
						},
						week: {
							titleFormat: " MMMM D YYYY"
						},
						day: {
							titleFormat: 'D MMM, YYYY'
						}
					},
					eventClick: function(calEvent, jsEvent, view) {
				
						that.eventClicked(calEvent);
				
						// change the border color just for fun
				
					},
					eventLimit: true, 
					events: [
					]
				});
				// var $calendar = $('#fullCalendar');
				for(const event of events) {
					console.log(event);
					let colourNum = Math.floor(Math.random() * 5);
					let dateStrings = "<b>Start: </b>" + moment(event.date_start).format("DD MMM YYYY - h:mm a") + "<br><b>End: </b>" + moment(event.date_end).format("DD MMM YYYY - h:mm a");
					let calcHtml = event.html;
					calcHtml += "<p style='margin-top: 25px'>"+dateStrings+"</p>";
					let eventData = {
						title: event.title,
						start: event.date_start,
						end: event.date_end,
						html: calcHtml,
						id: event.id,
						className: this.colours[colourNum]
					}
					console.log(eventData)
					$calendar.fullCalendar('renderEvent', eventData, true);
				}
				this.loading = false;

			})
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
