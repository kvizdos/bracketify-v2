import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { config } from "../../assets/config.js"

@Injectable()
export class AuthGuardService implements CanActivate {
    async verifySession() {
        var dat;
        var url = "http://" + config.urls.current + "/verifysession"
        let ret = await this.http.get(url + "/?sessionid=" + localStorage.getItem("sessionid") + "&user=" + localStorage.getItem("username")).toPromise();
        return ret
      }
    

  constructor(public router: Router, private http: HttpClient) {}
  canActivate(): boolean {
      if((localStorage.getItem("username") && localStorage.getItem("sessionid")) !== null) {
        let choice = this.verifySession().then((response) => {
            if(response['verified'] == "false") {
                window.location.href = "/login";
                return false
            };
        });
      } else {
            window.location.href = "/login";
          return false;
      }
    
    return true;
    /*if (!this.auth.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;*/

  }
}