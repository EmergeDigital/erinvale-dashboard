import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import {AuthService} from "./../../services/auth.service";
import {DataService} from "./../../services/data.service";
import {NotificationsService} from "./../../services/notifications.service";
import {PermissionsService} from "./../../services/permissions.service";

import * as moment from 'moment';

declare var require: any
declare var $:any;

@Component({
  moduleId: module.id,
  selector: 'editEvent-cmp',
  templateUrl: './editEvent.component.html'
})

export class EditEventComponent implements OnInit{
  
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


  private sub: any;
  id: string = '';
  loading: boolean = false;
  user_group: string = '';
  updating: boolean = false;
  showPreview: boolean = false;
  event: any = {};
  froala_loading: boolean = true;
  froalaOptions: any = {};

  constructor(public auth: AuthService, public router: Router, private route: ActivatedRoute,
    public data: DataService, public notify: NotificationsService, public permissions: PermissionsService) {
      this.loading = true;
      
      this.sub = this.route.params.subscribe(params => {
          this.id = params['id'];
          if(!!this.id) {
            this.data.getEvent(this.id).then(event => {
              if(!!event) {
                this.event = event;
                this.loading = false;
                console.log(this.event);
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
                $('#dateStart').val(moment(this.event.date_start).format('MM/DD/YYYY h:mm a').toUpperCase());
                $('#dateEnd').val(moment(this.event.date_end).format('MM/DD/YYYY h:mm a').toUpperCase());
                this.user_group = permissions.processAccountType(event).replace(/([A-Z])/g, ' $1').trim()
              } else {
                this.loading = false;
                notify.failure('Unable to Find Event', 'The requested event could not be found', true, 'warning');
                //Error cannot find
              }
            }).catch(ex => {
              notify.failure('Unable to Find Event', 'The requested event could not be found', true, 'warning');
              if(ex === "Insufficient Permissions") {
                this.loading = false;
                //this.error = "Unable to access this vendor";
              } else {
                this.loading = false;
                //this.error = ex;
              }
            })
          } else {
            this.loading = false;
            //this.error = "Please enter an vendor id";
          }
    
      });
  }

  update() {
    if(this.updating === false) {
      this.updating = true;
      if(this.user_group !== '') {
        if(this.event.title && this.event.title !== '') {
          if(this.event.subtitle && this.event.subtitle !== '') {
            if(this.event.html && this.event.html !== '') {
              if(this.event.location_name && this.event.location_name !== '') {
                let ds = $('#dateStart').val();
                let de = $('#dateEnd').val();
                if(ds && de){
                  de = new Date(de);
                  ds = new Date(ds);
                  if(de.getTime() >= ds.getTime()){
                    console.log(this.event);
                    this.event.date_start = ds;
                    this.event.date_end = de;
                    this.processUserGroup();
                    this.data.updateEvent(this.event, this.event.id).then(result => {
                      this.event = result;
                      this.updating = false;
                      this.notify.success("Event Updated", "Event has been updated successfully", true, "success");
                    })
                  } else {
                    //Date end < date start
                    this.updating = false;
                    this.notify.failure("Unable to Update Event", "End date must be after start date", true, "warning");
                  }
                } else {
                  //Dates
                  this.updating = false;
                  this.notify.failure("Unable to Update Event", "Please enter start and end dates", true, "warning");
                }
              } else {
                //Location
                this.updating = false;
                this.notify.failure("Unable to Update Event", "Please enter location. This lets everyone know where to meet or go", true, "warning");
              }
            } else {
              //content
              this.updating = false;
              this.notify.failure("Unable to Update Event", "Please enter content", true, "warning");
            }
          } else {
            //subtitle
            this.updating = false;
            this.notify.failure("Unable to Update Event", "Please enter a subtitle", true, "warning");
          }
        } else {
          this.updating = false;
          this.notify.failure("Unable to Update Event", "Please enter a title", true, "warning");
          //title
        }
      } else {
        this.updating = false;
        this.notify.failure("Unable to Update Event", "Please select a user group for this Event", true, "warning");
      }
    }
  }




  processUserGroup() {
    switch(this.user_group) {
      case "Home Owner":
        this.event.user_group_hoa = true;
        this.event.user_group_golf = false;
        break;
      
      case "Golf Member":        
        this.event.user_group_hoa = false;
        this.event.user_group_golf = true;
        break;
        
      case "All":        
        this.event.user_group_hoa = true;
        this.event.user_group_golf = true;
        break;
    }
  }
}
