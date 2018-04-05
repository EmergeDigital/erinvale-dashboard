import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Http, Headers, HttpModule } from "@angular/http";
import { RequestOptions, Request, RequestMethod } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { AuthService } from "./auth.service";
import { PermissionsService } from "./permissions.service";

// import { Vendor } from "./../classes/vendor";
import { User } from "./../classes/user";
// import { Expo } from "./../classes/expo";

@Injectable()
export class DataService {
    private API_URL: string;

    constructor(
        public http: Http,
        public permissions: PermissionsService,
        public auth: AuthService
    ) {
        this.API_URL = environment.apiUrl;
    }

    // ============== USERS ==============
    getUsers(_params: undefined): Promise<User[]> {
        return new Promise((resolve, reject) => {
            let permissions = this.permissions.getAccountType();
            let params = _params || {};

            this.http
                .get(this.API_URL + "/v1/users/get_all", { params })
                .toPromise()
                .then(users => {
                    const _users = users.json();
                    // this.user_loaded.emit(_user);
                    // this.has_loaded = true;
                    resolve(_users);
                })
                .catch(ex => {
                    reject(ex);
                });
        });
    }

    getUser(id): Promise<User> {
        return new Promise((resolve, reject) => {
            this.http
                .get(this.API_URL + "/v1/users/get", { params: { id } })
                .toPromise()
                .then(user => {
                    const _user = user.json();
                    // this.user_loaded.emit(_user);
                    // this.has_loaded = true;
                    resolve(_user);
                })
                .catch(ex => {
                    reject(ex);
                });
        });
    }

    deleteUsers(emails): Promise<any> {
        return new Promise((resolve, reject) => {
            // if(!this.permissions.checkPermissions(['admin'])) {
            //   reject("Insufficient Permissions")
            // }

            this.http
                .post(this.API_URL + "/v1/users/delete", {
                    user: { email: emails }
                })
                .toPromise()
                .then(response => {
                    const _response = response.json();
                    resolve(_response);
                })
                .catch(ex => {
                    reject(ex);
                });
        });
    }

    changePassword(password, new_password): Promise<any> {
        return new Promise((resolve, reject) => {
            let body = {
                user: {
                    email: this.auth.current_user.email,
                    password: password,
                    new_password: new_password
                }
            };
            this.http
                .post(this.API_URL + "/v1/users/change_password", body)
                .toPromise()
                .then(response => {
                    const _response = response.json();
                    this.auth.storeAuth(
                        this.auth.current_user.email,
                        new_password
                    );
                    resolve(_response.replace(/"/g, ""));
                })
                .catch(ex => {
                    console.log(ex);
                    if (ex._body) {
                        ex = ex._body.replace(/"/g, "");
                    } else {
                        ex.replace(/"/g, "");
                    }
                    reject(ex);
                });
        });
    }

    changeEmail(new_email, password): Promise<any> {
        return new Promise((resolve, reject) => {
            let body = {
                user: {
                    email: this.auth.current_user.email,
                    new_email: new_email,
                    password: password
                }
            };
            this.http
                .post(this.API_URL + "/v1/users/change_email", body)
                .toPromise()
                .then(response => {
                    const _response = response.json();
                    this.auth.storeAuth(new_email, password);
                    this.auth.current_user.email = new_email;
                    resolve(_response.replace(/"/g, ""));
                })
                .catch(ex => {
                    console.log(ex);
                    if (ex._body) {
                        ex = ex._body.replace(/"/g, "");
                    } else {
                        ex.replace(/"/g, "");
                    }
                    reject(ex);
                });
        });
    }

    resetPassword(email): Promise<any> {
        return new Promise((resolve, reject) => {
            let params = { email: email };
            this.http
                .get(this.API_URL + "/v1/users/reset_password_link", {
                    params: params
                })
                .toPromise()
                .then(response => {
                    const _response = response.json();
                    resolve(_response.replace(/"/g, ""));
                })
                .catch(ex => {
                    console.log(ex);
                    if (ex._body) {
                        ex = ex._body.replace(/"/g, "");
                    } else {
                        ex.replace(/"/g, "");
                    }
                    reject(ex);
                });
        });
    }

    updateUser(changes): Promise<User> {
        return new Promise((resolve, reject) => {
            let body = {
                user: {
                    email: this.auth.current_user.email
                },
                changes: changes
            };

            this.http
                .post(this.API_URL + "/v1/users/update", body)
                .toPromise()
                .then(user => {
                    const _user = user.json();
                    console.log(_user);
                    this.auth.storeCurrrentUser(_user);
                    // this.user_loaded.emit(_user);
                    // this.has_loaded = true;
                    resolve(_user);
                })
                .catch(ex => {
                    reject(ex.json());
                });
        });
    }

    updateUserAlt(changes, email): Promise<User> {
        return new Promise((resolve, reject) => {
            let body = {
                user: {
                    email: email
                },
                changes: changes
            };

            this.http
                .post(this.API_URL + "/v1/users/update", body)
                .toPromise()
                .then(user => {
                    const _user = user.json();
                    console.log(_user);
                    // this.user_loaded.emit(_user);
                    // this.has_loaded = true;
                    resolve(_user);
                })
                .catch(ex => {
                    reject(ex.json());
                });
        });
    }
    // ============== /USERS ==============

    // ============== NEWS ==============
    createPost(post): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
                .post(this.API_URL + "/v1/posts/create", post)
                .toPromise()
                .then(post => {
                    const _post = post.json();

                    resolve(_post);
                })
                .catch(ex => {
                    reject(ex.json());
                });
        });
    }

    getPosts(_params: undefined): Promise<any[]> {
        return new Promise((resolve, reject) => {
            let permissions = this.permissions.getAccountType();
            let params = _params || {};

            this.http
                .get(this.API_URL + "/v1/posts/get_all", { params })
                .toPromise()
                .then(result => {
                    const _result = result.json();
                    resolve(_result);
                })
                .catch(ex => {
                    reject(ex);
                });
        });
    }

    deletePost(id): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
                .post(this.API_URL + "/v1/posts/delete", { post: { id: id } })
                .toPromise()
                .then(response => {
                    const _response = response.json();
                    resolve(_response);
                })
                .catch(ex => {
                    reject(ex);
                });
        });
    }

    getPost(id): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
                .get(this.API_URL + "/v1/posts/get", { params: { id } })
                .toPromise()
                .then(result => {
                    const _result = result.json();
                    resolve(_result);
                })
                .catch(ex => {
                    reject(ex);
                });
        });
    }

    updatePost(changes, id): Promise<any> {
        return new Promise((resolve, reject) => {
            let body = {
                post: {
                    id
                },
                changes
            };

            this.http
                .post(this.API_URL + "/v1/posts/update", body)
                .toPromise()
                .then(result => {
                    const _result = result.json();
                    console.log(_result);
                    resolve(_result);
                })
                .catch(ex => {
                    reject(ex.json());
                });
        });
    }

    //Gets a combined array of posts and news
    getNews(_params: undefined): Promise<any[]> {
        return new Promise((resolve, reject) => {
            let permissions = this.permissions.getAccountType();
            let params = _params || {};

            this.http
                .get(this.API_URL + "/v1/posts/get_news", { params })
                .toPromise()
                .then(result => {
                    const _result = result.json();
                    resolve(_result);
                })
                .catch(ex => {
                    reject(ex);
                });
        });
    }
    // ============== /NEWS ==============

    // ============== EVENTS ==============
    createEvent(event): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
                .post(this.API_URL + "/v1/events/create", event)
                .toPromise()
                .then(event => {
                    const _event = event.json();

                    resolve(_event);
                })
                .catch(ex => {
                    reject(ex.json());
                });
        });
    }

