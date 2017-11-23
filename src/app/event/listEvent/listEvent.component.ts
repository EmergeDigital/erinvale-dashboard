import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import {AuthService} from "./../../services/auth.service";
import {DataService} from "./../../services/data.service";
import {NotificationsService} from "./../../services/notifications.service";
import {PermissionsService} from "./../../services/permissions.service";

import * as moment from 'moment';
declare var $:any;

declare interface Table_With_Checkboxes {
    id?: number;
    name: string;
    job_position: string;
    salary: string;
    active?: boolean;
}
declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}
declare interface TableData2 {
    headerRow: string[];
    dataRows: Table_With_Checkboxes[];
}

@Component({
    moduleId: module.id,
    selector: 'listEvent-cmp',
    templateUrl: 'listEvent.component.html'
})

export class ListEventComponent{
    public tableData1: TableData;
    loading: boolean = true;
    user_type: any = {
        value: "AllUsers",
        name: "All Users"
    };


    ngOnInit(){

        
    }

    constructor(public auth: AuthService, public router: Router, private route: ActivatedRoute,
        public data: DataService, public notify: NotificationsService, public permissions: PermissionsService) {
        this.refresh(null);
        // setTimeout(()=> {
        //     // this.tableData1 = {
        //     //     headerRow: [ '#', 'Name', 'Job Position', 'Since', 'Salary', 'Actions'],
        //     //     dataRows: [
        //     //         ['1', 'Andrew Mike', 'Develop', '2013', '99,225',''],
        //     //         ['2', 'John Doe', 'Design', '2012', '89,241', ''],
        //     //         ['3', 'Alex Mike', 'Design', '2010', '92,144', ''],
        //     //         ['4','Mike Monday', 'Marketing', '2013', '49,990', ''],
        //     //         ['5', 'Paul Dickens', 'Communication', '2015', '69,201', '']
        //     //     ]
        //     // };
        //     // this.loading = false;

        // }, 3000);
    }

    refresh(params) {
        this.loading = true;
        this.data.getEvents(params).then(events => {
            console.log(events);
            let _events = events.map((p) => {
                return [
                    p.title,
                    p.subtitle,
                    this.permissions.processAccountType(p).replace(/([A-Z])/g, ' $1').trim(),
                    moment(p.date_start).format('MM/DD/YYYY h:mm a').toUpperCase(),
                    moment(p.date_end).format('MM/DD/YYYY h:mm a').toUpperCase(),
                    p.location_name,
                    p.id,
                    p.created_by_id                    
                ];
            })
            console.log(_events);
            this.tableData1 = {
                headerRow: ['Title', 'Subtitle', 'User Group', 'Date Start', 'Date End', 'Location'],
                dataRows: _events
            };
            this.loading = false;
            console.log(this.tableData1);
        }).catch(ex => {
            this.notify.failure("Unable to Fetch Events", ex, true, "warning");
            this.loading = true;
        })

    }

    edit(row) {

      let id = row[6];
      this.router.navigate(["/event/edit/" + id]);
    }

    confirmDelete(row) {
        console.log(row);
        this.notify.success("Are You Sure?", "This event will be delete permanently", true, "warning-message-and-cancel").then( result => {
            if(result) {
                this.data.deleteEvent(row[6]).then(result => {
                    this.notify.success("Event Deleted", "Event has been deleted", false, "success");
                    this.changeUserType(this.user_type.name);
                }).catch(ex => {
                    this.notify.failure("Unable To Delete Event", ex, true, "warning");
                })
            }
        })
    }

    changeUserType(new_group) {
        let params = this.processUserGroup(new_group);
        this.user_type = {
            value: new_group.replace(/\s/g, ''),
            name: new_group 
        };
        console.log(this.user_type);
        this.refresh(params);
    }

    processUserGroup(group) {
      switch(group) {
        case "Home Owner":
            return {
                user_group_hoa: true
            };
        
        case "Golf Member":        
            return {
                user_group_golf: true
            };
        
        default:
            return {};
      }
    }
}
