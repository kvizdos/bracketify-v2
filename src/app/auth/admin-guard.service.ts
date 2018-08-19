import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { config } from "../../assets/config.js"
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuardService implements CanActivate {
    async verifySession() {
        var dat;
        var url = config.urls.current + "/verifysession"
        let ret = await this.http.get(url + "/?sessionid=" + localStorage.getItem("sessionid") + "&user=" + localStorage.getItem("username")).toPromise();
        return ret
      }
    

  constructor(public router: Router, private http: HttpClient) {}
  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      if((localStorage.getItem("username") && localStorage.getItem("sessionid")) !== null) {
        let choice = this.verifySession().then((response) => {
          console.log(response);
            if(response['verified'] == "false") {
                window.location.href = "/login?callback=" + window.location.pathname.substring(1);
                console.log("no");
                resolve(false);
            } else if(response['email'] == "false") {
              window.location.href = "/verifyemail";
              console.log("no");
              resolve(false);
            } else if(response['membership'] !== 4) {
              window.location.href = "/home";
              console.log("no");
              resolve(false);
            } else {
              resolve(true);

            }
        });
      } else {
        window.location.href = "/login?callback=" + window.location.pathname.substring(1);
        resolve(false);
      }
    })
      
    /*if (!this.auth.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;*/

  }
}