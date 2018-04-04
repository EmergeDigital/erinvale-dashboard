import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import {AuthService} from "./../../services/auth.service";
import {DataService} from "./../../services/data.service";
import {NotificationsService} from "./../../services/notifications.service";
import {PermissionsService} from "./../../services/permissions.service";

declare var require: any
declare var $:any;

@Component({
  moduleId: module.id,
  selector: 'addEvent-cmp',
  templateUrl: './addEvent.component.html'
})

export class AddEventComponent implements OnInit{
  
    ngOnInit() {
      $('#dateStart').datetimepicker({
        icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-chevron-up",
            down: "fa fa-chevron-down",
            previous: 'fa fa-chevron-left',
            next: 'fa fa-chevron-right',
            today: 'fa fa-screenshot',
            clear: 'fa fa-trash',
            close: 'fa fa-remove'
        }
     });
     $('#dateEnd').datetimepicker({
       icons: {
           time: "fa fa-clock-o",
           date: "fa fa-calendar",
           up: "fa fa-chevron-up",
           down: "fa fa-chevron-down",
           previous: 'fa fa-chevron-left',
           next: 'fa fa-chevron-right',
           today: 'fa fa-screenshot',
           clear: 'fa fa-trash',
           close: 'fa fa-remove'
       }
    });
  }
  showPreview: boolean = false;
  new_event: any = {};
  user_group: string = '';
  updating: boolean = false;
  date_start: any;
  date_end: any;
  refresh: boolean = true;
  froala_loading: boolean = true;
  froalaOptions: any = {};
  
  constructor(public auth: AuthService, public router: Router, private route: ActivatedRoute,
        public data: DataService, public notify: NotificationsService, public permissions: PermissionsService) {

          this.froala_loading = true;
          this.data.signUrls().then(urls => {
            console.log(urls);
            this.froalaOptions = {
              // KEY
              key: 'NC-13aA-9dpI-7A2qgE-13ynxvI-7A5B-21qr==',
              // IMAGES
              imageUploadToS3: urls.images,
              ImageMaxSize: 4 * 1024 * 1024, // 4MB LIMIT
              ImageAllowedTypes: ['jpg', 'jpeg', 'png', 'gif'],
              // VIDOES
              videoUploadToS3: urls.videos,
              videoMaxSize: 100 * 1024 * 1024, // 100MB LIMIT
              videoAllowedTypes: ['webm', 'mp4', 'flv', 'avi', 'wmv', 'mov'],
              // DOCS
              fileUploadToS3: urls.docs,
              fileMaxSize: 25 * 1024 * 1024, // 25MB LIMIT,
              fileAllowedTypes: ['*']
            };
            this.froala_loading = false;
            // setTimeout(() => {
            // },10)
          });
  }

  // date_start: {
  //   type: "datetime"
  // },
  // date_end: {
  //   type: "datetime"
  // },


  // location_name: {
  //   type: "string"
  // },

  // repeating: {
  //   type: "boolean",
  //   defaultsTo: false
  // },
  // interval: {
  //   type: "string"
  // },

  click() {
    let ds = $('#dateStart').val();
    let de = $('#dateEnd').val();
    console.log(ds, de);
  }

  create() {
    if(this.updating === false) {
      this.updating = true;
      if(this.user_group !== '') {
        if(this.new_event.title && this.new_event.title !== '') {
          if(this.new_event.subtitle && this.new_event.subtitle !== '') {
            if(this.new_event.html && this.new_event.html !== '') {
              if(this.new_event.location_name && this.new_event.location_name !== '') {
                let ds = $('#dateStart').val();
                let de = $('#dateEnd').val();
                if(ds && de){
                  console.log("YAY");
                  de = new Date(de);
                  ds = new Date(ds);
                  if(de.getTime() >= ds.getTime()){
                    console.log(this.new_event);
                    this.new_event.created_by = this.auth.current_user.first_name + " " + this.auth.current_user.last_name;
                    this.new_event.created_by_id = this.auth.current_user.id;
                    this.new_event.date_start = ds;
                    this.new_event.date_end = de;
                    this.processUserGroup();
                    this.data.createEvent(this.new_event).then(result => {
                      this.new_event = {};
                      this.user_group = '';
                      this.refresh = false;
                      $('#dateStart').val('');
                      $('#dateEnd').val('');
                      setTimeout(()=> {
                        this.refresh = true;
                        this.updating = false;
                        this.notify.success("Event Posted", "Event has been posted successfully", true, "success");
                      },1)
                    })
                  } else {
                    //Date end < date start
                    this.updating = false;
                    this.notify.failure("Unable to Create Event", "End date must be after start date", true, "warning");
                  }
                } else {
                  //Dates
                  this.updating = false;
                  this.notify.failure("Unable to Create Event", "Please enter start and end dates", true, "warning");
                }
              } else {
                //Location
                this.updating = false;
                this.notify.failure("Unable to Create Event", "Please enter location. This lets everyone know where to meet or go", true, "warning");
              }
            } else {
              //content
              this.updating = false;
              this.notify.failure("Unable to Create Event", "Please enter content", true, "warning");
            }
          } else {
            //subtitle
            this.updating = false;
            this.notify.failure("Unable to Create Event", "Please enter a subtitle", true, "warning");
          }
        } else {
          this.updating = false;
          this.notify.failure("Unable to Create Event", "Please enter a title", true, "warning");
          //title
        }
      } else {
        this.updating = false;
        this.notify.failure("Unable to Create Event", "Please select a user group for this Event", true, "warning");
      }
    }
  }

  processUserGroup() {
    switch(this.user_group) {
      case "Home Owner":
        this.new_event.user_group_hoa = true;
        this.new_event.user_group_golf = false;
        break;
      
      case "Golf Member":        
        this.new_event.user_group_hoa = false;
        this.new_event.user_group_golf = true;
        break;

      case "All":        
        this.new_event.user_group_hoa = true;
        this.new_event.user_group_golf = true;
        break;
    }
  }
}