    getEvents(_params: undefined): Promise<any[]> {
        return new Promise((resolve, reject) => {
            let permissions = this.permissions.getAccountType();
            let params = _params || {};

            this.http
                .get(this.API_URL + "/v1/events/get_all", { params })
                .toPromise()
                .then(result => {
                    const _result = result.json();
                    resolve(_result);
                })
                .catch(ex => {
                    reject(ex);
                });
        });
    }

    deleteEvent(id): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
                .post(this.API_URL + "/v1/events/delete", { event: { id: id } })
                .toPromise()
                .then(response => {
                    const _response = response.json();
                    resolve(_response);
                })
                .catch(ex => {
                    reject(ex);
                });
        });
    }

    getEvent(id): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
                .get(this.API_URL + "/v1/events/get", { params: { id } })
                .toPromise()
                .then(result => {
                    const _result = result.json();
                    resolve(_result);
                })
                .catch(ex => {
                    reject(ex);
                });
        });
    }

    updateEvent(changes, id): Promise<any> {
        return new Promise((resolve, reject) => {
            let body = {
                event: {
                    id
                },
                changes
            };

            this.http
                .post(this.API_URL + "/v1/events/update", body)
                .toPromise()
                .then(result => {
                    const _result = result.json();
                    console.log(_result);
                    resolve(_result);
                })
                .catch(ex => {
                    reject(ex.json());
                });
        });
    }

    attendEvent(id, attendance): Promise<any> {
        return new Promise((resolve, reject) => {
            let body = {
                event: {
                    id
                },
                user: {
                    id: this.auth.current_user.id,
                    attendance
                }
            };

            this.http
                .post(this.API_URL + "/v1/events/attend", body)
                .toPromise()
                .then(result => {
                    const _result = result.json();
                    console.log(_result);
                    resolve(_result);
                })
                .catch(ex => {
                    reject(ex.json());
                });
        });
    }
    // ============== /EVENTS ==============

    // ============== DOWNLOADS ==============
    createDownload(download): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
                .post(this.API_URL + "/v1/downloads/create", download)
                .toPromise()
                .then(_download => {
                    resolve(_download.json());
                })
                .catch(ex => {
                    reject(ex.json());
                });
        });
    }

    getDownloads(_params: undefined): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const params = _params || {};

            this.http
                .get(this.API_URL + "/v1/downloads/get_all", { params })
                .toPromise()
                .then(result => {
                    const _result = result.json();
                    resolve(_result);
                })
                .catch(ex => {
                    reject(ex);
                });
        });
    }

    deleteDownload(id): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
                .post(this.API_URL + "/v1/downloads/delete", {
                    download: { id: id }
                })
                .toPromise()
                .then(response => {
                    const _response = response.json();
                    resolve(_response);
                })
                .catch(ex => {
                    reject(ex);
                });
        });
    }

    getDownload(id): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
                .get(this.API_URL + "/v1/downloads/get", { params: { id } })
                .toPromise()
                .then(result => {
                    const _result = result.json();
                    resolve(_result);
                })
                .catch(ex => {
                    reject(ex);
                });
        });
    }

    updateDownload(changes, id): Promise<any> {
        return new Promise((resolve, reject) => {
            let body = {
                download: {
                    id
                },
                changes
            };

            this.http
                .post(this.API_URL + "/v1/downloads/update", body)
                .toPromise()
                .then(result => {
                    const _result = result.json();
                    console.log(_result);
                    resolve(_result);
                })
                .catch(ex => {
                    reject(ex.json());
                });
        });
    }

    updateDownloadCount(user_id, download_id): Promise<any> {
        return new Promise((resolve, reject) => {
            let body = {
                download: {
                    id: download_id
                },
                user : {
                    id: user_id
                }
            };

            this.http
                .post(this.API_URL + "/v1/downloads/count", body)
                .toPromise()
                .then(result => {
                    const _result = result.json();
                    console.log(_result);
                    resolve(_result);
                })
                .catch(ex => {
                    reject(ex.json());
                });
        });

    }

    downloadedFile(id): Promise<any> {
        return new Promise((resolve, reject) => {
            const body = {
                download: {
                    id
                },
                user: {
                    id: this.auth.current_user.id
                }
            };

            this.http
                .post(this.API_URL + "/v1/downloads/count", body)
                .toPromise()
                .then(result => {
                    const _result = result.json();
                    console.log(_result);
                    resolve(_result);
                })
                .catch(ex => {
                    reject(ex.json());
                });
        });
    }
    // ============== /DOWNLOADS ==============

    // ============== DASHBOARD ==============
    fetchDashboardData(): Promise<any> {
        return new Promise((resolve, reject) => {
            let params = {
                id: this.auth.current_user.id
            };

            this.http
                .get(this.API_URL + "/v1/users/dashboard", { params })
                .toPromise()
                .then(result => {
                    const _result = result.json();
                    console.log(_result);
                    resolve(_result);
                })
                .catch(ex => {
                    reject(ex.json());
                });
        });
    }
    // ============== /DASHBOARD ==============

    // ============== FUNCTIONS ==============
    signUrls(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
                .get(this.API_URL + "/v1/functions/signAll")
                .toPromise()
                .then(urls => {
                    const _urls = urls.json();
                    // this.user_loaded.emit(_user);
                    // this.has_loaded = true;
                    resolve(_urls);
                })
                .catch(ex => {
                    reject(ex);
                });
        });
    }
    signUrl(folder: String): Promise<String> {
        return new Promise((resolve, reject) => {
            const params = { folder };
            this.http
                .get(this.API_URL + "/v1/functions/sign", { params })
                .toPromise()
                .then(url => {
                    const _url = url.json();
                    // this.user_loaded.emit(_user);
                    // this.has_loaded = true;
                    resolve(_url);
                })
                .catch(ex => {
                    reject(ex);
                });
        });
    }
    deleteFile(url: String): Promise<any> {
        return new Promise((resolve, reject) => {
            const body = { download: { url } };
            this.http
                .post(this.API_URL + "/v1/functions/deleteFile", body)
                .toPromise()
                .then(response => {
                    // this.user_loaded.emit(_user);
                    // this.has_loaded = true;
                    resolve(response.json());
                })
                .catch(ex => {
                    reject(ex);
                });
        });
    }

    contact(name: String, message: String, email: String, user_group: String): Promise<any> {
        return new Promise((resolve, reject) => {
            const body = { name, message, email, user_group };
            this.http
                .post(this.API_URL + '/v1/functions/contact', body)
                .toPromise()
                .then(response => {
                    resolve(response.json());
                })
                .catch(ex => {
                    reject(ex);
                });
        });
    }

    register(name: String, email: String, user_group: String, erf: String, mn: String, address: String): Promise<any> {
        return new Promise((resolve, reject) => {
            const body = { name, email, user_group, erf, mn, address };
            this.http
                .post(this.API_URL + '/v1/functions/register', body)
                .toPromise()
                .then(response => {
                    resolve(response.json());
                })
                .catch(ex => {
                    reject(ex.json());
                });
        });
    }
}
