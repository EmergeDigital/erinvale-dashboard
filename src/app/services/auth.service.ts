import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {Http, Headers, HttpModule} from '@angular/http';
import {RequestOptions, Request, RequestMethod} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { PermissionsService } from "./permissions.service";
import { User } from "./../classes/user";

@Injectable()
export class AuthService {

  constructor(public http: Http, public permissions: PermissionsService) {
    this.API_URL = environment.apiUrl;
  }

  authenticated: boolean = false;
  public current_user: User;
  private auth_email: string;
  private auth_password: string;
  private API_URL: string;

  public loginStored(): Promise<User> {
    //log in
    //set permissions
    //store auth
    return new Promise((resolve, reject) => {

      // this.authenticated = true;
      // // this.storeAuth(email, password);
      // this.permissions.setAccountType("Admin");
      // // this.permissions.setAccountType("GolfMember");
      // // this.permissions.setAccountType("HomeOwner");
      // console.log("AUTHED?");
      // // reject("Incorrect Password");
      // resolve(new User({id: '123124'}));
      let params = {email: this.auth_email, password: this.auth_password};
      this.http.get(this.API_URL + "/v1/users/login", {params: params}).toPromise().then(user => {
          const _user = user.json();
          this.current_user = _user;
          this.authenticated = true;
          this.permissions.setAccountType(this.permissions.processAccountType(_user));
          // this.user_loaded.emit(_user);
          // this.has_loaded = true;
          resolve(_user);
      }).catch(ex => {
        console.log(ex);
          reject(ex.json());
      });
    });
  }

  public login(email, password): Promise<User> {
    //log in
    //set permissions
    //store auth
    return new Promise((resolve, reject) => {
      // this.authenticated = true;
      // // this.storeAuth(email, password);
      // this.permissions.setAccountType("Admin");
      // // this.permissions.setAccountType("GolfMember");
      // // this.permissions.setAccountType("HomeOwner");
      // console.log("AUTHED?");
      // resolve(new User({id: '123124'}));

      let params = {email: email, password: password};
      this.http.get(this.API_URL + "/v1/users/login", {params: params}).toPromise().then(user => {
          const _user = user.json();
          this.current_user = _user;
          this.authenticated = true;
          this.storeAuth(email, password);
          this.permissions.setAccountType(this.permissions.processAccountType(_user));
          // this.user_loaded.emit(_user);
          // this.has_loaded = true;
          resolve(_user);
      }).catch(ex => {
        console.log(ex);
          reject(ex.json());
      });
    });
  }

  public storeCurrrentUser(user) {
    this.current_user = new User(user);
  }
  //
  public createAccount(user): Promise<any> {  
    return new Promise((resolve, reject) => {
      // let body = {email: "courtney@codelab.io", password: "1234", permissions: "admin", contact_number: "000000001", first_name: "Courtney", last_name: "Jooste" };
      this.http.post(this.API_URL + "/v1/users/create", user).toPromise().then(user => {
          const _user = user.json();
          // this.current_user = _user;
          // this.authenticated = true;
          // this.user_loaded.emit(_user);
          // this.has_loaded = true;
          resolve(_user);
      }).catch(ex => {
          reject(ex.json());
      });
    });
  }

  public logout() {
    this.authenticated = false;
    this.storeAuth(null, null);
  }

  public isAuthenticated(): boolean {
    return this.authenticated;
  }

  public storeAuth(email, password) {
    console.log("no");
    if(!!email && !!password) {
      console.log("YES");
      let authBundle = {
        email: email,
        password: password
      };
      this.setLocalAuth(authBundle);
      this.auth_email = email;
      this.auth_password = password;
    } else {
      this.setLocalAuth(null);
      this.auth_email = null;
      this.auth_password = null;
    }
  }

  public getAuth() {
    let auth = this.getLocalAuth();
    if(!!auth) {
      this.auth_email = auth.email;
      this.auth_password = auth.password;
      return true;
    } else {
      return false;
    }
  }

  setLocalAuth(authBundle) {
    localStorage.setItem('authBundle', JSON.stringify(authBundle));
  }

  getLocalAuth() {
    return JSON.parse(localStorage.getItem('authBundle'));
  }

}
