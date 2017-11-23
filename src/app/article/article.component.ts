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
    selector: 'article-cmp',
    templateUrl: 'article.component.html'
})

export class ArticleComponent implements OnInit{

    ngOnInit() {
        // // Init Tags Input
    }

    updating: boolean = false;
    loading: boolean = true;
    post: any;
    private sub: any;
    id: string = '';

    constructor(public auth: AuthService, public router: Router, private route: ActivatedRoute,
        public data: DataService, public notify: NotificationsService, public permissions: PermissionsService) {
            //FETCH ARTICLE
            this.loading = true;
            
            this.sub = this.route.params.subscribe(params => {
                this.id = params['id'];
                if(!!this.id) {
                  this.data.getPost(this.id).then(post => {
                    if(!!post) {
                      this.post = post;
                      this.loading = false;
                      setTimeout(()=>{
                          if($(".tagsinput").length != 0){
                              $(".tagsinput").tagsinput();
                          }
                      }, 1);
                      console.log(this.post);
                    } else {
                      this.loading = false;
                      //Error cannot find
                    }
                  }).catch(ex => {
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
	
	// processUserGroup(group) {
	// 	switch(group) {
	// 	case "HomeOwner":
	// 		return {
	// 			user_group_hoa: true
	// 		};
		
	// 	case "GolfMember":        
	// 		return {
	// 			user_group_golf: true
	// 		};
		
	// 	default:
	// 		return {};
	// 	}
	// }
    
}
