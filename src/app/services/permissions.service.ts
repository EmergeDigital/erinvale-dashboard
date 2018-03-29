import { Injectable } from '@angular/core';

@Injectable()
export class PermissionsService {

  private accountType: string;

  constructor() { }

  getAccountType() {
    return this.accountType;
  }

  setAccountType(accountType) {
    this.accountType = accountType;
  }

  checkPermissions(allowed) {
    let permissions = this.getAccountType();
    // let params = {};
    return (allowed.indexOf(permissions) > -1);

  }
  processAccountType(user) {
    if(user.permissions === "admin") {
      return "Admin";
    } else {      
      if(user.user_group_hoa) {
        if(user.user_group_golf) {
          return "All";
        }
        return "Resident";
      }
      return "GolfMember";
    }
  }

}
