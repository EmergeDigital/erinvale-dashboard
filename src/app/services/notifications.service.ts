import { Injectable } from '@angular/core';
declare var $:any;
declare var swal:any;

@Injectable()
export class NotificationsService {

  constructor() { }

  types: string[] = ['default','info','success','warning','danger'];
  icons: string[] = ['ti-bell','ti-info-alt','ti-check','ti-bolt','ti-alert'];

  success(title, text, popup, type) {
    return new Promise((resolve, reject) => {
      if(popup) {
        this.showSwal(type || 'basic', title, text).then(result => {
          resolve(result);
        }).catch(ex => {
          reject(ex);
        })
      } else {
        this.showNotification(type || 'basic', text);
        resolve(true);
      }
    });
  }
  
  failure(title, text, popup, type) {
    return new Promise((resolve, reject) => {
      if(popup) {
        this.showSwal(type || 'danger', title, text).then(result => {
          resolve(result);
        }).catch(ex => {
          reject(ex);
        })
      } else {
        this.showNotification(type || 'danger', text);
        resolve(true);
      }
    });
  }


  showNotification(type, text){
    // var type = ['','info','success','warning','danger'];

    // var color = Math.floor((Math.random() * 4) + 1);

    //TODO: assign icon based on type
    let i = this.types.indexOf(type);

    if(i !== -1) {
      $.notify({
          icon: this.icons[i],
          message: text
        },{
            type: type,
            timer: 2500,
            placement: {
                from: 'bottom',
                align: 'center'
            }
      });
    }

  }

  showSwal(type, title, text){
    //FOR LATER https://stackoverflow.com/questions/12797118/how-can-i-declare-optional-function-parameters-in-javascript
    return new Promise((resolve, reject) => {

      if (this.types.includes(type)) {

        swal({
          type: type,
          title: title,
          text: text,
          buttonsStyling: false,
          confirmButtonClass: "btn btn-"+type
        });
        resolve(true);
      }
      else if(type == 'basic'){
        swal({
              title: title,
              buttonsStyling: false,
              confirmButtonClass: "btn btn-success"
          });
          resolve(true);

      }else if(type == 'title-and-text'){
          swal({
                title: title,
                text: text,
                buttonsStyling: false,
                confirmButtonClass: "btn btn-info"
            });
            resolve(true);

      }else if(type == 'success-control'){
        swal({
            title: title,
            text: text,
            type: 'success',
            showCancelButton: true,
            cancelButtonText: 'No, later',
            confirmButtonText: 'Yes, lets go!',
            cancelButtonClass: "btn btn-danger",
            confirmButtonClass: "btn btn-success",
            buttonsStyling: false
        }).then(function() {
            resolve(true);
        }, function(dismiss) {
            // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
            if (!!dismiss) {
                resolve(false);
            }
        })
      }
      else if(type == 'warning-message-and-confirmation'){
            swal({
                title: title,
                text: text,
                type: 'warning',
                showCancelButton: true,
                confirmButtonClass: 'btn btn-success',
                cancelButtonClass: 'btn btn-danger',
                confirmButtonText: 'Yes, delete it!',
                buttonsStyling: false
            }).then(function() {
                resolve(true);
            });
      }else if(type == 'warning-message-and-cancel'){
            swal({
                title: title,
                text: text,
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, go ahead',
                cancelButtonText: 'No, I changed my mind',
                confirmButtonClass: "btn btn-success",
                cancelButtonClass: "btn btn-danger",
                buttonsStyling: false
            }).then(function() {
                resolve(true);
            }, function(dismiss) {
                // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
                if (!!dismiss) {
                    resolve(false);
                }
            })

      }else if(type == 'custom-html'){
          swal({
                title: title,
                buttonsStyling: false,
                confirmButtonClass: "btn btn-success",
                html:
                    'You can use <b>bold text</b>, ' +
                    '<a href="http://github.com">links</a> ' +
                    'and other HTML tags'
            });

      }else if(type == 'auto-close'){
          swal({ title: title,
                text: text,
                timer: 2000,
                showConfirmButton: false
          });
      } else if(type == 'input-field'){
            swal({
                title: title,
                html: '<div class="form-group">' +
                          '<input id="input-field" type="text" class="form-control" />' +
                      '</div>',
                showCancelButton: true,
                confirmButtonClass: 'btn btn-success',
                cancelButtonClass: 'btn btn-danger',
                buttonsStyling: false
            }).then(function(result) {
                resolve(result);
            }).catch(swal.noop)
      }

    });
  }
}
